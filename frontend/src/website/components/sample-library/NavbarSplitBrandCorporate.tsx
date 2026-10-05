import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../Logo';
import { ThemeToggle } from '../../../shared/theme/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2, 
  Cpu, 
  Briefcase, 
  Scale, 
  Landmark, 
  Server, 
  FileCheck,
  Menu,
  X,
  LayoutGrid
} from 'lucide-react';

const HOME_VERSIONS = [
  { to: '/', label: 'Home V1', desc: 'Original spectacle' },
  { to: '/v2', label: 'Home V2', desc: 'Editorial story' },
  { to: '/v3', label: 'Home V3', desc: 'Cinematic journey' },
  { to: '/v4', label: 'Home V4', desc: 'Rails & iris' },
  { to: '/v5', label: 'Home V5', desc: 'Practice grid' },
];

const MOBILE_LINKS = [
  ...HOME_VERSIONS,
  { to: '/solutions', label: 'Solutions', desc: 'Hiring solutions' },
  { to: '/jobs', label: 'Jobs', desc: 'Open mandates' },
  { to: '/employers', label: 'For Employers', desc: 'Hire talent' },
  { to: '/candidates', label: 'For Candidates', desc: 'Careers' },
  { to: '/industries', label: 'Industries', desc: 'Sectors we power' },
  { to: '/case-studies', label: 'Case Studies', desc: 'Client proof' },
  { to: '/about', label: 'About', desc: 'Company' },
];

export const NavbarSplitBrandCorporate: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  const [activeBrand, setActiveBrand] = useState<'talent' | 'scale'>('talent');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={bare ? 'w-full relative z-15' : 'w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative z-15'}>
      {!bare && (
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
          04 · Split-Brand Corporate Multi-Entity Navbar
        </span>
        <span className="text-cyan-800 bg-cyan-50 border border-cyan-200/70 px-2 py-0.5 rounded text-[10px] font-bold">
          Dual Entity Switcher & Enterprise Mega-Drawers
        </span>
      </div>
      )}

      <header 
        className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-md shadow-slate-100 relative"
        onMouseEnter={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top utility tier */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Institutional GCC & Executive Talent Advisory
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline font-mono">Bangalore • Hyderabad • London • San Francisco</span>
          </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-blue-600 transition-colors font-medium">Client Portal Login</Link>
              <span className="text-slate-300">•</span>
              <Link to="/candidate/register" className="hover:text-blue-600 transition-colors font-medium">Candidate Network</Link>
            </div>
        </div>

        {/* Main Navigation Tier with Entity Switcher */}
        <div className="px-6 py-3.5 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <a href="/" aria-label="NexaTalent IT Solutions home" className="shrink-0 hidden sm:block">
              <Logo height={34} />
            </a>
            {/* Split Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveBrand('talent');
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeBrand === 'talent' 
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>NexaTalent IT Solutions</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveBrand('scale');
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeBrand === 'scale' 
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                <span>NexaScale GCC</span>
              </button>
            </div>

            {/* Navigation Links based on active brand */}
            <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-700">
              {activeBrand === 'talent' ? (
                <>
                  {/* Talent Link 1 */}
                  <div className="relative py-1" onMouseEnter={() => handleMouseEnter('retained')}>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === 'retained' ? null : 'retained')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                        activeMenu === 'retained' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <span>Retained Search</span>
                      <ChevronDown className={`w-3 h-3 ${activeMenu === 'retained' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  {/* Talent Link 2 */}
                  <div className="relative py-1" onMouseEnter={() => handleMouseEnter('vetting')}>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === 'vetting' ? null : 'vetting')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                        activeMenu === 'vetting' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <span>Technical Vetting</span>
                      <ChevronDown className={`w-3 h-3 ${activeMenu === 'vetting' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  {/* Talent Link 3 */}
                  <div className="relative py-1" onMouseEnter={() => handleMouseEnter('comp')}>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === 'comp' ? null : 'comp')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                        activeMenu === 'comp' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <span>Equity & Comp</span>
                      <ChevronDown className={`w-3 h-3 ${activeMenu === 'comp' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  <Link to="/about" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-700 transition-colors">
                    Board Practice
                  </Link>
                </>
              ) : (
                <>
                  {/* Scale Link 1 */}
                  <div className="relative py-1" onMouseEnter={() => handleMouseEnter('turnkey')}>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === 'turnkey' ? null : 'turnkey')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                        activeMenu === 'turnkey' ? 'bg-indigo-50 text-indigo-700' : ''
                      }`}
                    >
                      <span>Turnkey Hubs</span>
                      <ChevronDown className={`w-3 h-3 ${activeMenu === 'turnkey' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  {/* Scale Link 2 */}
                  <div className="relative py-1" onMouseEnter={() => handleMouseEnter('compliance')}>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === 'compliance' ? null : 'compliance')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                        activeMenu === 'compliance' ? 'bg-indigo-50 text-indigo-700' : ''
                      }`}
                    >
                      <span>Entity & Tax</span>
                      <ChevronDown className={`w-3 h-3 ${activeMenu === 'compliance' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  <Link to="/industries" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-indigo-700 transition-colors">
                    Facility Architecture
                  </Link>
                  <Link to="/solutions" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-indigo-700 transition-colors">
                    Rebadging
                  </Link>
                </>
              )}
              {/* Home Versions — always visible */}
              <div className="relative py-1" onMouseEnter={() => handleMouseEnter('versions')}>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={activeMenu === 'versions'}
                  onClick={() => setActiveMenu(activeMenu === 'versions' ? null : 'versions')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                    activeMenu === 'versions' ? 'bg-slate-900 text-white' : ''
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Home Versions</span>
                  <ChevronDown className={`w-3 h-3 ${activeMenu === 'versions' ? 'rotate-180' : 'text-slate-400'}`} />
                </button>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/about"
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all hidden sm:block cursor-pointer"
            >
              Download Brochure
            </Link>
            {activeBrand === 'talent' ? (
              <Link
                to="/employers"
                className="px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              >
                <span>Retain Talent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/industries"
                className="px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
              >
                <span>Setup GCC Campus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dropdowns on Hover */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full pt-1 z-50"
              onMouseEnter={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="h-2 w-full bg-transparent" />
              
              <div className="mx-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10">
                
                {/* Talent - Retained Search */}
                {activeMenu === 'retained' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/solutions" className="block p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>CXO & Country Leadership</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Managing Directors, Country HR heads, and Site Leaders for Tier-1 Captives.</p>
                    </Link>
                    <Link to="/jobs" className="block p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <span>VP Engineering & Architects</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Distinguished engineers and technical fellows across AI and core platforms.</p>
                    </Link>
                    <Link to="/solutions" className="block p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono font-bold text-blue-700 uppercase">90-Day Placement SLA</div>
                        <p className="text-[11px] text-slate-600 mt-1">Full replacement guarantee backed by psychometric and institutional vetting.</p>
                      </div>
                      <span className="text-xs font-bold text-blue-700 flex items-center gap-1 mt-2">
                        <span>View Engagement Terms</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                )}

                {/* Talent - Technical Vetting */}
                {activeMenu === 'vetting' && (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/solutions" className="block p-3 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5 mb-1">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>5-Stage Rigorous Funnel</span>
                      </div>
                      <p className="text-[11px] text-slate-500">LeetCode hard algorithmic screens & real production system architecture reviews.</p>
                    </Link>
                    <Link to="/employers" className="block p-3 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>IP & Background Clearance</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Criminal history, degree authenticity, and former employer exit checks.</p>
                    </Link>
                    <Link to="/candidates" className="block p-3 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span>Live Sandbox Evaluation</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Candidates build a real distributed queue live under senior proctor supervision.</p>
                    </Link>
                  </div>
                  <Link to="/employers" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:gap-2.5 transition-all">
                    <span>Hire vetted talent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  </>
                )}

                {/* Talent - Comp */}
                {activeMenu === 'comp' && (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/employers" className="block p-3.5 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-blue-600" />
                        <span>Global PPP Compensation Matrix</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Precise salary benchmarks across Bangalore, Hyderabad, London, and New York.</p>
                    </Link>
                    <Link to="/candidates" className="block p-3.5 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span>Cross-Border ESOP Structuring</span>
                      </div>
                      <p className="text-[11px] text-slate-500">US 409A and Indian FEMA compliant equity frameworks for overseas engineers.</p>
                    </Link>
                  </div>
                  <Link to="/jobs" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:gap-2.5 transition-all">
                    <span>See open roles with disclosed bands</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  </>
                )}

                {/* Scale - Turnkey Hubs */}
                {activeMenu === 'turnkey' && (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/employers" className="block p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-indigo-950 mb-1">50-Seat Pilot Pod</div>
                      <p className="text-[11px] text-slate-600">Rapid 45-day operational deployment with managed IT infrastructure.</p>
                    </Link>
                    <Link to="/industries" className="block p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-indigo-950 mb-1">200-Seat Autonomous GCC</div>
                      <p className="text-[11px] text-slate-600">Dedicated campus with dedicated fiber lines and custom brand fitout.</p>
                    </Link>
                    <Link to="/case-studies" className="block p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-indigo-950 mb-1">500+ Seat Enterprise Scale</div>
                      <p className="text-[11px] text-slate-600">Multi-city redundancy with complete legal entity setup and BOT option.</p>
                    </Link>
                  </div>
                  <Link to="/industries" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:gap-2.5 transition-all">
                    <span>Explore GCC hubs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  </>
                )}

                {/* Scale - Entity & Tax */}
                {activeMenu === 'compliance' && (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/industries" className="block p-3.5 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-indigo-600" />
                        <span>STPI & SEZ Registration</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Duty-free hardware imports and 0% GST on foreign exchange export services.</p>
                    </Link>
                    <Link to="/solutions" className="block p-3.5 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                      <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                        <Server className="w-4 h-4 text-indigo-600" />
                        <span>Transfer Pricing & Audit Defense</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Arm&apos;s-length margin certification and annual compliance filing under Indian law.</p>
                    </Link>
                  </div>
                  <Link to="/about" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:gap-2.5 transition-all">
                    <span>Our compliance posture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  </>
                )}

                {/* Home Versions navigator */}
                {activeMenu === 'versions' && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {HOME_VERSIONS.map((v) => {
                      const current = location.pathname === v.to;
                      return (
                        <Link
                          key={v.to}
                          to={v.to}
                          className={`block p-3.5 rounded-xl border transition-all ${
                            current
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-900 hover:shadow-sm'
                          }`}
                        >
                          <div className={`font-bold text-xs mb-0.5 ${current ? 'text-white' : 'text-slate-900'}`}>
                            {v.label} {current && <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500 text-white">YOU ARE HERE</span>}
                          </div>
                          <p className={`text-[11px] ${current ? 'text-slate-300' : 'text-slate-500'}`}>{v.desc}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Mobile menu — all key pages + home versions */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 px-4 py-3 bg-white max-h-[70vh] overflow-y-auto">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-2">Home Versions</div>
          <div className="space-y-1">
            {MOBILE_LINKS.map((l) => {
              const current = location.pathname === l.to;
              return (
                <Link
                  key={`${l.to}-${l.label}`}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    current ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{l.label}</span>
                  <span className={`text-[11px] font-normal ${current ? 'text-slate-300' : 'text-slate-400'}`}>{l.desc}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex gap-2 pt-3">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
            >
              Sign In
            </Link>
            <Link
              to="/candidate/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-3 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white"
            >
              Join Network
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
