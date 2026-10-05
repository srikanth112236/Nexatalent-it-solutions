import * as I from '../../components/web-comp/WcInfoSections';
import { ScrollProgressBar } from '../../components/web-comp/WcSections';

const all = [I.I1CandidateJourney, I.I2RecruiterJourney, I.I3JobBoard, I.I4SalaryGuide, I.I5Benefits, I.I6AgencyValues, I.I7HiringTrends, I.I8ApplicationTips, I.I9InterviewPrep, I.I10ResumeTemplates, I.I11RemoteWork, I.I12VisaSponsorship, I.I13EmployerBranding, I.I14TalentMapping, I.I15Diversity, I.I16Onboarding, I.I17CandidateOnboarding, I.I18Notifications, I.I19Messaging, I.I20Analytics, I.I21Webinars, I.I22CaseStudyBand, I.I23Community, I.I24Referrals, I.I25BlogTopics, I.I26Legal, I.I27Support, I.I28Integrations, I.I29Security, I.I30OfficeLocations, I.I31ContactCTA, I.I32Newsletter, I.I33Social, I.I34App, I.I35PartnerCTA, I.I36ContentPillars, I.I37TestimonialsBand, I.I38FAQBand];

export function WebCompAboutPage() {
  return (
    <div className="bg-white">
      <ScrollProgressBar />
      {all.map((C, i) => <C key={i} />)}
    </div>
  );
}
