import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Hero14WaterfallCascadeParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const col1Y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const col2Y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const candidates = [
    { name: 'Dr. Siddharth M.', role: 'Head of Quant Research', prev: 'ex-Citadel', score: 'Top 0.1%', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Elena Rostova', role: 'Staff SRE & Kubernetes', prev: 'ex-Datadog', score: 'Top 0.5%', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Kavita Patel', role: 'Principal ML Engineer', prev: 'ex-Meta FAIR', score: 'Top 0.2%', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
    { name: 'David Zhang', role: 'FPGA Kernel Architect', prev: 'ex-Two Sigma', score: 'Top 0.1%', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[95vh] bg-slate-950 text-white overflow-hidden flex items-center justify-center border-y border-slate-800"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Narrative */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERTICAL WATERFALL TALENT PARALLAX</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            The World&apos;s Most Elite <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Technical Bench, On Demand.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed max-w-lg">
            Every candidate in our waterfall registry has cleared algorithmic code evaluation, verified GitHub repository audit, and institutional reference checks.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button 
              type="button"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Verified Bench Roster</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Cascading Waterfall Columns with Vertical Parallax */}
        <div className="lg:col-span-6 h-[460px] sm:h-[520px] overflow-hidden grid grid-cols-2 gap-4 relative p-2 rounded-3xl bg-slate-900/50 border border-slate-800/80">
          
          {/* Column 1 (Scrolls upward) */}
          <motion.div style={{ y: col1Y }} className="space-y-4">
            {candidates.slice(0, 2).map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img src={c.img} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-indigo-500" />
                  <div>
                    <div className="font-bold text-sm text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.role}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Pedigree: <strong className="text-white">{c.prev}</strong></span>
                  <span className="text-indigo-400 font-bold">{c.score}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Column 2 (Scrolls downward) */}
          <motion.div style={{ y: col2Y }} className="space-y-4">
            {candidates.slice(2, 4).map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img src={c.img} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-pink-500" />
                  <div>
                    <div className="font-bold text-sm text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.role}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Pedigree: <strong className="text-white">{c.prev}</strong></span>
                  <span className="text-pink-400 font-bold">{c.score}</span>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </div>
  );
};
