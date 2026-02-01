"use client";

import Link from "next/link";

export function StepNavButtons({
  backHref,
  nextLabel,
  onNext,
  nextDisabled,
}: {
  backHref?: string;
  nextLabel: string;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
        ) : (
          <span />
        )}
      </div>

      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}