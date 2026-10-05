import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';

export const Hero05BentoHorizonMorph: React.FC = () => {

  return (
    <div className="relative min-h-[92vh] bg-slate-900 text-white overflow-hidden flex items-center justify-center border-y border-slate-800">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-12">
        
        {/* Top Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE BENTO ARCHITECTURE 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            The Living Architecture of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              High-Velocity Global Tech Pods
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-light max-w-xl mx-auto">
            Hover over any bento pod below to inspect live compensation differentials, verified vetting benchmarks, and pre-cleared engineers.
          </p>
        </div>

        {/* Morphing Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Large Pod Snapshot */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-2 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-blue-400 font-bold">POD #042 · FINTECH HIGH-THROUGHPUT</span>
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">100% OPERATIONAL</span>
              </div>
              <h3 className="text-xl font-bold text-white">Bare-Metal C++ & Low-Latency Matching Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed in Bangalore with direct sub-millisecond connectivity to London and New York exchanges. 12 engineers, 2 principal leads.
              </p>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-2 text-center text-xs font-mono border-t border-slate-800/80 mt-4">
              <div className="p-2 rounded-xl bg-slate-900">
                <div className="text-slate-500 text-[10px]">THROUGHPUT</div>
                <div className="text-white font-bold">1.4M msg/s</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900">
                <div className="text-slate-500 text-[10px]">SAVINGS</div>
                <div className="text-emerald-400 font-bold">69.2%</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900">
                <div className="text-slate-500 text-[10px]">TIME TO RAMP</div>
                <div className="text-cyan-400 font-bold">18 Days</div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Live Candidate Profile */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                    alt="Candidate" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Ananya R.</div>
                  <div className="text-[11px] text-slate-400 font-mono">Distributed DB Fellow</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>5-Stage Rigor: 99.8th percentile</span>
                </div>
                <div className="text-[11px] text-slate-500">Ready for instant burst allocation.</div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                Cleared for Immediate Placement
              </span>
            </div>
          </motion.div>

          {/* Card 3: Instant Arbitrage Gauge */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>PPP Arbitrage Matrix</span>
              </div>
              <div className="text-3xl font-black text-white">$210,000</div>
              <p className="text-xs text-slate-400 mt-1">Average annual net delta per staff engineer retained in our Bangalore hub.</p>
            </div>
            <button 
              type="button"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              <span>Build Custom Pod</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
