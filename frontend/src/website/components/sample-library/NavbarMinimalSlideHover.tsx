import React, { useState, useRef, useEffect } from 'react';
import { Logo } from '../Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Globe2, 
  Building2, 
  Users, 
  DollarSign, 
  FileText, 
  Award, 
  ChevronDown 
} from 'lucide-react';


export const NavbarMinimalSlideHover: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const links = [
    { 
      label: 'Capabilities', 
      href: '#capabilities',
      dropdown: [
        { title: 'Turnkey GCC Hubs', desc: '50–500 seat autonomous engineering campuses', badge: '75 Days', icon: Building2 },
        { title: 'AI & LLM Guilds', desc: 'Post-training researchers & distributed GPU architects', badge: 'Top 1%', icon: Cpu },
        { title: 'Fintech & Low Latency', desc: 'Bare-metal C++, FPGA, FIX protocol pipelines', badge: 'Quant', icon: Zap },
      ]
    },
    { 
      label: 'GCC Playbook', 
      href: '#playbook',
      dropdown: [
        { title: 'Build-Operate-Transfer (BOT)', desc: '100% legal entity transition roadmap', icon: Globe2 },
        { title: 'PPP Arbitrage Framework', desc: '60–70% cost delta with zero quality loss', icon: DollarSign },
        { title: 'Zero-Trust IP & SOC-2', desc: 'Enterprise data compliance and vault topology', icon: ShieldCheck },
      ]
    },
    { 
      label: 'Talent Cloud', 
      href: '#talent',
      dropdown: [
        { title: 'Pre-Vetted Senior Bench', desc: '200+ staff engineers ready for 72hr burst', badge: 'Ready', icon: Users },
        { title: 'Executive Retained Mandates', desc: 'Bespoke CXO & VP search with 90-day SLA', icon: Award },
        { title: 'Technical Evaluation Sandbox', desc: 'Live code review and architecture vetting', icon: FileText },
      ]
    },
    { 
      label: 'Economic Model', 
      href: '#economics',
      dropdown: [
        { title: 'Open-Book Cost Plus', desc: 'Complete breakdown of salary, perks & margins', icon: DollarSign },
        { title: 'GCC ROI Calculator', desc: 'Interactive financial simulator for CFOs', icon: Zap },
      ]
    },
    { 
      label: 'Company', 
      href: '#company',
      dropdown: [
        { title: 'About NexaTalent IT Solutions', desc: 'Our ethos, founders, and sovereign GCC vision', icon: Building2 },
        { title: 'Verified Case Studies', desc: '14 enterprise case studies with verified metrics', icon: FileText },
      ]
    },
  ];

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredIndex(index);
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative z-25">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          02 · Minimal Underline Slide Hover Navbar
        </span>
        <span className="text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded text-[10px] font-bold">
          Magnetic Indicator Tracker & Card Dropdowns
        </span>
      </div>

      <header 
        className="max-w-6xl mx-auto px-6 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-md shadow-slate-100 flex items-center justify-between relative"
        onMouseEnter={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Brand */}
        <a href="/" aria-label="NexaTalent IT Solutions home" className="flex items-center shrink-0">
          <Logo height={30} />
        </a>

        {/* Links with sliding underline highlight & hover dropdowns */}
        <nav className="hidden md:flex items-center relative gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200/70">
          {links.map((link, i) => (
            <div 
              key={link.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(i)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                className="relative px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors z-10 flex items-center gap-1 cursor-pointer"
              >
                {hoveredIndex === i && (
                  <motion.div
                    layoutId="minimalNavHighlight"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200 -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span>{link.label}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === i ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {/* Anchored floating dropdown card */}
              <AnimatePresence>
                {activeDropdown === i && link.dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-72 sm:w-80"
                  >
                    {/* Hover Bridge */}
                    <div className="h-2 w-full bg-transparent" />
                    
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                      <div className="text-[10px] font-mono uppercase font-bold text-indigo-600 px-2 py-1 mb-1 tracking-wider border-b border-slate-100 flex items-center justify-between">
                        <span>{link.label} Overview</span>
                        <span>{link.dropdown.length} Mandates</span>
                      </div>
                      <div className="space-y-1">
                        {link.dropdown.map((sub, j) => {
                          const IconComp = sub.icon;
                          return (
                            <a
                              key={j}
                              href={link.href}
                              className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
                            >
                              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 group-hover:bg-white group-hover:border-indigo-200 text-indigo-600 shrink-0 transition-colors">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                                    {sub.title}
                                  </span>
                                  {sub.badge && (
                                    <span className="text-[9px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded shrink-0">
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                                  {sub.desc}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC-2 Verified</span>
          </div>
          <button 
            type="button"
            className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span>Consult Partner</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </header>
    </div>
  );
};
