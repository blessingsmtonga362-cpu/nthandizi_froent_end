"use client";

import { useState } from "react";
import { 
  Plus, 
  X, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Download,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock Students Data (Ranked by Need Score)
const INITIAL_STUDENTS = [
  { id: "STU001", name: "Chisomo Phiri", score: 98, status: "Available" },
  { id: "STU002", name: "Blessings Banda", score: 95, status: "Available" },
  { id: "STU003", name: "Tiwonge Mwale", score: 92, status: "Available" },
  { id: "STU004", name: "Lumbani Nyasulu", score: 89, status: "Available" },
  { id: "STU005", name: "Mtunthama Jere", score: 87, status: "Available" },
  { id: "STU006", name: "Eneya Kaunda", score: 85, status: "Available" },
  { id: "STU007", name: "Yamika Chima", score: 82, status: "Available" },
];

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([
    { id: 1, name: "Press Trust", logo: null, status: "completed", beneficiaries: 120 },
    { id: 2, name: "FDH Bank", logo: null, status: "in-progress", beneficiaries: 0 },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeSponsor, setActiveSponsor] = useState<any>(null);
  const [beneficiaryCount, setBeneficiaryCount] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle allocation logic
  const handlePreviewSelection = () => {
    const count = parseInt(beneficiaryCount);
    if (isNaN(count) || count <= 0) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      // Logic: Take top X students who aren't already taken
      setSelectedStudents(INITIAL_STUDENTS.slice(0, count));
      setIsProcessing(false);
    }, 800);
  };

  const handleGenerateReport = () => {
    // In a real app, this would trigger the notification system
    alert(`Approval successful. Notifications sent to ${selectedStudents.length} students.`);
    setActiveSponsor(null);
    setSelectedStudents([]);
    setBeneficiaryCount("");
  };

  return (
    <div className="relative h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Sponsors</h1>
          <p className="text-slate-500 text-sm mt-1">Manage institutional funding and student allocation</p>
        </div>
      </div>

      {/* Sponsor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Add Sponsor Tile */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-48 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-brand-blue hover:bg-brand-blue/[0.02] transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-brand-blue group-hover:text-white flex items-center justify-center transition-all">
            <Plus size={24} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-brand-blue">Add Sponsor</span>
        </button>

        {/* Sponsor Tiles */}
        {sponsors.map((sponsor) => (
          <motion.div
            key={sponsor.id}
            whileHover={{ y: -5 }}
            onClick={() => setActiveSponsor(sponsor)}
            className="h-48 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center text-center gap-4"
          >
            {sponsor.status === "in-progress" && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
                <Loader2 size={10} className="animate-spin text-amber-600" />
                <span className="text-[9px] font-black uppercase text-amber-600 tracking-tighter">In Progress</span>
              </div>
            )}
            
            <div className="w-20 h-20 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-blue font-black text-2xl shadow-inner border border-slate-50">
              {sponsor.name.substring(0, 2).toUpperCase()}
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900">{sponsor.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {sponsor.beneficiaries > 0 ? `${sponsor.beneficiaries} Beneficiaries` : 'No active allocation'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PREMIUM SIDE PANEL */}
      <AnimatePresence>
        {activeSponsor && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSponsor(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ 
                x: 0,
                width: selectedStudents.length > 0 ? 600 : 400
              }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 h-screen bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-slate text-white flex items-center justify-center font-bold text-xs">
                    {activeSponsor.name.substring(0, 2)}
                  </div>
                  <div>
                    <h2 className="font-black text-brand-slate tracking-tight">{activeSponsor.name}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocation Protocol</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveSponsor(null)}
                  className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {selectedStudents.length === 0 ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-brand-blue/5 rounded-3xl border border-brand-blue/10">
                      <h4 className="text-sm font-bold text-brand-blue flex items-center gap-2 mb-2">
                        <Users size={16} /> New Allocation
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Enter the total number of students this sponsor will support. The system will automatically select the highest-ranked students from the available pool.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Number of Beneficiaries</label>
                      <div className="flex gap-2">
                        <Input 
                          type="number"
                          value={beneficiaryCount}
                          onChange={(e) => setBeneficiaryCount(e.target.value)}
                          placeholder="e.g. 50"
                          className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-brand-slate px-6"
                        />
                        <Button 
                          onClick={handlePreviewSelection}
                          disabled={!beneficiaryCount || isProcessing}
                          className="h-14 px-8 rounded-2xl bg-brand-blue hover:bg-brand-blueDark text-white font-black"
                        >
                          {isProcessing ? <Loader2 className="animate-spin" /> : "Verify"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-brand-slate uppercase tracking-widest text-[10px]">Identified Recipients</h3>
                      <button 
                        onClick={() => setSelectedStudents([])}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                      >
                        Reset Selection
                      </button>
                    </div>

                    <div className="bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100/50">
                          <tr className="text-[9px] uppercase font-black text-slate-400 tracking-widest">
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4 text-center">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedStudents.map((stu, i) => (
                            <tr key={stu.id} className="text-sm">
                              <td className="px-6 py-4 font-black text-brand-blue">#0{i + 1}</td>
                              <td className="px-6 py-4 font-bold text-brand-slate">{stu.name}</td>
                              <td className="px-6 py-4 text-center">
                                <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black">
                                  {stu.score}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Panel Footer */}
              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                <Button 
                  disabled={selectedStudents.length === 0}
                  onClick={handleGenerateReport}
                  className={cn(
                    "w-full h-16 rounded-[20px] font-black text-md transition-all flex items-center justify-center gap-3",
                    selectedStudents.length > 0 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-200" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <FileText size={20} />
                  Generate Selection Report
                </Button>
                <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-4">
                  Final approval will notify all selected students.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Sponsor Modal (Overlay) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-slate/60 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] w-full max-w-md p-10 relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-brand-slate tracking-tight mb-2">New Sponsor</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium">Onboard a new funding partner to the platform.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Sponsor Name</label>
                  <Input placeholder="Enter organization name" className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Logo (Optional)</label>
                  <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Plus className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload PNG</span>
                  </div>
                </div>
                <Button className="w-full h-16 bg-brand-blue text-white rounded-[20px] font-black shadow-xl shadow-brand-blue/20 mt-4">
                  Register Sponsor
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}