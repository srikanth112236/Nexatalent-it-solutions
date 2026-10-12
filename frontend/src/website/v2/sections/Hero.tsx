import { V2_HERO } from '../data/content';
import { PillButton } from '../components/ui';

export function V2Hero() {
  return (
    <section aria-label="Introduction" className="bg-white px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0265FF]/25 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0265FF] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> {V2_HERO.eyebrow} • 4,800+ hires
        </span>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
          Connect the <span className="relative whitespace-nowrap text-[#0265FF]">right talent
            <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#0265FF]/20" aria-hidden />
          </span> with the right organization
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{V2_HERO.sub}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <PillButton to={V2_HERO.primaryCta.href} label={V2_HERO.primaryCta.label} variant="dark" />
          <PillButton to={V2_HERO.secondaryCta.href} label={V2_HERO.secondaryCta.label} variant="outline" />
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
          <span className="flex -space-x-2">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-slate-700 to-slate-950 text-[9px] font-black text-white">
                {['NT', 'TC', 'HR', 'EX'][n - 1]}
              </span>
            ))}
          </span>
          Trusted by GCCs, BFSI & SaaS hiring teams
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
        {V2_HERO.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={['NexaTalent recruiters collaborating with a client team', 'Modern client office supported by NexaTalent staffing', 'Technology engineers placed by NexaTalent at work'][i] ?? 'NexaTalent client and talent teams'}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="h-52 w-full rounded-2xl border border-slate-200 object-cover shadow-sm sm:h-56"
          />
        ))}
      </div>
    </section>
  );
}
