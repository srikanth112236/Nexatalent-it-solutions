import React, { useState } from 'react';
import { Building, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export const NavbarSplitBrandCorporate: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<'talent' | 'scale'>('talent');

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>04 · Split-Brand Corporate Multi-Entity Navbar</span>
        <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded text-[10px]">Dual Entity Switcher</span>
      </div>

      <header className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Top utility tier */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Institutional GCC & Executive Talent Advisory
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">Bangalore • Hyderabad • London • San Francisco</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#portal" className="hover:text-blue-600 transition-colors">Client Login</a>
            <span className="text-slate-300">•</span>
            <a href="#careers" className="hover:text-blue-600 transition-colors">Candidate Hub</a>
          </div>
        </div>

        {/* Main Navigation Tier with Entity Switcher */}
        <div className="px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Split Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveBrand('talent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeBrand === 'talent' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>NexaTalent</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveBrand('scale')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeBrand === 'scale' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>NexaScale GCC</span>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
              {activeBrand === 'talent' ? (
                <>
                  <a href="#retained" className="hover:text-blue-600 transition-colors">Retained Search</a>
                  <a href="#vetting" className="hover:text-blue-600 transition-colors">Technical Vetting</a>
                  <a href="#compensation" className="hover:text-blue-600 transition-colors">Equity & Comp</a>
                  <a href="#leadership" className="hover:text-blue-600 transition-colors">Board Practice</a>
                </>
              ) : (
                <>
                  <a href="#turnkey" className="hover:text-indigo-600 transition-colors">Turnkey Hubs</a>
                  <a href="#compliance" className="hover:text-indigo-600 transition-colors">Entity & Tax</a>
                  <a href="#infrastructure" className="hover:text-indigo-600 transition-colors">Facility Architecture</a>
                  <a href="#rebadging" className="hover:text-indigo-600 transition-colors">Rebadging</a>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all hidden sm:block"
            >
              Download Brochure
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Schedule Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
