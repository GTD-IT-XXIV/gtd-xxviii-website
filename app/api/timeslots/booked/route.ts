export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.registration.findMany({
    where: { paymentStatus: { in: ["PENDING", "PAID"] } },
    select: { timeSlot: true },
  });

  const booked = rows.map((r) => String(r.timeSlot).trim());

  return NextResponse.json(
    { booked },
    { headers: { "Cache-Control": "no-store" } }
  );
}
