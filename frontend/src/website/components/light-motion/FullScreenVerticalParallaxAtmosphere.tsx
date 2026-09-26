import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cloud, Award, CheckCircle2, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalParallaxAtmosphere: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(cloudBackRef.current, {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(cloudMidRef.current, {
        y: -260,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to(cardFrontRef.current, {
        y: -420,
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
      className="relative w-screen min-h-[130vh] bg-gradient-to-b from-blue-50/80 via-white to-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Atmosphere Back Layer */}
      <div
        ref={cloudBackRef}
        className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center"
      >
        <div className="w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-300/30 via-indigo-200/20 to-teal-200/30 blur-3xl" />
      </div>

      {/* Atmospheric Mid Layer */}
      <div
        ref={cloudMidRef}
        className="relative z-10 w-full px-8 md:px-24 flex justify-between items-center pointer-events-none"
      >
        <div className="p-6 rounded-3xl bg-white/70 border border-slate-200 shadow-xl backdrop-blur-md max-w-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold mb-2">
            <Cloud className="w-4 h-4 text-blue-500" />
            <span>ATMOSPHERIC TIER 02</span>
          </div>
          <div className="text-xl font-black text-slate-900 mb-1">Global Elevation</div>
          <div className="text-xs text-slate-500">Cross-continental talent synchronization between US and Indian time zones.</div>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 border border-slate-200 shadow-xl backdrop-blur-md max-w-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>ACCELERATION FACTOR</span>
          </div>
          <div className="text-xl font-black text-slate-900 mb-1">3.4x Engineering Output</div>
          <div className="text-xs text-slate-500">Documented delivery boost within 90 days of GCC integration.</div>
        </div>
      </div>

      {/* Front Layer: High Speed Floating Executive Dossiers */}
      <div
        ref={cardFrontRef}
        className="relative z-20 w-full px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-8 my-16 max-w-5xl mx-auto"
      >
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
              DIRECTOR OF AI PLATFORMS
            </span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Ex-FAANG Machine Learning Lead</h3>
          <p className="text-slate-600 text-xs leading-relaxed mb-4">
            Spearheaded 100B+ parameter distributed model training cluster. Cleared all 4 stages of NexaTalent architectural assessment.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Available for Immediate Deployment</span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold font-mono">
              PRINCIPAL INFRASTRUCTURE
            </span>
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Ultra Low-Latency Quant Architect</h3>
          <p className="text-slate-600 text-xs leading-relaxed mb-4">
            Custom kernel bypass and zero-copy packet processing specialist. Master of C++20 and eBPF profiling.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Available for Immediate Deployment</span>
          </div>
        </div>
      </div>
    </section>
  );
};
