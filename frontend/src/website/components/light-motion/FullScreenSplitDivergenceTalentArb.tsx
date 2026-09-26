import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, Users, ArrowUpRight, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitDivergenceTalentArb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPodRef = useRef<HTMLDivElement>(null);
  const rightPodRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftPodRef.current,
        { xPercent: 50, opacity: 0.2 },
        { xPercent: 0, opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightPodRef.current,
          { xPercent: -50, opacity: 0.2 },
          { xPercent: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          bannerRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-900 text-white overflow-hidden flex flex-col justify-center items-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Multiplier Grid */}
      <div className="absolute inset-0 bg-radial from-slate-800 to-slate-950 pointer-events-none" />

      {/* Top Banner */}
      <div ref={bannerRef} className="relative z-30 mb-8 text-center px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-xs font-bold mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>PATTERN 20 · 4X TALENT MULTIPLIER DIVERGENCE</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          1 US Principal Budget = <span className="text-emerald-400">4 Elite GCC Engineers</span>
        </h2>
      </div>

      {/* Symmetrically Diverged Halves */}
      <div className="relative z-20 w-full px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Diverged Pod: 2 Senior Backend Architects */}
        <div
          ref={leftPodRef}
          className="p-8 lg:p-10 rounded-3xl bg-slate-800/90 border border-blue-500/30 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase">
              GCC POD SQUAD A
            </span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">2x Senior Backend Architects</h3>
          <p className="text-slate-400 text-sm mb-6">
            Leading high-throughput distributed database replication and gRPC microservices.
          </p>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs">
            <span className="text-slate-400">Combined Allocation</span>
            <span className="text-emerald-400 font-bold">$180,000 / Year</span>
          </div>
        </div>

        {/* Right Diverged Pod: 1 AI ML Lead + 1 DevOps Lead */}
        <div
          ref={rightPodRef}
          className="p-8 lg:p-10 rounded-3xl bg-slate-800/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              GCC POD SQUAD B
            </span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">1x AI Lead + 1x SRE Architect</h3>
          <p className="text-slate-400 text-sm mb-6">
            Managing inference pipeline optimization, Terraform automation, and 99.999% uptime.
          </p>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs">
            <span className="text-slate-400">Combined Allocation</span>
            <span className="text-emerald-400 font-bold">$195,000 / Year</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-8 flex items-center gap-2 text-xs font-mono text-slate-400">
        <DollarSign className="w-4 h-4 text-emerald-400" />
        <span>Total 4-Engineer GCC Squad: $375K vs Bay Area 1-Engineer: $420K</span>
        <ArrowUpRight className="w-4 h-4 text-blue-400 ml-2" />
      </div>
    </section>
  );
};
