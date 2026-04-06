"use client";
import { useState } from "react";
import { useApplicationStore } from "@/lib/store/use-application-store";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EducationLevel } from "@/lib/store/use-application-store";
import { motion, AnimatePresence } from "framer-motion";

const labelClass = "text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 block";
const inputClass = "h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors";

type TabKey = "primary" | "secondary" | "tertiary";
const TABS: { key: TabKey; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "tertiary", label: "Tertiary" },
];

function EducationForm({ level, data, onChange }: { level: TabKey; data: EducationLevel; onChange: (d: Partial<EducationLevel>) => void }) {
  return (
    <motion.div
      key={level}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="grid md:grid-cols-2 gap-6 pt-6"
    >
      <div className="space-y-2">
        <label className={labelClass}>Name of School</label>
        <Input className={inputClass} placeholder="e.g. Kamuzu Academy" value={data.schoolName} onChange={(e) => onChange({ schoolName: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Tuition Fee (Per Term)</label>
        <Input type="number" className={inputClass} placeholder="e.g. 50000" value={data.tuitionFee} onChange={(e) => onChange({ tuitionFee: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Year Completed</label>
        <Input type="number" className={inputClass} placeholder="e.g. 2018" value={data.yearCompleted} onChange={(e) => onChange({ yearCompleted: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Who Paid Fees</label>
        <Input className={inputClass} placeholder="e.g. Parent, Government, NGO" value={data.whoPaidFees} onChange={(e) => onChange({ whoPaidFees: e.target.value })} />
      </div>
    </motion.div>
  );
}

export default function Step3() {
  const [activeTab, setActiveTab] = useState<TabKey>("primary");
  const { data, updateEducation } = useApplicationStore();

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 h-11 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300",
              activeTab === tab.key
                ? "bg-white text-brand-blue shadow-md shadow-slate-200/80"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <EducationForm
          key={activeTab}
          level={activeTab}
          data={data.education[activeTab]}
          onChange={(d) => updateEducation(activeTab, d)}
        />
      </AnimatePresence>
    </div>
  );
}
