"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation";
import Navbar from "@/components/Navbar";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong");
        return;
      }
      setMessage(json.message);
      // Redirect to login after a short pause.
      setTimeout(() => router.push("/login?reset=1"), 1500);
    } catch {
      setServerError("Unable to reach the server. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-base-900 p-6 text-center shadow-xl sm:p-8">
        <h1 className="text-2xl font-bold text-white">Invalid link</h1>
        <p className="mt-2 text-sm text-gray-400">
          This reset link is missing its token. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-base-900 p-6 shadow-xl sm:p-8">
      <h1 className="text-2xl font-bold text-white">Set a new password</h1>
      <p className="mt-1 text-sm text-gray-400">
        Choose a new password for your account.
      </p>

      {message && (
        <div className="mt-4 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {message} Redirecting to login…
        </div>
      )}
      {serverError && (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <input type="hidden" {...register("token")} />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            New password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
            placeholder="At least 6 characters"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Confirm new password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !!message}
          className="w-full rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-gray-400">Loading…</div>}>
          <ResetForm />
        </Suspense>
      </main>
    </div>
  );
}
