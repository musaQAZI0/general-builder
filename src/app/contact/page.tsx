import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-base-900 p-6 shadow-xl sm:p-8">
          <h1 className="text-2xl font-bold text-white">Request a Quote</h1>
          <p className="mt-1 text-sm text-gray-400">
            Tell us about your project and we&apos;ll get back to you with a
            quote.
          </p>
          <div className="mt-6">
            <QuoteForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
