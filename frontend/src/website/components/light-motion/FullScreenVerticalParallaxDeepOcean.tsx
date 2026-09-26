import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Radio, Search, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalParallaxDeepOcean: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const floatCard1Ref = useRef<HTMLDivElement>(null);
  const floatCard2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ring1Ref.current, {
        scale: 1.4,
        opacity: 0.6,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(ring2Ref.current, {
        scale: 1.8,
        opacity: 0.4,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.to(floatCard1Ref.current, {
        y: -180,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(floatCard2Ref.current, {
        y: -320,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[130vh] bg-gradient-to-b from-teal-50/40 via-white to-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center items-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Light Sonar Concentric Rings */}
      <div
        ref={ring1Ref}
        className="absolute w-[600px] h-[600px] rounded-full border border-teal-300/40 pointer-events-none"
      />
      <div
        ref={ring2Ref}
        className="absolute w-[950px] h-[950px] rounded-full border border-cyan-200/50 pointer-events-none"
      />

      {/* Center Deep Scanner Core */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-mono text-xs font-bold mb-4">
          <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span>DEEP TALENT MARKET SCANNER · BIOLUMINESCENT SONAR</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Sub-Surface Passive <span className="text-teal-600">Headhunting</span>
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          Uncovering unlisted tier-1 architects and elite engineering directors who never enter public job markets.
        </p>
      </div>

      {/* Floating Pods at Different Parallax Depths */}
      <div className="relative z-20 w-full px-8 md:px-24 flex flex-wrap justify-around items-center gap-8 mt-12">
        <div
          ref={floatCard1Ref}
          className="p-8 rounded-3xl bg-white border border-teal-200/80 shadow-2xl shadow-teal-500/5 backdrop-blur-xl max-w-sm"
        >
          <div className="flex items-center gap-2 text-teal-700 font-mono text-xs font-bold mb-3">
            <Search className="w-4 h-4 text-teal-600" />
            <span>DEPTH: 3,200M · PASSIVE DISCOVERY</span>
          </div>
          <div className="font-extrabold text-slate-900 text-xl mb-2">Stealth VP Engineering</div>
          <div className="text-xs text-slate-600 mb-4 leading-relaxed">
            Currently leading 350-engineer platform team at high-growth SaaS decacorn.
          </div>
          <div className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Discrete Dialogue Open
          </div>
        </div>

        <div
          ref={floatCard2Ref}
          className="p-8 rounded-3xl bg-white border border-cyan-200/80 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl max-w-sm"
        >
          <div className="flex items-center gap-2 text-cyan-700 font-mono text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>DEPTH: 6,400M · NON-COMPETE CLEARED</span>
          </div>
          <div className="font-extrabold text-slate-900 text-xl mb-2">Founding GCC Managing Director</div>
          <div className="text-xs text-slate-600 mb-4 leading-relaxed">
            Delivered 0-to-1200 engineer scale for global investment bank in 24 months.
          </div>
          <div className="text-xs font-mono text-cyan-700 font-bold bg-cyan-50 px-3 py-1 rounded-full inline-block">
            Verified Track Record
          </div>
        </div>
      </div>
    </section>
  );
};
