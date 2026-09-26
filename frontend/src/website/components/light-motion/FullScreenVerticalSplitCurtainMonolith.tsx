import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, ArrowUp, ArrowDown, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalSplitCurtainMonolith: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topSlabRef = useRef<HTMLDivElement>(null);
  const bottomSlabRef = useRef<HTMLDivElement>(null);
  const globeContentRef = useRef<HTMLDivElement>(null);

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

      tl.to(topSlabRef.current, { yPercent: -100, ease: 'power2.inOut' }, 0)
        .to(bottomSlabRef.current, { yPercent: 100, ease: 'power2.inOut' }, 0)
        .fromTo(
          globeContentRef.current,
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
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Unveiled Global Route Map */}
      <div
        ref={globeContentRef}
        className="relative z-10 w-full px-8 md:px-20 py-16 max-w-5xl mx-auto text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
          <Globe className="w-8 h-8 text-blue-600 animate-spin-slow" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>PATTERN 18 · VERTICAL MONOLITHIC SPLIT</span>
        </div>

        <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
          Global Mobility & Bilateral Routing
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Both monolithic stone slabs part upward and downward, providing direct live tracking of executive candidate placements across international tech corridors.
        </p>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs text-slate-500">Trans-Pacific Route</div>
            <div className="text-xl font-black text-blue-600 mt-1">SF ↔ BLR</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs text-slate-500">Trans-Atlantic Route</div>
            <div className="text-xl font-black text-emerald-600 mt-1">LON ↔ HYD</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs text-slate-500">Average Transit SLA</div>
            <div className="text-xl font-black text-indigo-600 mt-1">14 Days</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs text-slate-500">L1/H1B Support</div>
            <div className="text-xl font-black text-teal-600 mt-1">Full Service</div>
          </div>
        </div>
      </div>

      {/* Top Monolithic Slab (Slides UP) */}
      <div
        ref={topSlabRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-white border-b border-slate-300 p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between text-xs font-mono text-blue-700 font-bold">
          <span>MONOLITH TIER 01</span>
          <span className="flex items-center gap-1">
            <span>SLIDING UP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
          NexaTalent Continental Axis
        </div>
      </div>

      {/* Bottom Monolithic Slab (Slides DOWN) */}
      <div
        ref={bottomSlabRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-white border-t border-slate-300 p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
          Global Mobility Protocol
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>COORDINATES ENGAGED</span>
          <span className="flex items-center gap-1 text-blue-600 font-bold">
            <span>SLIDING DOWN</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
};
