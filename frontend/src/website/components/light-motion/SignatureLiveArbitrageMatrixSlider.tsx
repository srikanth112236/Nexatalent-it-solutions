import React, { useState } from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';

export const SignatureLiveArbitrageMatrixSlider: React.FC = () => {
  const [headcount, setHeadcount] = useState(30);
  const [seniorRatio, setSeniorRatio] = useState(40); // 40% Staff/Principal, 60% Senior
  const [location, setLocation] = useState<'blr' | 'hyd'>('blr');

  // Pricing calculations
  const staffRateBlr = 9500; // monthly USD
  const srRateBlr = 6500;
  const staffRateUS = 28000;
  const srRateUS = 20000;

  const locMultiplier = location === 'hyd' ? 0.92 : 1.0;

  const staffCount = Math.round((headcount * seniorRatio) / 100);
  const srCount = headcount - staffCount;

  const monthlyBlr = (staffCount * staffRateBlr + srCount * srRateBlr) * locMultiplier;
  const monthlyUS = staffCount * staffRateUS + srCount * srRateUS;
  const netMonthlySavings = monthlyUS - monthlyBlr;
  const netAnnualSavings = netMonthlySavings * 12;
  const savingsPct = Math.round((netMonthlySavings / monthlyUS) * 100);

  return (
    <section className="py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Reveal 07 • Live Multi-Slider Arbitrage Calculator</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Live GCC Capital Arbitrage Engine
          </h2>
          <p className="text-lg text-slate-600">
            Dynamically adjust squad size, staff-to-senior ratio, and location hub to simulate real-time capital reinvestment margins.
          </p>
        </div>

        {/* 2-Column: Sliders & Live Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase text-slate-600">Total Engineering Headcount</label>
                <span className="text-base font-black font-mono text-blue-600 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  {headcount} Engineers
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase text-slate-600">Senior Staff / Principal Ratio</label>
                <span className="text-base font-black font-mono text-purple-600 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  {seniorRatio}% Staff ({staffCount} Staff, {srCount} Sr)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="10"
                value={seniorRatio}
                onChange={(e) => setSeniorRatio(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold uppercase text-slate-600 block mb-2">Target Capability Hub</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLocation('blr')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    location === 'blr' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Bangalore (Indiranagar / ORR)
                </button>
                <button
                  onClick={() => setLocation('hyd')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    location === 'hyd' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Hyderabad (HITEC City)
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400">FINANCIAL SIMULATION</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-900 text-xs font-black">
                {savingsPct}% Cost Efficiency
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly India Run Rate</span>
                <span className="text-xl md:text-2xl font-black text-blue-400 font-mono block mt-1">
                  ${(monthlyBlr / 1000).toFixed(0)}k / mo
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">US Equivalent Spend</span>
                <span className="text-xl md:text-2xl font-black text-rose-400 font-mono block mt-1">
                  ${(monthlyUS / 1000).toFixed(0)}k / mo
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block">
                Net Annual Capital Arbitrage
              </span>
              <div className="text-3xl md:text-4xl font-black font-mono mt-1">
                +${(netAnnualSavings / 1000000).toFixed(2)}M / Year
              </div>
              <p className="text-xs text-blue-100 mt-2">
                Reinvest into accelerated product velocity with top 0.5% Staff-vetted engineers.
              </p>
            </div>

            <button className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
              <span>Export Custom Financial Model (PDF)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
