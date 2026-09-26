import React, { useState } from 'react';
import { Users, Plus, Minus, Download } from 'lucide-react';

interface SquadRole {
  id: string;
  name: string;
  level: string;
  salaryBlrUSD: number; // monthly
  salaryUSUSD: number; // monthly
  tech: string;
  count: number;
}

const INITIAL_ROLES: SquadRole[] = [
  { id: 'vp-eng', name: 'VP of Engineering / Site Director', level: 'Executive', salaryBlrUSD: 14000, salaryUSUSD: 36000, tech: 'Org Scaling & GCC Governance', count: 1 },
  { id: 'staff-arch', name: 'Staff Distributed Systems Architect', level: 'L6 / Staff', salaryBlrUSD: 9500, salaryUSUSD: 28000, tech: 'Go/Rust, Raft, High-QPS', count: 2 },
  { id: 'sr-backend', name: 'Senior Backend Engineer', level: 'L5 / Senior', salaryBlrUSD: 6500, salaryUSUSD: 20000, tech: 'Microservices, Kafka, PostgreSQL', count: 4 },
  { id: 'sre-lead', name: 'Lead Platform / SRE Architect', level: 'L6 / Staff', salaryBlrUSD: 8500, salaryUSUSD: 24000, tech: 'Kubernetes, Terraform, eBPF', count: 2 },
  { id: 'ml-eng', name: 'Production LLM / AI Engineer', level: 'L5 / Senior', salaryBlrUSD: 7800, salaryUSUSD: 22000, tech: 'PyTorch, vLLM, TensorRT', count: 2 }
];

export const SignatureHiringSquadBuilder: React.FC = () => {
  const [roles, setRoles] = useState<SquadRole[]>(INITIAL_ROLES);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const updateCount = (id: string, delta: number) => {
    setRoles(prev =>
      prev.map(r => {
        if (r.id === id) {
          const newCount = Math.max(0, Math.min(10, r.count + delta));
          return { ...r, count: newCount };
        }
        return r;
      })
    );
  };

  const totalEngineers = roles.reduce((sum, r) => sum + r.count, 0);
  const monthlyBlrSpend = roles.reduce((sum, r) => sum + r.count * r.salaryBlrUSD, 0);
  const monthlyUSSpend = roles.reduce((sum, r) => sum + r.count * r.salaryUSUSD, 0);
  const monthlySavings = monthlyUSSpend - monthlyBlrSpend;
  const launchDays = totalEngineers <= 5 ? 21 : totalEngineers <= 15 ? 35 : 60;

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 48 • Interactive Engineering Squad Builder</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Interactive Engineering Squad Architect
          </h2>
          <p className="text-lg text-slate-600">
            Compose your target GCC technical pod in real time. Adjust headcounts across seniority levels to simulate launch timelines and cost arbitrage.
          </p>
        </div>

        {/* 2-Column Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Role Configurator */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Squad Composition & Headcount
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">
                {totalEngineers} Total Hires
              </span>
            </div>

            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{role.name}</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {role.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{role.tech}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      ~${(role.salaryBlrUSD).toLocaleString()}/mo in Bangalore vs ~${(role.salaryUSUSD).toLocaleString()}/mo in US
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateCount(role.id, -1)}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-black text-slate-900 font-mono text-base">
                      {role.count}
                    </span>
                    <button
                      onClick={() => updateCount(role.id, 1)}
                      className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Output & Blueprint Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-2xl shadow-blue-500/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Squad Blueprint Summary</h3>
                <p className="text-xs text-slate-500">Instant telemetry output</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                SLA: {launchDays} Days
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase">Estimated Pod Launch SLA</span>
                <span className="text-base font-black text-slate-900 font-mono">{launchDays} Calendar Days</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase">Monthly Bangalore Run Rate</span>
                <span className="text-base font-black text-blue-600 font-mono">${monthlyBlrSpend.toLocaleString()} / mo</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block">
                  Net Monthly Capital Arbitrage
                </span>
                <div className="text-3xl font-black font-mono mt-1">
                  +${monthlySavings.toLocaleString()} / mo
                </div>
                <span className="text-xs text-blue-100 block mt-1">
                  ~${((monthlySavings * 12) / 1000000).toFixed(2)}M in annual capital reinvestment savings
                </span>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Blueprint Exported to PDF!' : 'Export Calibrated Pod Blueprint'}</span>
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Includes candidate profiles, verified compensation bands, and SEZ compliance roadmap.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
