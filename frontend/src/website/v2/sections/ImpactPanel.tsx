import { V2_IMPACT } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

/** Light version — white card, no dark panel. */
export function V2ImpactPanel() {
  return (
    <CreamSection label="Delivery impact">
      <SectionHead eyebrow={V2_IMPACT.eyebrow} title={V2_IMPACT.title} />
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-b border-slate-100 p-8 md:border-b-0 md:border-r">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{V2_IMPACT.client}</div>
            <div className="mt-2 text-5xl font-black tabular-nums text-slate-950">{V2_IMPACT.value}</div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{V2_IMPACT.valueNote}</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            {V2_IMPACT.stats.map((s) => (
              <div key={s.label} className="p-6">
                <div className="text-2xl font-black tabular-nums text-slate-950">{s.value}</div>
                <div className="mt-1 text-[11px] font-semibold leading-snug text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CreamSection>
  );
}
