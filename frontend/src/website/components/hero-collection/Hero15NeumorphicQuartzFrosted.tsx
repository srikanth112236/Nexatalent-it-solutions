import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export const Hero15NeumorphicQuartzFrosted: React.FC = () => {
  return (
    <div className="relative min-h-[92vh] bg-gradient-to-b from-slate-50 via-blue-50/30 to-white text-slate-900 overflow-hidden flex items-center justify-center border-y border-slate-200">
      
      {/* Soft Pastel Ambient Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-blue-200/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[250px] bg-purple-200/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-semibold text-blue-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>FROSTED QUARTZ GLASS ARCHITECTURE • LIGHT LUXURY</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Purity in Execution. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Speed in Global Scale.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          NexaTalent IT Solutions transforms cross-border talent acquisition into an elevated, transparent partnership. Full-stack legal entity setup, real estate, and vetted engineering teams.
        </p>

        {/* 3 Floating Frosted Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left max-w-4xl mx-auto">
          
          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">72-Hour Contract Burst</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant deployment of pre-evaluated senior engineers to support rapid product delivery milestones.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% IP Security Vault</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              SOC-2 certified infrastructure, air-gapped workstations, and bilateral non-disclosure agreements.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">BOT Legal Transfer</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete operational handover of your GCC subsidiary with zero transfer penalties or legal frictions.
            </p>
          </motion.div>

        </div>

        {/* Action Button */}
        <div className="pt-6 flex justify-center">
          <button 
            type="button"
            className="px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Initiate Sovereign Advisory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
