"use client";
import { useApplicationStore } from "@/lib/store/use-application-store";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const selectClass = "w-full h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 outline-none appearance-none focus:border-brand-blue transition-colors";
const labelClass = "text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 block";
const inputClass = "h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors";

const PAYMENT_METHODS = [
  { value: "airtel", label: "Airtel Money", type: "mobile" },
  { value: "tnm", label: "TNM Mpamba", type: "mobile" },
  { value: "national", label: "National Bank", type: "bank" },
  { value: "standard", label: "Standard Bank", type: "bank" },
];

export default function Step5() {
  const { data, updatePayment } = useApplicationStore();
  const p = data.payment;

  const selected = PAYMENT_METHODS.find((m) => m.value === p.paymentMethod);
  const isMobile = selected?.type === "mobile";
  const isBank = selected?.type === "bank";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className={labelClass}>Select Payment Method</label>
        <select
          className={selectClass}
          value={p.paymentMethod}
          onChange={(e) => updatePayment({ paymentMethod: e.target.value, phoneNumber: "", accountName: "", accountNumber: "" })}
        >
          <option value="">Choose a method...</option>
          {PAYMENT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {isMobile && (
          <motion.div
            key="mobile-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className={labelClass}>Phone Number</label>
                <Input
                  className={inputClass}
                  placeholder="+265 999 000 000"
                  value={p.phoneNumber}
                  onChange={(e) => updatePayment({ phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Account Name</label>
                <Input
                  className={inputClass}
                  placeholder="Name on account"
                  value={p.accountName}
                  onChange={(e) => updatePayment({ accountName: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}

        {isBank && (
          <motion.div
            key="bank-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className={labelClass}>Account Number</label>
                <Input
                  className={inputClass}
                  placeholder="e.g. 0123456789"
                  value={p.accountNumber}
                  onChange={(e) => updatePayment({ accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Account Name</label>
                <Input
                  className={inputClass}
                  placeholder="Name on account"
                  value={p.accountName}
                  onChange={(e) => updatePayment({ accountName: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual method cards */}
      {p.paymentMethod && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "p-5 rounded-2xl border flex items-center gap-4",
            isMobile ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
            isMobile ? "bg-amber-500 text-white" : "bg-blue-600 text-white"
          )}>
            {isMobile ? "M" : "B"}
          </div>
          <div>
            <p className="font-black text-brand-slate text-sm">{selected?.label}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isMobile ? "Mobile Money Transfer" : "Bank Transfer"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
