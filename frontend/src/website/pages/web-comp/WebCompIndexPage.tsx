import { WcHero, WcHireButton, WcFeaturedJobs } from '../../components/web-comp/WcHero';
import { WcCareerPaths, WcCategoryCards, WcHowItWorks } from '../../components/web-comp/WcCareerPaths';
import { WcManagerSection, WcCrmInsights, WcGenerativeAi } from '../../components/web-comp/WcManagerSection';

export function WebCompIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between bg-white px-10 py-5 ring-1 ring-neutral-100">
        <img src="/logo.png" alt="NexaTalent IT Solutions" className="h-10" />
        <nav className="flex gap-8 text-xs text-neutral-600">
          <span>Home</span><span>How it Works</span><span>About Us</span>
        </nav>
        <button className="rounded-full bg-[#28C76F] px-5 py-2 text-xs font-semibold text-white">Request a Demo</button>
      </header>
      <div className="flex justify-center pt-10"><WcHireButton /></div>
      <WcHero />
      <WcGenerativeAi />
      <WcManagerSection />
      <WcCrmInsights />
      <WcHowItWorks />
      <WcCategoryCards />
      <WcCareerPaths />
      <WcFeaturedJobs />
    </div>
  );
}
