"use client";

import { useRouter } from "next/navigation";
import { useRegister } from "./RegisterProvider";
import { getBundle, getSlot } from "@/lib/RegisterStore";

export function SummaryCard() {
  const router = useRouter();
  const { state, reset } = useRegister();

  const bundle = getBundle(state.bundleId);
  const slot = getSlot(state.slotId);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Summary</h2>

        <button
          onClick={() => {
            reset();                 // ✅ clears storage + state
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
