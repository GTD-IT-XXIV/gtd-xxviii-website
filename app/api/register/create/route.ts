import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const EARLY_BIRD_LIMIT = 3;
const EARLY_BIRD_CENTS = 4200; // 42 SGD
const REGULAR_CENTS = 4800;    // 48 SGD

export async function POST(req: Request) {
  const data = await req.json();
  const timeSlot = String(data.timeSlot ?? "").trim();

  if (!timeSlot) {
    return NextResponse.json({ error: "Missing timeSlot" }, { status: 400 });
  }

  try {
    const paidCount = await prisma.registration.count({
      where: { paymentStatus: "PAID" },
    });
    const amountCents = paidCount < EARLY_BIRD_LIMIT ? EARLY_BIRD_CENTS : REGULAR_CENTS;
    const reg = await prisma.registration.create({
      data: {
        teamName: data.teamName,
        captainName: data.captainName,
        telegram: data.telegram,
        phone: data.phone,
        email: data.email,
        member1: data.member1,
        member2: data.member2,
        member3: data.member3,
        member4: data.member4,
        member5: data.member5 ? String(data.member5) : null,
        timeSlot,
        bundleId: String(data.bundleId),
        paymentStatus: "PENDING",
        amountCents,
        currency: "sgd",
      },
    });

    return NextResponse.json({ ok: true, registrationId: reg.id, amountCents });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // Slot already exists. If it's the same user and still pending, reuse it.
      const existing = await prisma.registration.findFirst({
        where: { timeSlot },
        select: { id: true, paymentStatus: true, email: true },
      });

      if (
        existing &&
        existing.paymentStatus === "PENDING" &&
        String(existing.email).toLowerCase() === String(data.email ?? "").toLowerCase()
      ) {
        return NextResponse.json({ ok: true, registrationId: existing.id, reused: true });
      }

      return NextResponse.json(
        { error: "This time slot has already been reserved. Please choose another slot." },
        { status: 409 }
      );
    }

    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
