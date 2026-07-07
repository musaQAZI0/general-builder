"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@/lib/validation";
import { SERVICES } from "@/lib/services";

interface QuoteFormProps {
  defaultService?: string;
  onSuccess?: () => void;
}

export default function QuoteForm({
  defaultService,
  onSuccess,
}: QuoteFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { service: defaultService ?? "" },
  });

  const onSubmit = async (data: QuoteInput) => {
    setServerError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong");
        return;
      }

      setSuccess(json.message ?? "Your quote request has been received!");
      reset({ name: "", phone: "", message: "", service: defaultService ?? "" });
      onSuccess?.();
    } catch {
      setServerError("Unable to reach the server. Please try again.");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {success}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Your name
        </label>
        <input
          {...register("name")}
          className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
          placeholder="John Smith"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Phone number
        </label>
        <input
          type="tel"
          {...register("phone")}
          className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
          placeholder="+44 7123 456789"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Service
        </label>
        <select
          {...register("service")}
          className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
        >
          <option value="">General enquiry</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Job details
        </label>
        <textarea
          rows={4}
          {...register("message")}
          className="w-full resize-y rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
          placeholder="Tell us about the work you need doing…"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Submit Quote Request"}
      </button>
    </form>
  );
}
