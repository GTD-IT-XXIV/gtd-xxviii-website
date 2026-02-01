import Stripe from "stripe";
import RegisterShell from "@/components/register/RegisterShell";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function CompletePage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <RegisterShell title="Payment complete">
        <p className="text-sm text-gray-600">Missing session.</p>
      </RegisterShell>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return (
    <RegisterShell title="Payment complete">
      <p className="text-sm text-gray-600">
        Thanks! Your payment status: <span className="font-semibold">{session.payment_status}</span>
      </p>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
        <div>Session: {session.id}</div>
        <div>Amount: {(session.amount_total ?? 0) / 100} {session.currency?.toUpperCase()}</div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Note: This page is for display. Fulfillment should be handled via webhooks. 
      </p>
    </RegisterShell>
  );
}
