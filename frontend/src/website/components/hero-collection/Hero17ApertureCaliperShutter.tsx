import React, { useState } from 'react';
import { Camera, Eye } from 'lucide-react';

export const Hero17ApertureCaliperShutter: React.FC = () => {
  const [apertureOpen, setApertureOpen] = useState(false);

  return (
    <div 
      className="relative min-h-[92vh] bg-slate-950 text-white overflow-hidden flex items-center justify-center border-y border-slate-800"
      onMouseEnter={() => setApertureOpen(true)}
      onMouseLeave={() => setApertureOpen(false)}
    >
      {/* Background Revealed Tech Floor under Aperture */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80" 
          alt="Engineering Floor"
          className="w-full h-full object-cover opacity-40 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
          <Eye className="w-3.5 h-3.5" />
          <span>MECHANICAL CALIPER APERTURE • OPTICAL REVEAL</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
          Uncompromised Clarity in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
            Global Technical Pedigree
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          Hover over the aperture shutter to open the mechanical caliper blades and inspect verified production engineering campuses.
        </p>

        {/* Central Aperture Shutter Interactive Button */}
        <div className="py-4">
          <button 
            type="button"
            onClick={() => setApertureOpen(!apertureOpen)}
            className="p-5 rounded-full bg-slate-900/90 border-2 border-blue-500 text-white hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/30 cursor-pointer inline-flex items-center gap-3 font-mono text-xs font-bold"
          >
            <Camera className="w-5 h-5 text-blue-400" />
            <span>{apertureOpen ? 'APERTURE F/1.4 [FULL EXPOSURE]' : 'EXPAND APERTURE SHUTTER'}</span>
          </button>
        </div>

        {/* 3 Proof Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <div className="text-slate-500 text-[10px]">TOLERANCE</div>
            <div className="text-white font-bold text-lg mt-0.5">0.01mm Fit</div>
            <div className="text-blue-400 text-[11px] mt-1">Direct cultural alignment</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <div className="text-slate-500 text-[10px]">VERIFICATION</div>
            <div className="text-white font-bold text-lg mt-0.5">5-Stage Screen</div>
            <div className="text-emerald-400 text-[11px] mt-1">Live architecture sandboxes</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <div className="text-slate-500 text-[10px]">REPLACEMENT</div>
            <div className="text-white font-bold text-lg mt-0.5">90-Day SLA</div>
            <div className="text-cyan-400 text-[11px] mt-1">Zero contingent downside</div>
          </div>
        </div>

      </div>
    </div>
  );
};
