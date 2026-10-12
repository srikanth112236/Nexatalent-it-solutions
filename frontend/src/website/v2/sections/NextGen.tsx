import { V2_NEXTGEN } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

/** Light version — white cards, no dark panels. */
export function V2NextGen() {
  return (
    <CreamSection>
      <SectionHead title={V2_NEXTGEN.title} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {V2_NEXTGEN.cards.map((c) => (
          <article key={c.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img src={c.image} alt="" loading="lazy" decoding="async" className="h-60 w-full object-cover" />
            <div className="space-y-2 p-6">
              <span className="inline-block rounded-full border border-[#0265FF]/25 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#0265FF]">{c.tag}</span>
              <h3 className="text-lg font-extrabold leading-snug text-slate-950">{c.title}</h3>
              <p className="text-xs leading-relaxed text-slate-600">{c.desc}</p>
              <div className="flex items-end gap-3 border-t border-slate-100 pt-4">
                <span className="text-3xl font-black tabular-nums text-slate-950">{c.stat}</span>
                <span className="pb-1 text-xs text-slate-600">{c.statLabel}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </CreamSection>
  );
}
