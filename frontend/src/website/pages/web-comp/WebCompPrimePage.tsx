import * as M from '../../components/web-comp/WcPrime';
import { ScrollProgressBar } from '../../components/web-comp/WcSections';

const all = [M.M1SplitHero, M.M2KanbanRoles, M.M3OrgChart, M.M4Terminal, M.M5Calendar, M.M6SearchAutocomplete, M.M7LineChart, M.M8Donut, M.M9Poll, M.M10ActivityFeed, M.M11ProgressRings, M.M12Invoice, M.M13FeatureChecklist, M.M14Badges, M.M15MasonryGallery, M.M16Countdown, M.M17Wizard, M.M18TiltCards, M.M19FloatingStack, M.M20QuotesWall, M.M21PricingTable, M.M22Timeline, M.M23RadialMenu, M.M24BeforeAfter, M.M25StackedCards, M.M26GridFeatures, M.M27Numbers, M.M28DualCTA, M.M29MasonryBlog, M.M30FinalCTA];

export function WebCompPrimePage() {
  return (
    <div className="bg-white">
      <ScrollProgressBar />
      {all.map((C, i) => <C key={i} />)}
    </div>
  );
}
