"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { verifyOtp, resendOtp } from "@/lib/api";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  // Countdown timer
  useEffect(() => {
    setCanResend(false);
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
  }, [email]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
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
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) return;

    setIsLoading(true);
    setError("");

    try {
      await verifyOtp(email, otp.join(""));
      setVerified(true);
      // Redirect to login after a short success pause
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");
    try {
      await resendOtp(email);
      setCanResend(false);
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
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

          <AnimatePresence mode="wait">
            {verified ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-display font-bold text-brand-slate mb-3 tracking-tight">Email Verified!</h2>
                <p className="text-slate-500 text-sm font-medium">
                  Your account is confirmed. Redirecting you to sign in...
                </p>
                <div className="mt-6 w-8 h-8 border-2 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mx-auto" />
              </motion.div>
            ) : (
              /* ── OTP entry state ── */
              <motion.div key="form">
                <div className="w-20 h-20 bg-brand-blue/5 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Mail size={36} />
                </div>

                <h2 className="text-3xl font-display font-bold text-brand-slate mb-3 tracking-tight">Verify Your Email</h2>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
                  We&apos;ve sent a 6-digit code to <br />
                  <span className="font-bold text-brand-blue">{email}</span>
                </p>

                <form onSubmit={handleVerify} className="space-y-8">
                  <div className="flex justify-between gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
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

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-red-500 text-[11px] font-bold uppercase tracking-wider"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={otp.some((d) => d === "") || isLoading}
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
                    Didn&apos;t receive the code?{" "}
                    {!canResend ? (
                      <span className="text-brand-blue font-black">Resend in {timer}s</span>
                    ) : (
                      <button
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="text-brand-blue font-black hover:text-brand-blueDark inline-flex items-center gap-1 transition-colors"
                      >
                        <RefreshCcw size={14} className={isResending ? "animate-spin" : ""} />
                        {isResending ? "Sending..." : "Resend Code"}
                      </button>
                    )}
                  </p>
                </div>

                <Link
                  href="/register"
                  className="mt-10 flex items-center justify-center gap-2 text-slate-400 hover:text-brand-blue text-xs font-bold uppercase tracking-widest mx-auto transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Registration
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
