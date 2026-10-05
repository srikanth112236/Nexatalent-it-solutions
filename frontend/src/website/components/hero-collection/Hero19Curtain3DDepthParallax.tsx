import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';

export const Hero19Curtain3DDepthParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const layer1Y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[95vh] bg-slate-900 text-white overflow-hidden flex items-center justify-center border-y border-slate-800"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center space-y-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>CURTAIN DEPTH 3D PARALLAX STACK</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight text-white">
          Layers of Rigor Behind <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Every Single Deployment
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          Peel back the layers of global captive operations: institutional governance, air-gapped security networks, and algorithmic candidate selection.
        </p>

        {/* 3 Staggered Depth Curtain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 text-left">
          
          <motion.div style={{ y: layer1Y }} className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-2">
            <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase">DEPTH LAYER 01</div>
            <h4 className="text-base font-bold text-white">Sovereign Entity Layer</h4>
            <p className="text-xs text-slate-400">100% legal compliance, zero tax ambiguity, and direct IP ownership transfer.</p>
          </motion.div>

          <motion.div style={{ y: layer2Y }} className="p-6 rounded-3xl bg-indigo-950/50 border border-indigo-500/40 shadow-2xl space-y-2">
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">DEPTH LAYER 02</div>
            <h4 className="text-base font-bold text-white">Technical Verification</h4>
            <p className="text-xs text-slate-400">Live system design sandboxing with senior staff engineers and code repo analysis.</p>
          </motion.div>

          <motion.div style={{ y: layer3Y }} className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-2">
            <div className="text-[10px] font-mono text-pink-400 font-bold uppercase">DEPTH LAYER 03</div>
            <h4 className="text-base font-bold text-white">Turnkey Infrastructure</h4>
            <p className="text-xs text-slate-400">Class-A tech parks, multi-homed ISP feeds, and SOC-2 Type II audit readiness.</p>
          </motion.div>

        </div>

        <div className="pt-4 flex justify-center">
          <button 
            type="button"
            className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Review Full Stack Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
