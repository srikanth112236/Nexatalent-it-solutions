import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Orbit, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceOrbitalRings: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRingRef = useRef<HTMLDivElement>(null);
  const rightRingRef = useRef<HTMLDivElement>(null);
  const centerCoreRef = useRef<HTMLDivElement>(null);

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

      // Dual gyroscopic titanium rings rotate & converge along 3D perspective
      tl.fromTo(
        leftRingRef.current,
        { xPercent: -80, rotateY: 60, opacity: 0 },
        { xPercent: 0, rotateY: 0, opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightRingRef.current,
          { xPercent: 80, rotateY: -60, opacity: 0 },
          { xPercent: 0, rotateY: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          centerCoreRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50/20 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Architectural Polar Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, #cbd5e1 1px, transparent 1px), linear-gradient(to right, #f1f5f9 1px, transparent 1px)',
          backgroundSize: '40px 40px, 80px 80px',
        }}
      />

      {/* Left Ring Wing (Silicon Valley Talent Demand) */}
      <div
        ref={leftRingRef}
        className="absolute left-0 top-0 bottom-0 w-full md:w-[42%] bg-white/90 border-r border-slate-200/80 p-8 md:p-14 flex flex-col justify-between z-20 backdrop-blur-2xl shadow-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-6">
            <Orbit className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span>ORBITAL AXIS ALPHA · US ENTERPRISE CAPEX</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Hyperscale Cloud & AI Mandates
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            US enterprise engineering clusters deploying foundational multi-modal models and petabyte-scale storage engines.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Target Headcount</span>
              <span className="text-slate-900 font-bold">Scoped Per Mandate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Commercial Basis</span>
              <span className="text-blue-600 font-bold">Documented Agreement</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          WESTERN CONVERGENCE FLANK
        </div>
      </div>

      {/* Right Ring Wing (Indian Autonomous GCC Guild) */}
      <div
        ref={rightRingRef}
        className="absolute right-0 top-0 bottom-0 w-full md:w-[42%] bg-white/90 border-l border-slate-200/80 p-8 md:p-14 flex flex-col justify-between z-20 backdrop-blur-2xl shadow-xl text-right"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold mb-6">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>ORBITAL AXIS BETA · GCC EXECUTION CAPACITY</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Bangalore & Hyderabad Pods
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Autonomous product engineering centers with verified zero-churn leadership and complete follow-the-sun code ownership.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Vetted Pipeline</span>
              <span className="text-slate-900 font-bold">4,200 Systems Engineers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Median Deploy Time</span>
              <span className="text-emerald-600 font-bold">11 Business Days</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          EASTERN CONVERGENCE FLANK
        </div>
      </div>

      {/* Central Holographic Clamping Node */}
      <div
        ref={centerCoreRef}
        className="relative z-30 p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl text-center max-w-md mx-4"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">
          AXIAL LOCK ENGAGED
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">
          Sovereign Pod Nexus
        </h3>
        <p className="text-slate-600 text-xs mb-6 leading-relaxed">
          Bilateral gyroscopic rings interlock, initiating secure VPC peering and immediate cross-continental sprint cycles.
        </p>
        <button className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors cursor-pointer shadow-md">
          <span>Inspect Peering Protocol</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
