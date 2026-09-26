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
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftPrismRef.current,
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightPrismRef.current,
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          lensRef.current,
          { scale: 0.2, rotate: 180, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, ease: 'elastic.out(1, 0.75)' },
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
      {/* Background Refractive Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-950 pointer-events-none" />

      {/* Left Chromatic Refraction Wing */}
      <div
        ref={leftPrismRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-gradient-to-r from-blue-600/20 via-indigo-600/10 to-transparent border-r border-blue-500/20 backdrop-blur-md"
      >
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs font-bold mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>PRISM GATE 01 · HEURISTIC SPECTRUM</span>
          </div>
          <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Algorithmic Candidate Refraction
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Multi-spectral evaluation breaking candidate problem-solving into raw AST structure, system design depth, and cognitive adaptability.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Depth Index: 98.4</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Speed: 1.2s Eval</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Chromatic Refraction Wing */}
      <div
        ref={rightPrismRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 p-12 lg:p-20 flex flex-col justify-center items-end bg-gradient-to-l from-emerald-600/20 via-teal-600/10 to-transparent border-l border-emerald-500/20 backdrop-blur-md text-right"
      >
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold mb-4">
            <Filter className="w-3.5 h-3.5" />
            <span>PRISM GATE 02 · CULTURAL ALIGNMENT</span>
          </div>
          <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Executive Cultural Transmittance
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Filtering for proactive ownership, high-autonomy decision velocity, and cross-border English fluency.
          </p>
          <div className="flex items-center justify-end gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Autonomy: Tier-1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Fit: 99.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Chromatic Talent Lens */}
      <div
        ref={lensRef}
        className="relative z-30 p-10 rounded-full bg-slate-900/90 border-2 border-white/40 shadow-[0_0_80px_rgba(59,130,246,0.4)] backdrop-blur-2xl text-center flex flex-col items-center justify-center w-84 h-84"
      >
        <Eye className="w-12 h-12 text-blue-400 mb-3 animate-pulse" />
        <div className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest mb-1">
          CHROMATIC FOCUS
        </div>
        <div className="text-2xl font-black text-white tracking-tight mb-2">
          Top 0.5% Talent
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clearance Confirmed</span>
        </div>
      </div>
    </section>
  );
};
