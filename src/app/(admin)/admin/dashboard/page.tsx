"use client";

import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Applications", value: "2,450", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Review", value: "124", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Approved Support", value: "890", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Flagged Files", value: "12", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f172a]">Analytics Overview</h1>
          <p className="text-slate-500">Live monitoring of the support profiling system</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm cursor-pointer">
            Export CSV
          </div>
          <div className="px-4 py-2 bg-unima-blue text-white rounded-lg text-xs font-bold shadow-lg shadow-unima-blue/20 cursor-pointer">
            Generate Report
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-green-500 text-xs font-bold flex items-center bg-green-50 px-2 py-1 rounded-full">
                +4% <TrendingUp size={12} className="ml-1" />
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-extrabold text-[#0f172a] mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-unima-blue">Priority Review Queue</h3>
          <span className="text-[10px] font-bold uppercase text-slate-400">Scores are internal only</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">ID / Programme</th>
                <th className="px-6 py-4 text-center">Need Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: "Chisomo Phiri", id: "BSC-COM-14-21", prog: "BSc Comp Science", score: 88, status: "Pending" },
                { name: "Blessings Banda", id: "BA-EDU-09-22", prog: "BA Education", score: 74, status: "Under Review" },
                { name: "Tiwonge Mwale", id: "LAW-01-20", prog: "Bachelor of Laws", score: 45, status: "Pending" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700 text-sm">{row.name}</td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-unima-blue">{row.id}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{row.prog}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      row.score > 80 ? "bg-red-50 text-red-600 border-red-100" :
                      row.score > 60 ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      {row.score}/100
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-medium text-slate-600">{row.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-unima-blue hover:text-unima-gold transition-colors font-bold text-xs flex items-center gap-1 ml-auto">
                      Review File <ArrowUpRight size={14} />
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
