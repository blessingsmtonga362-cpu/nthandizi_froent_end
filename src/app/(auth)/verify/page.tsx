"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(60); // 60 seconds
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCanResend(false); // Reset on mount or email change
    setTimer(60);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [email]); // Restart timer if email changes (e.g. going back and forth)

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(d => d === "")) return;
    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      router.push("/dashboard"); // Redirect to student dashboard after verification
    }, 1200);
  };

  const handleResendCode = () => {
    // Simulate API call to resend OTP
    setIsLoading(true);
    setTimeout(() => {
      console.log("Resending OTP to:", email); // For debugging
      setIsLoading(false);
      setCanResend(false);
      setTimer(60); // Restart timer
      setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
      inputRefs.current[0]?.focus(); // Focus first input
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col justify-center py-12 px-6 selection:bg-brand-blue/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full mx-auto"
      >
        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-brand-blue/5 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Mail size={36} />
          </div>
          
          <h2 className="text-3xl font-black text-brand-slate mb-3 tracking-tight">Verify Your Email</h2>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
            We've sent a 6-digit verification code to <br />
            <span className="font-bold text-brand-blue">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="w-12 h-16 text-center text-2xl font-black border-2 rounded-2xl border-slate-200 bg-slate-50 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-brand-slate"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button 
              type="submit"
              disabled={otp.some(d => d === "") || isLoading}
              className="w-full h-16 bg-brand-blue hover:bg-brand-blueDark text-white font-black rounded-[20px] shadow-xl shadow-brand-blue/20 text-md transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Confirm & Proceed"
              )}
            </Button>
          </form>

          <div className="text-sm mt-8">
            <p className="text-slate-500 font-medium">
              Didn't receive the code? {" "}
              {timer > 0 && !canResend ? (
                <span className="text-brand-blue font-black">Resend in {timer}s</span>
              ) : (
                <Button 
                  variant="link"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-brand-blue font-black hover:text-brand-blueDark flex items-center gap-1 mx-auto text-sm"
                >
                  <RefreshCcw size={16} /> Resend Code
                </Button>
              )}
            </p>
          </div>

          <Link
            href="/register"
            className="mt-10 flex items-center justify-center gap-2 text-slate-400 hover:text-brand-blue text-xs font-bold uppercase tracking-widest mx-auto transition-colors"
          >
            <ArrowLeft size={16} /> Back to Registration
          </Link>
        </div>
      </motion.div>
    </div>
  );
}