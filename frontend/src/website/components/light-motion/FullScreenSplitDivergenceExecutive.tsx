import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, ShieldCheck, Lock, Unlock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitDivergenceExecutive: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

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

      tl.fromTo(
        leftDoorRef.current,
        { xPercent: 0 },
        { xPercent: -100, ease: 'power2.inOut' },
        0
      )
        .fromTo(
          rightDoorRef.current,
          { xPercent: 0 },
          { xPercent: 100, ease: 'power2.inOut' },
          0
        )
        .fromTo(
          coreRef.current,
          { scale: 0.88, opacity: 0.4 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.1
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Pattern 20 Unveiled Core: Confidential Executive Talent Database */}
      <div
        ref={coreRef}
        className="relative z-10 w-full max-w-4xl mx-auto p-8 lg:p-12 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
          <Database className="w-8 h-8 text-blue-600" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-4">
          <Unlock className="w-3.5 h-3.5 text-emerald-600" />
          <span>PATTERN 20 · VAULT DIVERGENCE UNVEILED</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Executive Talent Vault Unlocked
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Both outer quarantine shields have split and diverged outward, granting accredited enterprise clients direct access to our tier-1 engineering leadership pool.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="text-xs font-mono text-slate-500">Total Cleared Leads</div>
            <div className="text-2xl font-black text-slate-900 mt-1">420 Principals</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="text-xs font-mono text-slate-500">Avg Retention Record</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">98.4% Over 3Y</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="text-xs font-mono text-slate-500">Escrow Security</div>
            <div className="text-2xl font-black text-blue-600 mt-1">100% Guaranteed</div>
          </div>
        </div>
      </div>

      {/* Pattern 20: Diverging Left Satin Shutter */}
      <div
        ref={leftDoorRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-white/95 border-r border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold">
          <Lock className="w-4 h-4" />
          <span>PATTERN 20 · LEFT SHIELD</span>
        </div>
        <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
          Sovereign Clearance Guard
        </div>
        <div className="text-xs font-mono text-slate-400">
          DIVERGING TO LEFT EDGE ON SCROLL
        </div>
      </div>

      {/* Pattern 20: Diverging Right Satin Shutter */}
      <div
        ref={rightDoorRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/95 border-l border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl text-right"
      >
        <div className="flex items-center justify-end gap-2 text-xs font-mono text-emerald-600 font-bold">
          <span>PATTERN 20 · RIGHT SHIELD</span>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
          Cryptographic Non-Compete
        </div>
        <div className="text-xs font-mono text-slate-400">
          DIVERGING TO RIGHT EDGE ON SCROLL
        </div>
      </div>
    </section>
  );
};
