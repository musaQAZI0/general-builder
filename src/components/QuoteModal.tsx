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
        className="max-h-[90vh] w-full max-w-md overflow-y-auto border border-[#18372f]/10 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#18372f]">Request a Quote</h2>
            {service && <p className="mt-1 text-sm text-[#245548]">{service}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 transition hover:bg-[#f6f4ef] hover:text-[#18372f]"
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
