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

  const [selectedDate, setSelectedDate] = useState<string>("");

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

  const dateOptions = useMemo(() => {
    const unique = Array.from(new Set(visibleSlots.map((s) => s.dateText)));
    return unique;
  }, [visibleSlots]);

  useEffect(() => {
    if (!hydrated) return;
    if (!selectedDate && dateOptions.length > 0) {
      setSelectedDate(dateOptions[0]);
    }
  }, [hydrated, selectedDate, dateOptions]);

  const filteredSlots = useMemo(() => {
    if (!selectedDate) return [];
    return visibleSlots.filter((s) => s.dateText === selectedDate);
  }, [visibleSlots, selectedDate]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.slotId && booked.has(state.slotId)) {
      setState((prev) => ({ ...prev, slotId: null }));
    }
  }, [hydrated, booked, state.slotId, setState]);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.slotId) return;

    const chosen = SLOTS.find((s) => s.id === state.slotId);
    if (chosen && selectedDate && chosen.dateText !== selectedDate) {
      setState((prev) => ({ ...prev, slotId: null }));
    }
  }, [hydrated, selectedDate, state.slotId, setState]);

  if (!hydrated) return null;

  return (
    <RegisterShell title="Register • Choose a time slot">
      <div>
        <p className="text-sm text-gray-600">
          Choose one available time slot.
          {loading && <span className="ml-2 text-gray-400">Loading…</span>}
        </p>

        {/* Date dropdown */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-black">
            Select date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
            disabled={loading || dateOptions.length === 0}
          >
            {dateOptions.length === 0 ? (
              <option value="">No dates available</option>
            ) : (
              dateOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mt-6 grid gap-3">
          {filteredSlots.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              No slots left for {selectedDate || "this date"}. Please choose another date.
            </div>
          ) : (
            filteredSlots.map((s) => {
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
                      selected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700",
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
