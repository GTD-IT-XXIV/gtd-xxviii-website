import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EARLY_BIRD_LIMIT = 3;

export async function GET() {
  const now = new Date();

  const claimed = await prisma.registration.count({
    where: {
      bundleId: "early",
      OR: [{ paymentStatus: "PAID" }, { bundleHoldUntil: { gt: now } }],
    },
  });

  const remaining = Math.max(0, EARLY_BIRD_LIMIT - claimed);

  return NextResponse.json({
    early: {
      limit: EARLY_BIRD_LIMIT,
      claimed,
      remaining,
      soldOut: remaining === 0,
    },
  });
}
