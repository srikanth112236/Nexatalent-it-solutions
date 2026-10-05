import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Box, Sparkles, Layers, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalParallaxMesh: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Differential vertical speed parallax across 3 depth planes
      gsap.to(layer1Ref.current, {
        y: -180,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(layer2Ref.current, {
        y: -340,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to(layer3Ref.current, {
        y: -520,
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
      className="relative w-screen min-h-[140vh] bg-gradient-to-b from-slate-50 via-blue-50/50 to-white text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Edge-to-Edge Animated Mesh Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 60%), linear-gradient(0deg, rgba(226, 232, 240, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226, 232, 240, 0.6) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 64px 64px, 64px 64px',
        }}
      />

      {/* Hero Section Baseline Title */}
      <div className="relative z-10 w-full text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>FULL-SCREEN VERTICAL PARALLAX · THREE-TIER OPTICAL PLANES</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight">
          Volumetric Architectural <span className="text-blue-600">Strata</span>
        </h2>
      </div>

      {/* Parallax Layer 1: Slow Foreground Slabs */}
      <div
        ref={layer1Ref}
        className="relative z-20 w-full px-8 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-8 my-8"
      >
        <div className="p-8 rounded-3xl bg-white/80 border border-slate-200 shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all">
          <Layers className="w-8 h-8 text-blue-600 mb-4" />
          <div className="text-xs font-mono text-slate-400 font-bold uppercase mb-1">Depth Tier 01</div>
          <h4 className="text-xl font-black text-slate-900 mb-2">Cloud Edge Orchestration</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Multi-cluster Kubernetes mesh deployed across US East, Europe, and Asia Pacific datacenters.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/80 border border-slate-200 shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all">
          <Cpu className="w-8 h-8 text-indigo-600 mb-4" />
          <div className="text-xs font-mono text-slate-400 font-bold uppercase mb-1">Depth Tier 01</div>
          <h4 className="text-xl font-black text-slate-900 mb-2">Distributed Consensus</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Raft and Paxos state machines handling 100,000 global transactions per second without lock contention.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/80 border border-slate-200 shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all">
          <Box className="w-8 h-8 text-emerald-600 mb-4" />
          <div className="text-xs font-mono text-slate-400 font-bold uppercase mb-1">Depth Tier 01</div>
          <h4 className="text-xl font-black text-slate-900 mb-2">Synthetic Interview Sim</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            AI-simulated code review agents challenging candidates with real production outage scenarios.
          </p>
        </div>
      </div>

      {/* Parallax Layer 2: Medium Floating Floating Telemetry Cards */}
      <div
        ref={layer2Ref}
        className="relative z-10 w-full px-12 md:px-32 flex flex-wrap justify-between items-center gap-8 my-12"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl max-w-sm">
          <div className="text-xs font-mono opacity-80 uppercase mb-1">Speed Tier 02 · Mid-Plane</div>
          <div className="text-2xl font-black mb-1">Structured Vetting Flow</div>
          <div className="text-xs text-blue-100">Documented evaluation stages across every mandate.</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-2xl max-w-sm">
          <div className="text-xs font-mono text-emerald-400 uppercase mb-1">Speed Tier 02 · Mid-Plane</div>
          <div className="text-2xl font-black mb-1">Transparent Commercials</div>
          <div className="text-xs text-slate-400">Rate-card benchmarking against single-market hiring.</div>
        </div>
      </div>

      {/* Parallax Layer 3: Deep Atmospheric High-Speed Typography */}
      <div
        ref={layer3Ref}
        className="relative z-0 w-full text-center pointer-events-none select-none my-8 opacity-10"
      >
        <span className="text-7xl md:text-[180px] font-black tracking-tighter text-slate-900 uppercase">
          NEXATALENT IT SOLUTIONS
        </span>
      </div>
    </section>
  );
};
