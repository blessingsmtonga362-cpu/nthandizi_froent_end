"use client";

import { useApplicationStore } from "@/lib/store/use-application-store";
import { useOfflinePersistence } from "@/hooks/use-offline-persistence";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Step1 from "@/components/student/wizard/step-1";
import Step2 from "@/components/student/wizard/step-2";
import Step3 from "@/components/student/wizard/step-3";
import Step4 from "@/components/student/wizard/step-4";

const STEPS = ["Personal", "Family", "Education", "Review"];

export default function ApplicationWizard() {
  useOfflinePersistence();
  const { data, setStep } = useApplicationStore();

  const nextStep = () => setStep(Math.min(data.currentStep + 1, 4));
  const prevStep = () => setStep(Math.max(data.currentStep - 1, 1));

  return (
    <div className="max-w-4xl mx-auto pb-32 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-slate tracking-tight">Student Profiling</h1>
          <p className="text-slate-500 font-medium mt-1 italic">Provide honest information for accurate assessment.</p>
        </div>
       
      </div>

      {/* Stepper */}
      <div className="hidden md:flex justify-between mb-16 relative px-4">
        <div className="absolute top-[20px] left-0 w-full h-[2px] bg-slate-100 z-0" />
        {STEPS.map((step, i) => {
          const isCurrent = data.currentStep === i + 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i + 1)}
              className="relative z-10 flex flex-col items-center gap-3 group focus:outline-none"
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-colors duration-300 cursor-pointer",
                isCurrent
                  ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/30"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              )}>
                {i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest absolute -bottom-8 whitespace-nowrap transition-colors",
                isCurrent ? "text-brand-blue" : "text-slate-300 group-hover:text-slate-400"
              )}>
                {step}
              </span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <motion.div layout className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 md:p-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={data.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              {data.currentStep === 1 && <Step1 />}
              {data.currentStep === 2 && <Step2 />}
              {data.currentStep === 3 && <Step3 />}
              {data.currentStep === 4 && <Step4 />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav Footer */}
        <div className="border-t border-slate-50 p-8 bg-brand-surface/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={data.currentStep === 1}
            className="font-black text-brand-blue uppercase tracking-widest text-xs h-12 px-8 rounded-xl"
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> Back
          </Button>

          <div className="flex flex-col items-center">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Section</div>
            <div className="text-lg font-black text-brand-slate">
              {data.currentStep} <span className="text-slate-300">/</span> 4
            </div>
          </div>

          <Button
            onClick={nextStep}
            className="bg-brand-blue hover:bg-brand-blueDark text-white h-14 px-12 rounded-2xl font-black text-md shadow-lg shadow-brand-blue/20 w-full sm:w-auto"
          >
            {data.currentStep === 4 ? "Submit Profile" : "Continue"} <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      
    </div>
  );
}
