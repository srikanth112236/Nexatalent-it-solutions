import React, { useState, useRef, useEffect } from 'react';
import { Logo } from '../Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, 
  Sparkles, 
  UserCheck, 
  ShieldAlert, 
  Building2, 
  DollarSign, 
  ChevronDown, 
  ArrowRight,
  X,
  Search
} from 'lucide-react';

export const NavbarExecutiveCommandPill: React.FC = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative z-20">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          03 · Executive Command Pill Navbar
        </span>
        <span className="text-amber-800 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded text-[10px] font-bold">
          Obsidian Glass & Executive Hover Drawers
        </span>
      </div>

      <div className="flex justify-center relative">
        <header 
          className="inline-flex items-center gap-2 p-1.5 rounded-full bg-slate-950 text-white shadow-xl shadow-slate-900/25 border border-slate-800 backdrop-blur-xl max-w-full relative z-30"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Brand Icon */}
          <a href="/" aria-label="NexaTalent IT Solutions home" className="flex items-center pl-1 pr-2 shrink-0">
            <Logo height={22} onDark />
          </a>

          <div className="h-4 w-px bg-slate-800" />

          {/* Quick Links with Hover Dropdowns */}
          <div className="flex items-center gap-1 text-xs">
            
            {/* 1. Sovereign GCC */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('gcc')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'gcc' ? null : 'gcc')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeMenu === 'gcc' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>Sovereign GCC</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'gcc' ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
              </button>

              {/* Flyout 1 */}
              <AnimatePresence>
                {activeMenu === 'gcc' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 pt-2 z-50 w-72"
                  >
                    <div className="h-2 w-full bg-transparent" />
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 text-left">
                      <div className="text-[10px] font-mono text-amber-400 font-bold px-2 py-1 uppercase tracking-wider border-b border-slate-800 mb-2">
                        Turnkey GCC Infrastructure
                      </div>
                      <div className="space-y-1">
                        <a href="#gcc-tier1" className="block p-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>Tier-1 Tech Hubs</span>
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1 rounded">Bangalore</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Indiranagar & Outer Ring Road autonomous campuses.</p>
                        </a>
                        <a href="#gcc-bot" className="block p-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>BOT Legal Entity Model</span>
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-1 rounded">100% Transfer</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Smooth institutional legal transfer in 12–24 months.</p>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Leadership */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('leadership')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'leadership' ? null : 'leadership')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeMenu === 'leadership' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>Leadership</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'leadership' ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
              </button>

              {/* Flyout 2 */}
              <AnimatePresence>
                {activeMenu === 'leadership' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-72"
                  >
                    <div className="h-2 w-full bg-transparent" />
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 text-left">
                      <div className="text-[10px] font-mono text-amber-400 font-bold px-2 py-1 uppercase tracking-wider border-b border-slate-800 mb-2">
                        Executive Talent Practice
                      </div>
                      <div className="space-y-1">
                        <a href="#cxo" className="block p-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>CXO Retained Search</span>
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1 rounded">Exclusive</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Managing Directors & Country VPs for Global Captives.</p>
                        </a>
                        <a href="#board" className="block p-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>Board Advisory</span>
                            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-1 rounded">Independent</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Local governance, audit and regulatory compliance experts.</p>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Arbitrage */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('arbitrage')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'arbitrage' ? null : 'arbitrage')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeMenu === 'arbitrage' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>Arbitrage</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'arbitrage' ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
              </button>

              {/* Flyout 3 */}
              <AnimatePresence>
                {activeMenu === 'arbitrage' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 pt-2 z-50 w-80"
                  >
                    <div className="h-2 w-full bg-transparent" />
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 text-left">
                      <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-2">
                        Real-Time PPP Comp Index (2026)
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2 mb-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">SF / Bay Area Principal:</span>
                          <span className="font-mono font-bold text-white">$260,000</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Bangalore GCC Principal:</span>
                          <span className="font-mono font-bold text-amber-400">$64,000</span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                          <span>Net Arbitrage Savings:</span>
                          <span>75.4%</span>
                        </div>
                      </div>
                      <a href="#calculator" className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between pt-1">
                        <span>Launch Full Financial Simulator</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* ⌘K Trigger */}
          <button
            type="button"
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Command className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Command</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">⌘K</kbd>
          </button>

          {/* Direct Concierge Trigger */}
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retain Us</span>
          </button>
        </header>
      </div>

      {/* Simulated Interactive Command Palette Drawer */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="mt-4 max-w-lg mx-auto p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl relative z-40"
          >
            <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2 text-amber-400 font-bold">
                <Command className="w-3.5 h-3.5" />
                EXECUTIVE DISPATCH TERMINAL
              </span>
              <button 
                type="button"
                onClick={() => setPaletteOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Type mandate, hub, or engineer requisition..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              {[
                { icon: UserCheck, title: 'Deploy Bangalore SRE Squad', meta: 'Turnkey • 14 days', badge: 'Active' },
                { icon: ShieldAlert, title: 'Request Confidential C-Suite Mandate', meta: 'NDA Protected', badge: 'Priority' },
                { icon: DollarSign, title: 'Generate 2026 GCC Cost Arbitrage Model', meta: 'Instant Excel/PDF', badge: 'Live' },
                { icon: Building2, title: 'Schedule Private GCC Walkthrough', meta: 'Virtual / In-Person', badge: 'Booking' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => alert(`Executed: ${item.title}`)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{item.meta}</span>
                    <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">{item.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
