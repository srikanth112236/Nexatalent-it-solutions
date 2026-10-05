import * as A from '../../components/web-comp/WcAceternity';
import { ScrollProgressBar } from '../../components/web-comp/WcSections';

const all = [A.A1Spotlight, A.A2GridBg, A.A3Bento, A.A4TracingBeam, A.A5InfiniteCards, A.A6AnimatedCounters, A.A7Tabs, A.A8Lamp, A.A9Aurora, A.A10Compare, A.A11FloatingDock, A.A12Typewriter, A.A13TextGenerate, A.A14BorderBeam, A.A15Meteors, A.A16CardHover, A.A17Expandable, A.A18StepsGlow, A.A19PricingGlow, A.A20LogoGrid, A.A21FeatureGrid, A.A22FAQModern, A.A23Testimonial, A.A24Globe, A.A25CTAShimmer, A.A26FooterTeaser, A.A27GradientText, A.A28TwoCol, A.A29SplitStats, A.A30DarkList];

export function WebCompAceternityPage() {
  return (
    <div className="bg-white">
      <ScrollProgressBar />
      {all.map((C, i) => <C key={i} />)}
    </div>
  );
}
