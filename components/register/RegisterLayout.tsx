"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  RegisterState,
  readRegisterState,
  writeRegisterState,
  defaultRegisterState,
} from "@/lib/RegisterStore";
import { SummaryCard } from "./SummaryCard";

type Props = {
  title: string;
  children: (args: {
    state: RegisterState;
    setState: (updater: (prev: RegisterState) => RegisterState) => void;
  }) => ReactNode;
};

export default function RegisterLayout({ title, children }: Props) {
  const [state, setStateInternal] = useState<RegisterState>(defaultRegisterState);

  useEffect(() => {
    setStateInternal(readRegisterState());
  }, []);

  const setState = (updater: (prev: RegisterState) => RegisterState) => {
    setStateInternal((prev) => {
      const next = updater(prev);
      writeRegisterState(next);
      return next;
    });
  };

  const stepLabels = useMemo(
    () => ["Bundle", "Details", "Slot", "Confirm"],
    []
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete the steps to register. Your progress is saved automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            {stepLabels.map((s) => (
              <span
                key={s}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
              >
                {s}
              </span>
            ))}
          </div>

          {children({ state, setState })}
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          <SummaryCard/>
        </div>
      </div>
    </div>
  );
}