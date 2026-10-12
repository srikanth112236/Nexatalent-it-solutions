import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { V2_INDUSTRIES } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';

/** Differentiation: photo-top cards with hires chip + roles, not flat gradients. */
export function V2IndustriesGrid() {
  return (
    <CreamSection>
      <SectionHead eyebrow={V2_INDUSTRIES.eyebrow} title={V2_INDUSTRIES.title} sub="Reference layout, NexaTalent data — each card links to its live /industries detail page." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {V2_INDUSTRIES.items.map((ind) => (
          <Link
            key={ind.slug}
            to={`/industries/${ind.slug}`}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="relative">
              <img src={(ind as { image?: string }).image} alt="" loading="lazy" decoding="async" className="h-32 w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
              <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/85 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur">
                {ind.hires}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-[13px] font-extrabold leading-snug text-slate-900">{ind.label}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">{ind.roles}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0265FF]">
                Explore hiring <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </CreamSection>
  );
}
