import React, { useState } from 'react';
import { Building2, Sliders, ArrowRight } from 'lucide-react';

export const Hero08CyberPhysicalCampus: React.FC = () => {
  const [wireframeMode, setWireframeMode] = useState(false);

  return (
    <div className="relative min-h-[92vh] bg-slate-950 text-white overflow-hidden flex items-center justify-center border-y border-slate-800">
      
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Headline & CAD Controls */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
            <Building2 className="w-3.5 h-3.5" />
            <span>CYBER-PHYSICAL GCC SPECIFICATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            From CAD Wireframe to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              500-Seat Living Campus
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            NexaScale delivers turnkey physical architecture with pre-installed Tier-IV data centers, dual-redundant grid power, biometric air-gapping, and fully vetted senior staff.
          </p>

          {/* Wireframe toggle switch */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Toggle CAD Wireframe Overlay</span>
              </div>
              <div className="text-[11px] text-slate-400">Inspect real-estate topology and security zones</div>
            </div>
            <button
              type="button"
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                wireframeMode 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {wireframeMode ? 'CAD Mode: ON' : 'CAD Mode: OFF'}
            </button>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-4 pt-2">
            <button 
              type="button"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Download Full Spec Sheet (PDF)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Interactive Photorealistic / Wireframe Campus View */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900 group">
            
            {/* Campus Image */}
            <img 
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80" 
              alt="Physical Tech Campus" 
              className={`w-full h-80 sm:h-96 object-cover transition-all duration-500 ${
                wireframeMode ? 'filter invert contrast-200 hue-rotate-180 opacity-60' : 'opacity-90'
              }`}
            />

            {/* Wireframe overlay HUD pins */}
            {wireframeMode && (
              <div className="absolute inset-0 bg-blue-950/40 pointer-events-none p-6 flex flex-col justify-between font-mono text-[10px] text-blue-300">
                <div className="flex justify-between items-start">
                  <div className="bg-black/80 px-2 py-1 rounded border border-blue-400/50">
                    ZONE A: AIR-GAPPED NOC [SEC-LEVEL 4]
                  </div>
                  <div className="bg-black/80 px-2 py-1 rounded border border-blue-400/50">
                    OPTIC FIBER: 2X 10Gbps TIER-1
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="bg-black/80 px-2 py-1 rounded border border-blue-400/50">
                    HVAC CHILLER: N+1 REDUNDANCY
                  </div>
                  <div className="bg-black/80 px-2 py-1 rounded border border-blue-400/50 text-emerald-400 font-bold">
                    CAD COMPLIANCE: 100% PASS
                  </div>
                </div>
              </div>
            )}

            {/* Physical Campus Badge */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bangalore EcoWorld Campus • Ready for Occupancy</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
