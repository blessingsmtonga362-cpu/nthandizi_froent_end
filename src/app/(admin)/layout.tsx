"use client";

import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Handshake, KeyRound, LogOut, ChevronRight, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/api";

const EXPANDED_W = 256;
const COLLAPSED_W = 72;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth("admin");

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Sponsors", icon: Handshake, href: "/admin/sponsors" },
    { label: "Notifications", icon: Bell, href: "/admin/notifications" },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  // Block render until auth resolves (only matters when guard is active)
  if (loading) return null;

  const initials = user ? ([user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "AD") : "AD";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <motion.aside 
        animate={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="bg-brand-slate text-slate-400 flex flex-col fixed h-full z-50 border-r border-white/5 overflow-hidden shadow-2xl"
      >
        {/* Branding Area */}
        <div className={cn(
          "flex items-center h-20 px-4 shrink-0",
          expanded ? "justify-between" : "justify-center"
        )}>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <img src="/mthandizi.png" alt="Mthandizi" className="h-8 w-auto brightness-0 invert" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue block mt-1">
                  Admin Portal
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronRight size={18} />
            </motion.span>
          </button>
        </div>

        <div className="mx-4 h-px bg-white/5 shrink-0" />

        {/* Nav */}
        <nav className="flex-1 px-3 pt-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={!expanded ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-200 group relative",
                  expanded ? "px-4 py-3 gap-3" : "px-0 py-3 justify-center",
                  isActive
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                    : "hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn(!isActive && "group-hover:text-brand-blue transition-colors")} />
                
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {isActive && expanded && (
                  <motion.div layoutId="adminNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <motion.main 
        animate={{ marginLeft: expanded ? EXPANDED_W : COLLAPSED_W }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1"
      >
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-end sticky top-0 z-40">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-10 h-10 rounded-xl bg-brand-slate text-white font-bold text-sm flex items-center justify-center hover:bg-brand-slate/80 transition-colors focus:outline-none"
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <button
                  onClick={() => { setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <KeyRound size={15} className="text-brand-blue" />
                  Change Password
                </button>
                <div className="h-px bg-slate-100" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
