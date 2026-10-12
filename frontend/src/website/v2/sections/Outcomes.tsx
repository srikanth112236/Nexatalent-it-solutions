import { V2_OUTCOMES } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

export function V2Outcomes() {
  return (
    <CreamSection>
      <SectionHead title={V2_OUTCOMES.title} />
      <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
        {V2_OUTCOMES.stats.map((s) => (
          <div key={s.value}>
            <div className="text-4xl font-black tracking-tight text-slate-950">{s.value}</div>
            <div className="mt-1 text-sm font-bold text-slate-900">{s.label}</div>
            <div className="mx-auto mt-1 max-w-[240px] text-xs leading-relaxed text-slate-500">{s.note}</div>
          </div>
        ))}
      </div>
    </CreamSection>
  );
}
