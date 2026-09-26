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

      // Pattern 20: Central split covers start together and diverge outward
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
          { scale: 0.85, opacity: 0.5 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.1
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
      {/* Pattern 20 Unveiled Core: Confidential Executive Talent Database */}
      <div
        ref={coreRef}
        className="relative z-10 w-full max-w-4xl mx-auto p-8 lg:p-12 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
          <Database className="w-8 h-8 text-blue-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold mb-4">
          <Unlock className="w-3.5 h-3.5" />
          <span>PATTERN 20 · VAULT DIVERGENCE UNVEILED</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          Unrestricted Executive Talent Vault
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Both outer quarantine shields have split and diverged outward, granting accredited enterprise clients direct access to our tier-1 engineering leadership pool.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-xs font-mono text-slate-400">Total Cleared Leads</div>
            <div className="text-2xl font-black text-white mt-1">420 Principals</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-xs font-mono text-slate-400">Avg Retention Record</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">98.4% Over 3Y</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-xs font-mono text-slate-400">Escrow Security</div>
            <div className="text-2xl font-black text-blue-400 mt-1">100% Guaranteed</div>
          </div>
        </div>
      </div>

      {/* Pattern 20: Diverging Left Shutter */}
      <div
        ref={leftDoorRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-slate-950 border-r-2 border-blue-500/50 p-12 flex flex-col justify-between z-20 shadow-2xl"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold">
          <Lock className="w-4 h-4" />
          <span>PATTERN 20 · LEFT SHIELD</span>
        </div>
        <div className="text-xl md:text-3xl font-black text-white tracking-tight">
          Sovereign Clearance Guard
        </div>
        <div className="text-xs font-mono text-slate-500">
          DIVERGING TO LEFT EDGE ON SCROLL
        </div>
      </div>

      {/* Pattern 20: Diverging Right Shutter */}
      <div
        ref={rightDoorRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-slate-950 border-l-2 border-emerald-500/50 p-12 flex flex-col justify-between z-20 shadow-2xl text-right"
      >
        <div className="flex items-center justify-end gap-2 text-xs font-mono text-emerald-400 font-bold">
          <span>PATTERN 20 · RIGHT SHIELD</span>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xl md:text-3xl font-black text-white tracking-tight">
          Cryptographic Non-Compete
        </div>
        <div className="text-xs font-mono text-slate-500">
          DIVERGING TO RIGHT EDGE ON SCROLL
        </div>
      </div>
    </section>
  );
};
