import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { V2_SERVICES } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

/** Differentiation vs reference: numbered 01–06, real photos, Nexa-blue hover ring. */
export function V2ServicesGrid() {
  return (
    <CreamSection>
      <SectionHead eyebrow={V2_SERVICES.eyebrow} title={V2_SERVICES.title} sub={V2_SERVICES.sub} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {V2_SERVICES.items.map((s) => (
          <Link
            key={s.title}
            to={s.href}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative">
              <img src={(s as { image?: string }).image} alt="" loading="lazy" decoding="async" className="h-44 w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="flex items-center justify-between text-[15px] font-extrabold text-slate-900">
                {s.title}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 transition-all group-hover:border-[#0265FF] group-hover:bg-[#0265FF] group-hover:text-white">
                  <ArrowUpRight size={16} />
                </span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </CreamSection>
  );
}
