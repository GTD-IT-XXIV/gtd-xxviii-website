"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearRegisterState } from "@/lib/RegisterStore";

export default function RegisterCompletePage() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  useEffect(() => {
    clearRegisterState();
  }, []);

  useEffect(() => {
    // Optional: wait a bit so user sees success message
    const t = setTimeout(() => {
      router.replace("/"); // go home
    }, 3000);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold">Payment successful 🎉</h1>
      <p className="mt-4 text-gray-600">
        Your registration has been confirmed.
      </p>
      <p className="mt-2 text-sm text-gray-400">
        Redirecting you to the home page…
      </p>
    </main>
  );
}
