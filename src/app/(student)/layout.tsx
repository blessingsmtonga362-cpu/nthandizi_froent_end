"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, KeyRound } from "lucide-react";
import { StudentNav } from "@/components/student/nav";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/api";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth("student");

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await logout();
    router.push("/login");
  };

  const handleChangePassword = () => {
    setOpen(false);
    // wire to real flow later
  };

  // Block render until auth resolves (only matters when guard is active)
  if (loading) return null;

  const initials = user ? ([user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "ST") : "ST";
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : (user?.email ?? "Student");

  return (
    <div className="flex min-h-screen bg-unima-surface">
      <StudentNav />
      <main className="flex-1 pb-24 lg:pb-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/UnimaLogo.png" alt="UNIMA" className="h-9 w-auto object-contain" />
            <div className="h-6 w-px bg-slate-200" />
            <span className="font-bold text-unima-blue text-sm tracking-tight">University of Malawi</span>
          </div>
          <div className="lg:hidden flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mthandizi.png" alt="Mthandizi" style={{ height: "32px", width: "auto" }} />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-unima-blue leading-none">{displayName}</p>
              {user?.registrationNumber && (
                <p className="text-[10px] text-unima-slate font-medium uppercase tracking-wider">{user.registrationNumber}</p>
              )}
            </div>

            {/* Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-unima-gold/20 border-2 border-unima-gold flex items-center justify-center text-unima-blue font-bold hover:bg-unima-gold/30 transition-colors focus:outline-none"
              >
                {initials}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-50">
                  <button
                    onClick={handleChangePassword}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand-slate hover:bg-slate-50 transition-colors"
                  >
                    <KeyRound size={16} className="text-brand-blue" />
                    Change Password
                  </button>
                  <div className="h-px bg-slate-100" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
