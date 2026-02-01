import Stripe from "stripe";
import { NextResponse } from "next/server";
import { BUNDLES } from "@/lib/RegisterData";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY. Check .env.local is in project root and restart npm run dev.");
}

const stripe = new Stripe(secretKey);

export async function POST(req: Request) {
  const { bundleId } = await req.json();

  const bundle = BUNDLES.find((b) => b.id === bundleId);
  if (!bundle) return NextResponse.json({ error: "Invalid bundle" }, { status: 400 });

  const amountCents = (bundle as any).amountCents;
  if (typeof amountCents !== "number") {
    return NextResponse.json({ error: "Missing amountCents on bundle" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_SITE_URL in .env.local" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "sgd",
          product_data: { name: bundle.name },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/register/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/register/payment?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
