import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timeSlot = (searchParams.get("timeSlot") ?? "").trim();

  const row = await prisma.registration.findFirst({
    where: { timeSlot },
    select: { id: true, paymentStatus: true, createdAt: true, email: true },
  });

  return NextResponse.json({ row });
}
