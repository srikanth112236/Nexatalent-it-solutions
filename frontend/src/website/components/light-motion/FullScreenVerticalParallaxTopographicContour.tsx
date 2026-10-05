import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mountain, Compass, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalParallaxTopographicContour: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerLowRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerHighRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(layerLowRef.current, {
        y: -140,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(layerMidRef.current, {
        y: -300,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to(layerHighRef.current, {
        y: -480,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[140vh] bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Topographic Elevation Vector Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%), repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, #cbd5e1 41px, transparent 42px)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold mb-4">
          <Mountain className="w-3.5 h-3.5 text-emerald-600" />
          <span>TOPOGRAPHIC ELEVATION MATRIX · MULTI-DEPTH SCRUB</span>
        </div>
        <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
          Topography of Global Tech Talent
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Mapping density elevations across premier Indian engineering corridors, from foundational Staff ICs to founding GCC Site Managing Directors.
        </p>
      </div>

      {/* Low Altitude Plane */}
      <div ref={layerLowRef} className="relative z-10 w-full px-8 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>ALTITUDE: 1,200M · ORR CORRIDOR</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900">Distributed Cloud Guild</h4>
          <p className="text-xs text-slate-500 mt-1">12,000+ Engineers skilled in Kubernetes, Istio, and eBPF.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>ALTITUDE: 2,400M · HITEC CITY</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900">FinTech & Payments Mesh</h4>
          <p className="text-xs text-slate-500 mt-1">8,500+ Engineers building transaction routing & fraud models.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>ALTITUDE: 3,600M · INDIRANAGAR LABS</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900">GenAI & ML Systems</h4>
          <p className="text-xs text-slate-500 mt-1">Researchers specializing in transformer inference.</p>
        </div>
      </div>

      {/* Mid Altitude Plane */}
      <div ref={layerMidRef} className="relative z-20 w-full px-12 md:px-32 flex justify-between items-center my-6">
        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl max-w-sm">
          <div className="text-xs font-mono text-emerald-400 mb-1">Elevation Benchmark</div>
          <div className="text-xl font-bold">Calibrated Scarcity Review</div>
          <div className="text-xs text-slate-400 mt-1">Assessed against documented principal-level rubrics.</div>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl max-w-sm">
          <div className="text-xs font-mono text-blue-600 mb-1">Geographic Density</div>
          <div className="text-xl font-bold text-slate-900">GCC Hiring Coverage</div>
          <div className="text-xs text-slate-500 mt-1">Pipeline relationships across key technology campuses.</div>
        </div>
      </div>

      {/* High Altitude Plane: Topographic Summit Marker */}
      <div ref={layerHighRef} className="relative z-30 w-full text-center px-6 my-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white font-mono text-xs font-bold shadow-2xl border border-slate-700">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>SUMMIT: FOUNDING GCC LEADERSHIP (CONFIDENTIAL PIPELINE)</span>
        </div>
      </div>
    </section>
  );
};
