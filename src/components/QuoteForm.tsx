"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@/lib/validation";
import { SERVICES } from "@/lib/services";

interface QuoteFormProps {
  defaultService?: string;
  onSuccess?: () => void;
}

const fieldClass = "min-h-12 w-full border border-[#18372f]/20 bg-white px-4 py-3 text-[#18372f] focus:border-[#245548] focus:outline-none focus:ring-2 focus:ring-[#245548]/20";
const labelClass = "mb-2 block text-sm font-bold text-[#18372f]";
const errorClass = "mt-1 text-sm text-red-700";

export default function QuoteForm({ defaultService, onSuccess }: QuoteFormProps) {
  const { status } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { service: defaultService ?? "" },
  });

  const onSubmit = async (data: QuoteInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "We could not send your request. Please try again.");
        return;
      }
      setSuccess(true);
      onSuccess?.();
    } catch {
      setServerError("Unable to reach the server. Please try again.");
    }
  };

  if (success) {
    return (
      <div role="status" className="border border-[#245548]/20 bg-[#edf4ee] p-6 text-[#18372f]">
        <h2 className="text-xl font-bold">Request received</h2>
        <p className="mt-2 text-sm leading-6">Thank you. We will review your project details and contact you about the next step.</p>
        {status !== "authenticated" && (
          <p className="mt-4 text-sm leading-6">For future requests, you can <Link href="/signup" className="font-bold underline underline-offset-4">create an account</Link> to view their progress. This guest request will be handled by our team directly.</p>
        )}
        <Link href={status === "authenticated" ? "/dashboard" : "/"} className="mt-5 inline-block text-sm font-bold underline underline-offset-4">
          {status === "authenticated" ? "View your dashboard" : "Back to home"}
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[#18372f]">
      <p className="text-sm leading-6 text-slate-600">Tell us the essentials. You can add more detail if you have it.</p>
      {serverError && <div role="alert" className="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{serverError}</div>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className={labelClass}>Your name <span aria-hidden="true">*</span></label>
          <input id="quote-name" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} className={fieldClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="quote-phone" className={labelClass}>Phone number <span aria-hidden="true">*</span></label>
          <input id="quote-phone" type="tel" autoComplete="tel" {...register("phone")} aria-invalid={!!errors.phone} className={fieldClass} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="quote-email" className={labelClass}>Email address <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="quote-email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} className={fieldClass} />
        <p className="mt-1 text-xs text-slate-500">Add an email if you would like a confirmation copy.</p>
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-postcode" className={labelClass}>Project postcode <span aria-hidden="true">*</span></label>
          <input id="quote-postcode" autoComplete="postal-code" {...register("postcode")} aria-invalid={!!errors.postcode} className={fieldClass} />
          {errors.postcode && <p className={errorClass}>{errors.postcode.message}</p>}
        </div>
        <div>
          <label htmlFor="quote-service" className={labelClass}>Type of work <span className="font-normal text-slate-500">(optional)</span></label>
          <select id="quote-service" {...register("service")} className={fieldClass}>
            <option value="">Not sure yet</option>
            {SERVICES.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="quote-message" className={labelClass}>What would you like done? <span aria-hidden="true">*</span></label>
        <textarea id="quote-message" rows={5} {...register("message")} aria-invalid={!!errors.message} className={fieldClass} placeholder="A short description of the work and anything we should know" />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <details className="border-y border-[#18372f]/10 py-4">
        <summary className="cursor-pointer text-sm font-bold text-[#245548]">Add more project details (optional)</summary>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="quote-property" className={labelClass}>Property type</label>
            <select id="quote-property" {...register("propertyType")} className={fieldClass}>
              <option value="">Choose one</option>
              <option>Terraced house</option><option>Semi-detached house</option><option>Detached house</option><option>Flat or apartment</option><option>Commercial property</option>
            </select>
          </div>
          <div>
            <label htmlFor="quote-timeline" className={labelClass}>Timeline</label>
            <select id="quote-timeline" {...register("timeline")} className={fieldClass}>
              <option value="">Choose one</option>
              <option>As soon as possible</option><option>Within 1-3 months</option><option>Within 3-6 months</option><option>Planning ahead</option>
            </select>
          </div>
          <div>
            <label htmlFor="quote-budget" className={labelClass}>Budget range</label>
            <select id="quote-budget" {...register("budget")} className={fieldClass}>
              <option value="">Choose one</option>
              <option>Under GBP 10k</option><option>GBP 10k-25k</option><option>GBP 25k-50k</option><option>GBP 50k-100k</option><option>GBP 100k+</option>
            </select>
          </div>
          <div>
            <label htmlFor="quote-contact" className={labelClass}>Preferred contact</label>
            <select id="quote-contact" {...register("preferredContact")} className={fieldClass}>
              <option value="">Choose one</option>
              <option>Phone call</option><option>WhatsApp</option><option>Email</option>
            </select>
          </div>
        </div>
      </details>

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <button type="submit" disabled={isSubmitting} className="min-h-12 w-full bg-[#245548] px-5 py-3 font-bold text-white hover:bg-[#18372f] disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? "Sending request..." : "Submit Quote Request"}
      </button>
      <p className="text-center text-xs leading-5 text-slate-500">No account needed. We will use your details only to respond to this enquiry.</p>
    </form>
  );
}
