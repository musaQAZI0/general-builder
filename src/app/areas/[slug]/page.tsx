import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  };
}

export default function AreaPage({ params }: { params: { slug: string } }) {
  const area = areas.find((item) => item.slug === params.slug) || areas[0];

  return (
    <div className="min-h-screen bg-white text-[#18372f]">
      <Navbar />
      <main>
        <section className="bg-[#f6f4ef] px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a98235]">Local building team</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Builders in {area.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Flint LTD delivers extensions, refurbishments, electrical work, plumbing and finishing across {area.name} and nearby London areas.</p>
            <Link href="/signup" className="mt-8 inline-flex bg-[#18372f] px-6 py-4 text-sm font-bold text-white">Start a local request</Link>
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
      </main>
      <Footer />
    </div>
  );
}
