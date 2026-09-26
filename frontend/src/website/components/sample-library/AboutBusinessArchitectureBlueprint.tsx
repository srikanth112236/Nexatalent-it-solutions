import React, { useState } from 'react';
import { Layers, Cpu, ShieldCheck, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutBusinessArchitectureBlueprint: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      icon: Cpu,
      title: 'Pillar I · Sovereign GCC Pods',
      subtitle: 'Self-governing engineering units directly integrated into client CI/CD pipelines.',
      deliverables: [
        'Turnkey 8-person squads (1 Staff Architect, 4 Senior Engineers, 2 QA, 1 SRE)',
        'Zero outsourced management overhead — reports directly to client VP Engineering',
        'Pre-configured GitHub, Slack, Datadog & AWS accounts on day 1',
      ],
      metric: '14-Day Pod Deployment',
    },
    {
      icon: ShieldCheck,
      title: 'Pillar II · Institutional Governance & IP Escrow',
      subtitle: 'Ironclad corporate, legal, and intellectual property defense framework.',
      deliverables: [
        '100% direct IP assignment to client US/UK parent entity',
        'SOC-2 Type II audited facility security and encrypted endpoint management',
        'Comprehensive FEMA / RBI cross-border compliance guarantees',
      ],
      metric: 'Zero IP Ambiguity',
    },
    {
      icon: DollarSign,
      title: 'Pillar III · 4.2x Capital Arbitrage Engine',
      subtitle: 'Transparent cost-plus financial model maximizing engineering runway.',
      deliverables: [
        '85% of total budget goes directly into elite engineer compensation & equity',
        'Transparent 15% operations & facility pass-through fee',
        'Save $180,000+ per senior engineer annually compared to Silicon Valley payroll',
      ],
      metric: '4.2x Capital Efficiency',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>12 · Business Architecture 3-Pillar Blueprint</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">Structural Operating Model</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>NexaScale GCC Operating Blueprint</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            How NexaTalent Re-Engineered the GCC Paradigm
          </h2>
          <p className="text-sm text-slate-500 font-light mt-2">
            Click on each pillar below to inspect our sovereign infrastructure, IP protections, and economic model.
          </p>
        </div>

        {/* 3 Pillars Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            const active = activePillar === i;
            return (
              <div
                key={i}
                onClick={() => setActivePillar(i)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer text-left ${
                  active 
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-md shadow-indigo-100' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${active ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>
                    {pillar.metric}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{pillar.title}</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{pillar.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Active Pillar Details Card */}
        <div className="p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block">
              Active Architecture Verification
            </span>
            <h3 className="text-xl font-bold text-white">{pillars[activePillar].title}</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {pillars[activePillar].deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <button 
            type="button"
            className="shrink-0 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Request Pillar Whitepaper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
