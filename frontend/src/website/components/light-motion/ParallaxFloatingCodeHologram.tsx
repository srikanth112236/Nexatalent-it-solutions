import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ParallaxFloatingCodeHologram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftWindowRef = useRef<HTMLDivElement>(null);
  const rightWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !leftWindowRef.current || !rightWindowRef.current) return;

    const ctx = gsap.context(() => {
      // Left terminal moves up faster
      gsap.to(leftWindowRef.current, {
        y: -140,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Right terminal moves up at moderate speed
      gsap.to(rightWindowRef.current, {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-white border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Dual-Terminal Parallax Hologram</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Floating Architectural Code Holograms
          </h2>
          <p className="text-lg text-slate-600">
            Real production code submissions from top 0.5% candidates floating at dual optical speeds over an executive intelligence grid.
          </p>
        </div>

        {/* 2 Floating Windows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Floating Window: C++20 Lockless Ring */}
          <div
            ref={leftWindowRef}
            className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-4 border border-slate-800"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-mono text-slate-400 ml-2">spsc_lockfree.hpp</span>
              </div>
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">PARALLAX 1.5x</span>
            </div>

            <pre className="font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
              <code>{`template<typename T, size_t Cap>
class SPSCQueue {
  alignas(64) std::atomic<size_t> tail_{0};
  alignas(64) std::atomic<size_t> head_{0};
  alignas(64) T ring_[Cap];
public:
  bool try_push(const T& val) noexcept {
    const auto t = tail_.load(std::memory_order_relaxed);
    if (t - head_.load(std::memory_order_acquire) == Cap)
      return false; // Saturation
    ring_[t & (Cap - 1)] = val;
    tail_.store(t + 1, std::memory_order_release);
    return true;
  }
};`}</code>
            </pre>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-bold">Latency: 4.2ns P99</span>
              <span className="text-slate-500">Passed 24/24 Stress Fuzzers</span>
            </div>
          </div>

          {/* Right Floating Window: CUDA Tensor Parallel */}
          <div
            ref={rightWindowRef}
            className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-4 border border-slate-800 lg:mt-12"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-mono text-slate-400 ml-2">fused_attention.cu</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">PARALLAX 0.8x</span>
            </div>

            <pre className="font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
              <code>{`__global__ void FusedAttentionTile(
    const half* __restrict__ Q,
    const half* __restrict__ K,
    const half* __restrict__ V,
    half* __restrict__ Out, int dim) {
  extern __shared__ half smem[];
  LoadTileAsync(smem, K, dim);
  __syncthreads();
  ComputeWarpMma(Out, Q, smem, dim);
}`}</code>
            </pre>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-bold">Throughput: 14k tokens/s</span>
              <span className="text-slate-500">Zero Warp Contention</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
