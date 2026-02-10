import { Suspense } from "react";
import RegisterCompleteClient from "./RegisterCompleteClient";

export default function RegisterCompletePage() {
  return (
    <Suspense fallback={<RegisterCompleteFallback />}>
      <RegisterCompleteClient />
    </Suspense>
  );
}

function RegisterCompleteFallback() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold">Payment successful 🎉</h1>
      <p className="mt-4 text-gray-600">Your registration has been confirmed.</p>
      <p className="mt-2 text-sm text-gray-400">Loading details…</p>
    </main>
  );
}
