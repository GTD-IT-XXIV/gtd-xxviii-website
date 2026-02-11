"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { useRegister } from "@/components/register/RegisterProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PaymentClient() {
  const { state, hydrated } = useRegister();
  const router = useRouter();
  const sp = useSearchParams();

  const canceled = sp.get("canceled"); // expects "1"
  const rid = sp.get("rid"); // registration id from cancel_url

  const didReleaseRef = useRef(false);
  const [releaseStatus, setReleaseStatus] = useState<"idle" | "releasing" | "released" | "error">("idle");
  const [releaseError, setReleaseError] = useState<string | null>(null);

  // Use rid if present (retry after cancel). Otherwise you need an id from state.
  // If you haven't added state.registrationId, this will rely on rid and require user to come from a cancel.
  const registrationId = useMemo(() => {
    // If you added state.registrationId, include it here:
    // return rid ?? state.registrationId ?? null;
    return rid ?? null;
  }, [rid /*, state.registrationId */]);

  // Release reservation when payment canceled
  useEffect(() => {
    if (!hydrated) return;
    if (canceled !== "1" || !rid) return;

    if (didReleaseRef.current) return;
    didReleaseRef.current = true;

    (async () => {
      try {
        setReleaseStatus("releasing");
        setReleaseError(null);

        const res = await fetch("/api/registrations/release", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: rid }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setReleaseStatus("error");
          setReleaseError(
            data?.detail
              ? `${data.error}: ${data.detail}`
              : (data?.error ?? `Release failed (HTTP ${res.status})`)
          );
          return;
        }

        setReleaseStatus("released");
      } catch (e: any) {
        console.error("release exception:", e);
        setReleaseStatus("error");
        setReleaseError(e?.message ?? "Release failed (network error)");
      }
    })();
  }, [hydrated, canceled, rid]);

  // Guard
  useEffect(() => {
    if (!hydrated) return;
    if (!state.bundleId) router.replace("/register");
  }, [hydrated, state.bundleId, router]);

  async function startCheckout() {
    if (!state.bundleId) return;

    // You MUST have a registrationId to start checkout (your API requires it).
    if (!registrationId) {
      alert("Missing registrationId. Please go back and confirm again.");
      router.replace("/register/confirm");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bundleId: state.bundleId,
        registrationId,
      }),
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
      {canceled === "1" && (
        <div className="mb-3 space-y-1">
          <p className="text-sm text-red-600">Payment canceled. You can try again.</p>

          {releaseStatus === "releasing" && (
            <p className="text-xs text-gray-500">Releasing your reserved slot…</p>
          )}

          {releaseStatus === "released" && (
            <p className="text-xs text-gray-500">Slot released.</p>
          )}

          {releaseStatus === "error" && (
            <p className="text-xs text-red-600">
              Couldn’t release slot automatically: {releaseError}
            </p>
          )}
        </div>
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
      </div>
    </RegisterShell>
  );
}
