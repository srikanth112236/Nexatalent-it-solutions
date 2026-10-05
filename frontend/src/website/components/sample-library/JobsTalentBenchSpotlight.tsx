import React from 'react';
import { UserCheck, ArrowRight, Clock, Star } from 'lucide-react';

export const JobsTalentBenchSpotlight: React.FC = () => {
  const bench = [
    {
      id: 'PROFILE · DISTRIBUTED SYSTEMS',
      role: 'Staff Distributed Systems Engineer',
      background: 'Deep tenure • Core platform engineering',
      stack: ['Go', 'Raft Consensus', 'Kafka', 'RocksDB'],
      availability: 'Notice-period mapped',
      location: 'India (Hybrid)',
      rating: 'Architecture Review Cleared',
    },
    {
      id: 'PROFILE · AI RESEARCH ENGINEERING',
      role: 'Senior LLM Systems Engineer',
      background: 'Research depth • Production model systems',
      stack: ['PyTorch', 'Megatron-LM', 'CUDA C++', 'Triton'],
      availability: 'Notice-period mapped',
      location: 'India (Hybrid)',
      rating: 'Systems Review Cleared',
    },
    {
      id: 'PROFILE · LOW-LATENCY SYSTEMS',
      role: 'Low-Latency C++ Engineer',
      background: 'Performance focus • Exchange-adjacent systems',
      stack: ['C++20/23', 'Solarflare OpenOnload', 'SIMD', 'FIX Protocol'],
      availability: 'Availability on request',
      location: 'UK / India (Remote options)',
      rating: 'Systems Review Cleared',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>Anonymized Sovereign Talent Bench Spotlight</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Instant Employer Hire</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Pre-Vetted & Cleared for Deployment</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Anonymized Active Talent Bench
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md font-light leading-relaxed">
            These candidates have cleared our rigorous 5-stage technical vetting sandbox and are ready to deploy to your GCC pod within 14 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bench.map((c, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{c.id}</span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{c.rating}</span>
                  </div>
                </div>

                <h4 className="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">
                  {c.role}
                </h4>
                <div className="text-xs text-slate-400 mb-4 font-light">{c.background}</div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.stack.map((s, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.availability}</span>
                  </span>
                  <span>{c.location}</span>
                </div>

                <button
                  type="button"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Request Unredacted Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
