"use client";

import { Clock, CheckCircle2, ChevronRight, Save, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const completedSteps = 2;
  const totalSteps = 6;
  const lastSaved = "2 minutes ago";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-slate tracking-tight">
            Moni, <span className="text-brand-blue">Dumisani</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Ready to complete your profiling process?</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-4 border-brand-surface bg-slate-200" />
          ))}
          <div className="w-10 h-10 rounded-full border-4 border-brand-surface bg-brand-blue flex items-center justify-center text-[10px] font-bold text-white">
            +12
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Application Main Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-brand-slate mb-2">Profile Completion</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Save size={14} className="text-emerald-500" />
                  Last synced {lastSaved}
                </div>
              </div>
              <div className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Active Draft
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-5xl font-black text-brand-slate">
                  {Math.round((completedSteps / totalSteps) * 100)}<span className="text-2xl text-slate-300">%</span>
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {completedSteps} of {totalSteps} Sections Done
                </span>
              </div>
              
              <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden flex gap-1.5 p-1">
                {[...Array(totalSteps)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className={cn(
                      "h-full rounded-full flex-1 transition-colors duration-1000",
                      i < completedSteps ? "bg-brand-blue shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-slate-200"
                    )}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {["Personal", "Family", "Living", "Academic", "Documents", "Review"].map((name, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                    i < completedSteps ? "bg-emerald-50/50 border-emerald-100" : 
                    i === completedSteps ? "bg-brand-blue/5 border-brand-blue/20" : "bg-white border-slate-100 opacity-50"
                  )}>
                    {i < completedSteps ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        i === completedSteps ? "bg-brand-blue animate-ping" : "bg-slate-300"
                      )} />
                    )}
                    <span className={cn(
                      "text-xs font-black uppercase tracking-tight",
                      i === completedSteps ? "text-brand-blue" : "text-brand-slate"
                    )}>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full mt-12 h-16 bg-brand-blue hover:bg-brand-blueDark text-white rounded-2xl text-lg font-black shadow-xl shadow-brand-blue/20 group transition-all hover:scale-[1.02]" asChild>
              <Link href="/apply">
                Continue Application
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Announcement Strip */}
          <div className="bg-brand-slate text-white rounded-[2rem] p-8 flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles size={80} />
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Bell size={24} className="text-brand-blue" />
              </div>
              <div>
                <p className="font-black text-xl tracking-tight">System Update</p>
                <p className="text-sm text-slate-400 font-medium mt-1">The Mthandizi pilot has been extended for UNIMA students.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h4 className="font-black text-brand-slate text-lg mb-8 flex items-center gap-3">
              <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                <Clock size={20} />
              </div>
              Timeline
            </h4>
            <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
              {[
                { title: "Account Created", date: "Mar 10, 2024", done: true },
                { title: "Application Started", date: "Mar 12, 2024", done: true },
                { title: "Review Phase", date: "Awaiting Submission", done: false },
                { title: "Final Outcome", date: "Pending", done: false },
              ].map((item, i) => (
                <div key={i} className="relative pl-10 group">
                  <div className={cn(
                    "absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white z-10 flex items-center justify-center transition-all",
                    item.done ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/30" : "bg-slate-100 text-slate-300"
                  )}>
                    {item.done && <CheckCircle2 size={14} />}
                  </div>
                  <p className={cn("text-xs font-black uppercase tracking-widest", item.done ? "text-brand-blue" : "text-slate-300")}>
                    {item.title}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}