import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing registration id" }, { status: 400 });
  }

  await prisma.registration.update({
    where: { id },
    data: {
      paymentStatus: "CANCELED",
      timeSlot: null,    
      slotHoldUntil: null
    },
  });

  return NextResponse.json({ ok: true });
}
