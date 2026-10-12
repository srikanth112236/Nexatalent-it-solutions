/**
 * v2 ("/new") content layer — NexaTalent copy adapted to the reference long-scroll layout.
 * Old pages untouched. Industries below MERGE image labels with existing INDUSTRIES_DATA metrics/roles.
 */

export const V2_HERO = {
  eyebrow: 'Your Trusted Technology & Talent Partner',
  title: 'Connect the right talent with the right organization',
  sub: 'Your Talent | Our Technology | A Better Tomorrow — permanent recruitment, contract staffing, executive search and vendor empanelment from sourcing to onboarding.',
  primaryCta: { label: 'Talk to an expert', href: '/#contact' },
  secondaryCta: { label: 'Explore solutions', href: '/solutions' },
  images: [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=70',
  ],
};

export const V2_OUTCOMES = {
  title: 'A better tomorrow our clients can measure',
  stats: [
    { value: '4,800+', label: 'Technology hires delivered', note: 'Across SaaS, BFSI, retail and GCC mandates' },
    { value: '12 days', label: 'Average shortlist SLA', note: 'Pre-screened profiles with evaluation notes' },
    { value: '96%', label: 'Offer-accept & retention', note: 'High-touch engagement, low drop-offs' },
  ],
};

export const V2_NEXTGEN = {
  title: 'Your talent, our technology — one partner',
  cards: [
    {
      tag: 'Our Technology',
      title: 'Technology that finds the right talent faster',
      desc: 'Live coding sandboxes, system-design rubrics and verified pools across IT, cloud, data and AI.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=70',
      stat: '100+',
      statLabel: 'Pre-vetted skill signals per role family',
    },
    {
      tag: 'Your Talent',
      title: 'Talent that stays — not just joins',
      desc: 'Sourcing squads, interview coordination and joining follow-up with 90-day replacement cover.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=70',
      stat: '88%',
      statLabel: 'Offer-acceptance on engaged mandates',
    },
  ],
};

/** 6 recruitment services — mirrors SolutionsPage delivery models, restyled to reference 6-card grid. */
export const V2_SERVICES = {
  eyebrow: 'What we do',
  title: 'Recruitment and staffing for every hiring need',
  sub: 'One trusted partner for permanent, contract, executive and high-volume technology hiring.',
  items: [
    { title: 'Permanent Recruitment', desc: 'Full-time tech, engineering and corporate hires with 90-day replacement cover.', href: '/solutions/permanent-hiring', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=70' },
    { title: 'Contract Staffing', desc: 'Time-bound project workforce with payroll, compliance and single invoicing.', href: '/solutions/contract-staffing', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=70' },
    { title: 'IT Staff Augmentation', desc: 'Pre-vetted engineers deployed in 72 hrs for spikes and squads.', href: '/solutions/contract-staffing', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=70' },
    { title: 'Executive Search', desc: 'Confidential CXO, VP Engineering and Director mandates.', href: '/solutions/executive-search', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=70' },
    { title: 'Bulk & Volume Hiring', desc: 'Structured drives for 10–100+ roles with batch interviews.', href: '/solutions/recruitment-process-support', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=70' },
    { title: 'RPO & Embedded TA', desc: 'Embedded recruiters inside your team with SLA-backed delivery.', href: '/solutions/rpo-support', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=700&q=70' },
  ],
};

export const V2_IMPACT = {
  eyebrow: 'Why it works',
  title: 'The right talent, without the hiring drag',
  client: 'NexaTalent delivery',
  value: '72 hrs',
  valueNote: 'First calibrated shortlist for most mandates — then weekly batches till close',
  stats: [
    { value: '72%', label: 'Faster time-to-shortlist' },
    { value: '3.5x', label: 'Larger verified pipeline' },
    { value: '310k', label: 'Curated technology profiles' },
  ],
};

/**
 * Image's 8 industries, merged with INDUSTRIES_DATA metrics/roles.
 * Labels match the reference; slugs link to existing /industries/:slug detail pages.
 */
export const V2_INDUSTRIES = {
  eyebrow: 'Industries we serve',
  title: 'Industries we serve in',
  items: [
    { label: 'Banking & Financial Services', slug: 'bfsi', hires: '2,900+ Hires', roles: 'Streamlined operations and enhanced security for personalized experiences.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=70' },
    { label: 'Retail & E-commerce', slug: 'retail', hires: '2,200+ Hires', roles: 'Technology that drives customer loyalty and optimizes operations.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=70' },
    { label: 'Manufacturing', slug: 'manufacturing', hires: '1,400+ Hires', roles: 'Smart production and sustainable processes through innovation.', image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=600&q=70' },
    { label: 'Oil, Energy & Utilities', slug: 'energy', hires: '1,100+ Hires', roles: 'Optimized resource management and efficiency at scale.', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=70' },
    { label: 'Healthcare & Life Sciences', slug: 'healthcare', hires: '1,750+ Hires', roles: 'Better patient outcomes and streamlined clinical operations.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=70' },
    { label: 'Communication & Media', slug: 'media', hires: '1,950+ Hires', roles: 'Digitized operations that enhance engagement and experiences.', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=600&q=70' },
    { label: 'Travel, Transportation & Logistics', slug: 'logistics', hires: '1,800+ Hires', roles: 'Efficiency, safety and customer satisfaction across supply chains.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=70' },
    { label: 'Government & Public Sector', slug: 'gcc', hires: '5,500+ Hires', roles: 'Secure, accessible digital services for public institutions.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=70' },
  ],
};

export const V2_OFFICES = {
  title: 'Talk to our recruitment team',
  sub: 'Mumbai HQ plus delivery hubs — one team from mandate to joining.',
  offices: [
    { city: 'Mumbai', country: 'India', note: 'Corporate HQ, Andheri East — enterprise, BFSI & leadership hiring', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=700&q=70' },
    { city: 'Bengaluru', country: 'India', note: 'Technology hub — SaaS, AI and GCC engineering pods', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=700&q=70' },
    { city: 'Dubai', country: 'UAE', note: 'Enterprise delivery support — GCC and global mandates', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=70' },
  ],
};

export const V2_WHY = {
  title: 'A better tomorrow, built into every hire',
  items: [
    { title: 'Right talent, right organization', desc: 'Role, stack, culture and budget matched before the first interview.' },
    { title: 'Technology that vets deeply', desc: 'Live coding, system-design rubrics and verified skill signals.' },
    { title: 'Partners from sourcing to joining', desc: 'Shortlist, interviews, offers and onboarding in one team.' },
    { title: 'Enterprise-grade compliance', desc: 'Background checks, contracts, payroll and audit-ready records.' },
    { title: 'Relationships beyond placement', desc: '90-day cover and talent success follow-up after joining.' },
  ],
};

export const V2_INSIGHTS = {
  eyebrow: 'News & Insights',
  title: 'Hiring intelligence, monthly',
  items: [
    { title: 'India Technology Compensation Report 2026', meta: 'Salary Guides • 12 min read', slug: 'india-tech-salary-guide-2026' },
    { title: 'The GCC Playbook: 0→100 engineers in 90 days', meta: 'GCC Reports • 15 min read', slug: 'gcc-setup-playbook-india' },
    { title: 'Eliminating the 40% offer-dropout problem', meta: 'Market Trends • 8 min read', slug: 'preventing-offer-shopping-attrition' },
  ],
};
