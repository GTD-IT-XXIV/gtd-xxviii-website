"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { useRegister } from "@/components/register/RegisterProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentPage() {
  const { state, hydrated } = useRegister();
  const router = useRouter();
  const sp = useSearchParams();
  const canceled = sp.get("canceled");

  useEffect(() => {
    if (!hydrated) return;
    // If no bundle selected, kick back to bundle page
    if (!state.bundleId) router.replace("/register");
  }, [hydrated, state.bundleId, router]);

  async function startCheckout() {
  if (!state.bundleId) return;

  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bundleId: state.bundleId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    alert(data?.error ?? `Checkout failed (${res.status})`);
    console.log("checkout error:", data);
    return;
  }

  if (data?.url) window.location.href = data.url;
}

  return (
    <RegisterShell title="Register • Payment">
      {canceled && (
        <p className="mb-3 text-sm text-red-600">Payment canceled. You can try again.</p>
      )}

      <p className="text-sm text-gray-600">
        You’ll be redirected to Stripe to complete payment.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push("/register/confirm")}
          className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>

        <button
          onClick={startCheckout}
          disabled={!state.bundleId}
          className={[
            "rounded-lg px-5 py-2.5 text-sm font-medium",
            state.bundleId
              ? "bg-gray-900 text-white hover:bg-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed",
          ].join(" ")}
        >
          Pay with Stripe
        </button>
      </div>
    </RegisterShell>
  );
}
