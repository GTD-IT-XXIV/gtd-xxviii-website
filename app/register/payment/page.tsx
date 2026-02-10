import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Loading payment…</div>}>
      <PaymentClient />
    </Suspense>
  );
}
