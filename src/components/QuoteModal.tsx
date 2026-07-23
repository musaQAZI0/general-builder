"use client";

import QuoteForm from "./QuoteForm";

interface QuoteModalProps {
  service: string;
  onClose: () => void;
}

export default function QuoteModal({ service, onClose }: QuoteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        data-testid="quote-modal"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-base-900 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Request a Quote</h2>
            {service && <p className="mt-1 text-sm text-brand-500">{service}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            x
          </button>
        </div>

        <QuoteForm defaultService={service} />
      </div>
    </div>
  );
}
