import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVICES } from "@/lib/services";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = SERVICES.find((item) => item.slug === params.slug);
  return {
    title: `${service?.title || "Building"} Services in London`,
    description: `${service?.description || "Professional building services"} by Flint LTD across London.`,
    alternates: { canonical: `/services/${params.slug}` },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((item) => item.slug === params.slug);
  if (!service) notFound();

  return (
    <div className="min-h-screen bg-white text-[#18372f]">
      <Navbar />
      <main>
        <section className="bg-[#18372f] px-5 py-20 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d2b776]">Flint LTD services</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{service.title} in London</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{service.description}</p>
            <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="mt-8 inline-flex bg-[#d2b776] px-6 py-4 text-sm font-bold text-[#18372f]">Get a quote</Link>
          </div>
        </section>
        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold">Planning your {service.title.toLowerCase()} project</h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">Tell us about your property and what you want to change. We can then discuss the scope, timing and next steps for your project in London.</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {service.scope.map((item) => <li key={item} className="border border-[#18372f]/10 p-6 leading-7 text-slate-700">{item}</li>)}
            </ul>
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
