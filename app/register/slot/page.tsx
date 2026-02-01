"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { StepNavButtons } from "@/components/register/StepNavButtons";
import { canGoSlot } from "@/components/register/routeGuards";
import { SLOTS } from "@/lib/RegisterData";
import { useRegister } from "@/components/register/RegisterProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SlotPage() {
  const router = useRouter();
  const { state, setState, hydrated } = useRegister();

  useEffect(() => {
    if (!hydrated) return;
    if (!canGoSlot(state)) router.replace("/register/details");
  }, [hydrated, state, router]);

  if (!hydrated) return null;

  return (
    <RegisterShell title="Register • Choose a time slot">
      <div>
        <p className="text-sm text-gray-600">
          Choose one available time slot.
        </p>

        <div className="mt-6 grid gap-3">
          {SLOTS.map((s) => {
            const selected = state.slotId === s.id;

            return (
              <button
                key={s.id}
                onClick={() =>
                  setState((prev) => ({ ...prev, slotId: s.id }))
                }
                className={[
                  "flex items-center justify-between rounded-2xl border px-5 py-4 text-left shadow-sm transition",
                  selected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:bg-gray-50",
                ].join(" ")}
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {s.dateText}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{s.label}</div>
                </div>

                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs",
                    selected
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700",
                  ].join(" ")}
                >
                  {selected ? "Selected" : "Select"}
                </span>
              </button>
            );
          })}
        </div>

        <StepNavButtons
          backHref="/register/details"
          nextLabel="Next"
          nextDisabled={!state.slotId}
          onNext={() => router.push("/register/confirm")}
        />
      </div>
    </RegisterShell>
  );
}
