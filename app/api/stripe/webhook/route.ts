export const runtime = "nodejs";

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function isObjectId(s: string) {
  return /^[a-f0-9]{24}$/i.test(s);
}

export async function POST(req: Request) {
  console.log("✅ WEBHOOK HIT");
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err?.message ?? err);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only mark PAID if Stripe says paid
        if (session.payment_status !== "paid") break;

        const registrationId = session.metadata?.registrationId;
        if (!registrationId || !isObjectId(registrationId)) {
          console.error("Bad or missing registrationId metadata:", registrationId, "session:", session.id);
          return NextResponse.json(
            { error: "Missing/invalid registrationId in session.metadata" },
            { status: 400 }
          );
        }

        const stripeSessionId = session.id;
        const stripePaymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        // Idempotent: updateMany won't throw if record was deleted
        await prisma.registration.updateMany({
          where: { id: registrationId },
          data: {
            paymentStatus: "PAID",
            stripeSessionId,
            stripePaymentIntentId,

            // ✅ clear holds
            slotHoldUntil: null,
            bundleHoldUntil: null,
          },
        });

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const registrationId = session.metadata?.registrationId;

        if (registrationId && isObjectId(registrationId)) {
          const reg = await prisma.registration.findUnique({
            where: { id: registrationId },
            select: { id: true, paymentStatus: true },
          });

          // ✅ delete non-paid to free UNIQUE timeSlot
          if (reg && reg.paymentStatus !== "PAID") {
            await prisma.registration.delete({ where: { id: reg.id } });
          }
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;

        // This is optional; keep it, but make it consistent
        await prisma.registration.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { paymentStatus: "FAILED" },
        });

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler failed:", err);
    // Stripe will retry on 500
    return NextResponse.json(
      { error: `Webhook handler failed: ${err.message ?? "Unknown error"}` },
      { status: 500 }
    );
  }
}
