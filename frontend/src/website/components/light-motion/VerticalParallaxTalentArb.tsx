import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface GeoHub {
  city: string;
  country: string;
  leadComp: string;
  staffComp: string;
  speed: number;
  highlight?: boolean;
}

const HUBS: GeoHub[] = [
  { city: 'San Francisco', country: 'Bay Area, USA', leadComp: '$420,000', staffComp: '$280,000', speed: 0.7 },
  { city: 'New York', country: 'Wall Street, USA', leadComp: '$390,000', staffComp: '$260,000', speed: 1.0 },
  { city: 'London', country: 'City & Tech City, UK', leadComp: '£220,000', staffComp: '£160,000', speed: 1.3 },
  { city: 'Bangalore', country: 'Karnataka, India', leadComp: '₹1.25 Cr (~$150k)', staffComp: '₹75 Lakhs (~$90k)', speed: 1.6, highlight: true },
];

export const VerticalParallaxTalentArb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.parallax-geo-card');

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const hub = HUBS[i];
        gsap.to(card, {
          y: -70 * hub.speed,
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
      className="py-28 bg-white border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Vertical Parallax • Global Capital & Arbitrage Differentials</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Cross-Border Capital Arbitrage in Motion
          </h2>
          <p className="text-lg text-slate-600">
            Watch the compensation and talent density differentials shift vertically across primary tech hubs on scroll.
          </p>
        </div>

        {/* 4 Differential Parallax Geo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {HUBS.map((hub, idx) => (
            <div
              key={idx}
              className={`parallax-geo-card rounded-3xl p-7 border transition-all duration-300 ${
                hub.highlight
                  ? 'bg-blue-600 text-white border-blue-500 shadow-2xl shadow-blue-500/25 ring-4 ring-blue-100'
                  : 'bg-slate-50 text-slate-900 border-slate-200 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${hub.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                  SPEED {hub.speed}x
                </span>
                {hub.highlight && (
                  <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-900 text-[10px] font-black uppercase">
                    75% Savings
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-1">
                {hub.city}
              </h3>
              <p className={`text-xs mb-6 ${hub.highlight ? 'text-blue-100' : 'text-slate-500'}`}>
                {hub.country}
              </p>

              <div className="space-y-3">
                <div className={`p-3 rounded-2xl ${hub.highlight ? 'bg-blue-700/60' : 'bg-white border border-slate-200/80'}`}>
                  <span className={`text-[10px] font-bold uppercase block ${hub.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                    VP / Head of Engineering
                  </span>
                  <span className="text-base font-black font-mono block mt-0.5">
                    {hub.leadComp}
                  </span>
                </div>

                <div className={`p-3 rounded-2xl ${hub.highlight ? 'bg-blue-700/60' : 'bg-white border border-slate-200/80'}`}>
                  <span className={`text-[10px] font-bold uppercase block ${hub.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                    Staff Distributed Systems
                  </span>
                  <span className="text-base font-black font-mono block mt-0.5">
                    {hub.staffComp}
                  </span>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t text-xs flex items-center justify-between ${hub.highlight ? 'border-blue-500/80 text-blue-200' : 'border-slate-200 text-slate-400'}`}>
                <span>Top 0.5% Density</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
