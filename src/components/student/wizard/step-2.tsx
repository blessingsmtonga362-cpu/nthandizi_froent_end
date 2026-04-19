"use client";
import { useApplicationStore } from "@/lib/store/use-application-store";
import { Input } from "@/components/ui/input";
import { MALAWI_TAS } from "@/lib/constants/malawi-data";
import { Upload, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const selectClass = "w-full h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 outline-none appearance-none focus:border-brand-blue transition-colors";
const labelClass = "text-[11px] font-bold uppercase text-slate-900 tracking-wider mb-2 block";
const inputClass = "h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors";

function FileUploadField({ label, file, onChange }: { label: string; file: File | null; onChange: (f: File | null) => void }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <label className={cn(
        "border-2 border-dashed rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all",
        file ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50 border-slate-200 hover:border-brand-blue/30 hover:bg-white"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          file ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
        )}>
          {file ? <CheckCircle2 size={22} /> : <Upload size={22} />}
        </div>
        <div className="min-w-0">
          <p className="font-black text-brand-slate text-sm truncate">{file ? file.name : "Click to upload"}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF or JPEG · Max 5MB</p>
        </div>
        <input type="file" accept=".pdf,.jpg,.jpeg" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </label>
    </div>
  );
}

export default function Step2() {
  const { data, updateFamily } = useApplicationStore();
  const f = data.family;

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClass}>Guardian First Name</label>
          <Input className={inputClass} placeholder="First name" value={f.guardianFirstName} onChange={(e) => updateFamily({ guardianFirstName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Guardian Surname</label>
          <Input className={inputClass} placeholder="Surname" value={f.guardianSurname} onChange={(e) => updateFamily({ guardianSurname: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Profession</label>
          <Input className={inputClass} placeholder="e.g. Farmer, Teacher" value={f.guardianProfession} onChange={(e) => updateFamily({ guardianProfession: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Date of Birth</label>
          <Input type="date" className={inputClass} value={f.guardianDob} onChange={(e) => updateFamily({ guardianDob: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Email Address</label>
          <Input type="email" className={inputClass} placeholder="guardian@email.com" value={f.guardianEmail} onChange={(e) => updateFamily({ guardianEmail: e.target.value })} />
        </div>
        <div className="space-y-2 w-full">
          <label className={labelClass}>T/A (Traditional Authority)</label>
          <select className={selectClass} value={f.guardianTa} onChange={(e) => updateFamily({ guardianTa: e.target.value })}>
            <option value="">Select T/A</option>
            {MALAWI_TAS.map((t, i) => <option key={`ta-${i}`} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Residential Address</label>
          <Input className={inputClass} placeholder="e.g. Area 18, Lilongwe" value={f.guardianResidentialAddress} onChange={(e) => updateFamily({ guardianResidentialAddress: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Postal Address</label>
          <Input className={inputClass} placeholder="P.O. Box 123, Lilongwe" value={f.guardianPostalAddress} onChange={(e) => updateFamily({ guardianPostalAddress: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <label className={labelClass}>Level of Education</label>
          <div className="flex flex-wrap gap-6">
            {["Primary", "Secondary", "Tertiary"].map((lvl) => (
              <button key={lvl} type="button" onClick={() => updateFamily({ guardianEducationLevel: lvl })}
                className="flex items-center gap-2.5 group focus:outline-none">
                <span className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  f.guardianEducationLevel === lvl ? "border-brand-blue" : "border-slate-300 group-hover:border-slate-400"
                )}>
                  {f.guardianEducationLevel === lvl && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue block" />
                  )}
                </span>
                <span className={cn("text-sm font-bold transition-colors",
                  f.guardianEducationLevel === lvl ? "text-brand-blue" : "text-slate-500 group-hover:text-slate-700"
                )}>{lvl}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-4">Document Uploads</p>
        <div className="grid md:grid-cols-3 gap-4">
          <FileUploadField label="Death Certificate" file={f.deathCertificateFile} onChange={(file) => updateFamily({ deathCertificateFile: file })} />
          <FileUploadField label="Guarantor National ID" file={f.guarantorNationalIdFile} onChange={(file) => updateFamily({ guarantorNationalIdFile: file })} />
          <FileUploadField label="Guarantor Consent Form" file={f.guarantorConsentFile} onChange={(file) => updateFamily({ guarantorConsentFile: file })} />
        </div>
      </div>
    </div>
  );
}
