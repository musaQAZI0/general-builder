"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const statuses = ["Received", "Reviewing", "Estimate Sent", "Approved", "In Progress", "Completed"] as const;

interface Quote {
  _id: string;
  userEmail?: string;
  name: string;
  phone: string;
  service?: string;
  message: string;
  postcode?: string;
  propertyType?: string;
  timeline?: string;
  budget?: string;
  preferredContact?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/quotes")
      .then((res) => (res.ok ? res.json() : { quotes: [] }))
      .then((data) => setQuotes(data.quotes ?? []))
      .catch(() => setQuotes([]));
  }, [status]);

  async function updateQuote(id: string, statusValue: string, adminNotes: string) {
    setSavingId(id);
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusValue, adminNotes }),
    });
    const data = await res.json();
    if (res.ok) {
      setQuotes((items) => items.map((item) => (item._id === id ? { ...item, ...data.quote } : item)));
    }
    setSavingId(null);
  }

  if (status === "loading") {
    return <main className="min-h-screen bg-[#f6f4ef] p-8 text-[#18372f]">Loading...</main>;
  }

  if (!session?.user?.isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f4ef] p-6 text-[#18372f]">
        <div className="max-w-md border border-[#18372f]/10 bg-white p-8">
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Sign in with an email listed in ADMIN_EMAILS to manage client requests.</p>
          <Link href="/dashboard" className="mt-6 inline-flex bg-[#18372f] px-5 py-3 text-sm font-bold text-white">Back to dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-5 py-8 text-[#18372f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-[#18372f]/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Owner workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Client requests</h1>
          </div>
          <Link href="/dashboard" className="text-sm font-bold text-[#245548] underline underline-offset-4">Client dashboard</Link>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="border border-[#18372f]/10 bg-white p-5">
            <p className="text-3xl font-bold">{quotes.length}</p>
            <p className="mt-2 text-sm font-bold">Total requests</p>
          </div>
          <div className="border border-[#18372f]/10 bg-white p-5">
            <p className="text-3xl font-bold">{quotes.filter((quote) => quote.status !== "Completed").length}</p>
            <p className="mt-2 text-sm font-bold">Active requests</p>
          </div>
          <div className="border border-[#18372f]/10 bg-white p-5">
            <p className="text-3xl font-bold">24h</p>
            <p className="mt-2 text-sm font-bold">Reply target</p>
          </div>
        </section>

        <section className="mt-8 grid gap-5">
          {quotes.map((quote) => (
            <article key={quote._id} className="border border-[#18372f]/10 bg-white p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#f3eee2] px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#a98235]">{quote.status}</span>
                    <span className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{new Date(quote.createdAt).toLocaleDateString("en-GB")}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{quote.name} - {quote.service || "General enquiry"}</h2>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <a className="font-bold text-[#245548]" href={`tel:${quote.phone}`}>{quote.phone}</a>
                    <a className="break-all font-bold text-[#245548]" href={`mailto:${quote.userEmail}`}>{quote.userEmail || "No account email"}</a>
                    <p>Postcode: {quote.postcode || "Not supplied"}</p>
                    <p>Property: {quote.propertyType || "Not supplied"}</p>
                    <p>Timeline: {quote.timeline || "Not supplied"}</p>
                    <p>Budget: {quote.budget || "Not supplied"}</p>
                    <p>Preferred contact: {quote.preferredContact || "Not supplied"}</p>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap border-l-4 border-[#d2b776] bg-[#f6f4ef] px-4 py-3 text-sm leading-6 text-slate-700">{quote.message}</p>
                </div>
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const formData = new FormData(form);
                    updateQuote(quote._id, String(formData.get("status")), String(formData.get("adminNotes") || ""));
                  }}
                >
                  <label className="block text-xs font-bold uppercase tracking-[.14em] text-slate-500">Status</label>
                  <select name="status" defaultValue={quote.status} className="min-h-11 w-full border border-[#18372f]/15 bg-white px-3 text-sm">
                    {statuses.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <label className="block text-xs font-bold uppercase tracking-[.14em] text-slate-500">Internal/customer note</label>
                  <textarea name="adminNotes" defaultValue={quote.adminNotes || ""} rows={5} className="w-full border border-[#18372f]/15 px-3 py-2 text-sm" />
                  <button disabled={savingId === quote._id} className="w-full bg-[#18372f] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                    {savingId === quote._id ? "Saving..." : "Save update"}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
