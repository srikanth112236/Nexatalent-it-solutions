import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Waves, Activity, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalParallaxQuantumWave: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveTrackRef = useRef<HTMLDivElement>(null);
  const floatCard1Ref = useRef<HTMLDivElement>(null);
  const floatCard2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(waveTrackRef.current, {
        y: -180,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(floatCard1Ref.current, {
        y: -300,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to(floatCard2Ref.current, {
        y: -440,
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
      className="relative w-screen min-h-[130vh] bg-gradient-to-b from-white via-blue-50/20 to-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background SVG Waveform Vector */}
      <div ref={waveTrackRef} className="absolute inset-x-0 top-1/4 pointer-events-none opacity-20">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-blue-500 fill-none stroke-current" strokeWidth="2">
          <path d="M0,160 C320,300 420,20 640,160 C860,300 960,20 1280,160 L1440,160" />
          <path d="M0,190 C320,330 420,50 640,190 C860,330 960,50 1280,190 L1440,190" strokeDasharray="8 8" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
          <Waves className="w-3.5 h-3.5 text-blue-600" />
          <span>QUANTUM PROBABILITY WAVE · OSCILLATING VERTICAL PARALLAX</span>
        </div>
        <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
          Quantitative Talent Vectoring
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Measuring the probability distribution of exceptional engineering talent across distributed consensus, kernel bypass, and machine learning systems.
        </p>
      </div>

      {/* Floating Dynamic Metric Nodes */}
      <div className="relative z-20 w-full px-8 md:px-24 flex flex-wrap justify-between items-center gap-8 my-8 max-w-6xl mx-auto">
        <div
          ref={floatCard1Ref}
          className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 max-w-md"
        >
          <div className="flex items-center gap-2 text-blue-600 font-mono text-xs font-bold mb-3">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>WAVE NODE 01 · LOW-LATENCY PROBABILITY</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">High-Frequency Kernel Guild</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Sub-microsecond order execution and custom PCIe driver engineers with verified Wall Street trading firm pedigree.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700">
            Median Match Speed: 8.4ms Quantitative Distance
          </div>
        </div>

        <div
          ref={floatCard2Ref}
          className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 max-w-md"
        >
          <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold mb-3">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>WAVE NODE 02 · DISTRIBUTED SCALE PROBABILITY</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Storage Consensus Architects</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Specialists in multi-Raft partition consensus, RocksDB storage engines, and zero-downtime shard migration.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700">
            Retention Record: 98.8% Over 36 Months
          </div>
        </div>
      </div>
    </section>
  );
};
