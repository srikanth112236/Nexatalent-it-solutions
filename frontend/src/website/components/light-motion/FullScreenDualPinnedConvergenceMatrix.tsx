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
        { x: '-80%', opacity: 0.3 },
        { x: '0%', opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightMatrixRef.current,
          { x: '80%', opacity: 0.3 },
          { x: '0%', opacity: 1, ease: 'power2.out' },
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
      className="relative w-screen min-h-screen bg-slate-900 text-white overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      <div className="absolute inset-0 bg-radial from-blue-900/30 to-slate-950 pointer-events-none" />

      {/* Edge-to-Edge Grid Columns */}
      <div className="relative z-10 w-full px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side: US Demand Matrix */}
        <div
          ref={leftMatrixRef}
          className="p-8 lg:p-12 rounded-3xl bg-slate-800/90 border border-blue-500/30 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 text-blue-400 font-mono text-xs font-bold mb-4">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>US TECH ARCHITECTURE SPECIFICATIONS</span>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-white mb-4">
            High-Complexity Infrastructure
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Real-time streaming ingestion, distributed consensus algorithms, and multi-tenant AI training clusters.
          </p>
          <div className="space-y-2.5 font-mono text-xs text-slate-300">
            <div className="flex justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700">
              <span className="text-slate-400">Core Language</span>
              <span className="text-white font-bold">Rust / C++20 / Go</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700">
              <span className="text-slate-400">Latency Threshold</span>
              <span className="text-blue-400 font-bold">&lt; 150 Microseconds</span>
            </div>
          </div>
        </div>

        {/* Right Side: India Supply Matrix */}
        <div
          ref={rightMatrixRef}
          className="p-8 lg:p-12 rounded-3xl bg-slate-800/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs font-bold mb-4">
            <Network className="w-4 h-4 text-emerald-400" />
            <span>INDIA GCC TALENT CAPACITY ENGINE</span>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-white mb-4">
            Senior Engineering Leadership
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            12+ years tier-1 experience scaling multi-region cloud services across Bangalore & Hyderabad hubs.
          </p>
          <div className="space-y-2.5 font-mono text-xs text-slate-300">
            <div className="flex justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700">
              <span className="text-slate-400">Available Principal Staff</span>
              <span className="text-emerald-400 font-bold">142 Actively Vetted</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700">
              <span className="text-slate-400">Average Onboarding Time</span>
              <span className="text-white font-bold">9 Calendar Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Quantum Hiring Bridge */}
      <div
        ref={bridgeRef}
        className="relative z-20 my-8 mx-auto px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-3"
      >
        <Sparkles className="w-4 h-4 text-yellow-300" />
        <span>CONVERGED QUANTUM MATCH RATIO: 99.8%</span>
        <ArrowRightLeft className="w-4 h-4 text-white" />
      </div>
    </section>
  );
};
