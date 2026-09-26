import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Compass, Cpu, Layers } from 'lucide-react';

export const FullScreenHorizontalSplitCurtainPrismBeams: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Split curtain translations
  const leftCurtainX = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '-102%']);
  const rightCurtainX = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '102%']);
  const curtainOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0.2]);

  // Center prism beam expansion
  const beamWidth = useTransform(scrollYProgress, [0.1, 0.6], ['4px', '100%']);
  const beamOpacity = useTransform(scrollYProgress, [0.05, 0.3, 0.8], [0.3, 1, 0.4]);
  const prismRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Content reveal
  const contentScale = useTransform(scrollYProgress, [0.2, 0.7], [0.85, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[220vh] bg-slate-950 text-white overflow-hidden"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-screen flex items-center justify-center overflow-hidden">
        
        {/* Background Revealed Stage: High-Performance Quantitative Guild Matrix */}
        <motion.div
          style={{ scale: contentScale, opacity: contentOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 lg:px-20 text-center"
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
            As the bilateral architectural curtains divide along the focal plane, optical diffraction beams unveil NexaTalent’s proprietary algorithmic calibration tier.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {[
              {
                icon: Cpu,
                tag: 'Latency Budget',
                val: '340ns',
                desc: 'Bare-metal kernel bypass & FPGA acceleration teams for global derivative engines.',
                color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30',
              },
              {
                icon: Layers,
                tag: 'Stochastic Models',
                val: '99.98%',
                desc: 'PhD researchers in non-linear PDEs, optimal execution, and order book dynamics.',
                color: 'from-violet-500/20 to-purple-500/5 border-violet-500/30',
              },
              {
                icon: Compass,
                tag: 'Autonomous Shards',
                val: '24 Nodes',
                desc: 'Self-governing sovereign squads deployed across New York, London, and Bangalore.',
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
        </motion.div>

        {/* Central Vertical Optical Light Beam */}
        <motion.div
          style={{ width: beamWidth, opacity: beamOpacity }}
          className="absolute inset-y-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-sm"
        />

        {/* Central Rotating Prism Core Node */}
        <motion.div
          style={{ rotate: prismRotate }}
          className="absolute z-40 w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[1.5px] shadow-[0_0_50px_rgba(168,85,247,0.5)] pointer-events-none"
        >
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-cyan-300 animate-ping" />
          </div>
        </motion.div>

        {/* Left Split Curtain (100vh x 50vw) */}
        <motion.div
          style={{ x: leftCurtainX, opacity: curtainOpacity }}
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
        </motion.div>

        {/* Right Split Curtain (100vh x 50vw) */}
        <motion.div
          style={{ x: rightCurtainX, opacity: curtainOpacity }}
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
        </motion.div>

      </div>
    </section>
  );
};
