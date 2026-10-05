import React, { useState, useRef, useEffect } from 'react';
import { Logo } from '../Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Cpu, 
  ChevronDown, 
  Search, 
  ArrowRight, 
  Globe2, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Menu, 
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Briefcase
} from 'lucide-react';

export const NavbarMegaMenuGlass: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
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
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative z-30">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          01 · Floating Glass Mega-Menu Navbar
        </span>
        <span className="text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded text-[10px] font-bold">
          Hover-Activated Multi-Tier Drawers
        </span>
      </div>

      <header 
        className="relative z-30 max-w-7xl mx-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/50"
        onMouseEnter={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" aria-label="NexaTalent IT Solutions home" className="flex items-center shrink-0">
            <Logo height={38} />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Mega Menu Trigger 1: Solutions */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('solutions')}
            >
              <button 
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'solutions' ? null : 'solutions')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'solutions' ? 'bg-blue-50 text-blue-700 shadow-xs' : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'solutions' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Mega Menu Trigger 2: GCC Hubs */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('hubs')}
            >
              <button 
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'hubs' ? null : 'hubs')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'hubs' ? 'bg-blue-50 text-blue-700 shadow-xs' : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>GCC Centers</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'hubs' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Mega Menu Trigger 3: Executive Search */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('talent')}
            >
              <button 
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'talent' ? null : 'talent')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'talent' ? 'bg-blue-50 text-blue-700 shadow-xs' : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>Executive Search</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'talent' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Mega Menu Trigger 4: Client Metrics */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('metrics')}
            >
              <button 
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'metrics' ? null : 'metrics')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'metrics' ? 'bg-blue-50 text-blue-700 shadow-xs' : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>Client Metrics</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'metrics' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>
            </div>

            <a href="#about" className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 transition-all">
              About Architecture
            </a>
          </nav>

          {/* Quick Search & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search mandates..." 
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white w-40 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>
            <button 
              type="button"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Build A Pod</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mega Menu Dropdown Container */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full pt-1 z-50"
              onMouseEnter={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              {/* Invisible bridge to prevent mouse leave gap */}
              <div className="h-2 w-full bg-transparent" />
              
              <div className="mx-4 sm:mx-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl">
                
                {/* 1. Solutions Mega Menu */}
                {activeMenu === 'solutions' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="text-xs font-mono uppercase text-blue-600 font-bold tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Sovereign GCC Deployment</span>
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-blue-600">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>Turnkey 50–500 Seat GCC Hubs</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Complete legal entity, real-estate, and leadership setup in 75 days.</p>
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-blue-600">
                          <Cpu className="w-4 h-4 text-indigo-600" />
                          <span>AI & LLM Training Squads</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Post-training researchers, synthetic data engineers, and H100 cluster architects.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-xs font-mono uppercase text-indigo-600 font-bold tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Specialized Guilds</span>
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-indigo-50/70 border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span>Low-Latency Quant & Fintech</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Bare-metal C++, FPGA acceleration, and FIX protocol distributed teams.</p>
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-indigo-50/70 border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                          <Layers className="w-4 h-4 text-cyan-600" />
                          <span>Cloud Native & Kubernetes SRE</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Zero-trust architecture, multi-region failover, and 99.999% SLA teams.</p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-100 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold mb-3 shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          <span>Guaranteed SLA</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1.5">90-Day Free Replacement</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Every candidate passes rigorous 5-stage vetting with verified technical repository assessments and criminal IP background checks.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer">
                        <span>Read Verification Playbook</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. GCC Hubs Mega Menu */}
                {activeMenu === 'hubs' && (
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mb-4 flex items-center justify-between">
                      <span>Global Sovereign Technology Centers</span>
                      <span className="text-blue-600">4 Operational Hubs</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { city: 'Bangalore', location: 'Indiranagar & Outer Ring Road', seats: '2,400+ Active Placed', lead: '14 Days', tz: 'UTC+5:30' },
                        { city: 'Hyderabad', location: 'HITEC City & Financial District', seats: '1,800+ Active Placed', lead: '18 Days', tz: 'UTC+5:30' },
                        { city: 'London', location: 'Bank & Canary Wharf', seats: '500+ Active Placed', lead: '21 Days', tz: 'UTC+0:00' },
                        { city: 'San Francisco', location: 'SoMa & Silicon Valley', seats: 'Executive Search Hub', lead: '30 Days', tz: 'UTC-8:00' },
                      ].map((hub, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Globe2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                              <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600">{hub.city}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">{hub.tz}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-3">{hub.location}</p>
                          <div className="space-y-1 text-[11px] font-mono text-slate-600 pt-2 border-t border-slate-200/60">
                            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{hub.seats}</span>
                            </div>
                            <div>Avg Turnaround: <strong className="text-slate-800">{hub.lead}</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Executive Search Mega Menu */}
                {activeMenu === 'talent' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase text-blue-600 font-bold tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>Leadership Mandates</span>
                      </div>
                      <div className="p-3 rounded-xl hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 cursor-pointer transition-all">
                        <div className="font-bold text-sm text-slate-900">CXO & Managing Directors</div>
                        <p className="text-xs text-slate-500 mt-1">Country heads and GCC managing directors with 15+ years experience.</p>
                      </div>
                      <div className="p-3 rounded-xl hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 cursor-pointer transition-all">
                        <div className="font-bold text-sm text-slate-900">Principal Architects & Fellows</div>
                        <p className="text-xs text-slate-500 mt-1">High-throughput system designers and distributed database architects.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase text-indigo-600 font-bold tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Engagement Models</span>
                      </div>
                      <div className="p-3 rounded-xl hover:bg-indigo-50/70 border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all">
                        <div className="font-bold text-sm text-slate-900">Retained Executive Search</div>
                        <p className="text-xs text-slate-500 mt-1">Exclusive 60-day mandate with weekly progress reports and psychometric indexing.</p>
                      </div>
                      <div className="p-3 rounded-xl hover:bg-indigo-50/70 border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all">
                        <div className="font-bold text-sm text-slate-900">72-Hour Contract Scale</div>
                        <p className="text-xs text-slate-500 mt-1">Instant surge capacity with immediate access to 200+ pre-vetted seniors.</p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold mb-3">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Zero Risk Model</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1.5">Confidential NDA Process</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          All client mandates are executed under bilateral non-disclosure agreements with strict anonymized candidate outreach.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-blue-700">
                        <span>Request Confidential Brief</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Client Metrics Mega Menu */}
                {activeMenu === 'metrics' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Economic Arbitrage</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900 mb-1">68.4%</div>
                      <p className="text-xs text-slate-600">Average net cost reduction achieved across Tier-1 US Tech enterprises expanding to GCC.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                        <Award className="w-4 h-4" />
                        <span>First-Year Retention</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900 mb-1">94.8%</div>
                      <p className="text-xs text-slate-600">Industry leading retention backed by equity alignment and transparent compensation.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                      <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Average Lead Time</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900 mb-1">16 Days</div>
                      <p className="text-xs text-slate-600">From initial technical requisition intake to final verified offer signed.</p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Accordion */}
        {mobileOpen && (
          <div className="lg:hidden p-4 border-t border-slate-200 space-y-2 bg-white">
            <div>
              <button 
                type="button" 
                onClick={() => setMobileSubmenu(mobileSubmenu === 'solutions' ? null : 'solutions')}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
              >
                <span>Solutions</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'solutions' && (
                <div className="pl-4 pr-2 py-2 space-y-2 text-xs text-slate-600 bg-slate-50 rounded-lg mb-2">
                  <div className="font-semibold text-blue-600">Turnkey GCC Hubs (50–500 seats)</div>
                  <div className="font-semibold text-indigo-600">AI & LLM Training Squads</div>
                  <div className="font-semibold text-amber-600">Low-Latency Quant Guild</div>
                </div>
              )}
            </div>

            <div>
              <button 
                type="button" 
                onClick={() => setMobileSubmenu(mobileSubmenu === 'hubs' ? null : 'hubs')}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
              >
                <span>GCC Centers</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'hubs' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'hubs' && (
                <div className="pl-4 pr-2 py-2 space-y-1.5 text-xs text-slate-600 bg-slate-50 rounded-lg mb-2">
                  <div>Bangalore (2,400+ Placed)</div>
                  <div>Hyderabad (1,800+ Placed)</div>
                  <div>London (500+ Placed)</div>
                  <div>San Francisco (Executive Search)</div>
                </div>
              )}
            </div>

            <a href="#about" className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50">About Architecture</a>
            <a href="#candidates" className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50">Executive Search</a>
            <a href="#case-studies" className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50">Client Metrics</a>
            
            <button type="button" className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm mt-3">
              Build A Pod
            </button>
          </div>
        )}
      </header>
    </div>
  );
};
