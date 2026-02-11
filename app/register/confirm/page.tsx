"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { StepNavButtons } from "@/components/register/StepNavButtons";
import { canGoConfirm } from "@/components/register/routeGuards";
import { useRegister } from "@/components/register/RegisterProvider";
import { getBundle, getSlot } from "@/lib/RegisterStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
  );
}

export default function ConfirmPage() {
  const router = useRouter();
  const { state, hydrated } = useRegister();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!canGoConfirm(state)) router.replace("/register");
  }, [hydrated, state, router]);

  if (!hydrated) return null;

  const bundle = getBundle(state.bundleId);
  const slot = getSlot(state.slotId);

  async function handleConfirmAndPay() {
    if (isLoading) return;

    if (!state.bundleId || !state.slotId || !state.details) {
      alert("Missing registration data");
      return;
    }

    try {
      setIsLoading(true);

      // 1) Create registration in DB
      const createRes = await fetch("/api/register/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleId: state.bundleId,
          timeSlot: state.slotId,

          teamName: state.details.groupName,
          captainName: state.details.captainName,
          email: state.details.email,
          phone: state.details.phone,
          telegram: state.details.telegram,

          member1: state.details.member1,
          member2: state.details.member2,
          member3: state.details.member3,
          member4: state.details.member4,
          member5: state.details.member5,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        alert(createData.error ?? "Failed to create registration");
        setIsLoading(false);
        return;
      }

      const registrationId = createData.registrationId;

      // 2) Create Stripe checkout session
      const payRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleId: state.bundleId,
          registrationId,
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        alert(payData.error ?? "Failed to start payment");
        setIsLoading(false);
        return;
      }

      // 3) Redirect to Stripe (keep loading state true; page is leaving)
      window.location.href = payData.url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <RegisterShell title="Register • Confirmation">
      <div>
        <p className="text-sm text-gray-600">Review your registration details.</p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs text-gray-500">Bundle</div>
              <div className="mt-1 font-medium text-gray-900">
                {bundle ? `${bundle.name} (${bundle.priceText})` : "-"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Slot</div>
              <div className="mt-1 font-medium text-gray-900">
                {slot ? `${slot.dateText} • ${slot.label}` : "-"}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Guest</div>
              <div className="mt-1 font-medium text-gray-900">
                {state.details?.captainName ?? "-"}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {state.details?.email ?? "-"} • {state.details?.phone ?? "-"}
              </div>
            </div>
          </div>
        </div>

        <StepNavButtons
          backHref="/register/slot"
          nextDisabled={isLoading}
          nextLabel={
            isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Processing…
              </span>
            ) : (
              "Confirm & Pay"
            )
          }
          onNext={handleConfirmAndPay}
        />

        {isLoading && (
          <p className="mt-3 text-xs text-gray-500">
            Please don’t close this tab — redirecting to payment…
          </p>
        )}
      </div>
    </RegisterShell>
  );
}
