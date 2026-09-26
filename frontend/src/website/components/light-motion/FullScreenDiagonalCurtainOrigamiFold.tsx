import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BrainCircuit, Sparkles, Network, ArrowUpRight, Cpu } from 'lucide-react';

export const FullScreenDiagonalCurtainOrigamiFold: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 4 Corner Diagonal Origami Flaps Translations and Rotations
  const topLeftX = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '-105%']);
  const topLeftY = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '-105%']);
  const topLeftRotate = useTransform(scrollYProgress, [0.15, 0.75], [0, -25]);

  const topRightX = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '105%']);
  const topRightY = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '-105%']);
  const topRightRotate = useTransform(scrollYProgress, [0.15, 0.75], [0, 25]);

  const bottomLeftX = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '-105%']);
  const bottomLeftY = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '105%']);
  const bottomLeftRotate = useTransform(scrollYProgress, [0.15, 0.75], [0, 25]);

  const bottomRightX = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '105%']);
  const bottomRightY = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '105%']);
  const bottomRightRotate = useTransform(scrollYProgress, [0.15, 0.75], [0, -25]);

  // Center Diamond Core scale & rotation
  const coreScale = useTransform(scrollYProgress, [0.2, 0.7], [0.8, 1]);
  const coreOpacity = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[220vh] bg-slate-950 text-white overflow-hidden"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Sticky Fullscreen Origami Chamber */}
      <div className="sticky top-0 h-screen w-screen flex items-center justify-center overflow-hidden perspective-1000">
        
        {/* Interior Revealed Stage: Sovereign AI Research Fellowship */}
        <motion.div
          style={{ scale: coreScale, opacity: coreOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 lg:px-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-mono uppercase tracking-widest mb-6">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            Pattern 17-20 Hybrid · 3D Diagonal Origami Unfolding
          </div>

          <h2 className="text-section-title font-semibold tracking-tight text-white mb-4 max-w-4xl">
            Sovereign AI Research & Foundation Model Guild
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl font-light mb-12">
            The four-quadrant origami folds peel apart along 45° tessellation vectors, unveiling our tier-1 deep learning and RLHF engineering cadre.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl text-left hover:border-indigo-400 transition-all">
              <Sparkles className="w-7 h-7 text-indigo-400 mb-4" />
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                Post-Training & RLVR
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">Tier-1 Researchers</div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Reinforcement learning with verifiable rewards, synthetic data distillation, and alignment experts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl text-left hover:border-indigo-400 transition-all">
              <Cpu className="w-7 h-7 text-purple-400 mb-4" />
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                Cluster Orchestration
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">32,768 H100s Scaled</div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Megatron-LM, DeepSpeed 3D parallelism, and InfiniBand topology specialists for fault-tolerant pre-training.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl text-left hover:border-indigo-400 transition-all">
              <Network className="w-7 h-7 text-cyan-400 mb-4" />
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                Agentic Workflows
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">Autonomous Swarms</div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Multi-agent tool-use architectures, MCP protocol implementers, and continuous self-healing pipelines.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Diagonal Flap 1: Top-Left (50vw x 50vh) */}
        <motion.div
          style={{ x: topLeftX, y: topLeftY, rotate: topLeftRotate }}
          className="absolute top-0 left-0 w-1/2 h-1/2 z-30 bg-slate-900 border-r border-b border-indigo-500/30 shadow-[10px_10px_30px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between"
        >
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Origami Quadrant I · NW</div>
          <div className="text-3xl lg:text-4xl font-black text-slate-800 uppercase tracking-tight">FOUNDATION</div>
        </motion.div>

        {/* Diagonal Flap 2: Top-Right (50vw x 50vh) */}
        <motion.div
          style={{ x: topRightX, y: topRightY, rotate: topRightRotate }}
          className="absolute top-0 right-0 w-1/2 h-1/2 z-30 bg-slate-900 border-l border-b border-indigo-500/30 shadow-[-10px_10px_30px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between text-right"
        >
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Origami Quadrant II · NE</div>
          <div className="text-3xl lg:text-4xl font-black text-slate-800 uppercase tracking-tight">INTELLIGENCE</div>
        </motion.div>

        {/* Diagonal Flap 3: Bottom-Left (50vw x 50vh) */}
        <motion.div
          style={{ x: bottomLeftX, y: bottomLeftY, rotate: bottomLeftRotate }}
          className="absolute bottom-0 left-0 w-1/2 h-1/2 z-30 bg-slate-900 border-r border-t border-indigo-500/30 shadow-[10px_-10px_30px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between"
        >
          <div className="text-3xl lg:text-4xl font-black text-slate-800 uppercase tracking-tight">ALIGNMENT</div>
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Origami Quadrant III · SW</div>
        </motion.div>

        {/* Diagonal Flap 4: Bottom-Right (50vw x 50vh) */}
        <motion.div
          style={{ x: bottomRightX, y: bottomRightY, rotate: bottomRightRotate }}
          className="absolute bottom-0 right-0 w-1/2 h-1/2 z-30 bg-slate-900 border-l border-t border-indigo-500/30 shadow-[-10px_-10px_30px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between text-right"
        >
          <div className="text-3xl lg:text-4xl font-black text-slate-800 uppercase tracking-tight">ACCELERATION</div>
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest flex items-center justify-end gap-1">
            <span>Scroll To Fold</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
