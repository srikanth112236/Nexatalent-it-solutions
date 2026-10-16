import { V2_WHY } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

export function V2WhyChoose() {
  return (
    <CreamSection>
      <SectionHead title={V2_WHY.title} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {V2_WHY.items.map((w) => (
          <div key={w.title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-extrabold leading-snug text-black">{w.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-black">{w.desc}</p>
          </div>
        ))}
      </div>
    </CreamSection>
  );
}
