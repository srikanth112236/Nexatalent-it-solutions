import React, { useState } from 'react';
import { Eye } from 'lucide-react';

interface SpotlightRole {
  id: string;
  role: string;
  company: string;
  secretStats: string;
  patents: string;
  equityHoldings: string;
}

const SPOTLIGHT_DATA: SpotlightRole[] = [
  { id: '1', role: 'Staff Distributed Storage Architect', company: 'Ex-Uber Storage Lead', secretStats: 'Architected petabyte Kafka ingest cluster handling 45M ops/sec', patents: '2 US Patents in Multi-Raft Partitioning', equityHoldings: 'Calibrated at ₹85L + RSUs' },
  { id: '2', role: 'VP & Head of Machine Learning Systems', company: 'Ex-FAANG Core AI Lab', secretStats: 'Trained and served 70B parameter models across 2,048 H100 GPUs', patents: '3 Patents in Fused Attention Memory Kernels', equityHoldings: 'Calibrated at ₹1.65 Cr + Tier-1 Equity' },
  { id: '3', role: 'Principal Low-Latency C++ Engineer', company: 'Ex-Top 3 Global Market Maker', secretStats: 'Achieved sub-420ns tick-to-trade order matching loop in hardware', patents: 'Proprietary Zero-Contention Ring Buffer Author', equityHoldings: 'Calibrated at ₹1.20 Cr Base' }
];

export const SignatureStickySpotlightAccordion: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 300, y: 150 });
  const [activeId, setActiveId] = useState('1');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section className="py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Reveal 06 • Interactive Spotlight Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Interactive Spotlight Intelligence Beam
          </h2>
          <p className="text-lg text-slate-600">
            Hover your cursor across the panel to cast a luminous spotlight revealing confidential architectural patents and deep candidate metrics.
          </p>
        </div>

        {/* Interactive Spotlight Container */}
        <div
          onMouseMove={handleMouseMove}
          className="relative max-w-5xl mx-auto rounded-3xl p-8 md:p-12 bg-white border border-slate-200 shadow-2xl overflow-hidden cursor-crosshair"
          style={{
            backgroundImage: `radial-gradient(circle 280px at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.12), transparent 80%)`
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                Active Candidate Spotlight Inspection
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
                Verified Deep-Tech Leader Profiles
              </h3>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
              SOC2 Type II Protected
            </span>
          </div>

          <div className="mt-8 space-y-4">
            {SPOTLIGHT_DATA.map((item) => {
              const isSelected = activeId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/40 border-2 border-blue-600 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-slate-900">{item.role}</h4>
                    <span className="text-xs font-mono font-bold text-slate-400">{item.company}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {item.secretStats}
                  </p>

                  <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700">{item.patents}</span>
                    <span className="font-mono font-black text-blue-600">{item.equityHoldings}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            Move mouse cursor to inspect hidden verification tags • 100% Verified Profiles
          </div>
        </div>

      </div>
    </section>
  );
};
