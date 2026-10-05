import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Play,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================================
   LIGHT HERO WRAPPER
   ============================================================================ */
function LightHeroWrapper({
  id,
  children,
  bgClass = 'bg-white',
}: {
  id: string;
  children: React.ReactNode;
  bgClass?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll('[data-gsap="reveal"]');
      if (elements && elements.length > 0) {
        gsap.fromTo(
          elements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id={id}
      className={`relative border-b border-neutral-200/80 ${bgClass} min-h-screen flex flex-col justify-center py-20 px-6 lg:px-16 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        {children}
      </div>
    </section>
  );
}

/* L1: ACETERNITY SPOTLIGHT & BEAM HERO (LIGHT EDITION) */
export function HeroLight1SpotlightBeam() {
  return (
    <LightHeroWrapper id="light-hero-1">
      <div className="relative rounded-3xl border border-neutral-200 bg-white/80 p-8 lg:p-16 shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] bg-gradient-to-b from-blue-400/20 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div data-gsap="reveal" className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <Sparkles size={14} className="text-blue-600" />
            <span>AI-POWERED MATCHING ENGINE 3.0</span>
          </div>

          <h1 data-gsap="reveal" className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
            High-Performance Hiring <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Engineered for Modern Teams.
            </span>
          </h1>

          <p data-gsap="reveal" className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Source, screen, and deploy elite engineering pods in days. Powered by algorithmic technical vetting and regional compliance automation.
          </p>

          <div data-gsap="reveal" className="pt-4 flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full bg-neutral-900 px-8 py-4 text-xs font-bold text-white shadow-xl hover:bg-neutral-800 transition-all"
            >
              Start Hiring Squad <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-4 text-xs font-bold text-neutral-800 shadow-sm hover:bg-neutral-50 transition-all"
            >
              <Play size={14} fill="currentColor" /> Watch 2-Min Demo
            </motion.button>
          </div>

          <div data-gsap="reveal" className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Shortlist Speed', val: '72 Hours' },
              { label: 'Code Vetting Pass', val: '99.2%' },
              { label: 'Talent Pool', val: '18,500+' },
              { label: 'Retention Rate', val: '98.4%' },
            ].map((m, i) => (
              <div key={i} className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 text-center">
                <p className="text-2xl font-extrabold text-neutral-900">{m.val}</p>
                <p className="text-[11px] text-neutral-500 font-medium mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LightHeroWrapper>
  );
}

/* L2: 21ST.DEV BENTO GRID HERO (LIGHT EDITION) */
export function HeroLight221stDevBento() {
  return (
    <LightHeroWrapper id="light-hero-2">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            21st.dev Architectural UI Pattern
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            The intelligent operating system for enterprise talent acquisition.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-8 rounded-3xl border border-neutral-200 bg-gradient-to-br from-indigo-50/60 via-white to-neutral-50 p-8 lg:p-12 flex flex-col justify-between shadow-lg relative overflow-hidden"
          >
            <div className="space-y-4">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                POD AUTOMATION
              </span>
              <h3 className="text-3xl font-extrabold text-neutral-900">
                Deploy 5-Person Full-Stack Pods in 10 Days
              </h3>
              <p className="text-sm text-neutral-600 max-w-lg">
                Pre-configured pods complete with Senior Staff Lead, Full-Stack Engineers, DevOps Specialist, and QA Automation Engineer.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-neutral-200/60 flex items-center justify-between text-xs font-semibold text-indigo-900">
              <span>Includes 90-Day Performance Guarantee</span>
              <ArrowUpRight size={18} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-4 rounded-3xl border border-neutral-200 bg-white p-8 flex flex-col justify-between shadow-md"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <h4 className="text-xl font-bold text-neutral-900">45% Arbitrage</h4>
              <p className="text-xs text-neutral-500">
                Significant cost efficiency compared to US/EU recruitment fees and local overheads.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 pt-4">Calculated Live &rarr;</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-4 rounded-3xl border border-neutral-200 bg-white p-8 flex flex-col justify-between shadow-md"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-xl font-bold text-neutral-900">100% Tax Compliant</h4>
              <p className="text-xs text-neutral-500">
                Local entity payroll, EOR, and visa sponsorship handled end-to-end across 38 countries.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 pt-4">Learn More &rarr;</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-8 rounded-3xl border border-neutral-200 bg-neutral-950 text-white p-8 flex items-center justify-between shadow-xl"
          >
            <div>
              <p className="text-xs font-mono text-emerald-400">LIVE CANDIDATE STREAM</p>
              <h4 className="text-2xl font-bold mt-1">2,450+ Verified Tech Leads Ready</h4>
            </div>
            <button className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-neutral-900 hover:bg-neutral-100">
              Browse Directory
            </button>
          </motion.div>
        </div>
      </div>
    </LightHeroWrapper>
  );
}

/* L4: ACETERNITY LAMP EFFECT (LIGHT MODE EDITION) */
export function HeroLight4LampLight() {
  return (
    <LightHeroWrapper id="light-hero-4" bgClass="bg-white">
      <div className="relative rounded-3xl bg-neutral-950 text-white p-10 lg:p-20 overflow-hidden shadow-2xl text-center space-y-8">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-gradient-to-b from-indigo-400/30 via-sky-300/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1 text-xs font-mono font-bold text-indigo-300">
            THE LAMP LIGHT CONE EFFECT
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Illuminating Global Talent Opportunities.
          </h1>
          <p className="text-base text-neutral-300">
            Find the right engineers, leaders, and technical specialists with crystal-clear clarity.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button className="rounded-full bg-white px-8 py-3.5 text-xs font-bold text-neutral-900 hover:bg-neutral-100 shadow-xl">
              Explore Talent Deck &rarr;
            </button>
          </div>
        </div>
      </div>
    </LightHeroWrapper>
  );
}

/* L6: MAGNETIC TYPOGRAPHY & AVATAR STACK */
export function HeroLight6MagneticAvatarStack() {
  return (
    <LightHeroWrapper id="light-hero-6">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#1A7FE8', '#28C76F', '#7367F0', '#FF9F43'].map((bg, i) => (
                <div key={i} style={{ backgroundColor: bg }} className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                  U{i + 1}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-neutral-600">Loved by 1,200+ Engineering Directors</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-900 leading-tight">
            Build your dream tech team without boundaries.
          </h1>

          <p className="text-base text-neutral-600 max-w-xl">
            Access vetted software architects, lead developers, and DevOps engineers ready for immediate integration.
          </p>

          <button className="rounded-2xl bg-neutral-950 px-8 py-4 text-xs font-bold text-white shadow-xl hover:bg-neutral-800">
            Request Custom Shortlist &rarr;
          </button>
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-neutral-900">Instant Role Request</h4>
          <input placeholder="e.g. Lead React Engineer in Dubai" className="w-full rounded-xl bg-neutral-50 p-3.5 text-xs border border-neutral-200 outline-none" />
          <input placeholder="Your work email" className="w-full rounded-xl bg-neutral-50 p-3.5 text-xs border border-neutral-200 outline-none" />
          <button className="w-full rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500">
            Get 3 Candidate Profiles
          </button>
        </div>
      </div>
    </LightHeroWrapper>
  );
}

/* L13: SWISS ARCHITECTURAL GRID HERO */
export function HeroLight13SwissGrid() {
  return (
    <LightHeroWrapper id="light-hero-13">
      <div className="border-t-2 border-neutral-900 pt-8 space-y-8">
        <h1 className="text-5xl sm:text-7xl font-black text-neutral-900 uppercase">
          NEXATALENT IT SOLUTIONS // TECH RECRUITMENT
        </h1>
        <p className="text-sm font-medium text-neutral-700 max-w-md">
          High-density recruitment framework for modern tech organizations.
        </p>
      </div>
    </LightHeroWrapper>
  );
}

/* L14: FULL-WIDTH VIDEO PORTAL HERO */
export function HeroLight14VideoPortal() {
  return (
    <LightHeroWrapper id="light-hero-14">
      <div className="rounded-3xl border border-neutral-200 bg-neutral-950 text-white p-12 text-center space-y-6">
        <h1 className="text-4xl font-extrabold">Watch how NexaTalent IT Solutions powers fast hiring.</h1>
        <div className="mx-auto h-16 w-16 rounded-full bg-white text-neutral-900 flex items-center justify-center cursor-pointer shadow-2xl">
          <Play size={24} fill="currentColor" className="ml-1" />
        </div>
      </div>
    </LightHeroWrapper>
  );
}
