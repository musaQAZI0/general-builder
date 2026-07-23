"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { COMPANY } from "@/lib/company";

const publicLinks = [
  ["Services", "/#services"],
  ["Process", "/#process"],
  ["Projects", "/#projects"],
  ["Accounts", "/contact"],
];

function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span className="relative h-12 w-12 overflow-hidden border border-[#18372f]/10 bg-white">
        <Image
          src="/flint-logo-ai.png"
          alt=""
          fill
          sizes="48px"
          className="object-contain p-1"
          priority
        />
      </span>
      <span>
        <span className="block text-[15px] font-extrabold uppercase tracking-[.12em] text-[#18372f]">Flint LTD</span>
        <span className="hidden text-[11px] font-semibold uppercase tracking-[.16em] text-slate-400 sm:block">
          London construction
        </span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const authed = status === "authenticated";

  return (
    <header className="sticky top-0 z-40 border-b border-[#18372f]/10 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-[#18372f]/10 bg-[#18372f] text-white lg:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-10 text-xs">
          <span className="font-semibold text-white/70">Company Reg. No. {COMPANY.registrationNumber}</span>
          <div className="flex items-center gap-6">
            <a href={COMPANY.accounts.phoneHref} className="font-bold text-[#d2b776]">{COMPANY.accounts.phone}</a>
            <a href={COMPANY.accounts.emailHref} className="text-white/70 hover:text-white">{COMPANY.accounts.email}</a>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Flint LTD home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 text-sm lg:flex">
          {authed ? (
            <>
              <Link href="/dashboard" className="font-semibold text-[#18372f]/70 hover:text-[#a98235]">Client portal</Link>
              <span className="max-w-[190px] truncate text-xs text-slate-500">{session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border border-[#18372f]/15 px-5 py-2.5 text-sm font-bold text-[#18372f] hover:bg-[#18372f] hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {publicLinks.map(([label, href]) => (
                <Link key={label} href={href} className="font-semibold text-[#18372f]/70 hover:text-[#a98235]">
                  {label}
                </Link>
              ))}
              <Link href="/login" className="font-semibold text-[#18372f]">Client login</Link>
              <Link href="/signup" className="bg-[#18372f] px-5 py-3 font-bold text-white transition hover:bg-[#245548]">
                Request estimate
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center border border-[#18372f]/15 text-[#18372f] lg:hidden"
        >
          <span className="text-xl">{open ? "x" : "="}</span>
        </button>
      </nav>

      <div data-testid="mobile-menu" className={`overflow-hidden border-[#18372f]/10 bg-white transition-all lg:hidden ${open ? "max-h-[430px] border-t" : "max-h-0"}`}>
        <div className="flex flex-col gap-1 px-5 py-5 text-sm">
          {authed ? (
            <>
              <Link onClick={() => setOpen(false)} href="/dashboard" className="py-3 font-bold">Client portal</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-2 bg-[#18372f] px-5 py-3 text-left font-bold text-white">Log out</button>
            </>
          ) : (
            <>
              {publicLinks.map(([label, href]) => (
                <Link key={label} onClick={() => setOpen(false)} href={href} className="py-3 font-semibold">
                  {label}
                </Link>
              ))}
              <a href={COMPANY.accounts.phoneHref} className="py-3 font-semibold text-[#1689c8]">{COMPANY.accounts.phone}</a>
              <Link onClick={() => setOpen(false)} href="/login" className="py-3 font-semibold">Client login</Link>
              <Link onClick={() => setOpen(false)} href="/signup" className="mt-2 bg-[#18372f] px-5 py-3 text-center font-bold text-white">
                Request estimate
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
