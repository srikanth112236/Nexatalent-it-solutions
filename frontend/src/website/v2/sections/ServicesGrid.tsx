import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { V2_SERVICES } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';
import { SafeImage } from '../components/SafeImage';

/** Differentiation vs reference: numbered 01–06, real photos, black hover ring. White bg only. */
export function V2ServicesGrid() {
  return (
    <CreamSection>
      <SectionHead eyebrow={V2_SERVICES.eyebrow} title={V2_SERVICES.title} sub={V2_SERVICES.sub} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {V2_SERVICES.items.map((s) => (
          <Link
            key={s.title}
            to={s.href}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-tranneutral-y-0.5 hover:shadow-md"
          >
            <div className="relative overflow-hidden bg-neutral-100">
              <SafeImage src={(s as { image?: string }).image || ''} alt={s.title} fallbackLabel={s.title} className="aspect-[16/10] w-full object-cover object-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
            </div>
            <div className="p-6">
              <h3 className="flex items-center justify-between text-[15px] font-extrabold text-black">
                {s.title}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 transition-all group-hover:border-black group-hover:bg-black group-hover:text-white">
                  <ArrowUpRight size={16} />
                </span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-black">{s.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-black">Get My Talent Shortlist →</span>
            </div>
          </Link>
        ))}
      </div>
    </CreamSection>
  );
}
