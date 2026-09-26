import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building, ShieldCheck, Cpu, Users, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CampusTier {
  id: string;
  level: string;
  name: string;
  sub: string;
  speed: number;
  metric: string;
  accent: string;
  icon: React.ElementType;
}

const TIERS: CampusTier[] = [
  { id: 't1', level: 'LAYER 01', name: 'SEZ Campus Facility & Legal Siting', sub: 'Indiranagar / Outer Ring Road, Bangalore', speed: 0.5, metric: 'Grade-A Real Estate', accent: '#2563eb', icon: Building },
  { id: 't2', level: 'LAYER 02', name: 'Encrypted Fiber & HSM Hardware Rig', sub: 'Multi-gigabit redundant networking & SOC2 compliance', speed: 0.85, metric: 'AES-256 Airgapped', accent: '#7c3aed', icon: Cpu },
  { id: 't3', level: 'LAYER 03', name: 'Founding Leadership Cadre', sub: 'Site Managing Director + 4 Principal Architects', speed: 1.2, metric: '100% Retained', accent: '#0891b2', icon: Users },
  { id: 't4', level: 'LAYER 04', name: '120-Engineer Autonomous Center', sub: 'Day-75 full sprint velocity parity with headquarters', speed: 1.55, metric: '$9.4M Arbitrage', accent: '#10b981', icon: ShieldCheck },
];

export const ParallaxIsometricCityRamp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.campus-tier-card');

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const tier = TIERS[i];
        gsap.to(card, {
          y: -90 * tier.speed,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            <span>Vertical Parallax • Isometric Capability Campus Stack</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Isometric Capability Campus Ramp
          </h2>
          <p className="text-lg text-slate-600">
            Four physical and operational strata of a Global Capability Center rising at differential vertical parallax velocities.
          </p>
        </div>

        {/* 4 Stratified Parallax Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {TIERS.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className="campus-tier-card rounded-3xl p-7 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase text-white tracking-wider"
                    style={{ backgroundColor: t.accent }}
                  >
                    {t.level}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    PARALLAX {t.speed}x
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-800 mb-4">
                  <Icon className="w-6 h-6" style={{ color: t.accent }} />
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-snug mb-1">
                  {t.name}
                </h3>

                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  {t.sub}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-600">{t.metric}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
