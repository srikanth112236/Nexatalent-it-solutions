import { V2_OUTCOMES } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

export function V2Outcomes() {
  return (
    <CreamSection>
      <SectionHead title={V2_OUTCOMES.title} />
      <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
        {V2_OUTCOMES.stats.map((s) => (
          <div key={s.value}>
            <div className="text-4xl font-black tracking-tight text-black">{s.value}</div>
            <div className="mt-2 text-[13px] font-extrabold uppercase tracking-[0.12em] text-black">{s.label}</div>
            <div className="mx-auto mt-1 max-w-[240px] text-xs leading-relaxed text-black">{s.note}</div>
          </div>
        ))}
      </div>
    </CreamSection>
  );
}
