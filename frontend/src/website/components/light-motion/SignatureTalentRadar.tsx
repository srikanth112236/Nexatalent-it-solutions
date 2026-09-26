import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, Sparkles, Shield, Zap } from 'lucide-react';

interface SeniorityTier {
  id: string;
  name: string;
  architecture: number; // 0 - 100
  concurrency: number;
  aiOptimization: number;
  leadership: number;
  incidentRecovery: number;
  deliverySLA: string;
  medianComp: string;
}

const TIERS: SeniorityTier[] = [
  {
    id: 'staff',
    name: 'Staff Software Architect',
    architecture: 92,
    concurrency: 88,
    aiOptimization: 80,
    leadership: 84,
    incidentRecovery: 86,
    deliverySLA: '48 Hours',
    medianComp: '₹65L – ₹85L'
  },
  {
    id: 'principal',
    name: 'Principal Systems Specialist',
    architecture: 98,
    concurrency: 96,
    aiOptimization: 86,
    leadership: 90,
    incidentRecovery: 95,
    deliverySLA: '72 Hours',
    medianComp: '₹85L – ₹1.25Cr'
  },
  {
    id: 'director',
    name: 'VP / Engineering Director',
    architecture: 90,
    concurrency: 85,
    aiOptimization: 92,
    leadership: 98,
    incidentRecovery: 94,
    deliverySLA: '5 Days',
    medianComp: '₹1.25Cr – ₹2.10Cr'
  },
  {
    id: 'fellow',
    name: 'Distinguished Fellow (AI / HFT)',
    architecture: 99,
    concurrency: 99,
    aiOptimization: 99,
    leadership: 92,
    incidentRecovery: 98,
    deliverySLA: 'Direct Partner Pod',
    medianComp: '₹2.00Cr+'
  }
];

export const SignatureTalentRadar: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<SeniorityTier>(TIERS[1]);

  // Compute SVG polygon coordinates for a 5-axis radar
  // Axis: 0: Top (Architecture), 1: Right-Top (Concurrency), 2: Right-Bottom (AI), 3: Left-Bottom (Leadership), 4: Left-Top (Incident)
  const size = 320;
  const center = size / 2;
  const radius = 120;
  const angles = [-90, -18, 54, 126, 198]; // 5 equidistant angles in degrees

  const getCoordinates = (value: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad)
    };
  };

  const points = [
    getCoordinates(selectedTier.architecture, angles[0]),
    getCoordinates(selectedTier.concurrency, angles[1]),
    getCoordinates(selectedTier.aiOptimization, angles[2]),
    getCoordinates(selectedTier.leadership, angles[3]),
    getCoordinates(selectedTier.incidentRecovery, angles[4])
  ];

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Radar className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span>Signature Component 41 • 5-Axis Capability Radar</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Interactive Seniority & Competency Radar
          </h2>
          <p className="text-lg text-slate-600">
            Real-time multi-dimensional assessment score across System Architecture, Distributed Concurrency, AI Optimization, and Executive Leadership.
          </p>
        </div>

        {/* Tier Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier)}
              className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                selectedTier.id === tier.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tier.name}
            </button>
          ))}
        </div>

        {/* Radar & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Radar Visualization */}
          <div className="lg:col-span-6 bg-slate-50/80 rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-between mb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>5-Axis Normalized Assessment</span>
              <span className="text-blue-600 font-mono">Calibrated P95+</span>
            </div>

            <div className="relative w-[320px] h-[320px]">
              <svg width={size} height={size} className="overflow-visible">
                {/* Concentric Grid Rings */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <circle
                    key={i}
                    cx={center}
                    cy={center}
                    r={radius * level}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray={i < 3 ? '3 3' : 'none'}
                  />
                ))}

                {/* Axis Spokes */}
                {angles.map((ang, i) => {
                  const spokeEnd = getCoordinates(100, ang);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={spokeEnd.x}
                      y2={spokeEnd.y}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Radar Dynamic Polygon */}
                <motion.polygon
                  points={polygonPath}
                  fill="rgba(37, 99, 235, 0.22)"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  initial={false}
                  animate={{ points: polygonPath }}
                  transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                />

                {/* Vertex Markers */}
                {points.map((pt, i) => (
                  <motion.circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    initial={false}
                    animate={{ cx: pt.x, cy: pt.y }}
                    transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                  />
                ))}
              </svg>

              {/* Axis Labels */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200 whitespace-nowrap">
                Architecture ({selectedTier.architecture}%)
              </div>
              <div className="absolute top-24 -right-10 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200 whitespace-nowrap">
                Concurrency ({selectedTier.concurrency}%)
              </div>
              <div className="absolute bottom-2 right-4 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200 whitespace-nowrap">
                GenAI & ML ({selectedTier.aiOptimization}%)
              </div>
              <div className="absolute bottom-2 left-4 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200 whitespace-nowrap">
                Leadership ({selectedTier.leadership}%)
              </div>
              <div className="absolute top-24 -left-10 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200 whitespace-nowrap">
                Incident Recovery ({selectedTier.incidentRecovery}%)
              </div>
            </div>

            <p className="mt-8 text-xs text-slate-500 text-center">
              Evaluated via NexaTalent 4-Stage Architectural Defense. Only candidates exceeding 85% in all vectors qualify for enterprise shortlist.
            </p>
          </div>

          {/* Metric Breakdown Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Selected Profile Profile</span>
                  <h3 className="text-2xl font-black text-slate-900">{selectedTier.name}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3.5 my-6">
                {[
                  { label: 'System & Distributed Architecture', val: selectedTier.architecture, color: 'bg-blue-600' },
                  { label: 'Ultra-Low Latency & High Concurrency', val: selectedTier.concurrency, color: 'bg-indigo-600' },
                  { label: 'Production GenAI & Fine-Tuning Kernels', val: selectedTier.aiOptimization, color: 'bg-emerald-600' },
                  { label: 'Executive Team Governance & Mentorship', val: selectedTier.leadership, color: 'bg-amber-500' },
                  { label: 'Chaos Engineering & Incident Recovery', val: selectedTier.incidentRecovery, color: 'bg-rose-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Shortlist SLA</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    {selectedTier.deliverySLA}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Target Compensation</span>
                  <span className="font-extrabold text-blue-600 font-mono mt-0.5 block">
                    {selectedTier.medianComp}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Want to calibrate bespoke radar axes for your tech stack?</span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all cursor-pointer">
                Request Calibration
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
