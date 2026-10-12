import { V2Footer } from '../components/V2Footer';
import { V2Navbar } from '../components/V2Navbar';
import { SeoHead } from '../../components/SeoHead';
import { V2Hero } from '../sections/Hero';
import { V2TrustBar } from '../sections/TrustBar';
import { V2Outcomes } from '../sections/Outcomes';
import { V2NextGen } from '../sections/NextGen';
import { V2ServicesGrid } from '../sections/ServicesGrid';
import { V2Process } from '../sections/Process';
import { V2ImpactPanel } from '../sections/ImpactPanel';
import { V2IndustriesGrid } from '../sections/IndustriesGrid';
import { V2Testimonials } from '../sections/Testimonials';
import { V2JobsFaq } from '../sections/JobsFaq';
import { V2OfficesContact } from '../sections/OfficesContact';
import { V2WhyChoose } from '../sections/WhyChoose';
import { V2InsightsSubscribe } from '../sections/InsightsSubscribe';

/** Public homepage at / — full white, responsive + accessible. Old design preserved at /v5. */
export function NewHomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-slate-950 focus:px-5 focus:py-2.5 focus:text-xs focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>
      <SeoHead
        title="NexaTalent — Talent strategy that drives growth"
        description="NexaTalent IT Solutions: recruitment outcomes, services, industries, offices and insights."
        canonicalPath="/"
      />
      <V2Navbar />
      <main id="main-content" tabIndex={-1}>
        <V2Hero />
        <V2TrustBar />
        <V2Outcomes />
        <V2NextGen />
        <V2ServicesGrid />
        <V2Process />
        <V2ImpactPanel />
        <V2IndustriesGrid />
        <V2Testimonials />
        <V2JobsFaq />
        <V2OfficesContact />
        <V2WhyChoose />
        <V2InsightsSubscribe />
      </main>
      <V2Footer />
    </div>
  );
}
