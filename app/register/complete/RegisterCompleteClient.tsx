"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearRegisterState } from "@/lib/RegisterStore";

export default function RegisterCompleteClient() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id"); // ok to keep (even if unused)

  useEffect(() => {
    clearRegisterState();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold">Payment successful 🎉</h1>
      <p className="mt-4 text-gray-600">Your registration has been confirmed.</p>
      <p className="mt-2 text-sm text-gray-400">
        Redirecting you to the home page…
      </p>

      {/* Optional: show sessionId for debugging */}
      {/* {sessionId && (
        <p className="mt-4 text-xs text-gray-400">Session: {sessionId}</p>
      )} */}
    </main>
  );
}
