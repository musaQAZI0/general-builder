"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import QuoteModal from "@/components/QuoteModal";
import { SERVICES } from "@/lib/services";

export default function DashboardPage() {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Our Services
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400 sm:text-base">
              Choose a service below and request a free, no-obligation quote.
              Our team will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
                onRequestQuote={(title) => setActiveService(title)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {activeService !== null && (
        <QuoteModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </div>
  );
}
