import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Code2 } from 'lucide-react';

interface RubricCard {
  id: string;
  tag: string;
  title: string;
  detail: string;
  codeSnippet: string;
  score: string;
  metrics: string[];
}

const RUBRIC_CARDS: RubricCard[] = [
  {
    id: 'rubric-1',
    tag: 'RUBRIC 01 • CONCURRENCY',
    title: 'Lockless Data Structures & Memory Ordering',
    detail: 'Evaluating candidate mastery over C++20 memory_order_acquire / release, cache line ping-ponging, and false sharing avoidance in multi-core systems.',
    codeSnippet: 'atomic<size_t> tail_{0}; // alignas(64) avoid false sharing\nassert(thread_contention == 0);',
    score: '99.2% SPSC Benchmark',
    metrics: ['Zero mutex lock overhead', '64-byte L1 cache line padding', 'Sub-5ns push/pop p99 latency']
  },
  {
    id: 'rubric-2',
    tag: 'RUBRIC 02 • DISTRIBUTED CONSENSUS',
    title: 'Raft Log Replication & Byzantine Recovery',
    detail: 'Testing dynamic leader election failover under simulated 40% packet drops and asymmetric network partitioning in Go and Rust.',
    codeSnippet: 'if acks >= quorum {\n  self.commit_index.store(last_idx, Release);\n  self.apply_state_machine().await?;\n}',
    score: '100% Quorum Integrity',
    metrics: ['Deterministic state machine transitions', 'Zero split-brain divergence', 'Sub-millisecond commit latency']
  },
  {
    id: 'rubric-3',
    tag: 'RUBRIC 03 • AI MODEL SERVING',
    title: 'vLLM Kernel Paging & FlashAttention',
    detail: 'Benchmarking GPU shared memory allocation, tensor core tiling, and continuous batching across 8x H100 GPU clusters.',
    codeSnippet: 'LoadTileAsync(smem, K, seq_len, head_dim);\n__syncthreads();\nComputeWarpMma(Out, Q, smem, head_dim);',
    score: '8.4x Token Throughput',
    metrics: ['Zero warp synchronization stalls', 'FP16 Tensor Core saturation', 'Sub-15ms time-to-first-token']
  }
];

export const OneSideStickyFeatureStack: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeRubric = RUBRIC_CARDS[activeIdx];

  return (
    <section className="py-28 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>One-Side Sticky Pin • Left Scrolling Rubric, Right Sticky Terminal</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Technical Vetting Rubric & Live Terminal
          </h2>
          <p className="text-lg text-slate-600">
            Scroll through our technical evaluation rubrics on the left while the live execution terminal stays pinned on the right.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Scrolling Rubric Cards */}
          <div className="lg:col-span-6 space-y-8">
            {RUBRIC_CARDS.map((item, idx) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`p-8 rounded-3xl border transition-all duration-300 ${
                  activeIdx === idx
                    ? 'bg-blue-50/30 border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {item.tag}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.score}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {item.detail}
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-200/80">
                  {item.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Terminal Output */}
          <div
            className="lg:col-span-6"
            style={{
              position: 'sticky',
              top: '120px',
              alignSelf: 'start',
            }}
          >
            <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-xs font-mono text-slate-400 ml-2">harness_evaluator.cc</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">● LIVE VERIFIED</span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Active Execution Context
                </span>
                <h4 className="text-lg font-bold text-slate-100">{activeRubric.title}</h4>
              </div>

              {/* Code Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-blue-400 overflow-x-auto">
                <pre>{activeRubric.codeSnippet}</pre>
              </div>

              {/* Output Strip */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Result: {activeRubric.score}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80">
                  Candidate meets strict Tier-1 FAANG/HFT Staff engineering bar.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Vetted by NexaTalent Principal Review Board</span>
                <span className="text-blue-400 font-bold">100% Guaranteed</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
