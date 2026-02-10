import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();

  const rows = await prisma.registration.findMany({
    where: {
      timeSlot: { not: null },
      OR: [
        { paymentStatus: "PAID" },
        {
          paymentStatus: "PENDING",
          slotHoldUntil: { gt: now },
        },
      ],
    },
    select: { timeSlot: true },
  });

  const booked = rows.map((r) => String(r.timeSlot).trim());

  return NextResponse.json(
    { booked },
    { headers: { "Cache-Control": "no-store" } }
  );
}
