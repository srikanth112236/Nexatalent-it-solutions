import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Building2, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitConvergenceHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const unifiedBadgeRef = useRef<HTMLDivElement>(null);

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
        leftSideRef.current,
        { xPercent: -50 },
        { xPercent: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightSideRef.current,
          { xPercent: 50 },
          { xPercent: 0, ease: 'power2.out' },
          0
        )
        .fromTo(
          unifiedBadgeRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.7)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-100 text-slate-900 overflow-hidden flex items-stretch m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Pattern 19: Left Screen Split (Western Enterprise) */}
      <div
        ref={leftSideRef}
        className="w-1/2 min-h-screen p-8 md:p-16 lg:p-24 flex flex-col justify-between bg-white border-r border-slate-300 z-10 shadow-xl"
      >
        <div className="flex items-center gap-2 text-blue-700 font-mono text-xs font-bold">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>WESTERN HEADQUARTERS · PATTERN 19 CONVERGENCE</span>
        </div>

        <div className="max-w-lg">
          <span className="text-blue-600 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
            Demand Vector
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Global Tech Leadership
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            US & European organizations requiring hardened engineering guilds without Silicon Valley compensation premiums.
          </p>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-2">
            <div>Median Bay Area Principal: <span className="text-slate-900 font-bold">$420K TC</span></div>
            <div>Time to Fill in SF: <span className="text-amber-600 font-bold">110 Days</span></div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          WESTERN CONVERGENCE FLANK
        </div>
      </div>

      {/* Pattern 19: Right Screen Split (India GCC Center) */}
      <div
        ref={rightSideRef}
        className="w-1/2 min-h-screen p-8 md:p-16 lg:p-24 flex flex-col justify-between bg-slate-50 border-l border-slate-300 z-10 text-right shadow-xl"
      >
        <div className="flex items-center justify-end gap-2 text-emerald-700 font-mono text-xs font-bold">
          <span>INDIA TALENT CORE · FULL 100VW CONVERGENCE</span>
          <Globe className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="max-w-lg ml-auto">
          <span className="text-emerald-600 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
            Supply Vector
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Autonomous GCC Squads
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Pre-vetted engineering directors and Staff architects ready to execute high-impact roadmaps on Day 1.
          </p>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 font-mono text-xs text-slate-700 space-y-2 text-left">
            <div>NexaTalent IT Solutions Calibrated Comp: <span className="text-emerald-600 font-bold">₹1.25 Cr ($150K)</span></div>
            <div>Time to Deploy: <span className="text-blue-600 font-bold">14 Days</span></div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          EASTERN CONVERGENCE FLANK
        </div>
      </div>

      {/* Center Unified Seam Lock Badge */}
      <div
        ref={unifiedBadgeRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-slate-700"
      >
        <Zap className="w-4 h-4 text-amber-400 fill-current" />
        <span>PATTERN 19: UNIFIED OPERATION</span>
        <ArrowRight className="w-4 h-4 text-emerald-400" />
      </div>
    </section>
  );
};
