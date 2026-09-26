import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceIrisAperture: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftBladeRef = useRef<HTMLDivElement>(null);
  const rightBladeRef = useRef<HTMLDivElement>(null);
  const interviewTerminalRef = useRef<HTMLDivElement>(null);

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
        leftBladeRef.current,
        { xPercent: -100, rotate: -25 },
        { xPercent: 0, rotate: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightBladeRef.current,
          { xPercent: 100, rotate: 25 },
          { xPercent: 0, rotate: 0, ease: 'power2.out' },
          0
        )
        .fromTo(
          interviewTerminalRef.current,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          0.3
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
      {/* Left Mechanical Iris Blade */}
      <div
        ref={leftBladeRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-white/95 border-r border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-bold">
          <Eye className="w-4 h-4 text-blue-600" />
          <span>IRIS APERTURE BLADE 01 · HEURISTIC GATE</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Synthetic Behavioral Screening
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Multi-agent evaluation challenging candidates through live system outage scenarios, architectural trade-offs, and executive conflict resolution.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700">
            Pass Rate: Top 0.8% of 24,000 Screened
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          APERTURE CLAMPING STAGE 01
        </div>
      </div>

      {/* Right Mechanical Iris Blade */}
      <div
        ref={rightBladeRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/95 border-l border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl text-right"
      >
        <div className="flex items-center justify-end gap-2 text-xs font-mono text-emerald-700 font-bold">
          <span>IRIS APERTURE BLADE 02 · INTEGRITY GATE</span>
          <Lock className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="max-w-md ml-auto">
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Zero-Leak Provenance Audit
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Comprehensive legal non-compete reviews and cryptographic identity confirmation ensuring complete corporate confidentiality.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 text-left">
            Clearance Level: Tier-1 Institutional Escrow
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          APERTURE CLAMPING STAGE 02
        </div>
      </div>

      {/* Central Terminal Core */}
      <div
        ref={interviewTerminalRef}
        className="relative z-30 p-8 md:p-10 rounded-3xl bg-slate-900 text-white shadow-2xl max-w-md mx-4 text-center border-2 border-slate-700"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div className="text-xs font-mono text-blue-400 font-bold uppercase mb-1">
          TERMINAL LOCKED & CLEARED
        </div>
        <h3 className="text-xl font-bold mb-2">Executive Candidate Cleared</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Iris blades locked securely. Candidate profile verified across code, design, and governance dimensions.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <CheckCircle2 className="w-4 h-4" />
          <span>Ready for Direct Client Interview</span>
        </div>
      </div>
    </section>
  );
};
