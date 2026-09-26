import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Diamond, CheckCircle2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDiagonalCurtainConvergence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topSlantRef = useRef<HTMLDivElement>(null);
  const bottomSlantRef = useRef<HTMLDivElement>(null);
  const centerDiamondRef = useRef<HTMLDivElement>(null);

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

      // Diagonal polygon curtain parting on scroll
      tl.to(topSlantRef.current, { yPercent: -100, xPercent: -20, ease: 'power2.inOut' }, 0)
        .to(bottomSlantRef.current, { yPercent: 100, xPercent: 20, ease: 'power2.inOut' }, 0)
        .fromTo(
          centerDiamondRef.current,
          { scale: 0.6, rotate: 45, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.5)' },
          0.2
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
      {/* Unveiled Diamond Center Pipeline */}
      <div
        ref={centerDiamondRef}
        className="relative z-10 w-full max-w-3xl p-8 lg:p-12 rounded-3xl bg-slate-800/90 border border-indigo-500/40 shadow-2xl backdrop-blur-2xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center">
          <Diamond className="w-8 h-8 text-indigo-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-400 font-mono text-xs font-bold mb-4">
          <Diamond className="w-3.5 h-3.5" />
          <span>DIAGONAL GEOMETRIC CURTAIN CONVERGENCE</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          The NexaTalent Diamond Standard
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Both diagonal planes part to reveal the quintessential sovereign talent standard: zero equity compromise, zero IP vulnerability, 100% execution confidence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Cryptographically Verified Code Telemetry</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Full Sovereign Hardware Isolation Enclaves</span>
          </div>
        </div>

        <button className="mt-8 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-lg shadow-indigo-600/30 transition-all cursor-pointer">
          <span>Explore Sovereign Mandates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Slanted Diagonal Curtain */}
      <div
        ref={topSlantRef}
        className="absolute top-0 left-0 right-0 h-[60%] bg-slate-950 border-b-2 border-indigo-500/40 p-12 flex flex-col justify-start z-20 shadow-2xl"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}
      >
        <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
          DIAGONAL CURTAIN WING ALPHA
        </span>
        <div className="text-2xl md:text-4xl font-black text-white mt-2">
          Geometric Precision Parting
        </div>
      </div>

      {/* Bottom Slanted Diagonal Curtain */}
      <div
        ref={bottomSlantRef}
        className="absolute bottom-0 left-0 right-0 h-[60%] bg-slate-950 border-t-2 border-indigo-500/40 p-12 flex flex-col justify-end z-20 shadow-2xl text-right"
        style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="text-2xl md:text-4xl font-black text-white mb-2">
          Diamond Architectural Seal
        </div>
        <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
          DIAGONAL CURTAIN WING BETA
        </span>
      </div>
    </section>
  );
};
