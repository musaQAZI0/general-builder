"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validation";
import Navbar from "@/components/Navbar";

export default function SignupPage(){
  const router=useRouter(); const [serverError,setServerError]=useState<string|null>(null); const [showPassword,setShowPassword]=useState(false);
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<SignupInput>({resolver:zodResolver(signupSchema)});
  const onSubmit=async(data:SignupInput)=>{setServerError(null);try{const res=await fetch("/api/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const json=await res.json();if(!res.ok){setServerError(json.error??"Something went wrong");return}router.push("/login?registered=1")}catch{setServerError("Unable to reach the server. Please try again.")}};
  return <div className="min-h-screen bg-[#f7f3e9]"><Navbar/><main className="grid min-h-[calc(100vh-78px)] lg:grid-cols-[.9fr_1.1fr]">
    <section className="flex items-center px-5 py-12 sm:px-10 lg:px-14 xl:pl-[max(3.5rem,calc((100vw-1280px)/2+2.5rem))]"><div className="mx-auto w-full max-w-lg lg:mx-0">
      <Link href="/" className="text-xs font-bold uppercase tracking-[.18em] text-[#a98235]">← Back to home</Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-[#a98235]">Start your project</p><h1 className="mt-3 text-4xl font-bold tracking-[-.035em] text-[#18372f] sm:text-5xl">Create your account.</h1><p className="mt-4 text-sm leading-6 text-slate-600">Three quick details and you&apos;re ready to request estimates and manage your project.</p>
      {serverError&&<div role="alert" className="mt-6 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">{serverError}</div>}
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div><label htmlFor="signup-email" className="mb-2 block text-sm font-bold">Email address</label><input id="signup-email" type="email" autoComplete="email" {...register("email")} className="min-h-[52px] w-full"/>{errors.email&&<p className="mt-1.5 text-xs font-medium text-red-600">{errors.email.message}</p>}</div>
        <div><label htmlFor="signup-phone" className="mb-2 block text-sm font-bold">Phone number</label><input id="signup-phone" type="tel" autoComplete="tel" inputMode="tel" {...register("phone")} className="min-h-[52px] w-full"/>{errors.phone&&<p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone.message}</p>}</div>
        <div><div className="mb-2 flex items-center justify-between"><label htmlFor="signup-password" className="block text-sm font-bold">Password</label><span className="text-xs text-slate-500">Minimum 6 characters</span></div><div className="relative"><input id="signup-password" type={showPassword?"text":"password"} autoComplete="new-password" {...register("password")} className="min-h-[52px] w-full !pr-16"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute inset-y-0 right-0 px-4 text-xs font-bold text-[#245548]">{showPassword?"Hide":"Show"}</button></div>{errors.password&&<p className="mt-1.5 text-xs font-medium text-red-600">{errors.password.message}</p>}</div>
        <button type="submit" disabled={isSubmitting} className="w-full disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting?"Creating account…":"Sign Up"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-bold text-[#245548] hover:underline">Login</Link></p>
      <p className="mt-7 border-t border-[#18372f]/10 pt-5 text-center text-xs leading-5 text-slate-500">By signing up, you agree to be contacted about your project. Your details stay private.</p>
    </div></section>
    <aside className="relative hidden overflow-hidden bg-[#18372f] lg:block"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=88')] bg-cover bg-center"/><div className="absolute inset-x-10 bottom-10 bg-[#18372f] p-8 text-white xl:inset-x-14 xl:bottom-14"><div className="text-[#d2b776]">★★★★★</div><blockquote className="mt-4 text-xl font-semibold leading-8">“Clear communication, a detailed estimate and a beautiful finish from one dependable team.”</blockquote><p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-white/60">Homeowner · Richmond</p></div></aside>
  </main></div>
}
