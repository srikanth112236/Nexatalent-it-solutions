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
      className="relative w-screen min-h-[130vh] bg-slate-950 text-white overflow-hidden flex flex-col justify-center items-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Bioluminescent Sonar Pulse Rings */}
      <div
        ref={ring1Ref}
        className="absolute w-[600px] h-[600px] rounded-full border border-teal-500/30 pointer-events-none"
      />
      <div
        ref={ring2Ref}
        className="absolute w-[950px] h-[950px] rounded-full border border-cyan-500/20 pointer-events-none"
      />

      {/* Center Deep Scanner Core */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-400 font-mono text-xs font-bold mb-4">
          <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>DEEP TALENT MARKET SCANNER · BIOLUMINESCENT SONAR</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          Sub-Surface Passive <span className="text-teal-400">Headhunting</span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Uncovering unlisted tier-1 architects and elite engineering directors who never enter public job markets.
        </p>
      </div>

      {/* Floating Pods at Different Parallax Depths */}
      <div className="relative z-20 w-full px-8 md:px-24 flex flex-wrap justify-around items-center gap-8 mt-12">
        <div
          ref={floatCard1Ref}
          className="p-6 rounded-3xl bg-slate-900/90 border border-teal-500/40 shadow-2xl backdrop-blur-xl max-w-sm"
        >
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold mb-2">
            <Search className="w-4 h-4" />
            <span>DEPTH: 3,200M · PASSIVE DISCOVERY</span>
          </div>
          <div className="font-bold text-white text-lg mb-1">Stealth VP Engineering</div>
          <div className="text-xs text-slate-400 mb-3">Currently leading 350-engineer platform team at high-growth SaaS decacorn.</div>
          <div className="text-xs font-mono text-emerald-400 font-semibold">Discrete Dialogue Open</div>
        </div>

        <div
          ref={floatCard2Ref}
          className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl backdrop-blur-xl max-w-sm"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>DEPTH: 6,400M · ZERO CONFLICT OF INTEREST</span>
          </div>
          <div className="font-bold text-white text-lg mb-1">Founding GCC Managing Director</div>
          <div className="text-xs text-slate-400 mb-3">Delivered 0-to-1200 engineer scale for global investment bank in 24 months.</div>
          <div className="text-xs font-mono text-cyan-400 font-semibold">Verified Track Record</div>
        </div>
      </div>
    </section>
  );
};
