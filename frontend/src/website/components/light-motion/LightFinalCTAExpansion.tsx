import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface FinalCTAProps {
  pill?: string;
  title?: string;
  headline?: string;
  sub?: string;
}

export const LightFinalCTAExpansion: React.FC<FinalCTAProps> = ({
  pill = 'START VENDOR EMPANELMENT',
  title = 'Ready to Upgrade Your Technology Hiring Capacity?',
  headline = 'Receive 3 to 5 Calibrated Profiles in Under 48 Hours',
  sub = 'Empanel Nexa Talent IT Solutions Private Limited to deploy permanent hires, flexible contract staffing pods, or turnkey GCC engineering teams.',
}) => {
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
      className="theme-light relative overflow-hidden bg-white text-black pt-16"
    >
      <div className="max-w-6xl mx-auto text-center mb-8 px-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-neutral-200 text-[#000000] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles size={14} className="text-[#000000]" />
          <span>{pill}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight">
          {title}
        </h2>
      </div>

      {/* Expanding CTA Surface — light: white card, black text/buttons */}
      <motion.div
        style={{
          scale,
          borderRadius,
        }}
        className="bg-white text-black py-20 px-6 text-center border-t border-neutral-200 relative"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white border border-black px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Zap size={14} className="text-black" />
            <span>48-HOUR SHORTLIST SLA</span>
          </div>

          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-black">
            {headline}
          </h3>

          <p className="text-base sm:text-xl text-black max-w-2xl mx-auto font-normal leading-relaxed">
            {sub}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/employers"
              className="px-8 py-4 rounded-full bg-black text-white hover:bg-neutral-800 font-extrabold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <span>Submit Requisition Now</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-full bg-white border border-neutral-300 hover:border-black text-black font-extrabold text-sm transition-all"
            >
              Request Empanelment Pack
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-black pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-black" />
              <span>90-Day Unconditional Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-black" />
              <span>Zero Candidate Fee Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-black" />
              <span>ISO 27001 & DPDP Governed</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
