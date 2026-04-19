"use client";
import { useApplicationStore } from "@/lib/store/use-application-store";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const selectClass = "w-full h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 outline-none appearance-none focus:border-brand-blue transition-colors";
const labelClass = "text-[11px] font-bold uppercase text-slate-900 tracking-wider mb-2 block";
const inputClass = "h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors";

export default function Step4() {
  const { data, updateAcademics } = useApplicationStore();
  const a = data.academics;

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className={labelClass}>Program of Study</label>
          <Input className={inputClass} placeholder="e.g. Bachelor of Science in Computer Science" value={a.programOfStudy} onChange={(e) => updateAcademics({ programOfStudy: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Department</label>
          <Input className={inputClass} placeholder="e.g. Department of Computing" value={a.department} onChange={(e) => updateAcademics({ department: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Year of Study</label>
          <select className={selectClass} value={a.yearOfStudy} onChange={(e) => updateAcademics({ yearOfStudy: e.target.value })}>
            <option value="">Select Year</option>
            {["Year 1", "Year 2", "Year 3", "Year 4", "Year 5+"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Upload */}
      <div>
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-4">Document Uploads</p>
        <div>
          <label className={labelClass}>Academic Transcript</label>
          <label className={cn(
            "border-2 border-dashed rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all",
            a.transcriptFile ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50 border-slate-200 hover:border-brand-blue/30 hover:bg-white"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              a.transcriptFile ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
            )}>
              {a.transcriptFile ? <CheckCircle2 size={22} /> : <Upload size={22} />}
            </div>
            <div className="min-w-0">
              <p className="font-black text-brand-slate text-sm truncate">{a.transcriptFile ? a.transcriptFile.name : "Click to upload transcript"}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF or JPEG · Max 5MB</p>
            </div>
            <input type="file" accept=".pdf,.jpg,.jpeg" className="hidden" onChange={(e) => updateAcademics({ transcriptFile: e.target.files?.[0] ?? null })} />
          </label>
        </div>
      </div>
    </div>
  );
}
