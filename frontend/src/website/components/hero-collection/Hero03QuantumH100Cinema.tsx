import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, Sparkles } from 'lucide-react';

export const Hero03QuantumH100Cinema: React.FC = () => {
  const [activeCluster, setActiveCluster] = useState<'h100' | 'b200' | 'fpga'>('h100');

  return (
    <div className="relative min-h-[92vh] bg-black text-white overflow-hidden flex items-center justify-center border-y border-neutral-900">
      {/* Volumetric Cinema Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline & Spec */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FRONTIER AI & DISTRIBUTED GPU SQUADS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Deploy AI Research Squads on <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Dedicated H100 GPU Clusters
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl leading-relaxed">
            Stop searching for solitary AI engineers. NexaTalent IT Solutions assembles full post-training squads: RLHF specialists, synthetic dataset pipelines, and CUDA kernel optimization architects.
          </p>

          {/* Cluster Selector Tabs */}
          <div className="flex items-center gap-2 pt-2">
            {[
              { id: 'h100', label: 'H100 SXM5 Pods', spec: '3.2 Tbps InfiniBand' },
              { id: 'b200', label: 'Blackwell B200 Early', spec: 'Next-Gen Tensor' },
              { id: 'fpga', label: 'Quant FPGA Low-Latency', spec: 'Sub-Microsecond' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCluster(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  activeCluster === tab.id 
                    ? 'bg-neutral-900 border border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-950' 
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <div>{tab.label}</div>
                <div className="text-[10px] text-neutral-500">{tab.spec}</div>
              </button>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Hiring Requirement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-neutral-500">
              Tracked end-to-end: <strong className="text-white">requirement to shortlist</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Holographic Cluster HUD Card */}
        <div className="lg:col-span-5">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl bg-neutral-950/90 border border-neutral-800 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400">
                <Cpu className="w-4 h-4" />
                <span>NEXA-MANDATE-ID: AI-PLT-01</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>

            {/* GPU Node Visualizer */}
            <div className="space-y-3 mb-5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">AI Platform Squad</div>
                  <div className="text-neutral-500 text-[10px]">Model Systems Hiring</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-bold">Technical Review</div>
                  <div className="text-[10px] text-neutral-500">Architecture Depth Stage</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">Systems Engineering Squad</div>
                  <div className="text-neutral-500 text-[10px]">Distributed Platform Hiring</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold">Employer Review</div>
                  <div className="text-[10px] text-neutral-500">Shortlist Stage</div>
                </div>
              </div>
            </div>

            {/* Squad Composition Specs */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-neutral-900 to-black border border-neutral-800/80 space-y-2 text-xs">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Assigned Screening Panel
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>1x Principal AI Specialist</span>
                <span className="font-mono text-cyan-400 font-bold">Assessed</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>3x Distributed Systems Engineers</span>
                <span className="font-mono text-cyan-400 font-bold">Reviewed</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>2x Data Pipeline Engineers</span>
                <span className="font-mono text-cyan-400 font-bold">Mapped</span>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};
