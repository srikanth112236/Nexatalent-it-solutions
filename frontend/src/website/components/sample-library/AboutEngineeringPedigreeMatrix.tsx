import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';

export const AboutEngineeringPedigreeMatrix: React.FC = () => {
  const domains = [
    {
      domain: 'Distributed Systems & Cloud Core',
      standards: ['CockroachDB / DynamoDB Internals', 'Raft Consensus Implementations', 'Multi-Region High Availability'],
      cutoff: 'Top 1.5% of Applicants',
      leadTime: '10 Days',
    },
    {
      domain: 'Low-Latency C++ & Quant Engines',
      standards: ['Kernel Bypass (Solarflare Onload)', 'Cache-Line Alignment & Lock-Free Queues', 'SIMD Vectorization & FPGA Interfacing'],
      cutoff: 'Top 0.8% of Applicants',
      leadTime: '18 Days',
    },
    {
      domain: 'Foundation Models & Applied AI',
      standards: ['Megatron-LM & DeepSpeed Pipeline Parallelism', 'Synthetic Data Distillation', 'Custom Tokenizer & Quantization Engines'],
      cutoff: 'Top 1.2% of Applicants',
      leadTime: '14 Days',
    },
    {
      domain: 'Enterprise DevSecOps & SRE',
      standards: ['Zero-Trust Architecture & mTLS', 'Automated Chaos Engineering (Litmus)', '99.999% Service Level Architecture'],
      cutoff: 'Top 2.0% of Applicants',
      leadTime: '8 Days',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>17 · Technical Vetting & Engineering Pedigree Matrix</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Verifiable Standards</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>Rigorous Bar-Raiser Matrix</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Every Candidate Tested Against Production Scenarios
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md font-light leading-relaxed">
            We don't use algorithmic quiz questions. Our bar-raisers evaluate real-world repo contributions, concurrency debugging, and architectural defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domains.map((d, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white text-sm">{d.domain}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                    {d.cutoff}
                  </span>
                </div>

                <ul className="space-y-2 py-3 text-xs text-slate-300">
                  {d.standards.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Avg Pod Assembly SLA:</span>
                <span className="text-emerald-400 font-bold">{d.leadTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
