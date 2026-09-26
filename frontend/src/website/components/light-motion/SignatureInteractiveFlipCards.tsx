import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface FlipCandidate {
  id: string;
  role: string;
  yoe: string;
  comp: string;
  badge: string;
  formerOrg: string;
  rubricScores: { label: string; score: string }[];
  notice: string;
}

const CANDIDATES: FlipCandidate[] = [
  {
    id: 'c1',
    role: 'Principal Low-Latency C++ Architect',
    yoe: '11 YOE',
    comp: '₹95L – ₹1.25 Cr',
    badge: 'HFT Trading Core',
    formerOrg: 'Ex-Tower Research / Citadel Colleague',
    rubricScores: [
      { label: 'Kernel Bypass SPSC Queue', score: '4.2ns P99' },
      { label: 'Lock-Free Memory Ordering', score: '100% Contention-Free' },
      { label: 'FPGA Verilog Synthesis', score: 'Production Verified' }
    ],
    notice: 'Immediate 15-Day Buyout'
  },
  {
    id: 'c2',
    role: 'Staff Distributed Storage Architect',
    yoe: '13 YOE',
    comp: '₹85L + RSUs',
    badge: 'Distributed Mesh',
    formerOrg: 'Ex-Uber Storage / CockroachDB Core',
    rubricScores: [
      { label: 'Raft Byzantine Consensus', score: 'Zero Divergence' },
      { label: 'Multi-Region K8s Mesh', score: '99.999% SLA' },
      { label: 'eBPF Kernel Tracing', score: 'Staff Level' }
    ],
    notice: 'Available under NDA'
  },
  {
    id: 'c3',
    role: 'VP & Head of AI Infrastructure',
    yoe: '15 YOE',
    comp: '₹1.60 Cr + Equity',
    badge: 'Foundation GenAI',
    formerOrg: 'Ex-Meta FAIR / DeepMind Collaborator',
    rubricScores: [
      { label: 'vLLM Tensor Core Paging', score: '14k tokens/sec' },
      { label: 'Megatron Cluster Scaling', score: '2,048 H100 Pods' },
      { label: 'Team Leadership Bar', score: 'Scaled 65+ Eng Org' }
    ],
    notice: 'Direct Partner Calibration'
  }
];

export const SignatureInteractiveFlipCards: React.FC = () => {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Reveal 04 • 3D 180° Flip Dossier Cards</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            3D Interactive Flip Dossier Cards
          </h2>
          <p className="text-lg text-slate-600">
            Click any candidate card to flip 180° in 3D perspective, revealing behind-the-scenes architectural benchmark scores and former company history.
          </p>
        </div>

        {/* 3 Flip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: '1200px' }}>
          {CANDIDATES.map((c) => {
            const isFlipped = !!flipped[c.id];
            return (
              <div
                key={c.id}
                onClick={() => toggleFlip(c.id)}
                className="relative h-[380px] w-full cursor-pointer select-none"
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 p-8 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col justify-between"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase">
                          {c.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">{c.yoe}</span>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 leading-snug mb-2">
                        {c.role}
                      </h3>
                      <p className="text-xs text-slate-500 mb-6">{c.formerOrg}</p>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Compensation</span>
                        <span className="text-xl font-black font-mono text-blue-600 block mt-0.5">{c.comp}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                      <span>Click to Flip for Technical Rubric &rarr;</span>
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Back Side (180deg) */}
                  <div
                    className="absolute inset-0 p-8 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col justify-between"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                          ● VETTING DOSSIER
                        </span>
                        <span className="text-xs font-mono text-slate-400">{c.notice}</span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-4">
                        Architecture Scorecard
                      </h4>

                      <div className="space-y-3">
                        {c.rubricScores.map((score, sIdx) => (
                          <div key={sIdx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
                            <span className="text-slate-300">{score.label}</span>
                            <span className="font-mono font-bold text-emerald-400">{score.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
                      <span>&larr; Click to Flip Back</span>
                      <span className="text-emerald-400">100% Cleared</span>
                    </div>
                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
