"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation";
import Navbar from "@/components/Navbar";

function LoginForm() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const justReset = searchParams.get("reset") === "1";

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!res || res.error) {
      setServerError("Invalid credentials");
      return;
    }

    // Hard navigation guarantees the just-set session cookie is sent with the
    // /dashboard request, so middleware always sees the session (a client-side
    // router.push can race the cookie and briefly bounce back to /login).
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-base-900 p-6 shadow-xl sm:p-8">
      <h1 className="text-2xl font-bold text-white">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-400">
        Login to access your services dashboard.
      </p>

      {justRegistered && (
        <div className="mt-4 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          Account created! Please log in.
        </div>
      )}

      {justReset && (
        <div className="mt-4 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          Password reset successfully. Please log in with your new password.
        </div>
      )}

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
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2.5 text-white outline-none focus:border-brand-500"
            placeholder="Your password"
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
          {isSubmitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-gray-400">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
