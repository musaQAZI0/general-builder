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
  const params = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const requested = params.get("callbackUrl");
    const callbackUrl = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl,
    });

    if (!res || res.error) {
      setServerError("Invalid credentials");
      return;
    }

    window.location.assign(res.url || callbackUrl);
  };

  return (
    <div className="mx-auto w-full max-w-lg lg:mx-0">
      <Link href="/" className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">
        &lt;- Back to home
      </Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-[#a98235]">Client portal</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.035em] text-[#18372f] sm:text-5xl">Welcome back.</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">Sign in to view services and request an estimate for your next project.</p>

      {params.get("registered") === "1" && (
        <div className="mt-6 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Account created! Please log in.</div>
      )}
      {params.get("reset") === "1" && (
        <div className="mt-6 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Password reset successfully. Please log in with your new password.</div>
      )}
      {serverError && (
        <div role="alert" className="mt-6 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">{serverError}</div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-bold">Email address</label>
          <input id="login-email" type="email" autoComplete="email" {...register("email")} className="min-h-[52px] w-full" />
          {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="login-password" className="block text-sm font-bold">Password</label>
            <Link href="/forgot-password" className="text-xs font-bold text-[#245548] hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} className="min-h-[52px] w-full !pr-16" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 px-4 text-xs font-bold text-[#245548]">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">New to Flint LTD? <Link href="/signup" className="font-bold text-[#245548] hover:underline">Create an account</Link></p>
      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#18372f]/10 pt-6 text-center text-[10px] font-bold uppercase tracking-[.08em] text-slate-500">
        <span>Secure login</span>
        <span>Private details</span>
        <span>Fast estimates</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f3e9]">
      <Navbar />
      <main className="grid min-h-[calc(100vh-78px)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="flex items-center px-5 py-12 sm:px-10 lg:px-14 xl:pl-[max(3.5rem,calc((100vw-1280px)/2+2.5rem))]">
          <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </section>
        <aside className="relative hidden overflow-hidden bg-[#18372f] lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=88')] bg-cover bg-center" />
          <div className="absolute inset-x-10 bottom-10 bg-[#18372f] p-8 text-white xl:inset-x-14 xl:bottom-14">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d2b776]">One team. Every trade.</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">Your project,<br />managed properly.</h2>
            <div className="mt-6 flex gap-6 text-xs text-white/65"><span>Fixed estimates</span><span>Fully insured</span></div>
          </div>
        </aside>
      </main>
    </div>
  );
}
