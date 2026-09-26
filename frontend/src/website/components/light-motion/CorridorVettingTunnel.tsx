import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, CheckCircle2, Cpu, Terminal, Users, Award, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface VettingGate {
  gate: string;
  title: string;
  evaluator: string;
  description: string;
  failureRate: string;
  metrics: string[];
  accent: string;
  icon: React.ElementType;
}

const GATES: VettingGate[] = [
  {
    gate: 'GATE 01',
    title: 'Production Architecture & Distributed State',
    evaluator: 'Ex-Staff Architect, Distributed Systems',
    description: 'Live whiteboarding on Raft consensus, Byzantine fault tolerance, sharded database partitioning, and cache coherency.',
    failureRate: '68% Filtered',
    metrics: ['Sub-millisecond state machines', 'Zero single-point-of-failure topologies', 'Partition tolerance verification'],
    accent: '#2563eb',
    icon: Cpu
  },
  {
    gate: 'GATE 02',
    title: 'Algorithmic Concurrency & Kernel Profiling',
    evaluator: 'Principal Systems Specialist',
    description: 'Candidates write lock-free memory buffers and multithreaded queues benchmarked for CPU cache misses and memory contention.',
    failureRate: '84% Filtered',
    metrics: ['Zero-allocation data paths', 'Atomic memory ordering models', 'eBPF kernel bypass profiling'],
    accent: '#0891b2',
    icon: Terminal
  },
  {
    gate: 'GATE 03',
    title: 'Organizational Leadership & Calibrated Culture',
    evaluator: 'Managing Partner & Former VP Eng',
    description: 'Assessing engineering empathy, conflict resolution in distributed teams, compensation expectations, and executive maturity.',
    failureRate: '93% Filtered',
    metrics: ['Cross-functional stakeholder sync', 'Mentorship & staff retention models', 'Notice-period buyouts & counter-defense'],
    accent: '#7c3aed',
    icon: Users
  },
  {
    gate: 'GATE 04',
    title: 'Background Verification & Credential Audit',
    evaluator: 'Governance & Compliance Board',
    description: 'Deep reference checks with former direct managers, verified educational credentials, criminal background checks, and NDA clearance.',
    failureRate: '96.5% Filtered (Top 3.5% Cleared)',
    metrics: ['Strict bilateral non-compete audits', '100% IP assignment clearance', 'Escrow-backed 180-day warranty'],
    accent: '#10b981',
    icon: Award
  }
];

export const CorridorVettingTunnel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.corridor-gate-card');

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
          { z: -180 * (i + 1), opacity: 0.25, scale: 0.85 },
          { z: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
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
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>3D Perspective Depth Corridor • Variation 1: 4-Gate Leadership Vetting Tunnel</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            The 4-Gate Architectural Vetting Tunnel
          </h2>
          <p className="text-lg text-slate-600">
            A 3D perspective depth corridor visualizing how our rigorous four-stage engineering evaluation filters out 96.5% of resume noise.
          </p>
        </div>

        {/* 3D Depth Stepping Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GATES.map((gate, idx) => {
            const Icon = gate.icon;
            return (
              <div
                key={idx}
                className="corridor-gate-card rounded-3xl p-7 bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-blue-400 hover:shadow-2xl transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${idx * 15}px)`
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase text-white tracking-wider"
                      style={{ backgroundColor: gate.accent }}
                    >
                      {gate.gate}
                    </span>
                    <span className="text-xs font-black font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {gate.failureRate}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-xs">
                    <Icon className="w-6 h-6" style={{ color: gate.accent }} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug mb-2">
                    {gate.title}
                  </h3>

                  <p className="text-xs font-semibold text-blue-600 mb-3">
                    Evaluator: {gate.evaluator}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {gate.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-200/80 pt-4 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Strict Vetting Benchmarks:
                    </span>
                    {gate.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Pass Threshold: &gt;90%</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
