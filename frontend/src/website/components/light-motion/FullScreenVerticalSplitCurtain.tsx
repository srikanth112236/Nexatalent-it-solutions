import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Radar, Compass, ArrowUp, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalSplitCurtain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const radarMapRef = useRef<HTMLDivElement>(null);

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

      // Pattern 18: Top moves up, Bottom moves down (vertical split curtain)
      tl.to(topCurtainRef.current, { yPercent: -100, ease: 'power2.inOut' }, 0)
        .to(bottomCurtainRef.current, { yPercent: 100, ease: 'power2.inOut' }, 0)
        .fromTo(
          radarMapRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
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
      {/* Pattern 18 Unveiled Content: Strategic Talent Radar */}
      <div
        ref={radarMapRef}
        className="relative z-10 w-full px-8 md:px-20 py-16 text-center max-w-4xl mx-auto"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
          <Radar className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-xs font-bold mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>PATTERN 18 · VERTICAL SHUTTER CURTAIN SPLIT</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          Global Talent Coordinates Unlocked
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          The vertical shutters have parted upwards and downwards, revealing live geographic candidate density across Bangalore Outer Ring Road, Hyderabad Financial District, and London Bank hubs.
        </p>

        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-3 bg-slate-900/80 rounded-xl">
            <div className="text-xs text-slate-400">Bangalore Hub</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">28,400+</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl">
            <div className="text-xs text-slate-400">Hyderabad Hub</div>
            <div className="text-xl font-bold text-blue-400 mt-1">14,200+</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl">
            <div className="text-xs text-slate-400">London Hub</div>
            <div className="text-xl font-bold text-purple-400 mt-1">4,500+</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl">
            <div className="text-xs text-slate-400">SF Hub</div>
            <div className="text-xl font-bold text-teal-400 mt-1">3,200+</div>
          </div>
        </div>
      </div>

      {/* Pattern 18: Top Curtain Panel (Slides UP) */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-slate-950 border-b-2 border-emerald-500/50 p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl"
      >
        <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
          <span>PATTERN 18 · TOP CURTAIN SHUTTER</span>
          <span className="flex items-center gap-1">
            <span>SLIDING UP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-2xl md:text-4xl font-black text-white tracking-tight">
          NexaTalent Global Radar
        </div>
      </div>

      {/* Pattern 18: Bottom Curtain Panel (Slides DOWN) */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-950 border-t-2 border-emerald-500/50 p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl"
      >
        <div className="text-2xl md:text-4xl font-black text-white tracking-tight">
          Candidate Coordinate System
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>COORDINATES CALIBRATED</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span>SLIDING DOWN</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
};
