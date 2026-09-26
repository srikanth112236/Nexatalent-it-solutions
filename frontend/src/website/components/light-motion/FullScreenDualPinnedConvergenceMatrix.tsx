import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Network, ArrowRightLeft, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceMatrix: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftMatrixRef = useRef<HTMLDivElement>(null);
  const rightMatrixRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftMatrixRef.current,
        { xPercent: -50, opacity: 0.3 },
        { xPercent: 0, opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightMatrixRef.current,
          { xPercent: 50, opacity: 0.3 },
          { xPercent: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          bridgeRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: 'power2.out' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Light Precision Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Edge-to-Edge Grid Columns */}
      <div className="relative z-10 w-full px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side: US Demand Matrix */}
        <div
          ref={leftMatrixRef}
          className="p-8 lg:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 text-blue-600 font-mono text-xs font-bold mb-4">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>US TECH ARCHITECTURE SPECIFICATIONS</span>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-slate-900 mb-4">
            High-Complexity Infrastructure
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Real-time streaming ingestion, distributed consensus algorithms, and multi-tenant AI training clusters.
          </p>
          <div className="space-y-2.5 font-mono text-xs text-slate-700">
            <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Core Systems</span>
              <span className="text-slate-900 font-bold">Rust / C++20 / Go</span>
            </div>
            <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Latency Threshold</span>
              <span className="text-blue-600 font-bold">&lt; 150 Microseconds</span>
            </div>
          </div>
        </div>

        {/* Right Side: India Supply Matrix */}
        <div
          ref={rightMatrixRef}
          className="p-8 lg:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold mb-4">
            <Network className="w-4 h-4 text-emerald-600" />
            <span>INDIA GCC TALENT CAPACITY ENGINE</span>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-slate-900 mb-4">
            Senior Engineering Leadership
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            12+ years tier-1 experience scaling multi-region cloud services across Bangalore & Hyderabad hubs.
          </p>
          <div className="space-y-2.5 font-mono text-xs text-slate-700">
            <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Available Principal Staff</span>
              <span className="text-emerald-600 font-bold">142 Actively Vetted</span>
            </div>
            <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Average Onboarding Time</span>
              <span className="text-slate-900 font-bold">9 Calendar Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Quantum Hiring Bridge */}
      <div
        ref={bridgeRef}
        className="relative z-20 my-8 mx-auto px-8 py-3.5 rounded-full bg-slate-900 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-3 border border-slate-700"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>CONVERGED QUANTUM MATCH RATIO: 99.8%</span>
        <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
      </div>
    </section>
  );
};
