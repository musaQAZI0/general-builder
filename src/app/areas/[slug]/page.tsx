import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

const areas = [
  { slug: "richmond", name: "Richmond" },
  { slug: "clapham", name: "Clapham" },
  { slug: "hampstead", name: "Hampstead" },
  { slug: "ealing", name: "Ealing" },
];

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = areas.find((item) => item.slug === params.slug);
  return {
    title: `Builders in ${area?.name || "London"}`,
    description: `Extensions, refurbishments, plumbing, electrical and decorating services in ${area?.name || "London"} by Flint LTD.`,
    alternates: { canonical: `/areas/${params.slug}` },
  };
}

export default function AreaPage({ params }: { params: { slug: string } }) {
  const area = areas.find((item) => item.slug === params.slug);
  if (!area) notFound();

  return (
    <div className="min-h-screen bg-white text-[#18372f]">
      <Navbar />
      <main>
        <section className="bg-[#f6f4ef] px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a98235]">Local building team</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Builders in {area.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Flint LTD delivers extensions, refurbishments, electrical work, plumbing and finishing across {area.name} and nearby London areas.</p>
            <Link href="/contact" className="mt-8 inline-flex bg-[#18372f] px-6 py-4 text-sm font-bold text-white">Start a local request</Link>
          </div>
        </section>
        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {["Site visit", "Written estimate", "Managed delivery"].map((item) => (
              <article key={item} className="border border-[#18372f]/10 p-6">
                <h2 className="font-bold">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">A practical local process for homeowners who want clear pricing, tidy work and reliable communication.</p>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-[#f6f4ef] px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold">Explore building services in {area.name}</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">Find out how we approach the work you are planning, then tell us about your property and the scope you have in mind.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
              <Link href="/services/new-extensions" className="border border-[#18372f]/20 bg-white px-4 py-3">Extensions</Link>
              <Link href="/services/refurbishment" className="border border-[#18372f]/20 bg-white px-4 py-3">Refurbishment</Link>
              <Link href="/services/electrical-work" className="border border-[#18372f]/20 bg-white px-4 py-3">Electrical</Link>
              <Link href="/services/plumbing-work" className="border border-[#18372f]/20 bg-white px-4 py-3">Plumbing</Link>
              <Link href="/services/painting" className="border border-[#18372f]/20 bg-white px-4 py-3">Painting</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
