import React, { useState } from 'react';
import { Cpu, ArrowRight } from 'lucide-react';

export const DetailGccTurnkeyPodConfigurator: React.FC = () => {
  const [leadArchitects, setLeadArchitects] = useState<number>(1);
  const [seniorEngineers, setSeniorEngineers] = useState<number>(4);
  const [sreDevOps, setSreDevOps] = useState<number>(1);
  const [qaAutomators, setQaAutomators] = useState<number>(2);

  const totalSeats = leadArchitects + seniorEngineers + sreDevOps + qaAutomators;
  // Estimated monthly cost in USD ($5k/sr, $8k/lead, $6k/sre, $3.5k/qa)
  const monthlyEstimate = (leadArchitects * 8200) + (seniorEngineers * 5200) + (sreDevOps * 6000) + (qaAutomators * 3800);
  const usEquivalent = totalSeats * 22500;
  const annualSavings = (usEquivalent - monthlyEstimate) * 12;

  return (
    <div className="w-full bg-[#FAF8F5] py-8 px-4 sm:px-8 border-y border-slate-200/80">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Squad Sizing Engine</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Configure Your Sovereign Engineering Pod
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Adjust team composition to model an indicative pod. Figures use illustrative planning rates and are confirmed per mandate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Principal / Staff Lead Architects ($8.2k/mo)</span>
                <span className="font-mono text-blue-600">{leadArchitects} Architect</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={leadArchitects}
                onChange={(e) => setLeadArchitects(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Senior Software Engineers ($5.2k/mo)</span>
                <span className="font-mono text-blue-600">{seniorEngineers} Engineers</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                value={seniorEngineers}
                onChange={(e) => setSeniorEngineers(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>DevSecOps & SRE Architects ($6.0k/mo)</span>
                <span className="font-mono text-blue-600">{sreDevOps} SREs</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={sreDevOps}
                onChange={(e) => setSreDevOps(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Automation QA & Performance Engineers ($3.8k/mo)</span>
                <span className="font-mono text-blue-600">{qaAutomators} QA Automators</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={qaAutomators}
                onChange={(e) => setQaAutomators(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Pricing Preview Box */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Pod Summary</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-bold">
                  {totalSeats} Total Seats
                </span>
              </div>

              <div className="text-3xl font-black font-mono text-white mb-1">
                ${monthlyEstimate.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 font-light">Indicative planning rates including office, payroll coordination, hardware & insurance.</p>

              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 mb-6">
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Indicative Annual Comparison</div>
                <div className="text-2xl font-black font-mono text-emerald-300">
                  ${annualSavings.toLocaleString()} / yr
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1 font-light">Illustrative delta vs a single-market baseline. Final commercials per agreement.</div>
              </div>
            </div>

            <button 
              type="button"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
            >
              <span>Request Detailed Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
