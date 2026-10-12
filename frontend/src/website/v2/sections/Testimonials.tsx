import { Star, Quote } from 'lucide-react';
import { CreamSection, SectionHead } from '../components/ui';

const QUOTES = [
  { quote: 'NexaTalent filled 14 backend roles in 30 days with an 88% joining ratio. The evaluation notes saved our panel hours.', name: 'VP Engineering', org: 'SaaS Platform, Bengaluru' },
  { quote: 'Their low-latency C++ pipeline is unmatched in India. Compliance and background checks were audit-clean.', name: 'Head of Talent', org: 'FinTech, Mumbai' },
  { quote: 'From 0 to a 40-engineer GCC pod in 90 days — with retention above 96% in year one.', name: 'CIO', org: 'Global Retail & Logistics' },
];

/** 3/4 NEW — social proof with semantic quotes, keyboard- and screen-reader-friendly. */
export function V2Testimonials() {
  return (
    <CreamSection label="Client testimonials">
      <SectionHead eyebrow="Client love" title="Teams that hire with NexaTalent" sub="Real mandates, measured outcomes." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {QUOTES.map((t) => (
          <figure key={t.name} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Quote size={22} className="text-[#0265FF]" aria-hidden />
            <div className="mt-2 flex gap-0.5" role="img" aria-label="Rated 5 out of 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} className="fill-amber-400 text-amber-400" aria-hidden />
              ))}
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">“{t.quote}”</blockquote>
            <figcaption className="mt-4 border-t border-slate-100 pt-3 text-xs">
              <span className="font-extrabold text-slate-900">{t.name}</span>
              <span className="block text-slate-500">{t.org}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </CreamSection>
  );
}
