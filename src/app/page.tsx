import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const services = [
  ["01", "Design & Build", "One accountable team from your first idea through to final handover."],
  ["02", "House Extensions", "Single, double-storey and wrap-around extensions built around your life."],
  ["03", "Full Refurbishments", "Complete transformations coordinated across every specialist trade."],
  ["04", "Electrical Work", "Certified rewiring, lighting, installations and fault finding."],
  ["05", "Plumbing Work", "Bathrooms, kitchens, heating and dependable plumbing installations."],
  ["06", "Painting & Finishing", "Meticulous preparation and a clean, lasting professional finish."],
];

const steps = [
  ["01", "Consultation", "We listen, visit your property and understand what you want to achieve."],
  ["02", "Design & planning", "A clear plan, practical advice and every requirement considered."],
  ["03", "Detailed estimate", "A transparent scope and price before any work begins."],
  ["04", "Build & delivery", "One project lead coordinates the schedule, trades and quality."],
  ["05", "Handover", "A thorough final check, clean handover and dependable aftercare."],
];

const heroImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=88";

const projects = [
  [heroImage, "Richmond", "Rear extension & kitchen"],
  ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=82", "Hampstead", "Full house refurbishment"],
  ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=82", "Clapham", "Contemporary interior"],
];

const reviews = [
  [
    "Flint LTD kept us informed from the first survey to the final handover. The extension was delivered beautifully and the fixed estimate gave us real peace of mind.",
    "Sarah & James",
    "Rear extension - Richmond",
  ],
  [
    "Professional, tidy and genuinely easy to work with. Having one project lead for the electrics, plumbing and finishing made the entire refurbishment feel manageable.",
    "Daniel M.",
    "Full refurbishment - Clapham",
  ],
  [
    "The quality of the finish is excellent. Every question was answered quickly, the site was kept organised and the completed kitchen is better than we imagined.",
    "Priya K.",
    "Kitchen renovation - Ealing",
  ],
];

const reasons = [
  "Fixed price - no surprise extras",
  "Line-by-line scope before you commit",
  "One point of contact throughout",
  "Site kept safe, tidy and respectful",
  "Final quality check and aftercare",
];

const trustItems = [
  ["Insurance", "Public liability cover and careful site controls before work starts."],
  ["Guarantee", "Written workmanship guarantee with a final handover checklist."],
  ["Payments", "Clear staged payments tied to agreed project milestones."],
  ["Coverage", "London-focused team covering Richmond, Clapham, Hampstead, Ealing and nearby areas."],
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#101c35]">
      <Navbar />
      <main>
        <section className="grid min-h-0 overflow-hidden bg-[#101c35] lg:min-h-[680px] lg:grid-cols-[.93fr_1.07fr]">
          <div className="flex items-center bg-[#101c35] px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12 xl:pl-[max(3rem,calc((100vw-1280px)/2+2.5rem))]">
            <div className="max-w-2xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#d5ad55]">London design & build specialists</p>
              <h1 className="text-[2.55rem] font-extrabold leading-[1.03] tracking-[-.05em] sm:text-6xl lg:text-7xl">
                Transforming
                <br />
                <span className="font-editorial text-[1.12em] text-[#d5ad55]">London homes.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white sm:text-lg">Extensions, refurbishments and complete property improvements - delivered beautifully, reliably and completely.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="rcb-gold-btn">Get a free estimate <span>-&gt;</span></Link>
                <a href="tel:+447341171991" className="rcb-outline-btn">Call +44 7341 171991</a>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
                <span className="tracking-[.12em] text-[#d5ad55]">*****</span>
                <div>
                  <p className="text-sm font-bold">4.9 customer rating</p>
                  <p className="text-xs text-white/55">Verified client feedback</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/70">
                <span>Fully insured</span>
                <span>Fixed estimates</span>
                <span>One project lead</span>
              </div>
            </div>
          </div>
          <div className="relative min-h-[340px] overflow-hidden bg-slate-200 sm:min-h-[420px] lg:min-h-full">
            <Image
              src={heroImage}
              alt="Completed London home extension with a bright kitchen and garden view"
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover"
              quality={78}
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#f7f3e9] px-5 py-4 text-[#18372f] shadow-xl sm:bottom-5 sm:left-auto sm:right-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#75551f]">Recently completed</p>
              <p className="mt-1 text-sm font-bold">Rear extension - Richmond</p>
            </div>
          </div>
        </section>

        <section className="border-b border-[#101c35]/10 bg-[#f5f6f8]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:grid-cols-4 sm:px-8 lg:px-10">
            <div className="trust-cell"><b>15+</b><span>Years experience</span></div>
            <div className="trust-cell"><b>250+</b><span>Projects delivered</span></div>
            <div className="trust-cell"><b>4.9 *</b><span>Customer rating</span></div>
            <div className="trust-cell"><b>100%</b><span>Work guaranteed</span></div>
          </div>
        </section>

        <section id="services" className="scroll-mt-28 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="rcb-kicker">Everything under one roof</p>
                <h2 className="rcb-title mt-4">One team. Every trade.<br />Nothing left to chance.</h2>
              </div>
              <div className="max-w-2xl lg:justify-self-end">
                <p className="text-lg leading-8 text-slate-600">Building work should not mean chasing six different contractors. We coordinate every specialist, every delivery and every detail so your project moves forward with confidence.</p>
                <Link href="/signup" className="mt-6 inline-flex items-center gap-3 border-b-2 border-[#c99d3d] pb-1 text-sm font-bold text-[#101c35]">Talk to our team <span>-&gt;</span></Link>
              </div>
            </div>
            <div className="mt-14 grid border-l border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(([n, t, d]) => (
                <div key={n} className="group border-b border-r border-slate-200 p-7 transition hover:bg-[#101c35] sm:p-9">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-[#c99d3d]">{n}</span>
                    <span className="text-xl text-[#c99d3d] transition group-hover:translate-x-1">-&gt;</span>
                  </div>
                  <h3 className="mt-10 text-xl font-bold group-hover:text-white">{t}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500 group-hover:text-white/65">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="bg-[#101c35] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="rcb-kicker">From idea to completion</p>
              <h2 className="rcb-title mt-4 !text-white">One clear process. Every time.</h2>
              <p className="mt-5 text-white/60">You always know what happens next, who is responsible and where your project stands.</p>
            </div>
            <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-5">
              {steps.map(([n, t, d]) => (
                <div key={n} className="bg-[#101c35] px-6 py-8">
                  <span className="text-sm font-bold text-[#d5ad55]">{n}</span>
                  <h3 className="mt-7 font-bold">{t}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-28 bg-[#f5f6f8] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="rcb-kicker">Our work</p>
                <h2 className="rcb-title mt-4">Selected projects.</h2>
              </div>
              <Link href="/signup" className="text-sm font-bold">Start your project -&gt;</Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {projects.map(([img, place, title]) => (
                <article key={place} className="group bg-white">
                  <div className="relative h-72 overflow-hidden bg-slate-200">
                    <Image
                      src={img}
                      alt={`${title} in ${place}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                      quality={70}
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c99d3d]">{place}</p>
                    <h3 className="mt-2 text-lg font-bold">{title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#101c35] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 border-b border-white/15 pb-10 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="rcb-kicker">Client reviews</p>
                <h2 className="rcb-title mt-4 !text-white">Trusted by homeowners<br />across London.</h2>
              </div>
              <div className="md:text-right">
                <div className="text-2xl tracking-[.12em] text-[#d5ad55]">*****</div>
                <p className="mt-2 text-sm font-bold">4.9 average customer rating</p>
                <p className="mt-1 text-xs text-white/70">Based on verified client feedback</p>
              </div>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {reviews.map(([quote, name, project]) => (
                <blockquote key={name} className="flex min-h-[300px] flex-col border border-white/15 bg-white/[.04] p-7 sm:p-8">
                  <div className="text-sm tracking-[.18em] text-[#d5ad55]">*****</div>
                  <p className="mt-7 flex-1 text-base leading-7 text-white/78">&quot;{quote}&quot;</p>
                  <footer className="mt-8 border-t border-white/10 pt-5">
                    <cite className="font-bold not-italic text-white">{name}</cite>
                    <p className="mt-1 text-xs text-white/70">{project}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
            <div>
              <p className="rcb-kicker">Why Flint LTD</p>
              <h2 className="rcb-title mt-4">The things your last builder probably didn&apos;t do.</h2>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {reasons.map((x, i) => (
                <div key={x} className="flex items-center gap-5 py-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d5ad55] text-xs font-bold">{i + 1}</span>
                  <span className="font-bold">{x}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#18372f]/10 bg-[#f5f6f8] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <p className="rcb-kicker">Trust and compliance</p>
                <h2 className="rcb-title mt-4">Built around clarity before work begins.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {trustItems.map(([title, copy]) => (
                  <article key={title} className="border border-[#18372f]/10 bg-white p-6">
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#18372f]/10 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
            <div>
              <p className="rcb-kicker">Client and business support</p>
              <h2 className="rcb-title mt-4">Project requests, accounts and communication in one place.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Client portal", "Track estimate requests and keep your project details together.", "/login", "Open portal"],
                ["Accounts team", "For invoice, payment and company account questions.", "/contact", "Contact accounts"],
              ].map(([title, copy, href, action]) => (
                <Link key={title} href={href} className="border border-[#18372f]/10 bg-[#f7f3e9] p-6 transition hover:border-[#245548] hover:bg-white">
                  <p className="text-lg font-bold">{title}</p>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{copy}</p>
                  <span className="mt-5 inline-flex text-sm font-bold text-[#245548]">{action} -&gt;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#d5ad55] py-16">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#18372f]">Let&apos;s build it properly</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Tell us about your project.</h2>
            </div>
            <Link href="/signup" className="inline-flex min-h-14 items-center justify-center gap-10 bg-[#101c35] px-7 font-bold text-white">Get a free estimate <span>-&gt;</span></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
