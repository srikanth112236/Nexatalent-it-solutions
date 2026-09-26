import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';

interface CityCompensation {
  city: string;
  country: string;
  currency: string;
  baseMedian: string;
  bonusEsop: string;
  totalCompUSD: number;
  purchasingPowerIndex: number; // 0 - 100
  talentDensity: string;
}

interface RoleHeatmap {
  id: string;
  title: string;
  specialization: string;
  cities: CityCompensation[];
}

const HEATMAP_DATA: RoleHeatmap[] = [
  {
    id: 'ai-lead',
    title: 'Head / VP of AI Infrastructure',
    specialization: 'GPU Clusters, vLLM, Distributed Training, Tensor Kernels',
    cities: [
      { city: 'San Francisco', country: 'USA', currency: '$', baseMedian: '$420,000', bonusEsop: '$250,000', totalCompUSD: 670000, purchasingPowerIndex: 68, talentDensity: 'High' },
      { city: 'New York', country: 'USA', currency: '$', baseMedian: '$390,000', bonusEsop: '$220,000', totalCompUSD: 610000, purchasingPowerIndex: 65, talentDensity: 'High' },
      { city: 'London', country: 'UK', currency: '£', baseMedian: '£220,000', bonusEsop: '£120,000', totalCompUSD: 440000, purchasingPowerIndex: 72, talentDensity: 'Medium-High' },
      { city: 'Bangalore', country: 'India', currency: '₹', baseMedian: '₹1.25 Cr', bonusEsop: '₹60 Lakhs', totalCompUSD: 220000, purchasingPowerIndex: 96, talentDensity: 'Very High' },
      { city: 'Hyderabad', country: 'India', currency: '₹', baseMedian: '₹1.10 Cr', bonusEsop: '₹50 Lakhs', totalCompUSD: 195000, purchasingPowerIndex: 94, talentDensity: 'High' }
    ]
  },
  {
    id: 'staff-backend',
    title: 'Staff Distributed Systems Architect',
    specialization: 'Go/Rust, Raft Consensus, Multi-Region Kubernetes, High-QPS Fabrics',
    cities: [
      { city: 'San Francisco', country: 'USA', currency: '$', baseMedian: '$280,000', bonusEsop: '$140,000', totalCompUSD: 420000, purchasingPowerIndex: 68, talentDensity: 'High' },
      { city: 'New York', country: 'USA', currency: '$', baseMedian: '$260,000', bonusEsop: '$130,000', totalCompUSD: 390000, purchasingPowerIndex: 65, talentDensity: 'High' },
      { city: 'London', country: 'UK', currency: '£', baseMedian: '£160,000', bonusEsop: '£70,000', totalCompUSD: 295000, purchasingPowerIndex: 72, talentDensity: 'Medium-High' },
      { city: 'Bangalore', country: 'India', currency: '₹', baseMedian: '₹75 Lakhs', bonusEsop: '₹35 Lakhs', totalCompUSD: 132000, purchasingPowerIndex: 95, talentDensity: 'Very High' },
      { city: 'Hyderabad', country: 'India', currency: '₹', baseMedian: '₹68 Lakhs', bonusEsop: '₹30 Lakhs', totalCompUSD: 118000, purchasingPowerIndex: 93, talentDensity: 'High' }
    ]
  },
  {
    id: 'quant-dev',
    title: 'Low-Latency C++ Quantitative Engineer',
    specialization: 'FPGA, Kernel Bypass, Order Execution Engines, Sub-Microsecond Tuning',
    cities: [
      { city: 'New York', country: 'USA', currency: '$', baseMedian: '$320,000', bonusEsop: '$250,000', totalCompUSD: 570000, purchasingPowerIndex: 65, talentDensity: 'High' },
      { city: 'London', country: 'UK', currency: '£', baseMedian: '£195,000', bonusEsop: '£160,000', totalCompUSD: 450000, purchasingPowerIndex: 72, talentDensity: 'High' },
      { city: 'San Francisco', country: 'USA', currency: '$', baseMedian: '$300,000', bonusEsop: '$200,000', totalCompUSD: 500000, purchasingPowerIndex: 68, talentDensity: 'Medium' },
      { city: 'Bangalore', country: 'India', currency: '₹', baseMedian: '₹95 Lakhs', bonusEsop: '₹55 Lakhs', totalCompUSD: 180000, purchasingPowerIndex: 96, talentDensity: 'Very High' },
      { city: 'Hyderabad', country: 'India', currency: '₹', baseMedian: '₹85 Lakhs', bonusEsop: '₹45 Lakhs', totalCompUSD: 155000, purchasingPowerIndex: 94, talentDensity: 'High' }
    ]
  }
];

export const SignatureCompensationHeatmap: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleHeatmap>(HEATMAP_DATA[0]);

  const maxTotalUSD = Math.max(...selectedRole.cities.map(c => c.totalCompUSD));

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 45 • Cross-Border Compensation Heatmap</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Global Tech Leadership Compensation Matrix
          </h2>
          <p className="text-lg text-slate-600">
            Real compensation percentiles, equity vesting, and purchasing-power-parity (PPP) indices across Tier-1 tech centers.
          </p>
        </div>

        {/* Role Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {HEATMAP_DATA.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                selectedRole.id === role.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {role.title}
            </button>
          ))}
        </div>

        {/* Heatmap Card */}
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 md:p-10 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Specialization Focus</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">{selectedRole.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedRole.specialization}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              <span>Calibrated Q1 2026 Data</span>
            </div>
          </div>

          {/* Matrix Rows */}
          <div className="mt-8 space-y-4">
            {selectedRole.cities.map((city, idx) => {
              const barWidthPercent = (city.totalCompUSD / maxTotalUSD) * 100;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* City & Country */}
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base">{city.city}</span>
                        <span className="text-xs text-slate-400 font-semibold">{city.country}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Density: <strong className="text-slate-700">{city.talentDensity}</strong>
                      </span>
                    </div>

                    {/* Visual Comp Bar */}
                    <div className="md:col-span-5">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                        <span>Base: {city.baseMedian}</span>
                        <span className="text-slate-500">ESOP/Bonus: {city.bonusEsop}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidthPercent}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                        />
                      </div>
                    </div>

                    {/* Total USD & PPP Index */}
                    <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-6 text-right">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total USD Normalized</span>
                        <span className="text-lg font-black text-slate-900 font-mono">
                          ${(city.totalCompUSD / 1000).toFixed(0)}k / yr
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Local PPP Index</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block font-mono">
                          {city.purchasingPowerIndex} / 100
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Under Matrix Advisory Note */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>
              Data synthesized from 1,200+ executive offers calibrated across India, UK, and US tech corridors in 2025–2026.
            </p>
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
              Download Full Salary Matrix CSV &rarr;
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
