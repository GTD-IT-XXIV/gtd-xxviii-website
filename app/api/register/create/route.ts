import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BUNDLES } from "@/lib/RegisterData";

export async function POST(req: Request) {
  const data = await req.json();

  const bundle = BUNDLES.find((b) => b.id === data.bundleId);
  if (!bundle) return NextResponse.json({ error: "Invalid bundleId" }, { status: 400 });

  const amountCents = (bundle as any).amountCents;
  if (typeof amountCents !== "number") {
    return NextResponse.json({ error: "Bundle missing amountCents" }, { status: 400 });
  }

  // Create PENDING registration
  const reg = await prisma.registration.create({
    data: {
      teamName: data.teamName,
      captainName: data.captainName,
      telegram: data.telegram,
      phone: data.phone,
      email: data.email,

      member1: data.member1 ?? "",
      member2: data.member2 ?? "",
      member3: data.member3 ?? "",
      member4: data.member4 ?? "",
      member5: data.member5 ?? null,

      timeSlot: data.timeSlot,
      bundleId: data.bundleId,

      amountCents,
      currency: "sgd",
      paymentStatus: "PENDING",
    },
    select: { id: true },
  });

  return NextResponse.json({ registrationId: reg.id });
}
