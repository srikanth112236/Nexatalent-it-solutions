import React from 'react';
import { Sparkles, Cpu, Network, ArrowRight } from 'lucide-react';

export const DetailCloudAndAiSpecialization: React.FC = () => {
  const stacks = [
    {
      title: 'Foundation Model Pre-Training',
      tools: ['Megatron-LM', 'DeepSpeed 3D Parallelism', 'FlashAttention-3', 'vLLM & TensorRT-LLM'],
      desc: 'Engineers who have trained models on 16,384+ GPU clusters with fault-tolerant checkpointing.',
      icon: Cpu,
    },
    {
      title: 'RLHF & Synthetic Data Distillation',
      tools: ['PPO / DPO Algorithms', 'Reward Modeling', 'Verifiable Reasoning (RLVR)', 'Curated Datasets'],
      desc: 'Post-training specialists in instruction tuning, multi-turn tool use, and cognitive alignment.',
      icon: Sparkles,
    },
    {
      title: 'Agentic Swarms & Tool Ingestion',
      tools: ['Model Context Protocol (MCP)', 'Autonomous Tool Routing', 'LangGraph / AutoGen', 'Vector Sharding'],
      desc: 'Orchestrating enterprise multi-agent workflows with deterministic state machines and fallback retries.',
      icon: Network,
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>26 · AI & Cloud Foundation Specialization Guild</span>
        <span className="text-violet-600 bg-violet-50 px-2 py-0.5 rounded text-[10px]">Deep Tech Practice</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Sovereign AI Engineering Pods</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Pre-Vetted AI Researchers & GPU Cluster Architects
            </h2>
          </div>
          <button 
            type="button"
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <span>Deploy AI Squad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stacks.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-violet-500/50 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-800/80 flex items-center justify-center text-violet-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">{s.desc}</p>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">Verified Stack:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tools.map((tool, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
