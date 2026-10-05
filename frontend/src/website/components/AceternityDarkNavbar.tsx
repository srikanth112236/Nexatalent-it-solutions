import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from '../../shared/theme/ThemeContext';

const SOLUTIONS_ITEMS = [
  { to: '/solutions', label: 'Solutions Overview', desc: 'Master capability matrix & engagement models' },
  { to: '/solutions/permanent-hiring', label: 'Permanent Recruitment', desc: 'Lateral tech talent & direct sourcing' },
  { to: '/solutions/contract-staffing', label: 'Contract Staffing', desc: 'Elastic engineering staff augmentation' },
  { to: '/solutions/gcc-hiring', label: 'GCC Turnkey Pods', desc: 'Offshore tech center setup in India' },
  { to: '/solutions/executive-search', label: 'Executive Search', desc: 'CTO, VP Eng & Board leadership' },
  { to: '/solutions/recruitment-process-support', label: 'Recruitment Process Support (RPO)', desc: 'Embedded talent acquisition teams' },
  { to: '/solutions/volume-hiring', label: 'Volume Hiring Drives', desc: '50-500 scale engineering batches' },
];

const INDUSTRIES_ITEMS = [
  { to: '/industries', label: 'Industries Overview', desc: '7 specialized sector practices' },
  { to: '/industries/technology', label: 'Technology & SaaS', desc: 'Hyper-scale & distributed systems' },
  { to: '/industries/bfsi', label: 'BFSI & FinTech', desc: 'Ultra-low latency & quant trading' },
  { to: '/industries/healthcare', label: 'Healthcare & Life Sciences', desc: 'HIPAA platforms & clinical AI' },
  { to: '/industries/manufacturing', label: 'Manufacturing & IoT', desc: 'Industry 4.0 & robotics firmware' },
  { to: '/industries/retail', label: 'Retail & E-Commerce', desc: 'High-concurrency checkout engines' },
  { to: '/industries/gcc', label: 'Global Capability Centers', desc: 'Multinational tech hub pods' },
];

const PLATFORM_ITEMS = [
  { to: '/employers', label: 'For Employers / Clients', desc: 'AI JD parsing, candidate shortlist & interviews', icon: Building2 },
  { to: '/candidates', label: 'For Candidates', desc: 'Resume scoring, career scanner & AI jobs', icon: Users },
  { to: '/partners', label: 'Recruitment Partners', desc: 'Vendor empanelment & requirement marketplace', icon: Briefcase },
  { to: '/why-nexatalent', label: 'Why NexaTalent IT Solutions', desc: 'Cost-Plus transparency & 90-day guarantee', icon: ShieldCheck },
];

const INTELLIGENCE_ITEMS = [
  { to: '/case-studies', label: 'Client Case Studies', desc: 'Quantified time-to-hire & latency outcomes' },
  { to: '/insights', label: 'Insights & Salary Reports', desc: 'India compensation benchmarks & GCC playbooks' },
];

export const AceternityDarkNavbar: React.FC = () => {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const location = useLocation();

  const toggleMobileSection = (sec: string) => {
    setMobileSection(mobileSection === sec ? null : sec);
  };

  return (
    <div className="w-full px-3 sm:px-6 pt-2.5 sm:pt-3">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="max-w-7xl mx-auto rounded-full bg-[#090b14]/92 backdrop-blur-xl border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.45)] text-white relative">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5">
          
          {/* Logo */}
          <Link to="/" aria-label="NexaTalent IT Solutions home" className="shrink-0 flex items-center pr-2">
            <Logo height={30} onDark />
          </Link>

          {/* Desktop Navigation: Compact & No-Wrap */}
          <nav className="hidden lg:flex items-center gap-0.5 text-[13.5px] font-medium" aria-label="Primary">
            
            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={solutionsOpen}
                onClick={() => setSolutionsOpen((o) => !o)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  solutionsOpen || location.pathname.startsWith('/solutions') 
                    ? 'text-white bg-white/10' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {solutionsOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl bg-[#0f111a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2 z-50">
                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider px-3 py-1 border-b border-white/5 mb-1">
                    Engagement Models
                  </div>
                  {SOLUTIONS_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSolutionsOpen(false)}
                      className={`block px-3 py-1.5 rounded-xl transition-colors ${
                        location.pathname === item.to ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white whitespace-nowrap">{item.label}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIndustriesOpen(true)}
              onMouseLeave={() => setIndustriesOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={industriesOpen}
                onClick={() => setIndustriesOpen((o) => !o)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  industriesOpen || location.pathname.startsWith('/industries') 
                    ? 'text-white bg-white/10' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Industries</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${industriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {industriesOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl bg-[#0f111a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2 z-50">
                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider px-3 py-1 border-b border-white/5 mb-1">
                    Sector Practices
                  </div>
                  {INDUSTRIES_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIndustriesOpen(false)}
                      className={`block px-3 py-1.5 rounded-xl transition-colors ${
                        location.pathname === item.to ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white whitespace-nowrap">{item.label}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Dropdown (Employers, Candidates, Partners, Why Nexa) */}
            <div 
              className="relative"
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={platformOpen}
                onClick={() => setPlatformOpen((o) => !o)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  platformOpen || ['/employers', '/candidates', '/partners', '/why-nexatalent'].includes(location.pathname)
                    ? 'text-white bg-white/10' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Platform</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${platformOpen ? 'rotate-180' : ''}`} />
              </button>

              {platformOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl bg-[#0f111a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2 z-50">
                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider px-3 py-1 border-b border-white/5 mb-1">
                    Hiring Ecosystem
                  </div>
                  {PLATFORM_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setPlatformOpen(false)}
                        className={`flex items-start gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                          location.pathname === item.to ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-300'
                        }`}
                      >
                        <Icon size={16} className="text-[#4361EE] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white whitespace-nowrap">{item.label}</div>
                          <div className="text-[10px] text-neutral-400 line-clamp-1">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Jobs Link */}
            <Link
              to="/jobs"
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                location.pathname === '/jobs' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Jobs
            </Link>

            {/* Intelligence Dropdown (Case Studies, Insights, Locations) */}
            <div 
              className="relative"
              onMouseEnter={() => setIntelligenceOpen(true)}
              onMouseLeave={() => setIntelligenceOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={intelligenceOpen}
                onClick={() => setIntelligenceOpen((o) => !o)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  intelligenceOpen || ['/case-studies', '/insights'].includes(location.pathname)
                    ? 'text-white bg-white/10' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Intelligence</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${intelligenceOpen ? 'rotate-180' : ''}`} />
              </button>

              {intelligenceOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl bg-[#0f111a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2 z-50">
                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider px-3 py-1 border-b border-white/5 mb-1">
                    Market Intelligence
                  </div>
                  {INTELLIGENCE_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIntelligenceOpen(false)}
                      className={`block px-3 py-1.5 rounded-xl transition-colors ${
                        location.pathname === item.to ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white whitespace-nowrap">{item.label}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About & Contact */}
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                location.pathname === '/about' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                location.pathname === '/contact' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Quick Right Actions: Compact & No-Wrap */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            
            <Link
              to="/login"
              className="hidden md:inline-flex px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>

            <Link
              to="/employers"
              className="inline-flex px-3.5 py-1.5 rounded-full bg-[#4361EE] hover:bg-[#3651D4] text-white text-xs font-bold transition-all shadow-[0_2px_10px_rgba(67,97,238,0.35)] whitespace-nowrap"
            >
              Hire Talent
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-full text-neutral-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Touch Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 px-4 py-4 max-h-[80vh] overflow-y-auto bg-[#0a0a12] rounded-b-2xl">
            
            {/* Quick Action Top Bar */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Link
                to="/employers"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#4361EE] text-white font-bold text-xs text-center whitespace-nowrap"
              >
                <Briefcase size={14} />
                <span>Hire Talent</span>
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center border border-white/10 whitespace-nowrap"
              >
                <Users size={14} />
                <span>Find Jobs</span>
              </Link>
            </div>

            {/* Navigation Groups */}
            <div className="flex flex-col gap-1">
              
              {/* Solutions Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('solutions')}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-[#4361EE]" />
                    <span>Solutions</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileSection === 'solutions' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSection === 'solutions' && (
                  <div className="pl-6 pr-2 py-1 flex flex-col gap-1 border-l-2 border-white/10 ml-4 mb-2">
                    {SOLUTIONS_ITEMS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="py-1.5 px-2 text-xs text-neutral-300 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Industries Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('industries')}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#0891B2]" />
                    <span>Industries</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileSection === 'industries' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSection === 'industries' && (
                  <div className="pl-6 pr-2 py-1 flex flex-col gap-1 border-l-2 border-white/10 ml-4 mb-2">
                    {INDUSTRIES_ITEMS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="py-1.5 px-2 text-xs text-neutral-300 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Links */}
              <Link
                to="/employers"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>For Employers</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

              <Link
                to="/candidates"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>For Candidates</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

              <Link
                to="/partners"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>Recruitment Partners</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

              <Link
                to="/why-nexatalent"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>Why NexaTalent IT Solutions</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

              <Link
                to="/case-studies"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>Case Studies</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

              <Link
                to="/insights"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>Insights & Reports</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>About</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-neutral-200 hover:bg-white/5 font-semibold text-sm"
              >
                <span>Contact</span>
                <ArrowRight size={13} className="text-neutral-500" />
              </Link>

            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-white/15 text-xs font-bold text-white hover:bg-white/5 transition-colors whitespace-nowrap"
              >
                Sign In to Platform
              </Link>
              <Link
                to="/candidate/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-neutral-200 transition-colors whitespace-nowrap"
              >
                Join Candidate Talent Network
              </Link>
            </div>

          </div>
        )}
      </header>
    </div>
  );
};
