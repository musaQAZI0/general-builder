"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { COMPANY } from "@/lib/company";
import { SERVICES } from "@/lib/services";

const navItems = [
  ["Overview", "#overview"],
  ["Requests", "#requests"],
  ["Services", "#services"],
  ["Accounts", "#accounts"],
  ["Support", "#support"],
];

interface QuoteSummary {
  _id: string;
  service?: string;
  message: string;
  postcode?: string;
  timeline?: string;
  budget?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quotes, setQuotes] = useState<QuoteSummary[]>([]);
  const { data: session } = useSession();
  const firstName = session?.user?.email?.split("@")[0]?.split(/[._-]/)[0] || "there";

  useEffect(() => {
    fetch("/api/quotes")
      .then((res) => (res.ok ? res.json() : { quotes: [] }))
      .then((data) => setQuotes(data.quotes ?? []))
      .catch(() => setQuotes([]));
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#18372f] lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col bg-[#18372f] text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[86px] items-center justify-between border-b border-white/10 px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden bg-white">
              <Image src="/flint-logo-ai.png" alt="" fill sizes="44px" className="object-contain p-1" priority />
            </span>
            <span>
              <span className="block text-sm font-extrabold uppercase tracking-[.14em]">Flint LTD</span>
              <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-white/40">Client portal</span>
            </span>
          </Link>
          <button onClick={() => setMenuOpen(false)} aria-label="Close dashboard menu" className="text-xl lg:hidden">x</button>
        </div>

        <nav className="flex-1 px-4 py-6">
          {navItems.map(([label, href], index) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`mb-1 flex min-h-12 items-center border-l-2 px-4 text-sm font-bold transition ${index === 0 ? "border-[#c8aa68] bg-white/10 text-white" : "border-transparent text-white/55 hover:bg-white/5 hover:text-white"}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="border-t border-white/10 p-5">
          <div className="mb-5 border border-white/10 bg-white/[.04] p-4">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d2b776]">Signed in as</p>
            <p className="mt-2 truncate text-sm font-bold">{session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full border border-white/15 px-4 py-3 text-left text-xs font-bold text-white/65 hover:bg-white/10 hover:text-white">
            Log out
          </button>
          {session?.user?.isAdmin && (
            <Link href="/admin" className="mt-3 block w-full border border-[#d2b776]/60 px-4 py-3 text-xs font-bold text-[#d2b776] hover:bg-white/10">
              Admin requests
            </Link>
          )}
        </div>
      </aside>

      {menuOpen && <button aria-label="Close dashboard overlay" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}

      <main id="overview" className="min-w-0 pb-24">
        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-[#18372f]/10 bg-white/95 px-5 backdrop-blur sm:px-8 lg:px-10">
          <button onClick={() => setMenuOpen(true)} aria-label="Open dashboard menu" className="grid h-10 w-10 place-items-center border border-[#18372f]/15 text-xl lg:hidden">=</button>
          <div className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">Client workspace</p>
            <p className="text-sm font-bold">Manage requests, accounts and next steps</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={COMPANY.accounts.phoneHref} className="hidden text-sm font-bold text-[#245548] sm:block">{COMPANY.accounts.phone}</a>
            <Link href="/dashboard/request" className="inline-flex min-h-11 items-center bg-[#18372f] px-4 text-sm font-bold text-white hover:bg-[#245548] sm:px-5">
              New request
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <section className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <div className="border border-[#18372f]/10 bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Welcome back</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Good to see you, <span className="capitalize">{firstName}</span>.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Use this portal to start building requests, check what happens next, and find the correct account team contact details.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard/request" className="inline-flex min-h-12 items-center justify-center bg-[#18372f] px-6 text-sm font-bold text-white hover:bg-[#245548]">Start project request</Link>
                <a href="#accounts" className="inline-flex min-h-12 items-center justify-center border border-[#18372f]/15 px-6 text-sm font-bold hover:bg-[#f6f4ef]">View accounts</a>
              </div>
            </div>

            <aside className="border border-[#18372f]/10 bg-[#18372f] p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d2b776]">Priority contact</p>
              <h2 className="mt-4 text-2xl font-bold">Accounts Department</h2>
              <p className="mt-3 text-sm leading-6 text-white/55">For invoice, payment or company account queries.</p>
              <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
                <a href={COMPANY.accounts.phoneHref} className="block text-xl font-bold text-[#d2b776]">{COMPANY.accounts.phone}</a>
                <a href={COMPANY.accounts.emailHref} className="block break-all text-sm font-bold text-white">{COMPANY.accounts.email}</a>
              </div>
            </aside>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="border border-[#18372f]/10 bg-white p-5">
              <p className="text-3xl font-bold">{quotes.length}</p>
              <h2 className="mt-3 font-bold">Saved requests</h2>
              <p className="mt-1 text-sm text-slate-500">Project enquiries in your account</p>
            </article>
            <article className="border border-[#18372f]/10 bg-white p-5">
              <p className="text-3xl font-bold">24h</p>
              <h2 className="mt-3 font-bold">Typical reply</h2>
              <p className="mt-1 text-sm text-slate-500">Initial response window</p>
            </article>
            <article className="border border-[#18372f]/10 bg-white p-5">
              <p className="text-3xl font-bold">1</p>
              <h2 className="mt-3 font-bold">Project lead</h2>
              <p className="mt-1 text-sm text-slate-500">Single point of contact</p>
            </article>
          </section>

          <section id="requests" className="scroll-mt-28 pt-12">
            <div className="flex flex-col justify-between gap-4 border-b border-[#18372f]/10 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Requests</p>
                <h2 className="mt-2 text-2xl font-bold">Project request status</h2>
              </div>
              <Link href="/dashboard/request" className="text-sm font-bold text-[#245548] underline underline-offset-4">Create request</Link>
            </div>
            <div className="mt-5 grid gap-4">
              {quotes.length === 0 ? (
                <article className="border border-dashed border-[#18372f]/20 bg-white p-6">
                  <h3 className="text-lg font-bold">No project requests yet</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Create your first request and it will appear here with status updates.</p>
                </article>
              ) : quotes.map((quote) => (
                <article key={quote._id} className="border border-[#18372f]/10 bg-white p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <span className="inline-flex bg-[#f3eee2] px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#a98235]">{quote.status}</span>
                      <h3 className="mt-4 text-lg font-bold">{quote.service || "General enquiry"}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{quote.message}</p>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">
                      {new Date(quote.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-3 border-t border-[#18372f]/10 pt-4 text-sm text-slate-600 sm:grid-cols-3">
                    <p><span className="font-bold text-[#18372f]">Postcode:</span> {quote.postcode || "Not supplied"}</p>
                    <p><span className="font-bold text-[#18372f]">Timeline:</span> {quote.timeline || "Not supplied"}</p>
                    <p><span className="font-bold text-[#18372f]">Budget:</span> {quote.budget || "Not supplied"}</p>
                  </div>
                  {quote.adminNotes && (
                    <p className="mt-4 border-l-4 border-[#d2b776] bg-[#f6f4ef] px-4 py-3 text-sm text-slate-700">{quote.adminNotes}</p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section id="services" className="scroll-mt-28 pt-12">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Start a project</p>
                <h2 className="mt-2 text-2xl font-bold">Choose a service</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">Pick the closest service. You can add specific details in the request form.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  data-testid="service-card"
                  href={`/dashboard/request?service=${encodeURIComponent(service.title)}`}
                  className="group flex min-h-[176px] flex-col border border-[#18372f]/10 bg-white p-5 text-left transition hover:border-[#245548] hover:bg-[#245548] hover:text-white"
                >
                  <span className="text-xs font-bold text-[#a98235] group-hover:text-[#d2b776]">{service.icon}</span>
                  <h3 className="mt-auto font-bold">{service.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500 group-hover:text-white/65">{service.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section id="accounts" className="scroll-mt-28 pt-12">
            <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
              <div className="border border-[#18372f]/10 bg-white p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Company details</p>
                <h2 className="mt-3 text-2xl font-bold">{COMPANY.name}</h2>
                <div className="mt-5 text-sm leading-6 text-slate-600">
                  {COMPANY.address.map((line) => <p key={line}>{line}</p>)}
                  <p className="mt-4">Co. Reg. No.: <span className="font-bold text-[#1689c8]">{COMPANY.registrationNumber}</span></p>
                </div>
              </div>
              <div className="border border-[#18372f]/10 bg-white p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Documents</p>
                <h2 className="mt-3 text-2xl font-bold">Invoices and estimates</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Documents sent by the accounts team should be checked against the company details shown here.</p>
                <div className="mt-6 border border-dashed border-[#18372f]/20 bg-[#f6f4ef] p-5">
                  <p className="font-bold">No documents uploaded yet.</p>
                  <p className="mt-1 text-sm text-slate-500">Invoices and estimates can be added here in a future portal update.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="support" className="scroll-mt-28 pt-12">
            <div className="flex flex-col justify-between gap-6 border-t border-[#18372f]/10 py-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Need help?</h2>
                <p className="mt-1 text-sm text-slate-500">Contact accounts for invoices, or start a request for project work.</p>
              </div>
              <div className="flex flex-col gap-2 text-sm font-bold sm:items-end">
                <a href={COMPANY.accounts.phoneHref} className="text-[#245548]">{COMPANY.accounts.phone}</a>
                <a href={COMPANY.accounts.emailHref} className="break-all text-[#245548]">{COMPANY.accounts.email}</a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-[#18372f]/10 bg-white px-2 lg:hidden">
        <a href="#overview" className="flex items-center justify-center text-[11px] font-bold text-[#245548]">Overview</a>
        <a href="#requests" className="flex items-center justify-center text-[11px] font-bold text-slate-500">Requests</a>
        <a href="#services" className="flex items-center justify-center text-[11px] font-bold text-slate-500">Services</a>
        <a href="#accounts" className="flex items-center justify-center text-[11px] font-bold text-slate-500">Accounts</a>
      </nav>
    </div>
  );
}
