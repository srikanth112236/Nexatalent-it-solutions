import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { V2_INDUSTRIES } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';
import { SafeImage } from '../components/SafeImage';

/** Photo-top cards with hires chip + roles. Images never half-crop: object-top + fallback. */
export function V2IndustriesGrid() {
  return (
    <CreamSection>
      <SectionHead eyebrow={V2_INDUSTRIES.eyebrow} title={V2_INDUSTRIES.title} sub="Specialized technology staffing and contract engineering squads across eight key industry verticals." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {V2_INDUSTRIES.items.map((ind) => (
          <Link
            key={ind.slug}
            to={`/industries/${ind.slug}`}
            className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all hover:-tranneutral-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="relative overflow-hidden bg-neutral-100">
              <SafeImage src={(ind as { image?: string }).image || ''} alt={ind.label} fallbackLabel={ind.label} className="aspect-[16/10] w-full object-cover object-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/85 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur">
                {ind.hires}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-[13px] font-extrabold leading-snug text-black">{ind.label}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-black">{ind.roles}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-black">
                Explore Hiring Talent <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </CreamSection>
  );
}
