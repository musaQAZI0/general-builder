import Link from "next/link";
import { COMPANY } from "@/lib/company";

export default function Footer() {
  return (
    <footer className="bg-[#101c35] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto_auto] lg:px-10">
        <div>
          <div className="text-sm font-extrabold uppercase tracking-[.15em]">
            Flint <span className="text-[#d5ad55]">LTD</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">
            Extensions, refurbishments and specialist trades delivered by one dependable team.
          </p>
          <p className="mt-4 max-w-sm text-xs leading-5 text-white/40">
            {COMPANY.address.join(", ")}
            <br />
            Co. Reg. No.: {COMPANY.registrationNumber}
          </p>
        </div>

        <div className="text-sm">
          <p className="font-bold text-white">Accounts</p>
          <a href={COMPANY.accounts.phoneHref} className="mt-3 block text-[#d5ad55] hover:text-white">
            {COMPANY.accounts.phone}
          </a>
          <a href={COMPANY.accounts.emailHref} className="mt-2 block break-all text-white/65 hover:text-[#d5ad55]">
            {COMPANY.accounts.email}
          </a>
        </div>

        <div className="flex gap-8 text-sm text-white/65">
          <Link href="/signup" className="hover:text-[#d5ad55]">Get an estimate</Link>
          <Link href="/login" className="hover:text-[#d5ad55]">Client login</Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 py-5 text-xs text-white/35 sm:flex-row sm:justify-between sm:px-8 lg:px-10">
        <span>© {new Date().getFullYear()} Flint LTD</span>
        <span>Professional building services across London.</span>
      </div>
    </footer>
  );
}
