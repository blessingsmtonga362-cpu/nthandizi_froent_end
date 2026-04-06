"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StaffLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Role detection logic would happen here via API
    setTimeout(() => router.push("/admin/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-unima-blue border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <GraduationCap className="text-unima-gold w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff Portal</h1>
          <p className="text-slate-500 text-sm mt-2">Authorized Personnel Only</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Administrative Email</label>
              <Input 
                type="email" 
                placeholder="admin@unima.ac.mw"
                className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-600 h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Security Password</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-600 h-12"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-unima-blue hover:bg-unima-blueLight text-white font-bold rounded-xl transition-all border border-slate-700"
            >
              {loading ? "Authenticating..." : "Unlock Access"}
              {!loading && <Lock className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-start gap-3">
            <ShieldAlert className="text-unima-gold w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">
              Access to this system is monitored. Unauthorized access attempts are logged and reported to the ICT Directorate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}