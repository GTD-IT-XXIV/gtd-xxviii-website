export const runtime = "nodejs";

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text(); // raw body

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extra safety: only treat as paid when paid
        if (session.payment_status !== "paid") break;

        const registrationId = session.metadata?.registrationId;
        if (!registrationId) {
          return NextResponse.json(
            { error: "Missing registrationId in session.metadata" },
            { status: 400 }
          );
        }

        const stripeSessionId = session.id;
        const stripePaymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        // Idempotent update:
        // - if already PAID, do nothing harmful
        // - your schema has unique stripeSessionId / stripePaymentIntentId, good
        await prisma.registration.update({
          where: { id: registrationId },
          data: {
            paymentStatus: "PAID",
            stripeSessionId,
            stripePaymentIntentId,
          },
        });

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const registrationId = session.metadata?.registrationId;

        if (registrationId) {
          await prisma.registration.update({
            where: { id: registrationId },
            data: {
              paymentStatus: "CANCELED",
              stripeSessionId: session.id,
            },
          });
        }
        break;
      }

      // Optional: handle failed payments (depends on your flow)
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;

        // If you stored stripePaymentIntentId already, you can update by that unique field.
        // NOTE: Prisma update requires unique `where`. stripePaymentIntentId is @unique, so OK.
        await prisma.registration.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { paymentStatus: "FAILED" },
        });

        break;
      }

      default:
        // ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    // If we return 500, Stripe will retry (good)
    return NextResponse.json(
      { error: `Webhook handler failed: ${err.message ?? "Unknown error"}` },
      { status: 500 }
    );
  }
}
