import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EARLY_BIRD_LIMIT = 3;
const EARLY_BIRD_CENTS = 4200; // 42 SGD
const REGULAR_CENTS = 4800;    // 48 SGD
const HOLD_MS = 3 * 60 * 1000;

export async function POST(req: Request) {
  const data = await req.json();

  const timeSlot = String(data.timeSlot ?? "").trim();
  const email = String(data.email ?? "").trim().toLowerCase();
  const bundleIdReq = String(data.bundleId ?? "").trim(); 

  if (!timeSlot) return NextResponse.json({ error: "Missing timeSlot" }, { status: 400 });
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
  if (!bundleIdReq) return NextResponse.json({ error: "Missing bundleId" }, { status: 400 });

  const now = new Date();
  const holdUntil = new Date(Date.now() + HOLD_MS);

  try {
    const existing = await prisma.registration.findFirst({
      where: {
        timeSlot,
        email,
        paymentStatus: "PENDING",
        OR: [{ slotHoldUntil: { gt: now } }, { slotHoldUntil: null }],
      },
      select: { id: true, amountCents: true, bundleId: true },
    });

    if (existing) {
      await prisma.registration.update({
        where: { id: existing.id },
        data: { slotHoldUntil: holdUntil, bundleHoldUntil: holdUntil },
      });

      return NextResponse.json({
        ok: true,
        reused: true,
        registrationId: existing.id,
        amountCents: existing.amountCents,
      });
    }

    const slotClaimed = await prisma.registration.findFirst({
      where: {
        timeSlot,
        OR: [{ paymentStatus: "PAID" }, { slotHoldUntil: { gt: now } }],
      },
      select: { id: true },
    });

    if (slotClaimed) {
      return NextResponse.json(
        { error: "This time slot has already been reserved. Please choose another slot." },
        { status: 409 }
      );
    }

    
    let bundleId = bundleIdReq;
    let amountCents = REGULAR_CENTS;

    if (bundleIdReq === "early") {
      const earlyClaimed = await prisma.registration.count({
        where: {
          bundleId: "early",
          OR: [{ paymentStatus: "PAID" }, { bundleHoldUntil: { gt: now } }],
        },
      });

      if (earlyClaimed < EARLY_BIRD_LIMIT) {
        bundleId = "early";
        amountCents = EARLY_BIRD_CENTS;
      } else {
        bundleId = "regular";
        amountCents = REGULAR_CENTS;
      }
    } else {
      bundleId = bundleIdReq;
      amountCents = REGULAR_CENTS;
    }

    const reg = await prisma.registration.create({
      data: {
        teamName: data.teamName,
        captainName: data.captainName,
        telegram: data.telegram,
        phone: data.phone,
        email,

        member1: data.member1,
        member2: data.member2,
        member3: data.member3,
        member4: data.member4 ? String(data.member4) : null,
        member5: data.member5 ? String(data.member5) : null,

        timeSlot,
        bundleId,
        paymentStatus: "PENDING",
        amountCents,
        currency: "sgd",

        slotHoldUntil: holdUntil,
        bundleHoldUntil: holdUntil,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, reused: false, registrationId: reg.id, amountCents });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "This time slot has already been reserved. Please choose another slot." },
        { status: 409 }
      );
    }

    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}