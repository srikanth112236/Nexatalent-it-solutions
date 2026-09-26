import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutGrid, CheckCircle2, Award, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenHorizontalSplitCurtain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      tl.to(leftCurtainRef.current, { xPercent: -100, ease: 'power2.inOut' }, 0)
        .to(rightCurtainRef.current, { xPercent: 100, ease: 'power2.inOut' }, 0)
        .fromTo(
          contentRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.2
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
      {/* Unveiled Full-Screen Background Content: Executive Cockpit */}
      <div
        ref={contentRef}
        className="relative z-10 w-full px-8 md:px-20 py-16 flex flex-col items-center justify-center text-center"
      >
        <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
          <LayoutGrid className="w-8 h-8 text-blue-600" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>PATTERN 17 · HORIZONTAL SPLIT CURTAIN UNVEILED</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Sovereign Executive Cockpit
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          The full-width architectural curtains have parted, providing direct interactive telemetry into our 400,000+ candidate live assessment ledger.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>STAGE 04 CLEARED</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mb-1">AI Research Directors</div>
            <div className="text-xs text-slate-600 leading-relaxed">
              82 Candidates cleared deep algorithmic and architectural vetting.
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>ESCROW SEALED</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mb-1">Founding GCC Managing Directors</div>
            <div className="text-xs text-slate-600 leading-relaxed">
              24 Executives placed with 100% 2-year retention records.
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-mono font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>ZERO CONFLICT</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mb-1">Staff Distributed Storage</div>
            <div className="text-xs text-slate-600 leading-relaxed">
              114 Engineers with verified non-compete quarantine passes.
            </div>
          </div>
        </div>
      </div>

      {/* Pattern 17: Left Architectural Curtain */}
      <div
        ref={leftCurtainRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-white border-r border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <span className="font-mono text-xs text-blue-600 font-extrabold uppercase tracking-widest">
          PATTERN 17 · LEFT CURTAIN WING
        </span>
        <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
          NexaTalent Infrastructure
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>SLIDING LEFT ON SCROLL</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180 text-blue-600" />
        </div>
      </div>

      {/* Pattern 17: Right Architectural Curtain */}
      <div
        ref={rightCurtainRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-white border-l border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl text-right"
      >
        <span className="font-mono text-xs text-emerald-600 font-extrabold uppercase tracking-widest">
          PATTERN 17 · RIGHT CURTAIN WING
        </span>
        <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
          Enterprise Search Vault
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center justify-end gap-2">
          <span>SLIDING RIGHT ON SCROLL</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>
    </section>
  );
};
