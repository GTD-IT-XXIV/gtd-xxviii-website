"use client";

import { useRouter } from "next/navigation";
import { useRegister } from "./RegisterProvider";
import { getBundle, getSlot } from "@/lib/RegisterStore";
import { useEffect, useMemo, useState } from "react";

function useBump(depsKey: string) {
  const [bump, setBump] = useState(false);

  useEffect(() => {
    setBump(true);
    const t = setTimeout(() => setBump(false), 180);
    return () => clearTimeout(t);
  }, [depsKey]);

  return bump;
}

export function SummaryCard() {
  const router = useRouter();
  const { state, reset } = useRegister();

  const bundle = getBundle(state.bundleId);
  const slot = getSlot(state.slotId);

  const depsKey = useMemo(() => {
    const d = state.details;
    return [
      state.bundleId ?? "",
      state.slotId ?? "",
      d?.captainName ?? "",
      d?.email ?? "",
      d?.phone ?? "",
    ].join("|");
  }, [state.bundleId, state.slotId, state.details]);

  const bump = useBump(depsKey);

  const ready =
    !!state.bundleId &&
    !!state.slotId &&
    !!state.details?.captainName &&
    !!state.details?.email &&
    !!state.details?.phone;

  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-200",
        bump ? "-translate-y-1" : "translate-y-0",
      ].join(" ")}
    >
      {/* Accent bar */}
      <div
      className={[
        "mb-4 h-1 w-full rounded-full transition-all duration-300",
        ready
          ? "bg-[#29cb33] shadow-[0_0_8px_rgba(41,203,51,0.6)]"
          : "bg-[#cb2929] shadow-[0_0_6px_rgba(203,41,41,0.6)]",
      ].join(" ")}
    />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
          <span
            className={[
              "rounded-full px-2 py-0.5 text-xs font-medium",
              ready
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            {ready ? "Ready" : "Incomplete"}
          </span>
        </div>

        <button
          onClick={() => {
            reset();
            router.replace("/register");
          }}
          className="text-xs text-gray-500 hover:text-gray-800"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-4 text-sm">
        <div>
          <div className="text-gray-500">Bundle</div>
          <div className="mt-1 font-medium text-gray-900">
            {bundle ? `${bundle.name} • ${bundle.priceText}` : "Not selected"}
          </div>
        </div>

        <div>
          <div className="text-gray-500">Details</div>
          <div className="mt-1 font-medium text-gray-900">
            {state.details ? state.details.captainName : "Not filled"}
          </div>
          {state.details && (
            <div className="mt-1 text-gray-600">
              {state.details.email} • {state.details.phone}
            </div>
          )}
        </div>

        <div>
          <div className="text-gray-500">Slot</div>
          <div className="mt-1 font-medium text-gray-900">
            {slot ? `${slot.dateText} • ${slot.label}` : "Not selected"}
          </div>
        </div>
      </div>
    </div>
  );
}
