import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const DualPinnedConvergenceShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedVertical, setSelectedVertical] = useState('FinTech & Low-Latency');
  const [podSize, setPodSize] = useState('20–50 Engineers');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.85, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=1200',
            pin: true,
            scrub: 0.8,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="max-w-4xl mx-auto px-6 w-full">
        
        {/* Converging Pinned Launchpad Card */}
        <div
          ref={cardRef}
          className="rounded-3xl p-8 md:p-12 bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/15 text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <Rocket className="w-3.5 h-3.5 text-blue-600" />
            <span>Dual Pinned Convergence • Launch Your GCC Search Pod</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Initiate Your Calibrated Executive Search Pod
          </h2>

          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select your technical discipline and target headcount to initiate an executive consultation with our Practice Managing Partners.
          </p>

          {/* Interactive Configurator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-xl mx-auto pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Technical Practice
              </label>
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="FinTech & Low-Latency">FinTech & Ultra-Low Latency</option>
                <option value="AI & Machine Learning">Generative AI & GPU Systems</option>
                <option value="Cloud & Distributed Systems">Cloud-Native & Distributed Mesh</option>
                <option value="Turnkey GCC Scale">Turnkey GCC 75-Day Incubation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Target Pod Size
              </label>
              <select
                value={podSize}
                onChange={(e) => setPodSize(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="1–5 Engineers">1–5 Executive Specialists</option>
                <option value="5–20 Engineers">5–20 Core Engineering Squad</option>
                <option value="20–50 Engineers">20–50 Capability Center</option>
                <option value="50–120+ Engineers">50–120+ Turnkey GCC Center</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            {submitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mandate Received! A Practice Partner will contact you within 2 business hours.</span>
              </div>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Launch Mandate Discovery Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>72-Hour Contractual SLA</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>180-Day Comprehensive Warranty</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SOC2 Type II Protected</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
