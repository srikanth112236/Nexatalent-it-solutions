import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ParallaxMultiLayerSplit: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerSlowRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerFastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !layerSlowRef.current || !layerMidRef.current || !layerFastRef.current) return;

    const ctx = gsap.context(() => {
      // Slow background layer
      gsap.to(layerSlowRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Medium middle layer
      gsap.to(layerMidRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Fast foreground layer
      gsap.to(layerFastRef.current, {
        y: -160,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Layer Parallax • Independent Depth Scrubbing Layers</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Multi-Layer Architectural Depth Parallax
          </h2>
          <p className="text-lg text-slate-600">
            Visualizing the layered rigor of our search pod: from raw talent mapping to microsecond benchmark profiles, moving at three independent optical speeds.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3 Parallax Layers Staggered */}
          <div className="lg:col-span-6 relative h-[520px] flex items-center justify-center">
            
            {/* Layer 1: Slow Background Card */}
            <div
              ref={layerSlowRef}
              className="absolute w-[85%] rounded-3xl p-6 bg-white border border-slate-200 shadow-lg top-0 left-0 text-xs space-y-3 opacity-70"
            >
              <div className="flex items-center justify-between text-slate-400 font-mono">
                <span>LAYER 01 • TALENT INDEX</span>
                <span className="text-blue-600 font-bold">45,000+ Leaders</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Calibrated Search Territory & Headhunting Matrix
              </h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Mapping the top 0.5% engineering talent across India, United Kingdom, and the United States.
              </p>
            </div>

            {/* Layer 2: Medium Middle Card */}
            <div
              ref={layerMidRef}
              className="absolute w-[90%] rounded-3xl p-7 bg-white border-2 border-blue-500/30 shadow-xl top-24 left-6 z-10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase">
                  LAYER 02 • LIVE KERNEL PROFILER
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">4.2ns P99 PASS</span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900">
                Lock-Free Concurrency & Memory Benchmark
              </h4>
              <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px]">
                <code>ThreadContention: 0% | Allocations: 0 heap | Passed 24/24</code>
              </div>
            </div>

            {/* Layer 3: Fast Foreground Card */}
            <div
              ref={layerFastRef}
              className="absolute w-[85%] rounded-3xl p-7 bg-white border-2 border-blue-600 shadow-2xl top-52 right-0 z-20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200">
                  LAYER 03 • VERIFIED DOSSIER
                </span>
                <span className="text-xs font-mono font-bold text-blue-600">72h SLA READY</span>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Vikram M. • Staff Distributed Architect
                </h4>
                <p className="text-xs text-slate-500">12 YOE • Ex-Uber Core Storage • Go / Raft / RocksDB</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700">Expectation: ₹85L + ESOP</span>
                <span className="font-bold text-emerald-600">Notice: Immediate Hold</span>
              </div>
            </div>

          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Zero Resume Noise. 100% Calibrated Profiles.</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Independent Parallax Speeds Visualizing Complete Vetting Rigor
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              While conventional recruiters spray keyword-matched resumes, NexaTalent IT Solutions operates across three calibrated architectural layers. On scroll, each stratum responds at differential visual speeds, matching how we deconstruct candidate capabilities from macro experience down to microsecond cache profiling.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Layer 1: Deep market mapping of the top 0.5% engineering talent pool',
                'Layer 2: Production architectural defense benchmarked by Staff engineers',
                'Layer 3: Direct verified candidate dossier delivered within 72 business hours'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer">
                <span>Explore Calibrated Vetting Framework</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
