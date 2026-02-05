"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { StepNavButtons } from "@/components/register/StepNavButtons";
import { canGoSlot } from "@/components/register/routeGuards";
import { SLOTS } from "@/lib/RegisterData";
import { useRegister } from "@/components/register/RegisterProvider";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function SlotPage() {
  const router = useRouter();
  const { state, setState, hydrated } = useRegister();

  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!canGoSlot(state)) router.replace("/register/details");
  }, [hydrated, state, router]);

  useEffect(() => {
    if (!hydrated) return;

    (async () => {
      try {
        const res = await fetch("/api/timeslots/booked", { cache: "no-store" });
        const data = await res.json();
        setBooked(new Set((data?.booked ?? []).map((x: any) => String(x).trim())));
        console.log("BOOKED FROM API:", data);
        console.log("BOOKED SET:", Array.from(new Set((data?.booked ?? []).map((x:any)=>String(x).trim()))));
        console.log("SLOTS IDS:", SLOTS.map(s => s.id));

      } catch {
        setBooked(new Set());
      } finally {
        setLoading(false);
      }
    })();
  }, [hydrated]);

  const visibleSlots = useMemo(() => {
    return SLOTS.filter((s) => !booked.has(String(s.id).trim()));
  }, [booked]);

  // If user had a selected slot that is now booked, clear it
  useEffect(() => {
    if (!hydrated) return;
    if (state.slotId && booked.has(state.slotId)) {
      setState((prev) => ({ ...prev, slotId: null }));
    }
  }, [hydrated, booked, state.slotId, setState]);

  if (!hydrated) return null;

  return (
    <RegisterShell title="Register • Choose a time slot">
      <div>
        <p className="text-sm text-gray-600">
          Choose one available time slot.
          {loading && <span className="ml-2 text-gray-400">Loading…</span>}
        </p>

        <div className="mt-6 grid gap-3">
          {visibleSlots.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              No slots left. Please check back later.
            </div>
          ) : (
            visibleSlots.map((s) => {
              const selected = state.slotId === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => setState((prev) => ({ ...prev, slotId: s.id }))}
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
            })
          )}
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
