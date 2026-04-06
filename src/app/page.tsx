"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Globe, 
  Layers, 
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Handle header background and logo color toggle on scroll
  useEffect(() => {
    const updateScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-blue/30 overflow-x-hidden">
      
      {/* Dynamic Header */}
      <motion.nav 
        initial={false}
        animate={{
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(15, 23, 42, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          borderBottomColor: isScrolled ? "rgba(226, 232, 240, 1)" : "rgba(226, 232, 240, 0)",
        }}
        className={cn(
          "px-6 py-4 flex justify-between items-center fixed top-0 w-full z-50 border-b transition-colors duration-300",
        )}
      >
        <div className="flex items-center">
          {/* Logo Filter: Inverts to white when on dark bg, original when on light bg */}
          <img 
            src="/mthandizi.png" 
            alt="Mthandizi Logo" 
            className={cn(
              "h-10 w-auto transition-all duration-500 ease-in-out",
              !isScrolled ? "brightness-0 invert" : "brightness-100"
            )} 
          />
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/login" 
            className={cn(
              "text-sm font-bold transition-colors duration-300",
              !isScrolled ? "text-slate-300 hover:text-white" : "text-brand-slate hover:text-brand-blue"
            )}
          >
            Sign In
          </Link>
          <Button 
            className={cn(
              "px-6 rounded-full font-bold shadow-lg transition-all duration-300",
              !isScrolled 
                ? "bg-white text-brand-slate hover:bg-slate-100" 
                : "bg-brand-blue hover:bg-brand-blueDark text-white shadow-brand-blue/20"
            )} 
            asChild
          >
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </motion.nav>

      <main className="flex-1">
        
        {/* Hero Section (Dark) */}
        <section className="relative min-h-screen flex items-center pt-20 pb-32 px-6 bg-brand-slate overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-blue blur-[120px]" 
            />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-extrabold uppercase tracking-[0.2em] mb-8">
                Nationwide Student Profiling Platform
              </span>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] text-balance">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-brand-blue bg-[length:200%_auto] animate-gradient">Empowerment.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                Mthandizi is an independent platform built to standardize student support 
                across Malawi. We help you build a professional profile that connects you 
                to institutional resources.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button size="lg" className="bg-brand-blue hover:bg-brand-blueDark text-white h-16 px-12 rounded-2xl text-lg font-extrabold shadow-2xl shadow-brand-blue/40 transition-all hover:scale-105 active:scale-95" asChild>
                  <Link href="/register">Get Started Now <ArrowRight className="ml-2 w-6 h-6" /></Link>
                </Button>
                <Button size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all" asChild>
                  <Link href="/login">Check Status</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 hidden md:block"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* Impact Section (White - Animates In/Out) */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="py-32 bg-white relative -mt-20 rounded-t-[60px] z-20 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.3)]"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-brand-slate mb-4">How It Works</h2>
              <div className="w-20 h-1.5 bg-brand-blue mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-16">
              {[
                { 
                  icon: Globe, 
                  title: "1. Centralized Access", 
                  desc: "A single platform for all Malawian universities. Your data is managed independently and professionally." 
                },
                { 
                  icon: Layers, 
                  title: "2. Secure Profiling", 
                  desc: "Complete a structured, neutral profile that highlights your academic standing and unique background." 
                },
                { 
                  icon: CheckCircle2, 
                  title: "3. Direct Updates", 
                  desc: "Receive real-time notifications about your status and institutional support decisions." 
                },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="w-20 h-20 bg-brand-surface rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-brand-blue group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-slate-200">
                    <feature.icon className="text-brand-blue w-10 h-10 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-slate mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Phase Info Section */}
        <section className="py-24 bg-brand-surface px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-brand-slate rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
          >
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Globe size={120} className="text-white" />
             </div>
             
             <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10">Initial Pilot: UNIMA</h2>
             <p className="text-slate-400 text-lg mb-10 relative z-10 leading-relaxed font-medium">
               Mthandizi is rolling out across Malawi. Our first implementation phase is currently 
               live for students of the <strong>University of Malawi (UNIMA)</strong>. 
               Register with your institutional email to begin your profile today.
             </p>
             <Button className="bg-white text-brand-slate hover:bg-slate-100 h-14 px-10 rounded-xl font-extrabold text-md relative z-10" asChild>
               <Link href="/register">Join the Pilot Phase</Link>
             </Button>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-brand-slate py-20 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
            <img src="/mthandizi.png" alt="Mthandizi" className="h-12 w-auto mb-6" />
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Bridging Potential and Support</p>
          </div>
          
          <div className="flex gap-12 text-sm font-bold uppercase tracking-wider text-slate-400">
             <Link href="/staff" className="hover:text-brand-blue transition-colors">Staff Portal</Link>
             <Link href="#" className="hover:text-brand-blue transition-colors">Data Privacy</Link>
             <Link href="#" className="hover:text-brand-blue transition-colors">Support</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-12 mt-12 border-t border-slate-50 text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.4em]">
           © 2024 Mthandizi Platform • Independent System
        </div>
      </footer>
    </div>
  );
}