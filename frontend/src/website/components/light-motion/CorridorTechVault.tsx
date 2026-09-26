import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Database, BrainCircuit, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TechVaultItem {
  vault: string;
  category: string;
  title: string;
  latencyBenchmark: string;
  stackTags: string[];
  sampleRoles: string[];
  accent: string;
  icon: React.ElementType;
}

const VAULTS: TechVaultItem[] = [
  {
    vault: 'VAULT 01',
    category: 'Quantitative Finance & HFT',
    title: 'Ultra-Low Latency & Kernel Bypass',
    latencyBenchmark: 'Sub-850 Nanoseconds P99',
    stackTags: ['Modern C++20/23', 'Solarflare OpenOnload', 'FPGA Verilog', 'Linux Kernel Bypass'],
    sampleRoles: ['Staff Low-Latency Systems Architect', 'Principal FPGA Acceleration Lead'],
    accent: '#2563eb',
    icon: Zap
  },
  {
    vault: 'VAULT 02',
    category: 'Core Infrastructure',
    title: 'Distributed Consensus & Mesh Networks',
    latencyBenchmark: '99.9999% Fault Quorum SLA',
    stackTags: ['Rust & Go', 'Raft / Multi-Paxos', 'eBPF Observability', 'Distributed RocksDB'],
    sampleRoles: ['Staff Distributed Storage Architect', 'Principal Cloud Mesh Engineer'],
    accent: '#7c3aed',
    icon: Database
  },
  {
    vault: 'VAULT 03',
    category: 'Autonomous AI Systems',
    title: 'Tensor Parallelism & GPU Kernels',
    latencyBenchmark: '14,000 Tokens/sec Cluster Throughput',
    stackTags: ['CUDA C++', 'vLLM & TensorRT-LLM', 'DeepSpeed / Megatron', 'Triton Kernels'],
    sampleRoles: ['VP of AI Platform Infrastructure', 'Principal GPU Kernel Specialist'],
    accent: '#0891b2',
    icon: BrainCircuit
  },
  {
    vault: 'VAULT 04',
    category: 'Enterprise Protection',
    title: 'Zero-Trust Cryptography & eBPF Security',
    latencyBenchmark: 'SOC2 Type II / Hardware HSM',
    stackTags: ['Post-Quantum Cryptography', 'eBPF Runtime Defense', 'SPIFFE/SPIRE', 'Confidential Computing'],
    sampleRoles: ['Chief Information Security Officer', 'Staff Cryptographic Infrastructure Lead'],
    accent: '#10b981',
    icon: Shield
  }
];

export const CorridorTechVault: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.corridor-tech-card');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.8,
        }
      });

      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { z: -160 * (i + 1), opacity: 0.25, rotateX: 10 },
          { z: 0, opacity: 1, rotateX: 0, duration: 1, ease: 'power2.out' },
          i * 0.35
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-white border-b border-slate-200 relative overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>3D Perspective Depth Corridor • Variation 3: Deep-Tech Architectural Vault</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Specialized Deep-Tech Architectural Vault
          </h2>
          <p className="text-lg text-slate-600">
            A 3D perspective traversal across the four deep-technology domains where NexaTalent holds exclusive candidate access.
          </p>
        </div>

        {/* 3D Depth Stepping Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VAULTS.map((vault, idx) => {
            const Icon = vault.icon;
            return (
              <div
                key={idx}
                className="corridor-tech-card rounded-3xl p-7 bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-blue-400 hover:shadow-2xl transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${idx * 15}px)`
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase text-white tracking-wider"
                      style={{ backgroundColor: vault.accent }}
                    >
                      {vault.vault}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {vault.category}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-xs">
                    <Icon className="w-6 h-6" style={{ color: vault.accent }} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug mb-1">
                    {vault.title}
                  </h3>

                  <p className="text-xs font-mono font-bold text-blue-600 mb-4">
                    {vault.latencyBenchmark}
                  </p>

                  {/* Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {vault.stackTags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-slate-600 border border-slate-200/80">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Sample Roles */}
                  <div className="space-y-1.5 border-t border-slate-200/80 pt-4 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Target Mandates:
                    </span>
                    {vault.sampleRoles.map((role, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-blue-600">Active Mandates &rarr;</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
