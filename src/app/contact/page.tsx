import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import QuoteForm from "@/components/QuoteForm";
import { COMPANY } from "@/lib/company";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_.85fr]">
          <div className="rounded-2xl border border-white/10 bg-base-900 p-6 shadow-xl sm:p-8">
            <h1 className="text-2xl font-bold text-white">Request a Quote</h1>
            <p className="mt-1 text-sm text-gray-400">
              Tell us about your project and we&apos;ll get back to you with a quote.
            </p>
            <div className="mt-6">
              <QuoteForm />
            </div>
          </div>

          <aside className="rounded-2xl border border-[#18372f]/10 bg-white p-6 text-[#18372f] shadow-xl sm:p-8">
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
