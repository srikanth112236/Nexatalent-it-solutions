import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Globe2, ArrowRight, Activity, Orbit } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceHolo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftClampRef = useRef<HTMLDivElement>(null);
  const rightClampRef = useRef<HTMLDivElement>(null);
  const centerHoloRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

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

      // Bilateral frosted calipers glide smoothly from full screen boundaries
      tl.fromTo(
        leftClampRef.current,
        { xPercent: -100, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightClampRef.current,
          { xPercent: 100, opacity: 0 },
          { xPercent: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          centerHoloRef.current,
          { scale: 0.7, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, ease: 'power2.out' },
          0.2
        )
        .to(ringRef.current, { rotate: 180, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Precision Blueprint Grid & Radial Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '32px 32px, 64px 64px, 64px 64px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-100/60 via-indigo-50/40 to-emerald-100/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Full-Screen Left Frosted Caliper Wing */}
      <div
        ref={leftClampRef}
        className="absolute left-0 top-0 bottom-0 w-full md:w-[38%] bg-white/85 border-r border-slate-200/80 backdrop-blur-2xl p-8 md:p-14 flex flex-col justify-between z-20 shadow-2xl shadow-blue-500/5"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-bold mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>CALIPER 01 · US STRATEGIC WORKLOADS</span>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Silicon Valley Platform Mandates
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            High-autonomy core architecture positions across AI foundation models, distributed databases, and high-frequency infrastructure.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500">Active Capital Commitment</span>
              <span className="font-extrabold text-blue-600 text-sm">$48.5M USD</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500">Median Fill Time Target</span>
              <span className="font-extrabold text-emerald-600 text-sm">14 Business Days</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>ORIGIN: SF · NYC · LONDON</span>
          <span className="text-blue-600 font-bold">READY TO LOCK</span>
        </div>
      </div>

      {/* Full-Screen Right Frosted Caliper Wing */}
      <div
        ref={rightClampRef}
        className="absolute right-0 top-0 bottom-0 w-full md:w-[38%] bg-white/85 border-l border-slate-200/80 backdrop-blur-2xl p-8 md:p-14 flex flex-col justify-between z-20 shadow-2xl shadow-emerald-500/5 text-right"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-mono font-bold mb-6">
            <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>CALIPER 02 · INDIA GCC GUILD</span>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Autonomous Bangalore & Hyderabad Hubs
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            Pre-evaluated engineering directors, Staff architects, and quantitative squads calibrated for day-one operational autonomy.
          </p>

          <div className="space-y-3 font-mono text-xs text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500">Pre-Vetted Talent Pool</span>
              <span className="font-extrabold text-emerald-600 text-sm">42,800+ Engineers</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500">2-Year Retention Benchmark</span>
              <span className="font-extrabold text-blue-600 text-sm">97.2% Certified</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="text-emerald-600 font-bold">READY TO LOCK</span>
          <span>LATITUDE: 12.9716° N</span>
        </div>
      </div>

      {/* Central Holographic Convergence Node */}
      <div
        ref={centerHoloRef}
        className="relative z-30 max-w-lg mx-auto p-10 rounded-3xl bg-white/95 border border-slate-200/90 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl text-center"
      >
        <div
          ref={ringRef}
          className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-xl shadow-blue-500/20"
        >
          <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
            <Orbit className="w-10 h-10 text-blue-600 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold mb-3 border border-blue-200">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span>BILATERAL CONVERGENCE ACTIVE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          Quantum Pod Launchpad
        </h2>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
          Western mandates and verified Indian talent squads mechanically lock into an integrated, zero-latency execution vehicle.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Cost Delta</div>
            <div className="text-xl font-bold text-emerald-600 font-mono">-64.8%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Execution SLA</div>
            <div className="text-xl font-bold text-blue-600 font-mono">100% Guaranteed</div>
          </div>
        </div>

        <button className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <span>Authorize Deployment Lock</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
