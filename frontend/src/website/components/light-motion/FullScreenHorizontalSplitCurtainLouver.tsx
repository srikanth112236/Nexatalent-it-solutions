import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Shield, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenHorizontalSplitCurtainLouver: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftLouverRef = useRef<HTMLDivElement>(null);
  const rightLouverRef = useRef<HTMLDivElement>(null);
  const councilRef = useRef<HTMLDivElement>(null);

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

      tl.to(leftLouverRef.current, { xPercent: -100, rotateY: 30, ease: 'power2.inOut' }, 0)
        .to(rightLouverRef.current, { xPercent: 100, rotateY: -30, ease: 'power2.inOut' }, 0)
        .fromTo(
          councilRef.current,
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
      {/* Unveiled Advisory Council */}
      <div
        ref={councilRef}
        className="relative z-10 w-full px-8 md:px-20 py-16 max-w-5xl mx-auto text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
          <Users className="w-8 h-8 text-blue-600" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>PATTERN 17 · LOUVER CURTAIN UNVEILED</span>
        </div>

        <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
          GCC Executive Advisory Council
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          The architectural Venetian louvers part horizontally, presenting the founding leaders and veteran site directors steering NexaTalent IT Solutions GCC practices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="text-xs font-mono text-blue-600 font-bold uppercase">Council Chair</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">Ex-Goldman Sachs MD</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Guided 3 Tier-1 banks in establishing multi-thousand seat tech capability hubs.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="text-xs font-mono text-indigo-600 font-bold uppercase">Technical Fellow</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">Ex-Google Principal</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Spearheaded foundational search infrastructure and global distributed cache clusters.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="text-xs font-mono text-emerald-600 font-bold uppercase">Governance Lead</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">Former Nasscom Officer</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Pioneered regulatory framework and talent bilateral mobility treaties for India GCCs.</p>
          </div>
        </div>
      </div>

      {/* Left Louver Slat Panel */}
      <div
        ref={leftLouverRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-white border-r border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-xs font-mono text-blue-600 font-bold uppercase">LOUVER CURTAIN ALPHA</span>
        <div className="text-2xl md:text-4xl font-black text-slate-900">
          Executive Council Portal
        </div>
        <div className="text-xs font-mono text-slate-400">
          SLIDING LEFT ON SCROLL
        </div>
      </div>

      {/* Right Louver Slat Panel */}
      <div
        ref={rightLouverRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-white border-l border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl text-right"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-xs font-mono text-emerald-600 font-bold uppercase">LOUVER CURTAIN BETA</span>
        <div className="text-2xl md:text-4xl font-black text-slate-900">
          Sovereign Governance
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center justify-end gap-1.5">
          <span>SLIDING RIGHT ON SCROLL</span>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </div>
      </div>
    </section>
  );
};
