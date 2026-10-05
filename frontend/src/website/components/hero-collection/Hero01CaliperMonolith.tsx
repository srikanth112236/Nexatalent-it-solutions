import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export const Hero01CaliperMonolith: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Caliper jaws split on scroll or hover
  const [caliperOpen, setCaliperOpen] = useState(false);
  const leftJaw = useTransform(scrollYProgress, [0, 0.5], ['0%', '-35%']);
  const rightJaw = useTransform(scrollYProgress, [0, 0.5], ['0%', '35%']);
  const coreScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const coreOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[90vh] bg-slate-950 text-white overflow-hidden flex items-center justify-center border-y border-slate-800"
      onMouseEnter={() => setCaliperOpen(true)}
      onMouseLeave={() => setCaliperOpen(false)}
    >
      {/* Background Deep Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.6) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* CORE LAYER: Revealed behind the Calipers */}
      <motion.div 
        style={{ scale: coreScale, opacity: coreOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>PRECISION GCC CALIPER SPECIFICATION 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
          Sovereign Captive Units.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
            Engineered to 0.01mm Tolerance.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-400 font-light leading-relaxed">
          NexaScale locks into tier-1 global technology centers. We build autonomous 50–500 seat engineering pods with legal entity setup, real estate, and verified principal staff.
        </p>

        {/* Live Caliper Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Deployment Speed</div>
            <div className="text-xl font-black text-white mt-0.5">75 Days</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">● Turnkey BOT</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Cost Arbitrage</div>
            <div className="text-xl font-black text-blue-400 mt-0.5">68.4%</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">vs US Bay Area</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Vetting Accuracy</div>
            <div className="text-xl font-black text-white mt-0.5">99.4%</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">5-Stage Rigor</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Replacement SLA</div>
            <div className="text-xl font-black text-cyan-400 mt-0.5">90 Days</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">Zero Fee Risk</div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button 
            type="button" 
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Commission Sovereign GCC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => setCaliperOpen(!caliperOpen)}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            <span>{caliperOpen ? 'Close Caliper Jaws' : 'Test Caliper Reveal'}</span>
          </button>
        </div>
      </motion.div>

      {/* LEFT CALIPER MONOLITH SLAB */}
      <motion.div 
        style={{ x: caliperOpen ? '-40%' : leftJaw }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900/95 border-r border-blue-500/40 shadow-2xl z-20 pointer-events-none flex flex-col justify-between p-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">CALIPER JAW [LEFT: ALPHA]</span>
        </div>

        {/* Vertical measurement ruler ticks */}
        <div className="space-y-4 font-mono text-[9px] text-slate-600 self-end pr-2">
          {['120.00mm', '100.00mm', '80.00mm', '60.00mm', '40.00mm', '20.00mm', '0.00mm'].map((tick) => (
            <div key={tick} className="flex items-center gap-2">
              <span>{tick}</span>
              <div className="w-3 h-px bg-slate-700" />
            </div>
          ))}
        </div>

        <div className="text-[10px] font-mono text-slate-500">
          STATUS: HYDRAULIC LOCK 0.01mm
        </div>
      </motion.div>

      {/* RIGHT CALIPER MONOLITH SLAB */}
      <motion.div 
        style={{ x: caliperOpen ? '40%' : rightJaw }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-slate-950 via-slate-900 to-slate-900/95 border-l border-blue-500/40 shadow-2xl z-20 pointer-events-none flex flex-col justify-between p-8 text-right"
      >
        <div className="flex items-center justify-end gap-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">CALIPER JAW [RIGHT: BETA]</span>
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Vertical measurement ruler ticks */}
        <div className="space-y-4 font-mono text-[9px] text-slate-600 self-start pl-2">
          {['120.00mm', '100.00mm', '80.00mm', '60.00mm', '40.00mm', '20.00mm', '0.00mm'].map((tick) => (
            <div key={tick} className="flex items-center gap-2">
              <div className="w-3 h-px bg-slate-700" />
              <span>{tick}</span>
            </div>
          ))}
        </div>

        <div className="text-[10px] font-mono text-slate-500">
          TOLERANCE: ABSOLUTE ZERO DEFECT
        </div>
      </motion.div>
    </div>
  );
};
