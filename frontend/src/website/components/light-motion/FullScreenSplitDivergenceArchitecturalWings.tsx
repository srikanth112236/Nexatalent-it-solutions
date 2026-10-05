import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Unlock, ArrowRight, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitDivergenceArchitecturalWings: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftWingRef = useRef<HTMLDivElement>(null);
  const rightWingRef = useRef<HTMLDivElement>(null);
  const innerMatrixRef = useRef<HTMLDivElement>(null);

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
        leftWingRef.current,
        { xPercent: 0 },
        { xPercent: -100, ease: 'power2.inOut' },
        0
      )
        .fromTo(
          rightWingRef.current,
          { xPercent: 0 },
          { xPercent: 100, ease: 'power2.inOut' },
          0
        )
        .fromTo(
          innerMatrixRef.current,
          { scale: 0.85, opacity: 0.3 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.15
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
      {/* Unveiled Inner Matrix */}
      <div
        ref={innerMatrixRef}
        className="relative z-10 w-full max-w-5xl mx-auto p-8 lg:p-14 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
          <Layers className="w-8 h-8 text-blue-600" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-4">
          <Unlock className="w-3.5 h-3.5 text-blue-600" />
          <span>PATTERN 20 · ARCHITECTURAL WING DIVERGENCE</span>
        </div>

        <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
          Sovereign Talent Pipeline Unveiled
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Both architectural wings glide outward toward the screen boundaries, revealing pre-vetted senior candidates across core systems engineering.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="text-xs font-mono text-blue-600 font-bold uppercase">Candidate Track 01</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">AI & Platform Architecture</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">Staff-level architects assessed on distributed systems design and production ownership.</p>
            <div className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Structured Technical Screening</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="text-xs font-mono text-indigo-600 font-bold uppercase">Candidate Track 02</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">Systems & Infrastructure</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">Concurrency, networking fundamentals and performance-aware engineering reviews.</p>
            <div className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Stage Evaluation</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="text-xs font-mono text-teal-600 font-bold uppercase">Candidate Track 03</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">Engineering Leadership</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">Directors and site leaders assessed on delivery record and team-building depth.</p>
            <div className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Reference-Checked Profiles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diverging Left Architectural Wing */}
      <div
        ref={leftWingRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-white/95 border-r border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <span className="text-xs font-mono text-blue-600 font-bold uppercase">WING ALPHA</span>
        <div className="text-2xl md:text-4xl font-black text-slate-900">
          Executive Screening Facet
        </div>
        <div className="text-xs font-mono text-slate-400">
          DIVERGING TO LEFT SCREEN EDGE
        </div>
      </div>

      {/* Diverging Right Architectural Wing */}
      <div
        ref={rightWingRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/95 border-l border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl text-right"
      >
        <span className="text-xs font-mono text-emerald-600 font-bold uppercase">WING BETA</span>
        <div className="text-2xl md:text-4xl font-black text-slate-900">
          Security Quarantine Facet
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center justify-end gap-1.5">
          <span>DIVERGING TO RIGHT SCREEN EDGE</span>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </div>
      </div>
    </section>
  );
};
