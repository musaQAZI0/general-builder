"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const authed = status === "authenticated";
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-base-900/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Brand — shrinks/truncates so it never gets cut off */}
        <Link
          href="/"
          onClick={close}
          className="flex min-w-0 items-center gap-2 text-base font-bold sm:text-lg"
        >
          <span className="text-brand-500">🏗️</span>
          <span className="truncate">
            General<span className="text-brand-500">Builder</span>
          </span>
        </Link>

        {/* Desktop nav (md and up) */}
        <div className="hidden items-center gap-3 text-sm md:flex">
          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-300 transition hover:text-white"
              >
                Dashboard
              </Link>
              <span className="max-w-[180px] truncate text-gray-500">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border border-white/15 px-4 py-2 font-medium text-gray-200 transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 font-medium text-gray-200 transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button (below md) — 44x44 touch target */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-md text-gray-200 transition hover:bg-white/10 md:hidden"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu panel — smoothly expands/collapses via max-height */}
      <div
        data-testid="mobile-menu"
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? "max-h-72 border-t border-white/10" : "max-h-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {authed ? (
            <>
              <span className="truncate px-2 py-1 text-xs text-gray-500">
                {session.user?.email}
              </span>
              <Link
                href="/dashboard"
                onClick={close}
                className="flex min-h-[44px] items-center rounded-md px-2 font-medium text-gray-200 transition hover:bg-white/10"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  close();
                  signOut({ callbackUrl: "/" });
                }}
                className="flex min-h-[44px] items-center rounded-md border border-white/15 px-2 text-left font-medium text-gray-200 transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={close}
                className="flex min-h-[44px] items-center rounded-md px-2 font-medium text-gray-200 transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="flex min-h-[44px] items-center justify-center rounded-md bg-brand-600 px-2 font-semibold text-white transition hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
