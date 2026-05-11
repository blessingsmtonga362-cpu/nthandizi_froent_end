"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, ChevronRight, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { getApplicationStatus, getStoredUser, type ApplicationStatus } from "@/lib/api";

const STEP_LABELS = ["Personal", "Family", "Education", "Review"];

export default function StudentDashboard() {
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    getApplicationStatus()
      .then(setStatus)
      .catch(() => {
        setStatus({ status: "draft", completedSteps: 0, totalSteps: STEP_LABELS.length, lastSaved: null, submittedAt: null });
      })
      .finally(() => setLoading(false));
  }, []);

  const completedSteps = status?.completedSteps ?? 0;
  const totalSteps = status?.totalSteps ?? STEP_LABELS.length;
  const firstName = user?.firstName ?? "Student";
  const progressPct = loading ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-black text-brand-slate tracking-tight">
          Moni, <span className="text-brand-blue">{firstName}</span>
        </h1>
        <p className="text-slate-400 font-medium mt-1 text-sm">Ready to complete your profiling process?</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Application tracker ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            {/* Card header */}
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-brand-slate">Profile Completion</h3>
              <span className={cn(
                "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                status?.status === "submitted"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-blue-50 text-brand-blue border-blue-200"
              )}>
                {loading ? "—" : status?.status === "submitted" ? "Submitted" : "Active Draft"}
              </span>
            </div>

            {/* Progress percentage + label */}
            <div className="flex justify-between items-end mb-3">
              <span className="text-4xl font-black text-brand-slate">
                {loading ? "—" : progressPct}
                <span className="text-xl text-slate-300 font-bold">%</span>
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {loading ? "" : `${completedSteps} of ${totalSteps} sections`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-brand-blue rounded-full"
              />
            </div>

            {/* Step chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {STEP_LABELS.map((name, i) => {
                const done = i < completedSteps;
                const current = i === completedSteps;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-colors",
                      done    ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                      current ? "bg-blue-50 border-blue-200 text-brand-blue" :
                                "bg-slate-50 border-slate-200 text-slate-400"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 size={14} className="shrink-0" />
                    ) : (
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        current ? "bg-brand-blue" : "bg-slate-300"
                      )} />
                    )}
                    {name}
                  </div>
                );
              })}
            </div>

            <Button
              className="w-full h-12 bg-brand-blue hover:bg-brand-blueDark text-white rounded-xl font-bold text-sm transition-colors"
              asChild
            >
              <Link href="/apply">
                Continue Application
                <ChevronRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>

          {/* Announcement strip */}
          <div className="bg-brand-slate text-white rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5">
              <Sparkles size={64} />
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <Bell size={20} className="text-brand-blue" />
            </div>
            <div>
              <p className="font-bold text-base">System Update</p>
              <p className="text-sm text-slate-400 mt-0.5">The Mthandizi pilot has been extended for UNIMA students.</p>
            </div>
          </div>
        </div>

        {/* ── Timeline sidebar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h4 className="font-bold text-brand-slate text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock size={16} className="text-brand-blue" />
            Timeline
          </h4>
          <div className="space-y-6 relative before:absolute before:left-[13px] before:top-1 before:bottom-1 before:w-px before:bg-slate-100">
            {[
              { title: "Account Created",    done: true },
              { title: "Application Started", done: completedSteps > 0 },
              { title: "Under Review",        done: status?.status === "reviewing" || status?.status === "approved" },
              { title: "Final Outcome",       done: status?.status === "approved" },
            ].map((item, i) => (
              <div key={i} className="relative pl-9">
                <div className={cn(
                  "absolute left-0 top-0.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center z-10 transition-colors",
                  item.done ? "bg-brand-blue" : "bg-slate-100"
                )}>
                  {item.done
                    ? <CheckCircle2 size={13} className="text-white" />
                    : <div className="w-2 h-2 rounded-full bg-slate-300" />
                  }
                </div>
                <p className={cn(
                  "text-xs font-bold uppercase tracking-wide leading-none",
                  item.done ? "text-brand-slate" : "text-slate-300"
                )}>
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  {item.done ? "Completed" : "Pending"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
