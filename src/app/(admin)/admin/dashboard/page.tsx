"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle, AlertCircle, ArrowUpRight, ShieldCheck } from "lucide-react";
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
        setStats({ totalApplications: 0, approvedSupport: 0, flaggedFiles: 0, priorityQueue: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  const tiles = [
    { label: "Total Applications", value: stats?.totalApplications ?? "—", icon: Users,       color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100"    },
    { label: "Approved Support",   value: stats?.approvedSupport   ?? "—", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Flagged Files",      value: stats?.flaggedFiles      ?? "—", icon: AlertCircle, color: "text-red-600",     bg: "bg-red-50",     border: "border-red-100"     },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-slate tracking-tight">Analytics Overview</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Student support distribution at a glance</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-5 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors">
            Export Data
          </button>
          <button className="h-10 px-5 bg-brand-blue text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-blueDark transition-colors">
            System Report
          </button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiles.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-5">
              <div className={cn("p-3 rounded-xl border", stat.bg, stat.color, stat.border)}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-brand-slate mt-1">
              {loading ? (
                <span className="inline-block w-14 h-7 bg-slate-100 rounded animate-pulse" />
              ) : (
                stat.value.toLocaleString()
              )}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Priority queue table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-brand-slate text-sm uppercase tracking-widest">Priority Ranking Queue</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
            <ShieldCheck size={12} className="text-brand-blue" />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">Internal Access</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Programme</th>
                <th className="px-6 py-4 text-center">Need Index</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-5">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              ) : stats?.priorityQueue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                    No applications in the queue yet.
                  </td>
                </tr>
              ) : (
                stats?.priorityQueue.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-brand-blue text-sm">#{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-slate">{row.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{row.id}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {row.program}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold border",
                        row.score > 80 ? "bg-red-50 text-red-600 border-red-200" :
                        row.score > 60 ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-emerald-50 text-emerald-600 border-emerald-200"
                      )}>
                        {row.score}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="h-8 w-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors ml-auto">
                        <ArrowUpRight size={15} />
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
