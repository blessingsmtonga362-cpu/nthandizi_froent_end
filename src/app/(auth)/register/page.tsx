"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    registrationNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    if (value.includes("@") && !value.endsWith("@unima.ac.mw")) {
      setEmailError("Please use your UNIMA email address (@unima.ac.mw)");
    } else {
      setEmailError("");
    }
  };

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    let strength = 0;
    if (pwd.length > 7) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const isFormValid = () =>
    formData.firstName.trim() &&
    formData.surname.trim() &&
    formData.registrationNumber.trim() &&
    formData.email.endsWith("@unima.ac.mw") &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    !emailError;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    setError("");

    try {
      await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.surname.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        university: "unima",
      });
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStrength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col justify-center py-12 px-6 selection:bg-brand-blue/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full mx-auto"
      >
        {/* Branding Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center mb-8 hover:scale-105 transition-transform">
            <img src="/mthandizi.png" alt="Mthandizi Logo" className="h-12 w-auto" />
          </Link>
          <h2 className="text-3xl font-black text-brand-slate tracking-tight">Create Account</h2>
          <p className="text-slate-500 font-medium mt-2">Join the Mthandizi student profiling platform.</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form className="space-y-7" onSubmit={handleRegister}>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-7">

              {/* First Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-slate-900 tracking-wider ml-1 block">First Name</label>
                <Input
                  required
                  placeholder="first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors"
                />
              </div>

              {/* Surname */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-slate-900 tracking-wider ml-1 block">Surname</label>
                <Input
                  required
                  placeholder="surname"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors"
                />
              </div>

              {/* University Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold uppercase text-slate-900 tracking-wider ml-1 block">Registration Number</label>
                <Input
                  required
                  placeholder="e.g. UNIMA20240123"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold uppercase text-slate-900 tracking-wider ml-1 block">University Email</label>
                <Input
                  required
                  type="email"
                  placeholder="yourname@unima.ac.mw"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={cn(
                    "h-14 rounded-2xl bg-white border border-slate-200 px-6 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors",
                    emailError ? "border-red-500" : ""
                  )}
                />
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-2 flex items-center gap-1.5 ml-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold uppercase text-slate-900 tracking-wider ml-1 block">Password</label>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="min. 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-14 rounded-2xl bg-white border border-slate-200 px-6 pr-12 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-blue transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex gap-1 mt-2 px-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={cn("h-1.5 w-full rounded-full transition-colors duration-300", currentStrength >= step ? getStrengthColor(currentStrength) : "bg-slate-100")} />
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold uppercase text-slate-900 tracking-wider ml-1 block">Confirm Password</label>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={cn(
                      "h-14 rounded-2xl bg-white border border-slate-200 px-6 pr-12 font-normal text-slate-800 placeholder:font-light focus:border-brand-blue transition-colors",
                      formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500" : ""
                    )}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-blue transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <AnimatePresence>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-2 flex items-center gap-1.5 ml-1"
                    >
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* API error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full h-16 bg-brand-blue hover:bg-brand-blueDark text-white font-black rounded-[20px] shadow-xl shadow-brand-blue/20 text-md transition-all active:scale-[0.98]"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-blue font-black hover:underline transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
