"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function StaffLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/admin/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-brand-slate flex flex-col items-center justify-center p-6 selection:bg-brand-blue/30 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-brand-blueDark/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-center" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[440px] w-full relative z-10"
      >
        {/* Branding Header - Container Removed */}
        <div className="text-center mb-10">
          <motion.img 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            src="/mthandizi.png" 
            alt="Mthandizi Logo" 
            className="h-12 w-auto brightness-0 invert mx-auto mb-8" 
          />
          
          <h1 className="text-3xl font-black text-white tracking-tight">Staff Portal</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-3">
            Authorized Personnel Only
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <form className="space-y-7" onSubmit={handleLogin}>
            
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 block">
                Email
              </label>
              <Input 
                type="email" 
                placeholder="email" 
                required
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-brand-blue/40 transition-all border-none shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 block">
                Password
              </label>
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-brand-blue/40 transition-all border-none shadow-inner"
                />
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-brand-blue hover:bg-brand-blueDark text-white font-black rounded-2xl shadow-xl shadow-brand-blue/20 text-md transition-all active:scale-[0.98] group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Unlock Access 
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}