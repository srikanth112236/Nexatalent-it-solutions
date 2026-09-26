import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export const NavbarMegaMenuGlass: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>01 · Floating Glass Mega-Menu Navbar</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Hover-Activated Mega Drawers</span>
      </div>

      <header 
        className="relative z-30 max-w-7xl mx-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-200/50"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20">
              N
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                Nexa<span className="text-blue-600">Talent</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider">GCC ARCHITECTURE</div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Mega Menu Trigger 1: Solutions */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('solutions')}
            >
              <button 
                type="button"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeMenu === 'solutions' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Mega Menu Trigger 2: GCC Hubs */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('hubs')}
            >
              <button 
                type="button"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeMenu === 'hubs' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <span>GCC Centers</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'hubs' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <a href="#about" className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-all">
              About Architecture
            </a>
            <a href="#candidates" className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-all">
              Executive Search
            </a>
            <a href="#case-studies" className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-all">
              Client Metrics
            </a>
          </nav>

          {/* Quick Search & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search mandates..." 
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-100/70 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white w-36 transition-all"
              />
            </div>
            <button 
              type="button"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Build A Pod</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mega Menu Dropdown Container */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full pt-2"
              onMouseEnter={() => {}}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="mx-6 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
                {activeMenu === 'solutions' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="text-xs font-mono uppercase text-blue-600 font-bold tracking-wider">
                        Sovereign GCC Deployment
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-blue-600">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>Turnkey 50–500 Seat GCC Hubs</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Complete legal entity, real-estate, and leadership setup in 75 days.</p>
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-blue-600">
                          <Cpu className="w-4 h-4 text-indigo-600" />
                          <span>AI & LLM Training Squads</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Post-training researchers, synthetic data engineers, and H100 cluster architects.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-xs font-mono uppercase text-indigo-600 font-bold tracking-wider">
                        Specialized Guilds
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span>Low-Latency Quant & Fintech</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Bare-metal C++, FPGA acceleration, and FIX protocol distributed teams.</p>
                      </div>
                      <div className="group p-3 rounded-xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                          <Layers className="w-4 h-4 text-cyan-600" />
                          <span>Cloud Native & Kubernetes SRE</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Zero-trust architecture, multi-region failover, and 99.999% SLA teams.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-100/80 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold mb-3">
                          <Sparkles className="w-3 h-3" />
                          <span>Guaranteed SLA</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">90-Day Free Replacement</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Every candidate passes rigorous 5-stage vetting with verified technical repository assessments.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs font-semibold text-blue-700">
                        <span>Read Verification Playbook</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                )}

                {activeMenu === 'hubs' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { city: 'Bangalore', location: 'Indiranagar & Outer Ring Road', seats: '2,400+ Active Placed', lead: '14 Days' },
                      { city: 'Hyderabad', location: 'HITEC City & Financial District', seats: '1,800+ Active Placed', lead: '18 Days' },
                      { city: 'London', location: 'Bank & Canary Wharf', seats: '500+ Active Placed', lead: '21 Days' },
                      { city: 'San Francisco', location: 'SoMa & Silicon Valley', seats: 'Executive Search Hub', lead: '30 Days' },
                    ].map((hub, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 hover:border-blue-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe2 className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-slate-900 text-sm">{hub.city}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{hub.location}</p>
                        <div className="space-y-1 text-[11px] font-mono text-slate-600">
                          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{hub.seats}</span>
                          </div>
                          <div>Avg Turnaround: {hub.lead}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Accordion */}
        {mobileOpen && (
          <div className="lg:hidden p-4 border-t border-slate-200 space-y-3">
            <a href="#solutions" className="block px-3 py-2 text-sm font-semibold text-slate-800">Solutions</a>
            <a href="#hubs" className="block px-3 py-2 text-sm font-semibold text-slate-800">GCC Hubs</a>
            <a href="#about" className="block px-3 py-2 text-sm font-semibold text-slate-800">About</a>
            <a href="#jobs" className="block px-3 py-2 text-sm font-semibold text-slate-800">Jobs</a>
            <button type="button" className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold">
              Build A Pod
            </button>
          </div>
        )}
      </header>
    </div>
  );
};
