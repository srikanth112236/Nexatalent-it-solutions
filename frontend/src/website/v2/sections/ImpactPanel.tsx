import { V2_IMPACT } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

/** Light version — white card, no dark panel. */
export function V2ImpactPanel() {
  return (
    <CreamSection label="Delivery impact">
      <SectionHead eyebrow={V2_IMPACT.eyebrow} title={V2_IMPACT.title} />
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center border-b border-neutral-100 p-8 md:border-b-0 md:border-r">
            <div className="text-[11px] font-bold uppercase tracking-widest text-black">{V2_IMPACT.client}</div>
            <div className="mt-2 text-5xl font-black tabular-nums tracking-tight text-black">{V2_IMPACT.value}</div>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-black/70">{V2_IMPACT.valueNote}</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-neutral-100 text-center">
            {V2_IMPACT.stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center p-6">
                <div className="text-2xl font-black tabular-nums tracking-tight text-black">{s.value}</div>
                <div className="mt-1.5 flex min-h-[2.4rem] items-start text-[11px] font-semibold leading-snug text-black/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CreamSection>
  );
}
