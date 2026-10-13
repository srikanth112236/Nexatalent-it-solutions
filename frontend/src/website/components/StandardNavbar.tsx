import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  Briefcase,
  Building2,
  Users,
  Layers,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  FileCheck2,
  Search,
  Sparkles,
  BookOpen,
  Award,
  PhoneCall,
  BadgeCheck,
} from 'lucide-react';
import { Logo } from './Logo';

interface NavSubItem {
  to: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

interface NavSection {
  id: string;
  label: string;
  badge: string;
  footerLink: { to: string; label: string };
  items: NavSubItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'solutions',
    label: 'Solutions',
    badge: 'Enterprise Engagement Models',
    footerLink: { to: '/solutions', label: 'Explore All Solutions & Delivery Frameworks' },
    items: [
      {
        to: '/solutions/permanent-hiring',
        label: 'Permanent Recruitment',
        desc: 'Direct tech sourcing & lateral engineering talent across senior levels',
        icon: Users,
      },
      {
        to: '/solutions/contract-staffing',
        label: 'Contract Staffing',
        desc: 'Elastic developer squads & agile augmentation for project delivery',
        icon: Layers,
      },
      {
        to: '/solutions/gcc-hiring',
        label: 'GCC Turnkey Pods',
        desc: 'Turnkey India offshore engineering center setup, BOT & scaling',
        icon: Building2,
      },
      {
        to: '/solutions/executive-search',
        label: 'Executive Search',
        desc: 'Confidential CTO, VP Engineering & Board tech leadership search',
        icon: Award,
      },
      {
        to: '/solutions/recruitment-process-support',
        label: 'Recruitment Process Support (RPO)',
        desc: 'Embedded talent acquisition teams managing end-to-end pipelines',
        icon: FileCheck2,
      },
      {
        to: '/solutions/volume-hiring',
        label: 'Volume Hiring Drives',
        desc: 'Accelerated batch hiring sprints for 50–500 engineering roles',
        icon: Sparkles,
      },
    ],
  },
  {
    id: 'industries',
    label: 'Industries',
    badge: 'Specialized Sector Practices',
    footerLink: { to: '/industries', label: 'View All 7 Specialized Industry Verticals' },
    items: [
      {
        to: '/industries/technology',
        label: 'Technology & SaaS',
        desc: 'Cloud-native platforms, distributed architectures & AI/ML pipelines',
        icon: Cpu,
      },
      {
        to: '/industries/bfsi',
        label: 'BFSI & FinTech',
        desc: 'Ultra-low latency execution, algorithmic trading & payment systems',
        icon: TrendingUp,
      },
      {
        to: '/industries/healthcare',
        label: 'Healthcare & Life Sciences',
        desc: 'HIPAA-compliant healthtech, clinical AI & medical IoT telemetry',
        icon: ShieldCheck,
      },
      {
        to: '/industries/manufacturing',
        label: 'Manufacturing & IoT',
        desc: 'Industry 4.0, embedded firmware & connected autonomous robotics',
        icon: Layers,
      },
      {
        to: '/industries/retail',
        label: 'Retail & E-Commerce',
        desc: 'High-concurrency checkout engines & omni-channel retail systems',
        icon: Building2,
      },
      {
        to: '/industries/gcc',
        label: 'Global Capability Centers (GCC)',
        desc: 'Cross-functional engineering pods for Fortune 500 tech hubs in India',
        icon: Users,
      },
    ],
  },
  {
    id: 'platform',
    label: 'Platform & Jobs',
    badge: 'Intelligent Hiring Ecosystem',
    footerLink: { to: '/request-talent', label: 'Post a Role or Request Engineering Talent' },
    items: [
      {
        to: '/employers',
        label: 'For Employers / Clients',
        desc: 'AI JD parsing, candidate scoring & vetted tech talent pipelines',
        icon: Building2,
      },
      {
        to: '/candidates',
        label: 'For Candidates',
        desc: 'Resume scoring, career concierge & curated high-growth tech roles',
        icon: Users,
      },
      {
        to: '/jobs',
        label: 'Open Tech Mandates',
        desc: 'Live engineering, DevOps, AI & architecture mandates across India',
        icon: Search,
      },
      {
        to: '/partners',
        label: 'Recruitment Partners',
        desc: 'Vendor empanelment, mandate marketplace & transparent fee payouts',
        icon: Briefcase,
      },
      {
        to: '/why-nexatalent',
        label: 'Why NexaTalent IT Solutions',
        desc: 'Cost-Plus pricing transparency & 90-day replacement guarantee',
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: 'company',
    label: 'Company & Insights',
    badge: 'Proof, Insights & Locations',
    footerLink: { to: '/insights', label: 'Download India Tech Compensation & Hiring Benchmark Report' },
    items: [
      {
        to: '/about',
        label: 'About NexaTalent IT Solutions',
        desc: 'Our corporate governance, leadership pedigree & technology vision',
        icon: Building2,
      },
      {
        to: '/case-studies',
        label: 'Client Case Studies',
        desc: 'Quantified time-to-hire, latency outcomes & verified enterprise scale',
        icon: Award,
      },
      {
        to: '/insights',
        label: 'Insights & Salary Reports',
        desc: 'India engineering compensation benchmarks & GCC setup playbooks',
        icon: BookOpen,
      },
      {
        to: '/contact',
        label: 'Contact Us',
        desc: 'Connect with our enterprise talent architects for RFPs & advisory',
        icon: PhoneCall,
      },
    ],
  },
];

export const StandardNavbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const location = useLocation();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const isCurrentSection = (section: NavSection) => {
    return (
      activeMenu === section.id ||
      section.items.some((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))
    );
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg focus:shadow-xl focus:font-semibold focus:outline-none"
      >
        Skip to content
      </a>

      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-[0_1px_12px_rgba(0,0,0,0.05)] transition-all"
      >
        <div className="mx-auto w-[85%] max-w-[1200px] h-[68px] flex items-center justify-between gap-6">
          <Link
            to="/"
            aria-label="NexaTalent IT Solutions Home"
            className="flex items-center shrink-0 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-lg py-1 outline-none"
            onClick={() => setActiveMenu(null)}
          >
            <Logo height={40} />
          </Link>

          {/* Desktop Navigation — black-only */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1"
            onMouseLeave={handleMouseLeave}
          >
            {NAV_SECTIONS.map((section) => {
              const isOpen = activeMenu === section.id;
              const isActive = isCurrentSection(section);

              return (
                <div
                  key={section.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(section.id)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setActiveMenu(isOpen ? null : section.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-semibold tracking-[-0.01em] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black ${
                      isOpen || isActive
                        ? 'text-white bg-black'
                        : 'text-black hover:bg-neutral-100'
                    }`}
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'text-black'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      role="region"
                      aria-label={`${section.label} menu`}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[600px] z-50"
                      onMouseEnter={() => handleMouseEnter(section.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white rounded-xl border border-neutral-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
                        <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-black font-mono">
                            {section.badge}
                          </span>
                          <span className="text-[11px] font-medium text-black">
                            NexaTalent
                          </span>
                        </div>

                        <div className="p-3 grid grid-cols-2 gap-1.5">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const isCurrent = location.pathname === item.to;

                            return (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setActiveMenu(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-lg transition-all group ${
                                  isCurrent
                                    ? 'bg-black text-white'
                                    : 'hover:bg-neutral-100 text-black'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                    isCurrent
                                      ? 'bg-white text-black'
                                      : 'bg-neutral-200 text-black group-hover:bg-black group-hover:text-white'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div
                                    className={`text-[13px] font-semibold leading-snug ${
                                      isCurrent ? 'text-white' : 'text-black'
                                    }`}
                                  >
                                    {item.label}
                                  </div>
                                  <p
                                    className={`text-[11px] leading-tight mt-0.5 line-clamp-2 ${
                                      isCurrent ? 'text-white' : 'text-black'
                                    }`}
                                  >
                                    {item.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                          <Link
                            to={section.footerLink.to}
                            onClick={() => setActiveMenu(null)}
                            className="text-xs font-bold text-black flex items-center gap-1.5 transition-colors group"
                          >
                            <span>{section.footerLink.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-black bg-white px-2 py-0.5 rounded-full border border-neutral-300">
                            <BadgeCheck className="w-3 h-3" />
                            Verified Partner
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right actions — black-only */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden md:inline-flex px-3.5 py-2 text-[13px] font-semibold text-black transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-black outline-none"
            >
              Sign In
            </Link>

            <Link
              to="/request-talent"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              <span>Hire Talent</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-black hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-black outline-none cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer — black-only */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200 px-4 py-5 shadow-2xl max-h-[82vh] overflow-y-auto">
            <div className="mx-auto w-[85%] max-w-[1200px]">
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <Link
                  to="/request-talent"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black text-white font-bold text-xs text-center"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Hire Talent</span>
                </Link>
                <Link
                  to="/jobs"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-xs text-center border border-neutral-200"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse Jobs</span>
                </Link>
              </div>

              <div className="flex flex-col gap-1.5">
                {NAV_SECTIONS.map((section) => {
                  const isExpanded = mobileExpandedSection === section.id;

                  return (
                    <div key={section.id} className="border-b border-neutral-200 last:border-0 pb-1">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedSection(isExpanded ? null : section.id)
                        }
                        className="w-full flex items-center justify-between py-3 px-2 rounded-lg text-black font-bold text-sm hover:bg-neutral-100 transition-colors"
                      >
                        <span>{section.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-black transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-3 pr-1 py-1 flex flex-col gap-1 bg-neutral-50 rounded-xl mb-2">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-black hover:bg-white transition-colors"
                              >
                                <Icon className="w-3.5 h-3.5 shrink-0" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                          <Link
                            to={section.footerLink.to}
                            onClick={() => setMobileOpen(false)}
                            className="mt-1 py-2 px-2.5 text-xs font-bold text-black flex items-center gap-1 border-t border-neutral-200"
                          >
                            <span>{section.footerLink.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-black hover:bg-neutral-50 transition-colors"
                >
                  Sign In to Platform
                </Link>
                <Link
                  to="/candidate/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-neutral-100 text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
                >
                  Join Candidate Talent Network
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
