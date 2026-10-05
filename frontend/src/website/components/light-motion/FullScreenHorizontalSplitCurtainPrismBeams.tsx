import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Compass, Cpu, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenHorizontalSplitCurtainPrismBeams: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const prismRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the moment the section reaches the viewport, then reveal
      // the curtains progressively with scroll scrub.
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
        leftCurtainRef.current,
        { xPercent: 0 },
        { xPercent: -102, ease: 'power2.inOut' },
        0
      )
        .fromTo(
          rightCurtainRef.current,
          { xPercent: 0 },
          { xPercent: 102, ease: 'power2.inOut' },
          0
        )
        .fromTo(
          beamRef.current,
          { scaleX: 0, opacity: 0.3 },
          { scaleX: 1, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          prismRef.current,
          { rotate: 0 },
          { rotate: 180, ease: 'none' },
          0
        )
        .fromTo(
          contentRef.current,
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
      className="relative w-screen min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Revealed Stage: High-Performance Quantitative Guild Matrix */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center px-6 lg:px-20 text-center w-full"
      >
        {/* Subtle Chromatic Background Glow */}
        <div className="absolute inset-0 bg-radial from-violet-600/10 via-amber-500/5 to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/30 text-violet-300 text-xs font-mono uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          Pattern 17 · Chromatic Beam Refraction
        </div>

        <h2 className="text-section-title font-semibold tracking-tight text-white mb-4 max-w-4xl">
          Prism Separation: Exposing High-Frequency Quantitative Engineering
        </h2>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl font-light mb-12">
          As the bilateral architectural curtains divide along the focal plane, optical diffraction beams unveil NexaTalent IT Solutions’s proprietary algorithmic calibration tier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[
            {
              icon: Cpu,
              tag: 'Latency Budget',
              val: 'Assessed',
              desc: 'Systems engineers reviewed for performance-aware design and evaluation depth.',
              color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30',
            },
            {
              icon: Layers,
              tag: 'Stochastic Models',
              val: 'Reviewed',
              desc: 'Quantitative researchers assessed on modelling depth and execution awareness.',
              color: 'from-violet-500/20 to-purple-500/5 border-violet-500/30',
            },
            {
              icon: Compass,
              tag: 'Autonomous Shards',
              val: 'Mapped',
              desc: 'Distributed hiring coordinated across regions with documented handover.',
              color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30',
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-gradient-to-b ${card.color} border backdrop-blur-xl text-left hover:border-slate-300/40 transition-all`}
            >
              <card.icon className="w-7 h-7 text-white mb-4" />
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block mb-1">
                {card.tag}
              </span>
              <div className="text-3xl font-bold font-mono text-white mb-2">{card.val}</div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Central Vertical Optical Light Beam */}
      <div
        ref={beamRef}
        className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-sm"
        style={{ transformOrigin: 'center' }}
      />

      {/* Central Rotating Prism Core Node */}
      <div
        ref={prismRef}
        className="absolute z-40 w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[1.5px] shadow-[0_0_50px_rgba(168,85,247,0.5)] pointer-events-none"
      >
        <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-cyan-300 animate-ping" />
        </div>
      </div>

      {/* Left Split Curtain (100vh x 50vw) */}
      <div
        ref={leftCurtainRef}
        className="absolute top-0 left-0 w-1/2 h-full z-30 bg-slate-900 border-r border-slate-700/80 shadow-[10px_0_40px_rgba(0,0,0,0.8)] flex flex-col justify-between p-8 lg:p-14"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Left Aperture · Node-Alpha</span>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
        <div>
          <span className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-800 select-none block">
            PRISM
          </span>
          <p className="text-xs text-slate-400 font-mono mt-2">Scroll downward to part chromatic curtains</p>
        </div>
        <div className="border-t border-slate-800 pt-4 flex justify-between text-xs text-slate-500 font-mono">
          <span>AZIMUTH: 180°</span>
          <span>POLARIZATION: DUAL</span>
        </div>
      </div>

      {/* Right Split Curtain (100vh x 50vw) */}
      <div
        ref={rightCurtainRef}
        className="absolute top-0 right-0 w-1/2 h-full z-30 bg-slate-900 border-l border-slate-700/80 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col justify-between p-8 lg:p-14 text-right"
      >
        <div className="flex items-center justify-between flex-row-reverse">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Right Aperture · Node-Beta</span>
          <span className="w-2 h-2 rounded-full bg-violet-400" />
        </div>
        <div>
          <span className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-800 select-none block">
            REFRACT
          </span>
          <p className="text-xs text-slate-400 font-mono mt-2">Unveiling sovereign algorithmic infrastructure</p>
        </div>
        <div className="border-t border-slate-800 pt-4 flex justify-between flex-row-reverse text-xs text-slate-500 font-mono">
          <span>FREQUENCY: 540 THz</span>
          <span>STATUS: SYNCHRONIZED</span>
        </div>
      </div>

    </section>
  );
};
