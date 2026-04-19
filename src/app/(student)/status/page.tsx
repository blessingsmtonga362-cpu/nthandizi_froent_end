"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Search, 
  FileCheck,
  ShieldCheck,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApplicationStatus() {
  // Mock State: 'submitted' | 'reviewing' | 'approved'
  const currentStatus = "reviewing"; 

  const steps = [
    { label: "Submitted", icon: FileCheck },
    { label: "Reviewing", icon: Search },
    { label: "Outcome", icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* RE-STYLED HERO CARD: Luminous Gradient Look */}
        <div className="relative rounded-[48px] p-10 md:p-20 text-white overflow-hidden shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] mb-12 bg-brand-slate">
          
          {/* 1. Animated Gradient Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,#2563EB_0%,rgba(37,99,235,0)_50%),radial-gradient(circle_at_70%_120%,#1E40AF_0%,rgba(30,64,175,0)_50%)] opacity-40" />
          
          {/* 2. Glass Shine Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Subtle Decorative Icon */}
          <div className="absolute -bottom-10 -right-10 p-10 opacity-10 rotate-12">
            <ShieldCheck size={280} />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Status Icon with White Glow */}
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 0 0px rgba(255,255,255,0)", "0 0 0 20px rgba(255,255,255,0.05)", "0 0 0 0px rgba(255,255,255,0)"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl"
            >
              <Search className="text-brand-blue" size={40} strokeWidth={2.5} />
            </motion.div>

            <span className="text-blue-400 font-black uppercase tracking-[0.5em] text-[10px] mb-4 drop-shadow-sm">
              Current Application State
            </span>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Under Review
            </h1>
            
            <p className="text-blue-100/60 font-medium max-w-md mx-auto leading-relaxed text-sm md:text-base">
              Your profiling application was successfully submitted. <br/> 
              The committee is now assessing your information.
            </p>
          </div>
        </div>

        {/* Simplified Progress Bar (Kept original structure) */}
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex justify-between relative">
            <div className="absolute top-6 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full" />
            
            {steps.map((step, i) => {
              const isPast = (currentStatus === "reviewing" && i === 0) || (currentStatus === "approved");
              const isCurrent = (currentStatus === "reviewing" && i === 1) || (currentStatus === "submitted" && i === 0);
              
              return (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white",
                    isPast ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : 
                    isCurrent ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/30" : 
                    "bg-slate-100 text-slate-300"
                  )}>
                    <step.icon size={20} strokeWidth={isCurrent ? 3 : 2} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isCurrent ? "text-brand-blue" : "text-slate-300"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Clock size={14} className="text-brand-blue" />
            Check back later for updates
          </p>
          
          <Button 
            className="h-14 px-10 rounded-2xl bg-slate-50 hover:bg-slate-100 text-brand-slate font-black uppercase tracking-widest text-xs transition-all border border-slate-100" 
            asChild
          >
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}