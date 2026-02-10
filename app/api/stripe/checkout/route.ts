import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY");
const stripe = new Stripe(secretKey);

const EARLY_BIRD_LIMIT = 3;
const HOLD_MS = 5 * 60 * 1000;

const PRICES: Record<string, { name: string; amountCents: number }> = {
  early: { name: "Early Bird Bundle", amountCents: 4200 },
  standard: { name: "Standard Bundle", amountCents: 4800 },
};

export async function POST(req: Request) {
  const { registrationId, bundleId } = await req.json();

  if (!registrationId) {
    return NextResponse.json({ error: "Missing registrationId" }, { status: 400 });
  }
  if (!bundleId || !(bundleId in PRICES)) {
    return NextResponse.json({ error: "Invalid bundleId" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_SITE_URL" }, { status: 500 });
  }

  const now = new Date();
  const holdUntil = new Date(Date.now() + HOLD_MS);

  // Load registration
  const reg = await prisma.registration.findUnique({
    where: { id: String(registrationId) },
    select: {
      id: true,
      timeSlot: true,
      currency: true,
      paymentStatus: true,
      bundleId: true,
      bundleHoldUntil: true,
    },
  });

  if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  if (!reg.timeSlot) {
    return NextResponse.json({ error: "Registration missing timeSlot" }, { status: 400 });
  }
  if (reg.paymentStatus === "PAID") {
    return NextResponse.json({ error: "Already paid" }, { status: 409 });
  }

  // Enforce early-bird capacity with holds + paid
  if (bundleId === "early") {
    // If this registration already has an active early hold, keep it.
    const alreadyHoldingEarly =
      reg.bundleId === "early" && reg.bundleHoldUntil && reg.bundleHoldUntil > now;

    if (!alreadyHoldingEarly) {
      const claimed = await prisma.registration.count({
        where: {
          bundleId: "early",
          OR: [
            { paymentStatus: "PAID" },
            { bundleHoldUntil: { gt: now } }, // active holds
          ],
        },
      });

      if (claimed >= EARLY_BIRD_LIMIT) {
        return NextResponse.json({ error: "Early bird sold out" }, { status: 409 });
      }
    }
  }

  // Lock selection + price on DB (source of truth)
  const price = PRICES[bundleId];
  const currency = (reg.currency ?? "sgd").toLowerCase();

  await prisma.registration.update({
    where: { id: reg.id },
    data: {
      bundleId,
      amountCents: price.amountCents,
      paymentStatus: "PENDING",
      slotHoldUntil: holdUntil,   // you already use this
      bundleHoldUntil: holdUntil, // new: early-bird inventory hold
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: price.name },
          unit_amount: price.amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      registrationId: String(reg.id),
      bundleId,
      amountCents: String(price.amountCents),
    },
    success_url: `${origin}/register/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/register/payment?canceled=1&rid=${reg.id}`,
  });

  await prisma.registration.update({
    where: { id: reg.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
