import { V2_IMPACT } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';
import { TrendingUp, Clock, Users, ShieldCheck, BarChart3 } from 'lucide-react';

/** Enhanced graphical charts version — pure monochrome, responsive, rich visual indicators. */
export function V2ImpactPanel() {
  const chartComparisons = [
    { label: 'Time-to-Shortlist', nexa: '72 hrs', industry: '14 - 21 days', percent: 85 },
    { label: 'Interview Conversion', nexa: '88%', industry: '32%', percent: 88 },
    { label: 'Mandate Fill SLA', nexa: '94%', industry: '45%', percent: 94 },
    { label: 'Candidate Retention (90d)', nexa: '98.4%', industry: '70%', percent: 98 },
  ];

  return (
    <CreamSection label="Delivery impact">
      <SectionHead eyebrow={V2_IMPACT.eyebrow} title={V2_IMPACT.title} />
      
      {/* Main Container */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        {/* Top Metric Strip */}
        <div className="grid grid-cols-1 border-b border-neutral-200 lg:grid-cols-12">
          {/* Hero SLA Callout (5 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200 p-8 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                <Clock size={13} className="text-black" />
                <span>{V2_IMPACT.client}</span>
              </div>
              <div className="mt-4 text-6xl font-black tabular-nums tracking-tight text-black sm:text-7xl">
                {V2_IMPACT.value}
              </div>
              <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-black/80">
                {V2_IMPACT.valueNote}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <TrendingUp size={22} className="shrink-0 text-black" />
              <div className="text-xs font-semibold text-black leading-snug">
                Backed by algorithmic talent graph calibration & 24/7 dedicated recruitment pod.
              </div>
            </div>
          </div>

          {/* 3 Graphical Stat Cards (7 cols) */}
          <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x lg:col-span-7">
            {V2_IMPACT.stats.map((s, idx) => {
              const icons = [TrendingUp, Users, ShieldCheck];
              const Icon = icons[idx] || BarChart3;
              const barPercentages = [72, 85, 96];
              const pct = barPercentages[idx] || 75;

              return (
                <div key={s.label} className="flex flex-col justify-between p-6 sm:p-8 text-left">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-black border border-neutral-300">
                        <Icon size={17} />
                      </span>
                      <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">
                        Metric {idx + 1}
                      </span>
                    </div>

                    <div className="mt-6 text-3xl font-black tabular-nums tracking-tight text-black sm:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-2 text-xs font-bold leading-snug text-black">
                      {s.label}
                    </div>
                  </div>

                  {/* Graphical Micro Progress Bar */}
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-[10px] font-bold text-black/70 mb-1.5">
                      <span>Efficiency Index</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                      <div className="h-full bg-black rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Graphical Comparative Benchmark Chart */}
        <div className="p-6 sm:p-8 bg-neutral-50/50">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <h4 className="text-sm font-extrabold text-black uppercase tracking-wider">
                Comparative Performance Benchmark
              </h4>
              <p className="text-xs text-black/70 mt-0.5">
                NexaTalent SLA vs Traditional Agency Benchmarks
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-black" />
                <span>NexaTalent SLA</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-black/50">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                <span>Industry Average</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {chartComparisons.map((c) => (
              <div key={c.label} className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{c.label}</div>
                  <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-black">{c.nexa}</span>
                    <span className="text-xs font-semibold text-neutral-400">vs {c.industry}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 border border-neutral-200">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-700"
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] font-bold text-neutral-500">
                    <span>Nexa SLA Performance</span>
                    <span>{c.percent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CreamSection>
  );
}
