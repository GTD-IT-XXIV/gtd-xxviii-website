import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EARLY_BIRD_LIMIT = 3;
const EARLY_BIRD_CENTS = 4200; // 42 SGD
const REGULAR_CENTS = 50;    // 48 SGD

const HOLD_MS = 3 * 60 * 1000;

export async function POST(req: Request) {
  const data = await req.json();

  const timeSlot = String(data.timeSlot ?? "").trim();
  const email = String(data.email ?? "").trim().toLowerCase();
  const bundleId = String(data.bundleId ?? "").trim();

  if (!timeSlot) return NextResponse.json({ error: "Missing timeSlot" }, { status: 400 });
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
  if (!bundleId) return NextResponse.json({ error: "Missing bundleId" }, { status: 400 });

  const now = new Date();
  const holdUntil = new Date(Date.now() + HOLD_MS);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) Reuse an existing active pending reg for same email+slot
      const existing = await tx.registration.findFirst({
        where: {
          timeSlot,
          email,
          paymentStatus: "PENDING",
          // only reuse if their hold is still active
          OR: [{ slotHoldUntil: { gt: now } }, { slotHoldUntil: null }], // tolerate null if you haven't used it before
        },
        select: { id: true, amountCents: true, bundleId: true },
      });

      if (existing) {
        // refresh hold so they can retry safely
        await tx.registration.update({
          where: { id: existing.id },
          data: {
            slotHoldUntil: holdUntil,
            bundleHoldUntil: holdUntil,
          },
        });

        return { reused: true, registrationId: existing.id, amountCents: existing.amountCents };
      }

      // 2) Enforce that the slot is free (not PAID, not actively held)
      const slotClaimed = await tx.registration.findFirst({
        where: {
          timeSlot,
          OR: [
            { paymentStatus: "PAID" },
            { slotHoldUntil: { gt: now } }, // active holds block others
          ],
        },
        select: { id: true },
      });

      if (slotClaimed) {
        return { error: "This time slot has already been reserved. Please choose another slot." as const };
      }

      // 3) Compute early bird price based on early claimed (PAID or active hold)
      // NOTE: only count early-bird bundle, not all PAID.
      const earlyClaimed = await tx.registration.count({
        where: {
          bundleId: "early",
          OR: [{ paymentStatus: "PAID" }, { bundleHoldUntil: { gt: now } }],
        },
      });

      const amountCents = earlyClaimed < EARLY_BIRD_LIMIT ? EARLY_BIRD_CENTS : REGULAR_CENTS;

      // 4) Create pending registration with holds
      const reg = await tx.registration.create({
        data: {
          teamName: data.teamName,
          captainName: data.captainName,
          telegram: data.telegram,
          phone: data.phone,
          email, // normalized

          member1: data.member1,
          member2: data.member2,
          member3: data.member3,
          member4: data.member4,
          member5: data.member5 ? String(data.member5) : null,

          timeSlot,
          bundleId,
          paymentStatus: "PENDING",
          amountCents,
          currency: "sgd",

          // holds
          slotHoldUntil: holdUntil,
          bundleHoldUntil: holdUntil,
        },
        select: { id: true },
      });

      return { reused: false, registrationId: reg.id, amountCents };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
