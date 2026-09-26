import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface RailCard {
  step: string;
  title: string;
  desc: string;
  metric: string;
}

const CARDS: RailCard[] = [
  { step: 'STAGE 01', title: 'Mandate Intake & Calibration', desc: 'Precision role architecture calibrated against Silicon Valley talent benchmarks.', metric: '48h SLA' },
  { step: 'STAGE 02', title: 'Deep Heuristic Evaluation', desc: 'Live AST architecture challenge and system scalability pressure tests.', metric: '99.4% Pass' },
  { step: 'STAGE 03', title: 'Escrow & Legal Quarantine', desc: 'Enforceable non-compete agreements and IP protection enclaves.', metric: 'Zero Leak' },
  { step: 'STAGE 04', title: 'Deployment & Day-1 Velocity', desc: 'Pre-configured dev environments ready for immediate high-frequency output.', metric: 'Day-1 Push' },
];

export const FullScreenHorizontalParallaxRail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // Pin container and scrub foreground cards laterally
      gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      });

      // Scrub background big text at different velocity (horizontal parallax)
      gsap.to(bgTextRef.current, {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 0.5,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Ultra-Large Parallax Watermark Text */}
      <div
        ref={bgTextRef}
        className="absolute top-1/4 left-0 whitespace-nowrap text-[18vw] font-black text-slate-200/50 pointer-events-none select-none tracking-tighter"
      >
        GLOBAL TALENT INFRASTRUCTURE
      </div>

      {/* Top Header */}
      <div className="relative z-10 w-full px-8 md:px-16 pt-8 pb-4 flex justify-between items-end border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>FULL-SCREEN HORIZONTAL PARALLAX RAIL</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Multi-Speed Lateral <span className="text-blue-600">Pipeline</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>SCROLL HORIZONTALLY (GSAP PINNED TRACK)</span>
        </div>
      </div>

      {/* Lateral Sliding Rail Cards */}
      <div className="relative z-20 w-full overflow-visible py-12">
        <div ref={trackRef} className="flex gap-8 px-8 md:px-16 w-max">
          {CARDS.map((card, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[420px] p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
                    {card.step}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                    {card.metric}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{card.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Phase Completion</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
