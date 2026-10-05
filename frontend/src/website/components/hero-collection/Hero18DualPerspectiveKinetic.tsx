import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, ArrowRight, Award } from 'lucide-react';

export const Hero18DualPerspectiveKinetic: React.FC = () => {
  const [mode, setMode] = useState<'employer' | 'candidate'>('employer');

  return (
    <div className={`relative min-h-[92vh] transition-colors duration-500 overflow-hidden flex items-center justify-center border-y ${
      mode === 'employer' ? 'bg-slate-950 text-white border-slate-800' : 'bg-blue-950 text-white border-blue-800'
    }`}>
      
      {/* Mode Switcher Pill at Top */}
      <div className="absolute top-8 z-30 flex items-center justify-center w-full">
        <div className="p-1 rounded-full bg-slate-900 border border-slate-700 shadow-xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('employer')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mode === 'employer' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>I Am An Employer</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('candidate')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mode === 'candidate' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>I Am Senior Talent</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center space-y-8 my-auto">
        
        {mode === 'employer' ? (
          <motion.div 
            key="employer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
              <Building className="w-3.5 h-3.5" />
              <span>ENTERPRISE GCC SOVEREIGNTY MODE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
              Scale 50–500 Engineers with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                100% Legal & CapEx Autonomy
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              We manage turnkey physical campuses, entity tax optimization, and recruit verified algorithmic talent with guaranteed 90-day replacement SLAs.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button 
                type="button"
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Commission Turnkey Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="candidate"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>ELITE CANDIDATE FELLOWSHIP MODE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
              Direct Access to Tier-1 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300">
                Global Captive Mandates
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-cyan-100 font-light leading-relaxed">
              Skip third-party agencies. Access direct US Dollar and British Pound pegged compensation packages with cross-border equity participation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button 
                type="button"
                className="px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-400/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Join Confidential Talent Bench</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
