import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Compass, Eye, Filter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergencePrism: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPrismRef = useRef<HTMLDivElement>(null);
  const rightPrismRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

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
        leftPrismRef.current,
        { xPercent: -100, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightPrismRef.current,
          { xPercent: 100, opacity: 0 },
          { xPercent: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          lensRef.current,
          { scale: 0.3, rotate: 180, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, ease: 'elastic.out(1, 0.75)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Soft Ambient Chromatic Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-200/40 via-purple-200/30 to-emerald-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Chromatic Refraction Wing */}
      <div
        ref={leftPrismRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-white/80 border-r border-slate-200/80 backdrop-blur-2xl shadow-xl"
      >
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold mb-4 border border-blue-200">
            <Compass className="w-3.5 h-3.5" />
            <span>PRISM GATE 01 · HEURISTIC SPECTRUM</span>
          </div>
          <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Algorithmic Refraction
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Multi-spectral evaluation breaking candidate problem-solving into raw AST structure, system design depth, and cognitive adaptability.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Depth Index: 98.4</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Speed: 1.2s Eval</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Chromatic Refraction Wing */}
      <div
        ref={rightPrismRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 p-12 lg:p-20 flex flex-col justify-center items-end bg-white/80 border-l border-slate-200/80 backdrop-blur-2xl shadow-xl text-right"
      >
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold mb-4 border border-emerald-200">
            <Filter className="w-3.5 h-3.5" />
            <span>PRISM GATE 02 · CULTURAL CALIBRATION</span>
          </div>
          <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Leadership Transmittance
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Filtering for proactive ownership, high-autonomy decision velocity, and cross-border English fluency.
          </p>
          <div className="flex items-center justify-end gap-4 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Autonomy: Tier-1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>Fit: 99.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Chromatic Talent Lens */}
      <div
        ref={lensRef}
        className="relative z-30 p-10 rounded-full bg-white border border-slate-200 shadow-2xl shadow-blue-500/20 backdrop-blur-2xl text-center flex flex-col items-center justify-center w-84 h-84"
      >
        <Eye className="w-12 h-12 text-blue-600 mb-3 animate-pulse" />
        <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">
          CHROMATIC FOCUS
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Top 0.5% Talent
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clearance Confirmed</span>
        </div>
      </div>
    </section>
  );
};
