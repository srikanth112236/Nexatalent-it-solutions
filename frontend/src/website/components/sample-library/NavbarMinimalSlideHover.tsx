import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export const NavbarMinimalSlideHover: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const links = [
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'GCC Playbook', href: '#playbook' },
    { label: 'Talent Cloud', href: '#talent' },
    { label: 'Economic Model', href: '#economics' },
    { label: 'Company', href: '#company' },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>02 · Minimal Underline Slide Hover Navbar</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">Magnetic Indicator Tracker</span>
      </div>

      <header className="max-w-6xl mx-auto px-6 py-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="font-bold text-slate-900 text-sm tracking-tight">NEXASCALE</span>
          <span className="text-[10px] text-slate-400 font-mono">/ TALENT</span>
        </div>

        {/* Links with sliding underline highlight */}
        <nav 
          className="hidden md:flex items-center relative gap-1 p-1 bg-slate-50/80 rounded-xl border border-slate-100"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(i)}
              className="relative px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors z-10"
            >
              {hoveredIndex === i && (
                <motion.div
                  layoutId="minimalNavHighlight"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/60 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC-2 Verified</span>
          </div>
          <button 
            type="button"
            className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Consult Partner</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </header>
    </div>
  );
};
