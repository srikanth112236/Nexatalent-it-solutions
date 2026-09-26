import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

interface MorphState {
  id: string;
  name: string;
  tag: string;
  headline: string;
  description: string;
  pathD: string;
  accent: string;
}

const MORPH_STATES: MorphState[] = [
  {
    id: 's1',
    name: '01. Raw Mandate Ideation',
    tag: 'Stage 1 • Scope Calibration',
    headline: 'Deconstructing CTO Non-Negotiables',
    description: 'Synthesizing disparate engineering requirements, tech stack constraints, and compensation bands into a formalized rubric.',
    pathD: 'M 100, 20 C 180, 20 220, 80 210, 160 C 200, 240 140, 230 70, 210 C 10, 190 20, 120 40, 60 C 50, 25 70, 20 100, 20 Z',
    accent: '#2563eb'
  },
  {
    id: 's2',
    name: '02. Vector Sieve Mapping',
    tag: 'Stage 2 • Talent Index',
    headline: 'Filtering 45,000+ Verified Leaders',
    description: 'Scouring passive talent networks across Bangalore, London, and Silicon Valley to isolate candidates with true production scale.',
    pathD: 'M 110, 30 C 190, 40 240, 110 220, 180 C 190, 240 110, 250 50, 210 C 10, 170 30, 90 60, 40 C 80, 25 90, 30 110, 30 Z',
    accent: '#7c3aed'
  },
  {
    id: 's3',
    name: '03. Architectural Vetting',
    tag: 'Stage 3 • Live Profiling',
    headline: 'Benchmarking Lock-Free Kernels',
    description: 'Staff engineers evaluate candidate pull requests, race condition resilience, and distributed consensus loops on live test clusters.',
    pathD: 'M 120, 20 C 210, 30 230, 130 200, 200 C 170, 260 80, 230 40, 180 C 10, 130 40, 60 70, 30 C 90, 20 100, 20 120, 20 Z',
    accent: '#0891b2'
  },
  {
    id: 's4',
    name: '04. Turnkey Center Go-Live',
    tag: 'Stage 4 • Autonomous Center',
    headline: 'Autonomous 120-Engineer Center',
    description: 'Founding leadership cadre deployed, turnkey SEZ facilities operational, and 100% intellectual property transfer executed.',
    pathD: 'M 100, 30 C 170, 30 230, 90 220, 170 C 210, 240 130, 240 60, 200 C 10, 160 20, 90 50, 50 C 70, 30 85, 30 100, 30 Z',
    accent: '#10b981'
  }
];

export const SignatureMorphingShapeSVG: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = MORPH_STATES[activeIdx];

  const cycleNext = () => {
    setActiveIdx((prev) => (prev + 1) % MORPH_STATES.length);
  };

  return (
    <section className="py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Reveal 02 • Liquid Morphing Shape Physics</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Liquid Morphing Search Topology
          </h2>
          <p className="text-lg text-slate-600">
            Click through the lifecycle stages to watch the organic SVG vector smoothly morph and recalculate candidate geometry.
          </p>
        </div>

        {/* 2-Column: Morphing Shape & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Morphing Canvas SVG */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              <svg viewBox="0 0 250 250" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="morphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={current.accent} />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>

                <motion.path
                  d={current.pathD}
                  fill="url(#morphGrad)"
                  fillOpacity="0.18"
                  stroke={current.accent}
                  strokeWidth="3"
                  initial={false}
                  animate={{ d: current.pathD }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Current Topology</span>
                <span className="text-xl font-black text-slate-900 mt-1">{current.name.split('.')[1]}</span>
              </div>
            </div>

            <button
              onClick={cycleNext}
              className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Morph to Next Stage</span>
            </button>
          </div>

          {/* Right: Stage Detail Tabs */}
          <div className="lg:col-span-6 space-y-4">
            {MORPH_STATES.map((state, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={state.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                      : 'bg-white/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold uppercase ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {state.tag}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    {state.headline}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {state.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
