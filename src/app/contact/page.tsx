import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import QuoteForm from "@/components/QuoteForm";
import { COMPANY } from "@/lib/company";
import { SERVICES } from "@/lib/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact and Request a Quote",
  description: "Contact Flint LTD about building work in London or reach our accounts team for invoice and payment queries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage({ searchParams }: { searchParams?: { service?: string } }) {
  const selectedService = SERVICES.find((service) => service.title === searchParams?.service)?.title;
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <div className="border border-[#18372f]/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Project enquiries</p>
            <h1 className="mt-2 text-3xl font-bold text-[#18372f]">Tell us about your project</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Request a quote without creating an account. Share the essentials and we&apos;ll follow up.
            </p>
            <div className="mt-6">
              <QuoteForm defaultService={selectedService} />
            </div>
          </div>

          <aside className="h-fit border border-[#18372f]/10 bg-[#f6f4ef] p-6 text-[#18372f] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">Accounts team</p>
            <h2 className="mt-3 text-2xl font-bold">Invoice and payment queries</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              For invoice questions or account information, contact the Flint LTD accounts department directly.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Phone</p>
                <a href={COMPANY.accounts.phoneHref} className="mt-1 block text-xl font-bold text-[#1689c8]">
                  {COMPANY.accounts.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Email</p>
                <a href={COMPANY.accounts.emailHref} className="mt-1 block break-all text-lg font-bold text-[#1689c8]">
                  {COMPANY.accounts.email}
                </a>
              </div>
              <div className="border-t border-[#18372f]/10 pt-4 text-slate-600">
                <p className="font-bold text-[#18372f]">{COMPANY.name}</p>
                {COMPANY.address.map((line) => <p key={line}>{line}</p>)}
                <p className="mt-3">
                  Co. Reg. No.: <span className="font-bold text-[#1689c8]">{COMPANY.registrationNumber}</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
