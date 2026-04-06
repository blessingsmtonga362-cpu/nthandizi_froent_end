"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Activity, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Application", href: "/apply", icon: FileText },
  { name: "Status", href: "/status", icon: Activity },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

const EXPANDED_W = 256;
const COLLAPSED_W = 72;

export function StudentNav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col bg-brand-slate h-screen sticky top-0 left-0 text-white overflow-hidden shrink-0"
      >
        {/* Logo area */}
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
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <img
                  src="/mthandizi.png"
                  alt="Mthandizi"
                  className="h-8 w-auto brightness-0 invert"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button — chevron rotates to hint direction */}
          <button
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0",
              "text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </motion.span>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/5 shrink-0" />

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-3 pt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={!expanded ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl transition-colors duration-200 group relative",
                  expanded ? "px-4 py-3" : "px-0 py-3 justify-center",
                  isActive
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="shrink-0"
                />
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="font-bold tracking-tight text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Collapsed hint — subtle dots to signal expandability */}
        {!expanded && (
          <div className="pb-6 flex flex-col items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white/20 block" />
            <span className="w-1 h-1 rounded-full bg-white/20 block" />
            <span className="w-1 h-1 rounded-full bg-white/20 block" />
          </div>
        )}
      </motion.aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-3 z-50 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-brand-blue scale-110" : "text-slate-400"
              )}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
