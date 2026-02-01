"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { StepNavButtons } from "@/components/register/StepNavButtons";
import { canGoConfirm } from "@/components/register/routeGuards";
import { useRegister } from "@/components/register/RegisterProvider";
import { clearRegisterState, getBundle, getSlot } from "@/lib/RegisterStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPage() {
  const router = useRouter();
  const { state, hydrated } = useRegister();

  useEffect(() => {
    if (!hydrated) return;
    if (!canGoConfirm(state)) router.replace("/register");
  }, [hydrated, state, router]);

  if (!hydrated) return null;

  const bundle = getBundle(state.bundleId);
  const slot = getSlot(state.slotId);

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
                {state.details?.captainName?? "-"}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {state.details?.email ?? "-"} • {state.details?.phone ?? "-"}
              </div>
            </div>
          </div>
        </div>

        <StepNavButtons
          backHref="/register/slot"
          nextLabel="Confirm"
          onNext={() => {
            clearRegisterState();
            router.push("/register/payment");
          }}
        />

        <p className="mt-3 text-xs text-gray-500">
          (For now, Confirm just clears the form and returns Home. Later we can
          connect this to your backend + email.)
        </p>
      </div>
    </RegisterShell>
  );
}
