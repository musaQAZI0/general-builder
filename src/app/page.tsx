import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVICES } from "@/lib/services";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-base-900 via-base-950 to-black" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 lg:py-32">
            <span className="inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-medium text-brand-500 sm:text-sm">
              Trusted General Builders
            </span>
            <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Building your vision,{" "}
              <span className="text-brand-500">brick by brick</span>.
            </h1>
            <p className="mt-4 max-w-xl text-base text-gray-300 sm:mt-6 sm:text-lg">
              From new extensions to full refurbishments, electrical, plumbing
              and painting — one reliable team for every job around your home.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link
                href="/signup"
                className="w-full rounded-lg bg-brand-600 px-6 py-3 text-center text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 sm:w-auto"
              >
                Sign Up to Get Started
              </Link>
              <Link
                href="/login"
                className="w-full rounded-lg border border-white/20 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Services teaser (names only) */}
        <section className="border-t border-white/10 bg-base-950">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
              What we do
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-400 sm:text-base">
              A full range of building and trade services under one roof.{" "}
              <span className="text-brand-500">
                Sign up to see full details.
              </span>
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {SERVICES.map((s) => (
                <div
                  key={s.slug}
                  className="flex flex-col items-center rounded-xl border border-white/10 bg-base-900 p-4 text-center sm:p-6"
                >
                  <span className="text-2xl sm:text-3xl">{s.icon}</span>
                  <span className="mt-3 text-xs font-semibold text-white sm:text-sm">
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center sm:mt-12">
              <Link
                href="/signup"
                className="inline-block w-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
              >
                Create a free account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
