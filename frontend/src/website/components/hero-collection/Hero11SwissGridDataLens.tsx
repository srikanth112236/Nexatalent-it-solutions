import React, { useState } from 'react';
import { Crosshair, ArrowRight } from 'lucide-react';

export const Hero11SwissGridDataLens: React.FC = () => {
  const [selectedSpec, setSelectedSpec] = useState<'infra' | 'ml' | 'fintech'>('infra');

  const specs = {
    infra: { title: 'Distributed SRE & Kubernetes', engineers: '340 Verified', rating: '99.4%', lead: '10 Days' },
    ml: { title: 'Post-Training LLM & CUDA', engineers: '190 Verified', rating: '99.8%', lead: '14 Days' },
    fintech: { title: 'Low-Latency C++ & FPGA', engineers: '220 Verified', rating: '99.1%', lead: '12 Days' },
  };

  const curr = specs[selectedSpec];

  return (
    <div className="relative min-h-[92vh] bg-white text-black overflow-hidden flex items-center justify-center border-y border-neutral-300 font-sans">
      
      {/* Swiss Hairline Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Coordinate Stamp */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-neutral-400">
        LAT: 12.9716° N / LON: 77.5946° E [SWISS GRID ARCHITECTURE]
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Swiss Minimal Typography */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[11px] font-mono tracking-wider font-bold">
            <Crosshair className="w-3.5 h-3.5 text-neutral-300" />
            <span>SWISS SPECIFICATION · DATA LENS 2026</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.95] text-black">
            Objective. <br />
            Deterministic. <br />
            Global Tech.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 font-light max-w-lg leading-relaxed">
            Eliminate subjective interviewing. NexaTalent IT Solutions measures algorithmic complexity, production incident response, and distributed consistency with zero guesswork.
          </p>

          {/* Interactive Specification Switcher */}
          <div className="flex gap-2 pt-2">
            {[
              { id: 'infra', label: '01 / Infrastructure' },
              { id: 'ml', label: '02 / Frontier ML' },
              { id: 'fintech', label: '03 / Quant Engine' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedSpec(btn.id as any)}
                className={`px-3.5 py-2 text-xs font-mono font-bold border transition-all cursor-pointer ${
                  selectedSpec === btn.id 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-black hover:text-black'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              className="px-7 py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Inspect Talent Lens</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Swiss Lens Precision Card */}
        <div className="lg:col-span-5">
          <div className="p-8 bg-neutral-50 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex items-center justify-between border-b border-black pb-3 text-xs font-mono font-bold">
              <span>TALENT LENS SPEC: {selectedSpec.toUpperCase()}</span>
              <span>VERIFIED</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase">Target Domain</div>
                <div className="text-xl font-bold text-black mt-0.5">{curr.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-neutral-500">AVAILABLE BENCH</div>
                  <div className="text-base font-bold text-black">{curr.engineers}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">VETTING ACCURACY</div>
                  <div className="text-base font-bold text-emerald-600">{curr.rating}</div>
                </div>
              </div>

              <div className="p-3 bg-white border border-neutral-300 text-xs font-mono flex items-center justify-between">
                <span>Mean Intake To Offer:</span>
                <strong className="text-black">{curr.lead}</strong>
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-neutral-400 text-right">
              NEXATALENT IT SOLUTIONS DETERMINISTIC INDEX • ISO 9001
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
