"use client";

import { Users, Clock, CheckCircle, AlertCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Applications", value: "2,450", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
   
    { label: "Approved Support", value: "890", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Flagged Files", value: "12", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Live monitoring of the support profiling system</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-medium hover:bg-brand-blueDark transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-green-600 text-xs font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                +4% <TrendingUp size={11} />
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Review queue */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Priority Review Queue</h3>
          <span className="text-[10px] font-medium uppercase text-slate-400 tracking-wider">Scores are internal only</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">ID / Programme</th>
                <th className="px-6 py-3 text-center">Need Score</th>
               
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: "Chisomo Phiri", id: "BSC-COM-14-21", prog: "BSc Computer Science", score: 88},
                { name: "Blessings Banda", id: "BA-EDU-09-22", prog: "BA Education", score: 74  },
                { name: "Tiwonge Mwale", id: "LAW-01-20", prog: "Bachelor of Laws", score: 45},
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 text-sm">{row.name}</td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-brand-blue">{row.id}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{row.prog}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      row.score > 80 ? "bg-blue-50 text-blue-600 border-blue-100" :
                      row.score > 60 ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {row.score}/100
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand-blue hover:text-brand-blueDark transition-colors text-xs font-medium flex items-center gap-1 ml-auto">
                      Review <ArrowUpRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
