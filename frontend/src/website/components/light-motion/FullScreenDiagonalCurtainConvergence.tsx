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
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Unveiled Diamond Center Pipeline */}
      <div
        ref={centerDiamondRef}
        className="relative z-10 w-full max-w-3xl p-10 lg:p-14 rounded-3xl bg-white border border-indigo-200/80 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Diamond className="w-8 h-8 text-indigo-600" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold mb-4">
          <Diamond className="w-3.5 h-3.5" />
          <span>DIAGONAL GEOMETRIC CURTAIN CONVERGENCE</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          The NexaTalent IT Solutions Diamond Standard
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Both diagonal planes part to reveal the quintessential sovereign talent standard: zero equity compromise, zero IP vulnerability, 100% execution confidence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Cryptographically Verified Code Telemetry</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Full Sovereign Hardware Isolation Enclaves</span>
          </div>
        </div>

        <button className="mt-8 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-xl shadow-indigo-600/20 transition-all cursor-pointer">
          <span>Explore Sovereign Mandates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Slanted Diagonal Ivory Curtain */}
      <div
        ref={topSlantRef}
        className="absolute top-0 left-0 right-0 h-[60%] bg-white border-b border-slate-300 p-12 flex flex-col justify-start z-20 shadow-2xl backdrop-blur-xl"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}
      >
        <span className="text-xs font-mono text-indigo-600 font-extrabold uppercase tracking-widest">
          DIAGONAL CURTAIN WING ALPHA
        </span>
        <div className="text-2xl md:text-4xl font-black text-slate-900 mt-2">
          Geometric Precision Parting
        </div>
      </div>

      {/* Bottom Slanted Diagonal Ivory Curtain */}
      <div
        ref={bottomSlantRef}
        className="absolute bottom-0 left-0 right-0 h-[60%] bg-white border-t border-slate-300 p-12 flex flex-col justify-end z-20 shadow-2xl backdrop-blur-xl text-right"
        style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="text-2xl md:text-4xl font-black text-slate-900 mb-2">
          Diamond Architectural Seal
        </div>
        <span className="text-xs font-mono text-indigo-600 font-extrabold uppercase tracking-widest">
          DIAGONAL CURTAIN WING BETA
        </span>
      </div>
    </section>
  );
};
