import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Hero02ArchitecturalParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Vertical differential parallax speeds
  const yLayerBack = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yLayerMid = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yLayerFront = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotateSubtle = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[90vh] bg-slate-50 text-slate-900 overflow-hidden flex items-center justify-center border-y border-slate-200"
    >
      {/* Blueprint Grid Lines */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating Differential Parallax Cards (Left & Right) */}
      <motion.div 
        style={{ y: yLayerBack }}
        className="absolute top-16 left-6 lg:left-16 z-0 hidden md:block max-w-xs"
      >
        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-300 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-blue-600 font-bold">
            <span>ELEVATION: LEVEL 04</span>
            <span>BLR-CAMPUS</span>
          </div>
          <div className="h-20 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center justify-center text-xs font-mono text-blue-700">
            [AIR-GAPPED SRE ZONE • 120 SEATS]
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Biometric Retina Access Verified</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        style={{ y: yLayerFront, rotate: rotateSubtle }}
        className="absolute bottom-16 right-6 lg:right-16 z-20 hidden md:block max-w-xs"
      >
        <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-2xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900">2026 Facility Handover</span>
          </div>
          <p className="text-xs text-slate-500">
            Zero capital expenditure. Turnkey Class-A campus deployed within 75 calendar days.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-700">
            <span>SQFT: 34,000</span>
            <span className="text-blue-600 font-bold">99.99% Power SLA</span>
          </div>
        </div>
      </motion.div>

      {/* Main Hero Center Content */}
      <motion.div 
        style={{ y: yLayerMid }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-300 shadow-xs text-xs font-mono text-slate-700">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>ARCHITECTURAL GCC BLUEPRINT • MULTI-PLANE VERTICAL PARALLAX</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Physical Architecture Meets <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Autonomous Global Captives
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          From STPI regulatory clearances and dedicated 10Gbps air-gapped fiber lines to senior engineering pod staffing. We engineer the physical and digital footprint of your Global Capability Center.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-700 pt-2">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Bangalore & Hyderabad Campuses</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Zero Real Estate CapEx</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Full Entity Transition SLA</span>
          </span>
        </div>

        {/* CTA */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <button 
            type="button"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Explore Campus Blueprints</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
