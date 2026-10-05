import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LightFinalCTAExpansion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Scale expansion on scroll
  const scale = useTransform(scrollYProgress, [0, 0.9], [0.95, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.9], ['32px', '0px']);

  return (
    <section
      ref={containerRef}
      className="theme-light relative overflow-hidden bg-[#FAF8F5] text-slate-900 pt-16"
    >
      <div className="max-w-6xl mx-auto text-center mb-8 px-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles size={14} className="text-[#0265FF]" />
          <span>START VENDOR EMPANELMENT</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ready to Upgrade Your Technology Hiring Capacity?
        </h2>
      </div>

      {/* Expanding CTA Surface */}
      <motion.div
        style={{
          scale,
          borderRadius,
        }}
        className="bg-[#0265FF] text-white py-20 px-6 text-center shadow-2xl relative"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Zap size={14} className="text-white" />
            <span>48-HOUR SHORTLIST SLA</span>
          </div>

          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Receive 3 to 5 Calibrated Profiles in Under 48 Hours
          </h3>

          <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Empanel Nexa Talent IT Solutions Private Limited to deploy permanent hires, flexible contract staffing pods, or turnkey GCC engineering teams.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/employers"
              className="px-8 py-4 rounded-full bg-white text-[#0265FF] hover:bg-slate-100 font-extrabold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <span>Submit Requisition Now</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-full bg-white/15 border border-white/30 hover:bg-white/25 text-white font-extrabold text-sm transition-all"
            >
              Request Empanelment Pack
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-white/95 pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-white" />
              <span>90-Day Unconditional Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-white" />
              <span>Zero Candidate Fee Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-white" />
              <span>ISO 27001 & DPDP Governed</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
