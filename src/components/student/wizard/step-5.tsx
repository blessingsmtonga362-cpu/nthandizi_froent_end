"use client";
import { useState } from "react";
import { useApplicationStore } from "@/lib/store/use-application-store";
import { Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{title}</span>
        <div className="flex items-center gap-4">
          <button onClick={onEdit} className="flex items-center gap-1.5 text-brand-blue hover:text-brand-blueDark text-[10px] font-black uppercase tracking-widest transition-colors">
            <Edit3 size={13} /> Edit
          </button>
          <button onClick={() => setExpanded((v) => !v)} className="flex items-center gap-1 text-slate-400 hover:text-brand-blue text-[10px] font-black uppercase tracking-widest transition-colors">
            {expanded ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> View More</>}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <div className="px-8 py-3 text-[11px] text-slate-300 font-medium italic">
          Click "View More" to see details
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
      <p className="text-sm font-black text-brand-slate break-words">
        {value || <span className="text-slate-300 italic font-medium">Not provided</span>}
      </p>
    </div>
  );
}

export default function Step5() {
  const { data, setStep } = useApplicationStore();
  const { personal: p, family: f, education: e, academics: a, payment: pay } = data;

  const PAYMENT_LABELS: Record<string, string> = {
    airtel: "Airtel Money", tnm: "TNM Mpamba",
    national: "National Bank", standard: "Standard Bank",
  };

  return (
    <div className="space-y-6">
      {/* Personal */}
      <ReviewCard title="Personal Information" onEdit={() => setStep(1)}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Field label="First Name" value={p.firstName} />
          <Field label="Surname" value={p.surname} />
          <Field label="Phone Number" value={p.phoneNumber} />
          <Field label="National ID" value={p.nationalId} />
          <Field label="Registration No." value={p.registrationNumber} />
          <Field label="Date of Birth" value={p.dateOfBirth} />
          <Field label="Gender" value={p.gender} />
          <Field label="Marital Status" value={p.maritalStatus} />
          <Field label="Home District" value={p.homeDistrict} />
          <Field label="T/A" value={p.ta} />
          <Field label="Physical Address" value={p.physicalAddress} />
          <Field label="Disability" value={p.disability} />
        </div>
        <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
          <Field label="Student ID Doc" value={p.studentIdFile?.name} />
          <Field label="National ID Doc" value={p.nationalIdFile?.name} />
        </div>
        <div className="mt-6 pt-6 border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Details</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Payment Method" value={PAYMENT_LABELS[pay.paymentMethod] ?? pay.paymentMethod} />
            {pay.phoneNumber && <Field label="Phone Number" value={pay.phoneNumber} />}
            {pay.accountNumber && <Field label="Account Number" value={pay.accountNumber} />}
            {pay.accountName && <Field label="Account Name" value={pay.accountName} />}
          </div>
        </div>
      </ReviewCard>

      {/* Family */}
      <ReviewCard title="Family Background" onEdit={() => setStep(2)}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Field label="Guardian First Name" value={f.guardianFirstName} />
          <Field label="Guardian Surname" value={f.guardianSurname} />
          <Field label="Profession" value={f.guardianProfession} />
          <Field label="Date of Birth" value={f.guardianDob} />
          <Field label="Email" value={f.guardianEmail} />
          <Field label="T/A" value={f.guardianTa} />
          <Field label="Residential Address" value={f.guardianResidentialAddress} />
          <Field label="Postal Address" value={f.guardianPostalAddress} />
          <Field label="Education Level" value={f.guardianEducationLevel} />
        </div>
        <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-3 gap-4">
          <Field label="Death Certificate" value={f.deathCertificateFile?.name} />
          <Field label="Guarantor National ID" value={f.guarantorNationalIdFile?.name} />
          <Field label="Guarantor Consent" value={f.guarantorConsentFile?.name} />
        </div>
      </ReviewCard>

      {/* Education */}
      <ReviewCard title="Education Background" onEdit={() => setStep(3)}>
        <div className="space-y-6">
          {(["primary", "secondary", "tertiary"] as const).map((lvl) => (
            <div key={lvl}>
              <p className={cn("text-[10px] font-black uppercase tracking-widest mb-3",
                lvl === "primary" ? "text-emerald-500" : lvl === "secondary" ? "text-amber-500" : "text-brand-blue"
              )}>{lvl}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="School Name" value={e[lvl].schoolName} />
                <Field label="Tuition / Term" value={e[lvl].tuitionFee ? `MWK ${e[lvl].tuitionFee}` : undefined} />
                <Field label="Year Completed" value={e[lvl].yearCompleted} />
                <Field label="Who Paid Fees" value={e[lvl].whoPaidFees} />
              </div>
            </div>
          ))}
        </div>
      </ReviewCard>

      {/* Academics */}
      <ReviewCard title="Academics" onEdit={() => setStep(4)}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Field label="Program of Study" value={a.programOfStudy} />
          <Field label="Department" value={a.department} />
          <Field label="Year of Study" value={a.yearOfStudy} />
          <Field label="Transcript" value={a.transcriptFile?.name} />
        </div>
      </ReviewCard>

      {/* Declaration */}
      <div className="pt-4 px-2">
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          <span className="font-black text-brand-slate">Declaration: </span>
          I hereby declare that the information provided in this application is true and complete to the best of my knowledge.
          I understand that any false statements or forged documentation will result in immediate disqualification and
          reporting to the relevant university authorities.
        </p>
        <label className="flex items-center gap-3 mt-4 cursor-pointer group">
          <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-brand-blue focus:ring-brand-blue/20 cursor-pointer" />
          <span className="text-xs font-black text-brand-slate group-hover:text-brand-blue transition-colors">
            I agree to the above declaration
          </span>
        </label>
      </div>
    </div>
  );
}
