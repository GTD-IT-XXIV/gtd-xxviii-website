"use client";

import { SummaryCard } from "./SummaryCard";

export default function RegisterShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-[#C71E1E]">{title}</h1>
        <p className="mt-2 text-sm text-gray-200">
          Complete the steps to register. Your progress is saved automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {children}
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          <SummaryCard />
        </div>
      </div>
    </div>
  );
}
