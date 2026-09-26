import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Shield, Globe, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FlightTier {
  layer: string;
  altitude: string;
  role: string;
  mandate: string;
  comp: string;
}

const TIERS: FlightTier[] = [
  { layer: 'Tier 04 · Exosphere', altitude: '40,000+ FT', role: 'Founding GCC Site Managing Director', mandate: 'Complete 0-to-1200 engineer operational autonomy and local entity P&L ownership.', comp: '₹2.2 Cr ($265K) + Escrow' },
  { layer: 'Tier 03 · Mesosphere', altitude: '28,000 FT', role: 'VP of Platform Infrastructure', mandate: 'Cross-continental multi-cloud governance and 99.999% global service uptime.', comp: '₹1.65 Cr ($200K) + Equity' },
  { layer: 'Tier 02 · Stratosphere', altitude: '16,000 FT', role: 'Principal Architect (Distributed AI)', mandate: 'Orchestrating large model training clusters and custom GPU inference pipelines.', comp: '₹1.25 Cr ($150K) Base' },
  { layer: 'Tier 01 · Troposphere', altitude: '8,000 FT', role: 'Staff SRE & Security Lead', mandate: 'Automating zero-trust compliance, IAM hardware isolation, and incident response.', comp: '₹85 Lakhs ($105K) Base' },
];

export const FullScreenVerticalParallaxStratosphereLaunch: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((el, idx) => {
        if (!el) return;
        gsap.to(el, {
          y: -80 * (4 - idx),
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[140vh] bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Header */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
          <Rocket className="w-3.5 h-3.5 text-blue-600" />
          <span>STRATOSPHERIC ASCENT · MULTI-TIER ALTITUDE MAPPING</span>
        </div>
        <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
          Leadership Altitude Corridor
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Four distinct altitude tiers tracking senior technical governance from specialized Staff ICs to enterprise Site Managing Directors.
        </p>
      </div>

      {/* Stratified Altitude Cards */}
      <div className="relative z-20 w-full px-8 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {TIERS.map((tier, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-blue-600 uppercase">
                  {tier.layer}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                  {tier.altitude}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">{tier.role}</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">{tier.mandate}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">Comp Index</span>
              <span className="text-emerald-600 font-bold">{tier.comp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Altitude Indicator Footer */}
      <div className="relative z-20 text-center py-6 text-xs font-mono text-slate-400 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-600" /> Full Security Quarantine</span>
        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-600" /> Global VPC Clearance</span>
        <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-indigo-600" /> 100% Escrow Warranty</span>
      </div>
    </section>
  );
};
