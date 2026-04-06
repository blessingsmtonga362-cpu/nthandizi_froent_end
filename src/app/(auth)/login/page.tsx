"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate high-end authentication delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col justify-center py-12 px-6 selection:bg-brand-blue/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[440px] w-full mx-auto"
      >
        {/* Branding Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center mb-8 hover:scale-105 transition-transform">
            <img src="/mthandizi.png" alt="Mthandizi Logo" className="h-12 w-auto" />
          </Link>
          <h2 className="text-3xl font-black text-brand-slate tracking-tight">Student Portal</h2>
          <p className="text-slate-500 font-medium mt-2">Sign in to manage your profiling application.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 block">
                Email
              </label>
              <Input 
                type="email" 
                placeholder="e.g. name-id-year@unima.ac.mw"
                required
                className="h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider ml-1 block">
                  Password
                </label>
                <Link href="#" className="text-[10px] text-brand-blue font-black uppercase tracking-widest hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button 
              disabled={isLoading}
              className="w-full h-16 bg-brand-blue hover:bg-brand-blueDark text-white font-black rounded-[20px] shadow-xl shadow-brand-blue/20 text-md transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={18} strokeWidth={3} />
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">or</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Registration Redirect */}
            <Button 
              variant="outline" 
              className="w-full h-16 border-2 border-slate-100 rounded-[20px] text-brand-slate font-black hover:bg-slate-50 hover:border-slate-200 transition-all text-md" 
              asChild
            >
              <Link href="/register">Create Student Account</Link>
            </Button>
          </form>
        </div>

        
      </motion.div>
    </div>
  );
}