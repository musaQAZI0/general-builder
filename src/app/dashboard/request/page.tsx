"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QuoteForm from "@/components/QuoteForm";

function RequestFormPanel() {
  const params = useSearchParams();
  const service = params.get("service") || "General enquiry";

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-5 py-8 text-[#18372f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">
          &lt;- Back to dashboard
        </Link>
        <section className="mt-8 border border-[#18372f]/10 bg-[#18372f] p-6 text-white shadow-xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d2b776]">Project request</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Request a Quote</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">Share the key details so Flint LTD can review the scope and respond with the right next step.</p>
          <div className="mt-7">
            <QuoteForm defaultService={service} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DashboardRequestPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f6f4ef] p-8 text-[#18372f]">Loading...</main>}>
      <RequestFormPanel />
    </Suspense>
  );
}
