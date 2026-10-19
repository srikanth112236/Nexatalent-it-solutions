import { V2_HERO } from '../data/content';
import { PillButton } from '../components/ui';
import { SafeImage } from '../components/SafeImage';

export function V2Hero() {
  return (
    <section aria-label="Introduction" className="bg-white px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/25 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-black shadow-sm">
          <span className="h-2 w-2 rounded-full bg-black" /> {V2_HERO.eyebrow}
        </span>
        <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-black sm:text-5xl">
          {V2_HERO.titleLine1}
          <br />
          {V2_HERO.titleLine2}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-black sm:text-base">{V2_HERO.sub}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <PillButton to={V2_HERO.primaryCta.href} label="Talk to a Hiring Expert" variant="dark" />
          <PillButton to={V2_HERO.secondaryCta.href} label="Explore Hiring Solutions" variant="outline" />
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-black">
          <span className="flex -space-x-2">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-black text-[9px] font-black text-white">
                {['NT', 'TC', 'HR', 'EX'][n - 1]}
              </span>
            ))}
          </span>
          {V2_HERO.trustLine}
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
        {V2_HERO.images.map((src, i) => (
          <div key={src} className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
            <SafeImage
              src={src}
              alt={['NexaTalent recruiters collaborating with a client team', 'Modern client office supported by NexaTalent staffing', 'Technology engineers placed by NexaTalent at work'][i] ?? 'NexaTalent client and talent teams'}
              className="aspect-[16/10] w-full object-cover object-center"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
