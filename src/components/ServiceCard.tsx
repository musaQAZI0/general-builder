import { Service } from "@/lib/services";

interface ServiceCardProps {
  service: Service;
  onRequestQuote: (serviceTitle: string) => void;
}

export default function ServiceCard({
  service,
  onRequestQuote,
}: ServiceCardProps) {
  return (
    <div
      data-testid="service-card"
      className="flex flex-col rounded-xl border border-white/10 bg-base-900 p-6 transition hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5"
    >
      <div className="mb-4 text-3xl">{service.icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-white">{service.title}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400">
        {service.description}
      </p>
      <button
        onClick={() => onRequestQuote(service.title)}
        className="mt-auto min-h-[44px] w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Request a Quote
      </button>
    </div>
  );
}
