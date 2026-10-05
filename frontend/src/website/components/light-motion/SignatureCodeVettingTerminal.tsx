import React, { useState } from 'react';
import { Terminal, CheckCircle2, Play, ShieldCheck, Copy, Check } from 'lucide-react';

interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  scenario: string;
  benchmark: string;
  code: string;
  metrics: {
    latency: string;
    throughput: string;
    allocations: string;
    passScore: string;
  };
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'cpp-lockless',
    name: 'Lockless SPSC RingBuffer (C++20)',
    language: 'cpp',
    scenario: 'Ultra-low latency exchange market data gateway with zero atomic contention',
    benchmark: '4.2 nanoseconds p99 latency',
    code: `template<typename T, size_t Capacity>
class LockFreeRingBuffer {
  static_assert((Capacity & (Capacity - 1)) == 0, "Capacity must be power of 2");
  alignas(64) std::atomic<size_t> head_{0};
  alignas(64) std::atomic<size_t> tail_{0};
  alignas(64) T storage_[Capacity];
public:
  bool try_push(const T& item) noexcept {
    const size_t current_tail = tail_.load(std::memory_order_relaxed);
    if ((current_tail - head_.load(std::memory_order_acquire)) == Capacity) {
      return false; // Buffer saturated
    }
    storage_[current_tail & (Capacity - 1)] = item;
    tail_.store(current_tail + 1, std::memory_order_release);
    return true;
  }
};`,
    metrics: {
      latency: '4.2 ns',
      throughput: '128M ops/sec',
      allocations: '0 heap bytes',
      passScore: '99.4%'
    }
  },
  {
    id: 'rust-raft',
    name: 'Distributed Raft State Machine (Rust)',
    language: 'rust',
    scenario: 'Byzantine fault-tolerant consensus loop under simulated network partition',
    benchmark: 'Sub-millisecond commit latency',
    code: `pub async fn step_leader_heartbeat(&mut self) -> Result<()> {
    let term = self.current_term.load(Ordering::Acquire);
    let last_idx = self.log.last_index();
    let entries = self.log.slice_from(self.commit_index);
    
    let quorum = (self.peers.len() / 2) + 1;
    let acks = self.broadcast_append_entries(term, entries).await?;
    
    if acks >= quorum {
        self.commit_index.store(last_idx, Ordering::Release);
        self.apply_state_machine().await?;
    }
    Ok(())
}`,
    metrics: {
      latency: '0.8 ms',
      throughput: '45,000 tx/sec',
      allocations: 'Arena pinned',
      passScore: '98.8%'
    }
  },
  {
    id: 'cuda-vllm',
    name: 'CUDA Kernel Tensor Parallelism (PyTorch/C++)',
    language: 'cuda',
    scenario: 'Fused flash-attention decode kernel with GPU shared memory optimization',
    benchmark: '94% FP16 Tensor Core saturation',
    code: `__global__ void FusedFlashAttentionKernel(
    const half* __restrict__ Q,
    const half* __restrict__ K,
    const half* __restrict__ V,
    half* __restrict__ Out,
    const int seq_len, const int head_dim) {
  extern __shared__ half smem[];
  const int tid = threadIdx.x;
  const int bid = blockIdx.x;
  // Cooperative shared-memory tile load without warp stall
  LoadTileAsync(smem, K, seq_len, head_dim);
  __syncthreads();
  ComputeWarpMma(Out, Q, smem, head_dim);
}`,
    metrics: {
      latency: '1.8 ms',
      throughput: '3,800 tokens/sec',
      allocations: '0 sync stalls',
      passScore: '99.1%'
    }
  }
];

export const SignatureCodeVettingTerminal: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(SNIPPETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 43 • Live Technical Vetting Terminal</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Production-Grade Engineering Vetting Engine
          </h2>
          <p className="text-lg text-slate-600">
            We reject multiple-choice questions. Candidates write production kernels tested against cache-miss profiling, race condition fuzzing, and latency benchmarks.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {SNIPPETS.map((snip) => (
            <button
              key={snip.id}
              onClick={() => setSelectedSnippet(snip)}
              className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                selectedSnippet.id === snip.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {snip.name}
            </button>
          ))}
        </div>

        {/* High-Tech Terminal Window */}
        <div className="rounded-3xl border border-slate-300 bg-slate-900 text-white shadow-2xl shadow-slate-900/20 overflow-hidden">
          
          {/* Terminal Window Header Bar */}
          <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-3 text-xs font-mono text-slate-400">
                nexatalent-evaluator-v4.2 • {selectedSnippet.language}.test
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Benchmarking...' : 'Execute Test Suite'}</span>
              </button>
            </div>
          </div>

          {/* Scenario Info Bar */}
          <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">
              <strong className="text-slate-200">Test Scenario:</strong> {selectedSnippet.scenario}
            </span>
            <span className="text-blue-400 font-mono font-semibold">
              Target: {selectedSnippet.benchmark}
            </span>
          </div>

          {/* Code Viewer Body */}
          <div className="p-6 md:p-8 font-mono text-xs md:text-sm text-slate-200 overflow-x-auto leading-relaxed bg-slate-900/60">
            <pre>
              <code>{selectedSnippet.code}</code>
            </pre>
          </div>

          {/* Metrics Results Console Strip */}
          <div className="p-6 bg-slate-950 border-t border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">P99 Latency</span>
                <span className="text-lg font-black text-emerald-400 font-mono block mt-0.5">
                  {selectedSnippet.metrics.latency}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sustained Throughput</span>
                <span className="text-lg font-black text-blue-400 font-mono block mt-0.5">
                  {selectedSnippet.metrics.throughput}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Heap Contention</span>
                <span className="text-lg font-black text-indigo-400 font-mono block mt-0.5">
                  {selectedSnippet.metrics.allocations}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Vetting Score</span>
                  <span className="text-lg font-black text-emerald-400 font-mono block mt-0.5">
                    {selectedSnippet.metrics.passScore}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Validation Stamp */}
            <div className="mt-4 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified by NexaTalent IT Solutions Principal Staff Engineering Review Board</span>
              </div>
              <span className="text-slate-500 font-mono">Status: READY_FOR_ENTERPRISE_SHORTLIST</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
