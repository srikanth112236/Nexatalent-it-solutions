import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { PillButton } from '../components/ui';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { getServiceDetail } from '../data/serviceDetails';

/** Eight verticals — light classic layout with editorial industry rows. */
const EIGHT_INDUSTRIES = [
  {
    slug: 'bfsi',
    label: 'Banking & Financial Services',
    desc: 'Streamlined operations and enhanced security to deliver personalized customer experiences.',
    alt: 'Financial analytics and banking technology operations',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80',
    metric: '2,900+ Hires',
  },
  {
    slug: 'retail',
    label: 'Retail & E-commerce',
    desc: 'Empowered businesses with technology to drive customer loyalty and optimize operations.',
    alt: 'Modern commercial retail storefront and digital logistics',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    metric: '2,200+ Hires',
  },
  {
    slug: 'manufacturing',
    label: 'Manufacturing',
    desc: 'Enabled smart production and sustainable processes through innovative solutions.',
    alt: 'High-precision automated industrial manufacturing machinery',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
    metric: '1,400+ Hires',
  },
  {
    slug: 'energy',
    label: 'Oil, Energy & Utilities',
    desc: 'Optimized resource management and improved efficiency with digital transformation.',
    alt: 'Renewable and industrial energy utility installation at sunrise',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80',
    metric: '1,100+ Hires',
  },
  {
    slug: 'healthcare',
    label: 'Healthcare & Life Sciences',
    desc: 'Improved patient outcomes and streamlined operations with advanced technologies.',
    alt: 'Medical research and clinical laboratory technology',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
    metric: '1,750+ Hires',
  },
  {
    slug: 'media',
    label: 'Communication & Media',
    desc: 'Digitized operations to enhance user engagement and create seamless experiences.',
    alt: 'Media production studio and digital broadcasting technology',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80',
    metric: '1,950+ Hires',
  },
  {
    slug: 'logistics',
    label: 'Travel, Transportation & Logistics',
    desc: 'Transformed processes to improve efficiency, safety, and customer satisfaction.',
    alt: 'Global commercial supply chain logistics and fulfillment facility',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    metric: '1,800+ Hires',
  },
  {
    slug: 'gcc',
    label: 'Government & Public Sector',
    desc: 'Delivered secure, accessible digital services that meet the standards of public institutions.',
    alt: 'Enterprise government and public institution architectural headquarters',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    metric: '5,500+ Hires',
  },
];

export function NewIndustriesPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const activeDetail = activeSlug ? getServiceDetail('industry', activeSlug) : undefined;
  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title="Industries We Serve — NexaTalent"
        description="NexaTalent partners with organizations across every major vertical — tailoring hiring, engineering and platform talent to the rhythms of each industry."
        canonicalPath="/industries"
      />
      <V2Navbar />
      <main id="main-content">
        {/* LIGHT BANNER */}
        <section className="border-b border-neutral-200 bg-white px-4 pb-14 pt-14 sm:px-6" aria-label="Industries banner">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-black">Industries</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
              Industries we serve in
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-black sm:text-base">
              NexaTalent partners with organizations across every major vertical — tailoring hiring, engineering and
              platform talent to the rhythms of each industry.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <PillButton to="/employers" label="Discuss your mandate" variant="dark" />
              <PillButton to="/contact" label="Talk to an expert" variant="outline" />
            </div>
          </div>
        </section>

        {/* EIGHT INDUSTRIES — editorial rows */}
        <section aria-label="Industries list" className="bg-white px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl divide-y divide-neutral-200 border-y border-neutral-200">
            {EIGHT_INDUSTRIES.map((ind) => (
              <article key={ind.slug} className="grid grid-cols-1 items-center gap-6 py-8 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-5">
                  <img
                    src={ind.image}
                    alt={ind.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full rounded-2xl border border-neutral-200 object-cover object-center"
                  />
                </div>
                <div className="md:col-span-7">
                  <span className="inline-flex items-center rounded-full border border-black/25 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-black">
                    {ind.metric}
                  </span>
                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-black sm:text-2xl">{ind.label}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-black">{ind.desc}</p>
                  <button
                    type="button"
                    onClick={() => setActiveSlug(ind.slug)}
                    className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-black focus-visible:outline-2 focus-visible:outline-black"
                  >
                    View hiring practice <ArrowRight size={14} aria-hidden />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-black sm:text-2xl">Don’t see your vertical?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-black">
              Our domain pods cover 16+ practice areas — tell us your sector and we’ll assemble the right team.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <PillButton to="/employers" label="Submit your mandate" variant="dark" />
              <PillButton to="/solutions" label="See solutions" variant="outline" />
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
      {activeDetail && <ServiceDetailModal detail={activeDetail} onClose={() => setActiveSlug(null)} />}
    </div>
  );
}
