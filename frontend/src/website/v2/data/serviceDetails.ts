/** Detail content for the interactive Learn-more / View-hiring-practice modals. */

export interface ServiceDetail {
  slug: string;
  kind: 'solution' | 'industry';
  label: string;
  tagline: string;
  description: string;
  image: string;
  alt: string;
  stats: [string, string][];
  capabilities: string[];
  process: string[];
  /** Prefilled into the lead form */
  service: string;
  industry?: string;
}

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const SOLUTION_DETAILS: ServiceDetail[] = [
  {
    slug: 'permanent-recruitment',
    kind: 'solution',
    label: 'Permanent Recruitment',
    tagline: 'Direct full-time hiring with replacement cover',
    description:
      'End-to-end permanent hiring for technology, engineering, corporate and leadership roles. A dedicated domain pod runs sourcing, screening and evaluation notes — you interview only pre-vetted shortlists delivered within 72 hours of mandate sign-off.',
    image: u('photo-1521737711867-e3b97375f902'),
    alt: 'Hiring team collaborating in a bright office',
    stats: [['72 hrs', 'first shortlist'], ['88%', 'offer acceptance'], ['90 days', 'replacement cover']],
    capabilities: [
      'Role scoping workshop with a practice lead',
      'Tech-screened shortlists with evaluation notes',
      'Offer negotiation and counter-offer management',
      'Background verification before joining',
      '90-day free replacement on every placement',
    ],
    process: ['Discovery call (24 hrs)', 'Sourcing & screening', 'Shortlist (72 hrs)', 'Interviews & offer', 'Onboarding'],
    service: 'Permanent Recruitment',
  },
  {
    slug: 'contract-staffing',
    kind: 'solution',
    label: 'Contract Staffing',
    tagline: 'Time-bound workforce with full compliance',
    description:
      'Project-based and time-bound engineers on our payroll — statutory compliance, PF/ESIC, single-window invoicing and smooth conversions to permanent when you want them on your books.',
    image: u('photo-1600880292203-757bb62b4baf'),
    alt: 'Two professionals shaking hands after a meeting',
    stats: [['7 days', 'avg. ramp-up'], ['100%', 'statutory cover'], ['1 invoice', 'single window']],
    capabilities: [
      'Fully compliant employment on our rolls',
      'Flexible 3–12 month engagements',
      'Option to convert to permanent mid-term',
      'Dedicated contract-desk relationship manager',
      'Weekly timesheet & attendance tracking',
    ],
    process: ['Requirement intake', 'Shortlist in 72 hrs', 'Interview & select', 'Deploy & payroll', 'Monthly invoicing'],
    service: 'Contract Staffing',
  },
  {
    slug: 'it-staff-augmentation',
    kind: 'solution',
    label: 'IT Staff Augmentation',
    tagline: 'Pre-vetted engineers in 72 hours',
    description:
      'Plug-and-play engineers for capacity spikes, agile squads and specialised skills. Our engineers work in your timezone, inside your tooling, with monthly capacity flex-up or flex-down.',
    image: u('photo-1522071820081-009f0129c71c'),
    alt: 'Development team working together at laptops',
    stats: [['72 hrs', 'deployment ready'], ['4,800+', 'engineers placed'], ['4.8/5', 'client rating']],
    capabilities: [
      'Vetted across 40+ tech stacks',
      'Embedded in your sprints and standups',
      'Monthly capacity adjustments',
      'Replacement within 7 days if fit issues',
      'Transparent weekly utilisation reporting',
    ],
    process: ['Skill-gap analysis', 'Matching (48 hrs)', 'Client interview', 'Deploy', 'Ongoing reviews'],
    service: 'IT Staff Augmentation',
  },
  {
    slug: 'executive-search',
    kind: 'solution',
    label: 'Executive Search',
    tagline: 'Confidential leadership search',
    description:
      'Discreet, retained search for CXO, VP Engineering, Director and Head-level mandates. Research-led mapping of target companies, confidential outreach and psychometric-backed assessments.',
    image: u('photo-1552664730-d307ca884978'),
    alt: 'Leadership team in a boardroom discussion',
    stats: [['30 days', 'avg. closure'], ['92%', 'retention at 1 yr'], ['100%', 'confidential']],
    capabilities: [
      'Target-company org mapping',
      'Confidential passive-candidate outreach',
      'Leadership assessments & benchmarking',
      'Offer structuring and relocation support',
      'Post-placement integration support',
    ],
    process: ['Retainer & briefing', 'Market mapping', 'Longlist', 'Assessments', 'Shortlist & close'],
    service: 'Executive Search',
  },
  {
    slug: 'bulk-hiring',
    kind: 'solution',
    label: 'Bulk & Volume Hiring',
    tagline: '10–100+ role expansions, structured drives',
    description:
      'Structured sourcing drives and batch interview coordination for expansions, new-site launches and seasonal peaks. Dedicated drive managers, campus networks and drive-day logistics included.',
    image: u('photo-1517245386807-bb43f82c33c4'),
    alt: 'Group of candidates waiting at a hiring drive',
    stats: [['100+', 'roles per drive'], ['2 wks', 'drive cycle'], ['1:6', 'interview-to-offer']],
    capabilities: [
      'Drive-day venue and logistics management',
      'Assessment design and proctoring',
      'Bulk-offer generation and joining tracking',
      'Multi-city sourcing networks',
      'Real-time drive dashboards',
    ],
    process: ['Volume planning', 'Sourcing surge', 'Drive day', 'Batch offers', 'Joining wave'],
    service: 'Bulk & Volume Hiring',
  },
  {
    slug: 'rpo-embedded-ta',
    kind: 'solution',
    label: 'RPO & Embedded TA',
    tagline: 'Recruiters inside your talent team',
    description:
      'Recruiters embedded inside your talent acquisition team with SLA-backed delivery, transparent reporting and full pipeline ownership — for a fixed monthly fee instead of per-hire markup.',
    image: u('photo-1542744173-8e7e53415bb0'),
    alt: 'Talent acquisition team planning on a whiteboard',
    stats: [['30%', 'cost per hire saved'], ['SLA', 'backed delivery'], ['1 desk', 'end-to-end owner']],
    capabilities: [
      'Dedicated recruiters on your brand',
      'Your ATS, your process, our bandwidth',
      'Weekly funnel reporting',
      'Employer-brand coordination',
      'Scale up or down monthly',
    ],
    process: ['Process audit', 'Team embed', 'Pipeline takeover', 'SLA reporting', 'Continuous optimisation'],
    service: 'RPO & Embedded TA',
  },
  {
    slug: 'gcc-talent-solutions',
    kind: 'solution',
    label: 'GCC Talent Solutions',
    tagline: 'Turnkey offshore engineering pods',
    description:
      'Talent pipelines, cost-plus modelling and Day-0 advisory for global capability centres standing up or scaling in India. From entity setup partners to the first 50 engineers.',
    image: u('photo-1497366216548-37526070297c'),
    alt: 'Modern open-plan capability centre office',
    stats: [['5–50+', 'pod size'], ['40%', 'cost arbitrage'], ['Day 0', 'setup advisory']],
    capabilities: [
      'Location and talent-market assessment',
      'Leadership hiring for the centre',
      'Cost-plus staffing models',
      'HR ops and compliance partners',
      'Phase-wise headcount ramps',
    ],
    process: ['Site selection', 'Leadership hire', 'Pod build-out', 'Scale phases', 'Steady-state TA'],
    service: 'GCC Talent Solutions',
  },
  {
    slug: 'vendor-empanelment',
    kind: 'solution',
    label: 'Vendor Empanelment',
    tagline: 'Partner network for sub-vendors',
    description:
      'Staffing firms and sub-vendors can apply to our empanelment network. Reliable IT and non-IT talent delivered together under one SLA, one invoice and one quality bar.',
    image: u('photo-1521791136064-7986c2920216'),
    alt: 'Business partners signing an agreement',
    stats: [['200+', 'empanelled partners'], ['1 SLA', 'shared quality bar'], ['Weekly', 'payouts']],
    capabilities: [
      'Standardised submission format',
      'Shared quality scorecard',
      'Faster interview loops',
      'Transparent tracking portal',
      'Preferred-partner mandate flow',
    ],
    process: ['Apply', 'Screening round', 'Empanelment', 'First mandate', 'Performance reviews'],
    service: 'Vendor Empanelment',
  },
  {
    slug: 'background-verification',
    kind: 'solution',
    label: 'Background Verification',
    tagline: 'Audit-ready checks before joining',
    description:
      'Identity, employment history, education and court-record checks before every joining — audit-ready reports aligned with ISO 27001 and DPDP Act data-privacy protocols.',
    image: u('photo-1450101499163-c8848c66ca85'),
    alt: 'Verification documents being reviewed',
    stats: [['48 hrs', 'turnaround'], ['100%', 'audit-ready'], ['ISO', '27001 aligned']],
    capabilities: [
      'ID and address verification',
      'Employment history confirmation',
      'Education and certification checks',
      'Criminal and court-record search',
      'Reference checks with managers',
    ],
    process: ['Consent capture', 'Document collection', 'Field verification', 'Report', 'Client review'],
    service: 'Background Verification',
  },
];

export const INDUSTRY_DETAILS: ServiceDetail[] = [
  {
    slug: 'bfsi',
    kind: 'industry',
    label: 'Banking & Financial Services',
    tagline: 'Compliance-first talent for BFSI',
    description:
      'Hiring for core banking, payments, risk, compliance and FinTech product teams. We understand RBI/SEBI screening norms and deliver pre-verified talent for regulated environments.',
    image: u('photo-1611974789855-9c2a0a7236a3'),
    alt: 'A financial advisor reviewing documents with a client',
    stats: [['2,900+', 'hires'], ['18 days', 'avg. time-to-fill'], ['92%', 'acceptance']],
    capabilities: [
      'Payments, core banking & risk tech talent',
      'Regulatory background checks by default',
      'Quant, risk and compliance specialists',
      'Digital banking transformation squads',
      'Leadership for FinTech verticals',
    ],
    process: ['Domain pod briefing', 'Compliance screening', 'Shortlist', 'Interviews', 'Verified joining'],
    service: 'BFSI hiring',
    industry: 'Banking & Financial Services',
  },
  {
    slug: 'retail',
    kind: 'industry',
    label: 'Retail & E-commerce',
    tagline: 'Omnichannel and marketplace talent',
    description:
      'Supply-chain tech, marketplace, merchandising and store-ops technology talent for modern retail. Seasonal peak hiring and omnichannel platform squads are our sweet spot.',
    image: u('photo-1441986300917-64674bd600d8'),
    alt: 'A retail worker at the entrance of a modern store',
    stats: [['2,200+', 'hires'], ['15 days', 'avg. time-to-fill'], ['Seasonal', 'peak support']],
    capabilities: [
      'Marketplace & e-commerce platform engineers',
      'Supply-chain and demand-planning tech',
      'Store-ops and POS transformation',
      'Seasonal volume-hiring drives',
      'D2C brand leadership search',
    ],
    process: ['Peak planning', 'Sourcing surge', 'Interviews', 'Drive offers', 'Steady-state hiring'],
    service: 'Retail hiring',
    industry: 'Retail & E-commerce',
  },
  {
    slug: 'manufacturing',
    kind: 'industry',
    label: 'Manufacturing',
    tagline: 'Smart factory and Industry 4.0 talent',
    description:
      'Plant automation, MES, IoT, quality and supply-chain technology hiring for discrete and process manufacturing. We staff Industry 4.0 programmes from the shop floor to the digital core.',
    image: u('photo-1565043666747-69f6646db940'),
    alt: 'Sparks flying from an automated industrial welding machine',
    stats: [['1,400+', 'hires'], ['20 days', 'avg. time-to-fill'], ['Multi-site', 'plant coverage']],
    capabilities: [
      'MES, SCADA and industrial-IoT engineers',
      'Plant automation and controls specialists',
      'Quality, EHS and lean leadership',
      'Supply-chain digitalisation talent',
      'Multi-site maintenance-tech hiring',
    ],
    process: ['Plant-visit briefing', 'Regional sourcing', 'Shortlist', 'Plant interviews', 'Joining'],
    service: 'Manufacturing hiring',
    industry: 'Manufacturing',
  },
  {
    slug: 'energy',
    kind: 'industry',
    label: 'Oil, Energy & Utilities',
    tagline: 'Digital energy and grid modernisation talent',
    description:
      'SCADA, smart-grid, renewables and energy-trading technology talent. Safety-critical staffing with strict compliance vetting for upstream, midstream and utility operators.',
    image: u('photo-1466611653911-95081537e5b7'),
    alt: 'An illuminated oil refinery seen from above at night',
    stats: [['1,100+', 'hires'], ['22 days', 'avg. time-to-fill'], ['Safety', 'vetted talent']],
    capabilities: [
      'Smart-grid and metering technologists',
      'SCADA / OT-security specialists',
      'Renewables project-engineering talent',
      'Energy trading and market platforms',
      'Safety-compliance verified placements',
    ],
    process: ['HSE briefing', 'Compliance vetting', 'Shortlist', 'Panel interviews', 'Mobilisation'],
    service: 'Energy hiring',
    industry: 'Oil, Energy & Utilities',
  },
  {
    slug: 'healthcare',
    kind: 'industry',
    label: 'Healthcare & Life Sciences',
    tagline: 'Clinical-tech and life-sciences talent',
    description:
      'Health-tech platforms, hospital information systems, clinical data and pharma-BPO technology hiring — with privacy-first screening aligned to health-data regulations.',
    image: u('photo-1576091160399-112ba8d25d1d'),
    alt: 'A futuristic interface visualizing health data',
    stats: [['1,750+', 'hires'], ['19 days', 'avg. time-to-fill'], ['HIPAA', 'aware talent']],
    capabilities: [
      'HIS / EMR implementation engineers',
      'Clinical-data and RWD specialists',
      'Health-tech product teams',
      'Pharma process and BPO leadership',
      'Privacy-first screening protocols',
    ],
    process: ['Compliance briefing', 'Domain screening', 'Shortlist', 'Interviews', 'Onboarding'],
    service: 'Healthcare hiring',
    industry: 'Healthcare & Life Sciences',
  },
  {
    slug: 'media',
    kind: 'industry',
    label: 'Communication & Media',
    tagline: 'Streaming, telco and digital-media talent',
    description:
      'Streaming platforms, telco OSS/BSS, ad-tech and digital-publishing engineering teams. High-velocity product hiring for audience-growth and content-platform programmes.',
    image: u('photo-1495020689067-958852e0c95d'),
    alt: 'A presenter speaking into a microphone under studio lighting',
    stats: [['1,950+', 'hires'], ['16 days', 'avg. time-to-fill'], ['Product', 'first teams']],
    capabilities: [
      'Streaming and video-platform engineers',
      'OSS/BSS and telco-core talent',
      'Ad-tech and measurement specialists',
      'Content-platform product teams',
      'Growth and audience-engagement roles',
    ],
    process: ['Product briefing', 'Portfolio screening', 'Shortlist', 'Craft interviews', 'Offer'],
    service: 'Media hiring',
    industry: 'Communication & Media',
  },
  {
    slug: 'logistics',
    kind: 'industry',
    label: 'Travel, Transportation & Logistics',
    tagline: 'Supply-chain tech and fleet-platform talent',
    description:
      'WMS/TMS platforms, fleet telematics, last-mile optimisation and travel-tech engineering hiring. Built for 24×7 operations environments and high-growth logistics startups.',
    image: u('photo-1586528116311-ad8dd3c8310d'),
    alt: 'A container cargo ship carrying freight at sea',
    stats: [['1,800+', 'hires'], ['17 days', 'avg. time-to-fill'], ['24×7', 'ops coverage']],
    capabilities: [
      'WMS / TMS platform engineers',
      'Fleet telematics and IoT talent',
      'Last-mile optimisation data scientists',
      'Travel-tech product engineering',
      'Warehouse-ops leadership',
    ],
    process: ['Ops briefing', 'Domain sourcing', 'Shortlist', 'Interviews', 'Mobilisation'],
    service: 'Logistics hiring',
    industry: 'Travel, Transportation & Logistics',
  },
  {
    slug: 'gcc',
    kind: 'industry',
    label: 'Government & Public Sector',
    tagline: 'Secure digital-government programmes',
    description:
      'Talent for e-governance platforms, PSU digital programmes and smart-city initiatives — with security-cleared backgrounds and strict procurement-compliance workflows.',
    image: u('photo-1486406146926-c627a92ad1ab'),
    alt: 'A government capitol building with a classical dome',
    stats: [['5,500+', 'hires'], ['Cleared', 'security vetting'], ['RFP', 'aligned delivery']],
    capabilities: [
      'e-governance platform engineers',
      'Smart-city and IoT integrators',
      'Cybersecurity cleared specialists',
      'PSU leadership and advisory roles',
      'RFP-compliant staffing workflows',
    ],
    process: ['RFP mapping', 'Cleared sourcing', 'Shortlist', 'Panel interviews', 'Deputation'],
    service: 'Public-sector hiring',
    industry: 'Government & Public Sector',
  },
];

export function getServiceDetail(kind: 'solution' | 'industry', slug: string): ServiceDetail | undefined {
  return (kind === 'solution' ? SOLUTION_DETAILS : INDUSTRY_DETAILS).find((d) => d.slug === slug);
}
