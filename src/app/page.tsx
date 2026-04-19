"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Globe, Layers, CheckCircle2 } from "lucide-react";
// Added useTransform to the imports
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [isIntro, setIsIntro] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // NEW: Scroll transformations for the Impact Section
  // This maps the scroll position (0 to 400px) to opacity (0 to 1) and Y position (100px to 0px)
  const impactOpacity = useTransform(scrollY, [0, 400], [0, 1]);
  const impactY = useTransform(scrollY, [0, 400], [100, 0]);

  // 1. Initial Intro Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntro(false);
    }, 1800); // Increased slightly to enjoy the pulse animation
    return () => clearTimeout(timer);
  }, []);

  // 2. Scroll Listener for Header
  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.8 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-blue/30 overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <motion.nav 
        initial={false}
        animate={{
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(15, 23, 42, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          borderBottomColor: isScrolled ? "rgba(226, 232, 240, 1)" : "rgba(226, 232, 240, 0)",
        }}
        className="px-6 py-4 flex justify-between items-center fixed top-0 w-full z-50 transition-all duration-500"
      >
        <div className="w-40 h-10 relative">
          {!isIntro && (
            <motion.img 
              layoutId="brand-logo"
              src="/mthandizi.png" 
              alt="Mthandizi Logo" 
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={cn(
                "h-10 w-auto absolute left-0 top-0",
                !isScrolled ? "brightness-0 invert" : "brightness-100"
              )} 
            />
          )}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isIntro ? 0 : 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-6"
        >
          <Link href="/login" className={cn("text-sm font-bold", !isScrolled ? "text-slate-300" : "text-brand-slate")}>Sign In</Link>
          <Button className={cn("px-6 rounded-full font-bold", !isScrolled ? "bg-white text-brand-slate" : "bg-brand-blue text-white")} asChild>
            <Link href="/register">Create Account</Link>
          </Button>
        </motion.div>
      </motion.nav>

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          
          <motion.div 
            initial={{ backgroundColor: "#ffffff" }}
            animate={{ backgroundColor: isIntro ? "#ffffff" : "#0F172A" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          />

          {/* INTRO LOGO (ANIMATES ON CENTER THEN FLIES) */}
          <AnimatePresence>
            {isIntro && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
                <motion.img
                  layoutId="brand-logo"
                  src="/mthandizi.png"
                  alt="Mthandizi Logo"
                  className="h-24 md:h-32 w-auto"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 120, damping: 20 },
                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </div>
            )}
          </AnimatePresence>

          {/* HERO CONTENT — flex-1 so it fills space above the chevron */}
          <div className="flex-1 flex items-center justify-center w-full relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isIntro ? "hidden" : "visible"}
              className="max-w-5xl w-full mx-auto text-center"
            >
              <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-brand-blue animate-gradient">Empowerment.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                Mthandizi is an independent platform built to standardize student support 
                across Malawi. Build a profile that connects you 
                to institutional resources.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button size="lg" className="bg-brand-blue hover:bg-brand-blueDark text-white h-16 px-12 rounded-2xl text-lg font-extrabold shadow-2xl shadow-brand-blue/40 transition-all hover:scale-105" asChild>
                  <Link href="/register">Get Started Now</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* CHEVRON — sits at the bottom in normal flow, perfectly centered */}
          <div className="relative z-10 pb-10 flex justify-center w-full">
            <AnimatePresence>
              {!isIntro && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, 10, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { delay: 0.6, duration: 0.8 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                  className="text-slate-500 hidden md:block"
                >
                  <ChevronDown size={32} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isIntro && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-blue blur-[120px] pointer-events-none" 
            />
          )}
        </section>

        {/* IMPACT SECTION (REVEALS ON SCROLL, DISAPPEARS AT TOP) */}
        <motion.section 
          style={{ opacity: impactOpacity, y: impactY }} // Tied to scroll progress
          className="py-32 bg-white relative -mt-20 rounded-t-[60px] z-20 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.3)]"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-brand-slate mb-4">How It Works</h2>
              <div className="w-20 h-1.5 bg-brand-blue mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-16">
              {[
                { icon: Globe, title: "1. Clear Eligibility Cliteria", desc: "The system uses a single non-discriminating approach for selecting students who are eligible and the process is highly standardized to enhance equity." },
                { icon: Layers, title: "2. Secure Profiling", desc: "Complete a structured, neutral profile that highlights your academic standing." },
                { icon: CheckCircle2, title: "3. Direct Updates", desc: "Receive real-time notifications about your status and support decisions." },
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <div className="w-20 h-20 bg-brand-surface rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-brand-blue transition-all duration-500 shadow-xl shadow-slate-200">
                    <feature.icon className="text-brand-blue w-10 h-10 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-slate mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white text-brand-slate py-20 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <img src="/mthandizi.png" alt="Mthandizi" className="h-12 w-auto" />
          <div className="flex gap-12 text-sm font-bold uppercase tracking-wider text-slate-400">
             
             <Link href="#">Privacy</Link>
             <Link href="#">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}