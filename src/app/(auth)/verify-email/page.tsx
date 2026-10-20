"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import {
  clearVerificationSession,
  getVerificationToken,
  resendEmailVerification,
  verifyEmail,
} from "@/lib/api";

type VerificationStatus =
  | "ready"
  | "verifying"
  | "verified"
  | "error"
  | "sending"
  | "resent";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailFromLink = searchParams.get("email");
  const [status, setStatus] = useState<VerificationStatus>("ready");
  const [email, setEmail] = useState(emailFromLink ?? "");
  const [error, setError] = useState("");
  const [hasVerificationSession, setHasVerificationSession] = useState(false);

  useEffect(() => {
    setHasVerificationSession(Boolean(getVerificationToken()));
  }, []);

  const handleVerify = async () => {
    if (!token) {
      setError("This verification link is incomplete. Open the full link from your email.");
      setStatus("error");
      return;
    }

    setStatus("verifying");
    setError("");
    try {
      const result = await verifyEmail(token);
      setEmail(result.email);
      clearVerificationSession();
      setHasVerificationSession(false);
      setStatus("verified");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We could not verify this email. Request a new link and try again.");
      setStatus("error");
    }
  };

  const handleResend = async () => {
    setStatus("sending");
    setError("");
    try {
      await resendEmailVerification();
      setStatus("resent");
    } catch (err: unknown) {
      setHasVerificationSession(Boolean(getVerificationToken()));
      setError(err instanceof Error ? err.message : "We could not send a new verification link.");
      setStatus("error");
    }
  };

  const title =
    status === "verified"
      ? "Email verified"
      : status === "verifying"
        ? "Verifying your email"
        : status === "sending"
          ? "Sending a new link"
        : status === "resent"
          ? "Check your inbox"
          : token
            ? "Confirm your email"
            : "Verify your email";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#FAF9F7]">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-slate-200 p-8 md:p-12 shadow-sm"
        aria-live="polite"
      >
        <div className="w-14 h-14 flex items-center justify-center mb-8 bg-brand-blue/5">
          {status === "verified" ? (
            <CheckCircle2 size={28} className="text-emerald-600" />
          ) : status === "error" ? (
            <AlertCircle size={28} className="text-red-500" />
          ) : status === "verifying" ? (
            <LoaderCircle size={28} className="text-brand-blue animate-spin" />
          ) : status === "sending" ? (
            <LoaderCircle size={28} className="text-brand-blue animate-spin" />
          ) : (
            <Mail size={28} className="text-brand-blue" />
          )}
        </div>

        <h1 className="text-3xl font-display font-bold text-brand-slate mb-3">
          {title}
        </h1>

        {status === "verified" ? (
          <>
            <p className="text-slate-600 mb-8">
              {email ? `${email} is confirmed.` : "Your email address is confirmed."} You can now sign in.
            </p>
            <Link
              href="/login"
              className="w-full h-12 bg-brand-slate text-white text-sm font-semibold flex items-center justify-center hover:bg-brand-blue transition-colors"
            >
              Continue to sign in
            </Link>
          </>
        ) : status === "verifying" ? (
          <p className="text-slate-600">Please wait while we confirm the one-time link.</p>
        ) : status === "sending" ? (
          <p className="text-slate-600">Please wait while we send a fresh verification link.</p>
        ) : status === "resent" ? (
          <>
            <p className="text-slate-600 mb-8">
              A fresh verification link has been sent. Check your inbox and use the newest link.
            </p>
            <Link href="/login" className="text-brand-blue hover:underline">
              Return to sign in
            </Link>
          </>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              {token
                ? "Press the button below to confirm your email address. This step protects your one-time link from email security scanners."
                : email
                  ? `We sent a verification link to ${email}. Open it to confirm your account.`
                  : "Open the verification link from your email to confirm your account."}
            </p>

            {error && (
              <p className="text-sm text-red-600 flex items-start gap-2 mb-6" role="alert">
                <AlertCircle size={17} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            )}

            {token && (
              <button
                type="button"
                onClick={handleVerify}
                className="w-full h-12 bg-brand-slate text-white text-sm font-semibold flex items-center justify-center hover:bg-brand-blue transition-colors"
              >
                Confirm email address
              </button>
            )}

            {hasVerificationSession && (!token || status === "error") && (
              <button
                type="button"
                onClick={handleResend}
                className="w-full h-12 bg-brand-slate text-white text-sm font-semibold flex items-center justify-center hover:bg-brand-blue transition-colors"
              >
                Send a new verification link
              </button>
            )}

            {!token && !hasVerificationSession && (
              <p className="text-sm text-slate-500 mb-6">
                To request another link, sign in with the account you registered. Your email must be confirmed before you can use the portal.
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/login" className="text-brand-blue hover:underline">
                Sign in
              </Link>
              <Link href="/register" className="text-slate-500 hover:text-brand-blue hover:underline">
                Back to registration
              </Link>
            </div>
          </>
        )}
      </motion.section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
          <LoaderCircle size={28} className="text-brand-blue animate-spin" />
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
