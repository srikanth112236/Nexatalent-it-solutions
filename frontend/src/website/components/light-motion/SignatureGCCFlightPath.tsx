import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, ArrowRight, TrendingDown } from 'lucide-react';

interface FlightCorridor {
  id: string;
  sourceCity: string;
  sourceRegion: string;
  targetCity: string;
  targetRegion: string;
  distanceKm: string;
  flightHours: string;
  sfCostPerHead: number; // in USD
  targetCostPerHead: number; // in USD
  setupSLA: string;
  primaryStacks: string[];
}

const CORRIDORS: FlightCorridor[] = [
  {
    id: 'sf-blr',
    sourceCity: 'San Francisco',
    sourceRegion: 'Bay Area, USA',
    targetCity: 'Bangalore',
    targetRegion: 'Karnataka, India',
    distanceKm: '13,500 km',
    flightHours: '19 hrs',
    sfCostPerHead: 385000,
    targetCostPerHead: 92000,
    setupSLA: '60 Calendar Days',
    primaryStacks: ['Distributed Systems', 'LLM Kernels', 'Cloud Native Go']
  },
  {
    id: 'ldn-hyd',
    sourceCity: 'London',
    sourceRegion: 'City & Canary Wharf, UK',
    targetCity: 'Hyderabad',
    targetRegion: 'Telangana, India',
    distanceKm: '7,700 km',
    flightHours: '9.5 hrs',
    sfCostPerHead: 240000,
    targetCostPerHead: 78000,
    setupSLA: '45 Calendar Days',
    primaryStacks: ['FinTech Infrastructure', 'Algorithmic Risk', 'Low-Latency C++']
  },
  {
    id: 'nyc-blr',
    sourceCity: 'New York',
    sourceRegion: 'Manhattan, USA',
    targetCity: 'Bangalore',
    targetRegion: 'Indiranagar & ORR, India',
    distanceKm: '13,300 km',
    flightHours: '18 hrs',
    sfCostPerHead: 350000,
    targetCostPerHead: 88000,
    setupSLA: '55 Calendar Days',
    primaryStacks: ['Quant Systems', 'Data Platform', 'Cybersecurity']
  }
];

export const SignatureGCCFlightPath: React.FC = () => {
  const [selectedCorridor, setSelectedCorridor] = useState<FlightCorridor>(CORRIDORS[0]);
  const [podSize, setPodSize] = useState<number>(30); // 10 to 100 engineers

  const annualSourceSpend = selectedCorridor.sfCostPerHead * podSize;
  const annualTargetSpend = selectedCorridor.targetCostPerHead * podSize;
  const annualSavings = annualSourceSpend - annualTargetSpend;
  const savingsPercent = Math.round((annualSavings / annualSourceSpend) * 100);

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Plane className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 42 • Geo-Orbital GCC Relocation & Pod Corridors</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Global Capability Center Orbital Flight Paths
          </h2>
          <p className="text-lg text-slate-600">
            Interactive talent arbitrage engine modeling engineering squad setups, compensation differentials, and turnkey launch SLAs from Western hubs to India.
          </p>
        </div>

        {/* Corridor Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {CORRIDORS.map((corridor) => (
            <button
              key={corridor.id}
              onClick={() => setSelectedCorridor(corridor)}
              className={`p-6 rounded-3xl text-left border transition-all cursor-pointer ${
                selectedCorridor.id === corridor.id
                  ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                  {corridor.flightHours} Corridor
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">{corridor.distanceKm}</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-black text-slate-900 mb-1">
                <span>{corridor.sourceCity}</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600">{corridor.targetCity}</span>
              </div>
              <p className="text-xs text-slate-500">{corridor.sourceRegion} &rarr; {corridor.targetRegion}</p>
            </button>
          ))}
        </div>

        {/* Interactive Flight Simulation & Arbitrage Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Geo Flight Path SVG Canvas */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Orbital Trajectory & SLA
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                Turnkey SLA: {selectedCorridor.setupSLA}
              </span>
            </div>

            {/* Flight Path Graphic SVG */}
            <div className="relative py-10">
              <svg viewBox="0 0 500 240" className="w-full h-auto">
                <defs>
                  <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Dashed trajectory arc */}
                <path
                  d="M 50 180 Q 250 20 450 180"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 50 180 Q 250 20 450 180"
                  fill="none"
                  stroke="url(#corridorGrad)"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />

                {/* Source Node */}
                <circle cx="50" cy="180" r="14" fill="#2563eb" />
                <circle cx="50" cy="180" r="24" fill="#2563eb" fillOpacity="0.15" />
                <text x="50" y="215" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">
                  {selectedCorridor.sourceCity}
                </text>
                <text x="50" y="232" textAnchor="middle" fontSize="10" fill="#64748b">
                  ${(selectedCorridor.sfCostPerHead / 1000).toFixed(0)}k/yr avg
                </text>

                {/* Target Node */}
                <circle cx="450" cy="180" r="14" fill="#10b981" />
                <circle cx="450" cy="180" r="24" fill="#10b981" fillOpacity="0.15" />
                <text x="450" y="215" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">
                  {selectedCorridor.targetCity}
                </text>
                <text x="450" y="232" textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="bold">
                  ${(selectedCorridor.targetCostPerHead / 1000).toFixed(0)}k/yr avg
                </text>

                {/* Mid Flight Indicator */}
                <g transform="translate(250, 95)">
                  <rect x="-60" y="-18" width="120" height="36" rx="10" fill="#0f172a" />
                  <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">
                    {savingsPercent}% Cost Savings
                  </text>
                </g>
              </svg>
            </div>

            {/* Core Tech Stack Pod Tags */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Specialized Pod Stacks Ready in this Corridor:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCorridor.primaryStacks.map((st, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Pod Arbitrage Calculator */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Target Squad Size (Engineers)
                </label>
                <span className="text-base font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
                  {podSize} Engineers
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={podSize}
                onChange={(e) => setPodSize(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>5 Engineers (Pilot Pod)</span>
                <span>50 Engineers (Sub-Org)</span>
                <span>100 Engineers (Turnkey Center)</span>
              </div>
            </div>

            {/* Financial Output Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                  {selectedCorridor.sourceCity} Annual Cost
                </span>
                <span className="text-xl md:text-2xl font-black text-rose-900 font-mono block mt-1">
                  ${(annualSourceSpend / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-rose-500 block mt-1">
                  Based on Western market comp bands
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  {selectedCorridor.targetCity} GCC Spend
                </span>
                <span className="text-xl md:text-2xl font-black text-emerald-900 font-mono block mt-1">
                  ${(annualTargetSpend / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                  Includes infrastructure & EOR
                </span>
              </div>
            </div>

            {/* Net Annual Arbitrage Highlight */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-200 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  Net Annual Capital Arbitrage
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-900 text-xs font-black">
                  {savingsPercent}% Efficiency
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-black font-mono">
                +${(annualSavings / 1000000).toFixed(2)}M / Year
              </div>
              <p className="text-xs text-blue-100 mt-2">
                Reinvest into accelerated R&D velocity while maintaining top 0.5% engineering talent quality.
              </p>
            </div>

            <button className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
              <span>Initiate Feasibility Study for {selectedCorridor.targetCity}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
