import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVICES } from "@/lib/services";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = SERVICES.find((item) => item.slug === params.slug);
  return {
    title: `${service?.title || "Building"} Services in London`,
    description: `${service?.description || "Professional building services"} by Flint LTD across London.`,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((item) => item.slug === params.slug) || SERVICES[0];

  return (
    <div className="min-h-screen bg-white text-[#18372f]">
      <Navbar />
      <main>
        <section className="bg-[#18372f] px-5 py-20 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d2b776]">Flint LTD services</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{service.title} in London</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{service.description}</p>
            <Link href="/signup" className="mt-8 inline-flex bg-[#d2b776] px-6 py-4 text-sm font-bold text-[#18372f]">Request an estimate</Link>
          </div>
        </section>
        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {["Detailed scope", "Managed trades", "Clean handover"].map((item) => (
              <article key={item} className="border border-[#18372f]/10 p-6">
                <h2 className="font-bold">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Clear communication, agreed milestones and one accountable project lead from first visit to completion.</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
