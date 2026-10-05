import React, { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeRubric = RUBRIC_CARDS[activeIdx];

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.rubric-scroll-trigger');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(idx)) {
              setActiveIdx(idx);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-15% 0px -25% 0px',
      }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToRubric = (index: number) => {
    setActiveIdx(index);
    if (!containerRef.current) return;
    const target = containerRef.current.querySelector(`[data-index="${index}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section ref={containerRef} className="py-20 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-xs">
            <Code2 className="w-4 h-4 text-[#0265FF]" />
            <span>PRACTITIONER EVALUATION ENGINE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Technical Vetting Rubric & Evaluation Console
          </h2>
          <p className="text-base text-slate-600">
            Scroll through evaluation criteria on the left while our verified candidate assessment console stays pinned on the right.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Left Column: Scrolling Rubric Cards */}
          <div className="lg:col-span-6 space-y-6">
            {RUBRIC_CARDS.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={item.id}
                  data-index={idx}
                  onClick={() => scrollToRubric(idx)}
                  className={`rubric-scroll-trigger p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white border-2 border-[#0265FF] shadow-xl shadow-blue-500/10'
                      : 'bg-[#FAF8F5] border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#0265FF]">
                      {item.tag}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {item.score}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                    {item.detail}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    {item.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0265FF] shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Console Output */}
          <div
            className="lg:col-span-6"
            style={{
              position: 'sticky',
              top: '100px',
              alignSelf: 'start',
            }}
          >
            <div className="rounded-3xl bg-[#FAF8F5] border border-slate-200 text-slate-900 shadow-xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                  <span className="text-xs font-bold text-slate-500 ml-2">technical_evaluation_console.ts</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">● VERIFIED CONSOLE</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                  Active Evaluation Context
                </span>
                <h4 className="text-base font-extrabold text-slate-900">{activeRubric.title}</h4>
              </div>

              {/* Code / Evaluation Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 font-mono text-xs text-[#0265FF] overflow-x-auto shadow-xs">
                <pre>{activeRubric.codeSnippet}</pre>
              </div>

              {/* Output Strip */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#0265FF]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Benchmark Result: {activeRubric.score}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Candidate meets strict Nexa Talent IT Solutions practitioner benchmarks.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Vetted by Senior Engineering Review Board</span>
                <span className="text-[#0265FF] font-bold">100% Quality Safeguard</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
