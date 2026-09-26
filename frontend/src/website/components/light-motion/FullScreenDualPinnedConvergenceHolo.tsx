import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ShieldCheck, Zap, Globe2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceHolo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftClampRef = useRef<HTMLDivElement>(null);
  const rightClampRef = useRef<HTMLDivElement>(null);
  const centerHoloRef = useRef<HTMLDivElement>(null);
  const gridOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      // Bilateral clamps converge from full viewport edges (100vw)
      tl.fromTo(
        leftClampRef.current,
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightClampRef.current,
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          centerHoloRef.current,
          { scale: 0.6, opacity: 0, filter: 'blur(10px)' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power2.out' },
          0.2
        )
        .to(
          gridOverlayRef.current,
          { opacity: 0.8, scale: 1.1, ease: 'none' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-900 text-white overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Edge-to-edge holographic mesh background */}
      <div
        ref={gridOverlayRef}
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Atmospheric Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Full-Screen Edge Left Clamp */}
      <div
        ref={leftClampRef}
        className="absolute left-0 top-0 bottom-0 w-full md:w-1/3 bg-slate-900/90 border-r border-blue-500/40 backdrop-blur-xl p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl shadow-blue-500/10"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-mono font-bold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CLAMP 01 · WESTERN ENTERPRISE DEMAND</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Fortune 100 Autonomous Workloads
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            San Francisco, New York, and London engineering headquarters dispatching critical distributed infrastructure and AI mandates.
          </p>
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex justify-between">
              <span className="text-slate-400">Total Open Capital</span>
              <span className="font-bold text-blue-400">$48.5M USD</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex justify-between">
              <span className="text-slate-400">Target Time-to-Deploy</span>
              <span className="font-bold text-emerald-400">14 Business Days</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>LATITUDE: 37.7749° N</span>
          <span className="text-blue-400 font-bold">READY TO CLAMP</span>
        </div>
      </div>

      {/* Full-Screen Edge Right Clamp */}
      <div
        ref={rightClampRef}
        className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 bg-slate-900/90 border-l border-emerald-500/40 backdrop-blur-xl p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl shadow-emerald-500/10"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold mb-6">
            <Globe2 className="w-3.5 h-3.5" />
            <span>CLAMP 02 · GCC COGNITIVE CAPEX</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            India Autonomous GCC Capacity
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Bangalore Outer Ring Road and Hyderabad HITEC City centers delivering elite Principal, Staff, and VP architects.
          </p>
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex justify-between">
              <span className="text-slate-400">Vetted Talent Pool</span>
              <span className="font-bold text-emerald-400">42,800+ Architects</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex justify-between">
              <span className="text-slate-400">Retention Metric</span>
              <span className="font-bold text-blue-400">97.2% Over 24M</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>LATITUDE: 12.9716° N</span>
          <span className="text-emerald-400 font-bold">READY TO CLAMP</span>
        </div>
      </div>

      {/* Central Holographic Convergence Core */}
      <div
        ref={centerHoloRef}
        className="relative z-30 max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/95 border border-blue-400/50 shadow-2xl shadow-blue-500/20 backdrop-blur-2xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/30">
          <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
            <Layers className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold mb-3 border border-blue-400/30">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>BILATERAL CONVERGENCE REACHED</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          NexaTalent Quantum Pod
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Western corporate mandates and Indian GCC squads mechanically lock into an integrated, zero-latency execution vehicle.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-left">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Cost Delta</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">-64.8%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Execution SLA</div>
            <div className="text-xl font-bold text-blue-400 font-mono">100% Guaranteed</div>
          </div>
        </div>

        <button className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <span>Authorize Pod Lock</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
