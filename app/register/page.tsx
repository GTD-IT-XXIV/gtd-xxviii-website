"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { useRegister } from "@/components/register/RegisterProvider";
import { BUNDLES } from "@/lib/RegisterData";
import Link from "next/link";

export default function RegisterPage() {
  const { state, setState, hydrated } = useRegister();

  if (!hydrated) return null; // prevents hydration mismatch

  return (
    <RegisterShell title="Register • Choose a bundle">
      <p className="text-sm text-gray-600">Select an event bundle to continue.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {BUNDLES.slice(0, 2).map((b) => {
          const selected = state.bundleId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setState((prev) => ({ ...prev, bundleId: b.id }))}
              className={[
                "text-left rounded-2xl border p-5 transition shadow-sm",
                selected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:bg-gray-50",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-gray-900">{b.name}</div>
                  <div className="mt-1 text-sm text-gray-600">{b.description}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">{b.priceText}</div>
              </div>
              <div className="mt-4">
                <span
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-xs",
                    selected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700",
                  ].join(" ")}
                >
                  {selected ? "Selected" : "Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex w-full items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Home
        </Link>
        <Link
          href="/register/details"
          className={[
            "inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium",
            state.bundleId
              ? "bg-gray-900 text-white hover:bg-black"
              : "bg-gray-200 text-gray-400 pointer-events-none",
          ].join(" ")}
        >
          Next
        </Link>
      </div>
    </RegisterShell>
  );
}
