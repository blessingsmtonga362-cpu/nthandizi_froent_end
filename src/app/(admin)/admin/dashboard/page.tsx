"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle, AlertCircle, TrendingUp, ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAdminDashboardStats, type DashboardStats } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats()
      .then(setStats)
      .catch(() => {
        // Fallback so the page still renders if backend is unreachable
        setStats({ totalApplications: 0, approvedSupport: 0, flaggedFiles: 0, priorityQueue: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  const tiles = [
    { label: "Total Applications", value: stats?.totalApplications ?? "—", icon: Users,         color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: "Approved Support",   value: stats?.approvedSupport   ?? "—", icon: CheckCircle,   color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Flagged Files",      value: stats?.flaggedFiles      ?? "—", icon: AlertCircle,   color: "text-red-600",     bg: "bg-red-50"     },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-slate tracking-tight">Analytics Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time surveillance of student support distribution</p>
        </div>
        <div className="flex gap-3">
          <button className="h-11 px-6 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Export Data
          </button>
          <button className="h-11 px-6 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-blueDark transition-all shadow-lg shadow-brand-blue/20">
            System Report
          </button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10 mb-6">
              <div className={cn("p-3.5 rounded-2xl", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                +4.2% <TrendingUp size={12} />
              </span>
            </div>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
            <h3 className="text-4xl font-black text-brand-slate mt-2 relative z-10">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                stat.value.toLocaleString()
              )}
            </h3>
            
            {/* Subtle background decoration */}
            <div className="absolute -bottom-4 -right-4 opacity-[0.02] rotate-12">
              <stat.icon size={120} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Review queue */}
      <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-brand-slate uppercase tracking-widest text-xs">Priority Ranking Queue</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-blue/5 rounded-full border border-brand-blue/10">
            <ShieldCheck size={12} className="text-brand-blue" />
            <span className="text-[9px] font-black uppercase text-brand-blue tracking-tighter">Internal Metric Access</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-10 py-5">Rank</th>
                <th className="px-6 py-5">Student Identity</th>
                <th className="px-6 py-5">Academic Info</th>
                <th className="px-6 py-5 text-center">Need Index</th>
                <th className="px-10 py-5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-10 py-6">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              ) : stats?.priorityQueue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-12 text-center text-slate-400 text-sm font-bold">
                    No applications in the queue yet.
                  </td>
                </tr>
              ) : (
                stats?.priorityQueue.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-10 py-6 font-black text-brand-blue text-sm">#0{i+1}</td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-brand-slate tracking-tight">{row.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{row.id}</p>
                    </td>
                    <td className="px-6 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                      {row.program}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className={cn(
                        "inline-flex px-3 py-1 rounded-lg text-[11px] font-black border",
                        row.score > 80 ? "bg-red-50 text-red-600 border-red-100" :
                        row.score > 60 ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}>
                        {row.score}/100
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="h-9 w-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm ml-auto">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
