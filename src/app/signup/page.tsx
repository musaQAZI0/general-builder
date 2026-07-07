"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validation";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong");
        return;
      }

      // Success — send them to login.
      router.push("/login?registered=1");
    } catch {
      setServerError("Unable to reach the server. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-base-900 p-6 shadow-xl sm:p-8">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-gray-400">
            Just three fields — that&apos;s all we need.
          </p>

          {serverError && (
            <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {serverError}
            </div>
          )}

          <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Phone number
              </label>
              <input
                type="tel"
                autoComplete="tel"
                {...register("phone")}
                className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
                placeholder="+44 7123 456789"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Password
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
