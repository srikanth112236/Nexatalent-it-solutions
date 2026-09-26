import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, TrendingUp, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ArbitrageColumn {
  hub: string;
  tz: string;
  role: string;
  compUSD: string;
  taxEfficiency: string;
  effectiveMultiple: string;
}

const HUBS: ArbitrageColumn[] = [
  { hub: 'San Francisco (PST)', tz: 'UTC -8', role: 'Staff Distributed Engineer', compUSD: '$380,000 / YR', taxEfficiency: 'CA State + Federal Tax: ~42%', effectiveMultiple: '1.0x Baseline' },
  { hub: 'London (GMT)', tz: 'UTC +0', role: 'Staff Distributed Engineer', compUSD: '£185,000 ($235K) / YR', taxEfficiency: 'UK Higher Bracket: ~45%', effectiveMultiple: '1.6x Output' },
  { hub: 'Bangalore (IST)', tz: 'UTC +5:30', role: 'Staff Distributed Engineer', compUSD: '₹1.15 Cr ($138K) / YR', taxEfficiency: 'India GCC SEZ Tech Incentive', effectiveMultiple: '2.8x Output' },
  { hub: 'Hyderabad (IST)', tz: 'UTC +5:30', role: 'Staff Distributed Engineer', compUSD: '₹1.05 Cr ($126K) / YR', taxEfficiency: 'Telangana Innovation Subsidy', effectiveMultiple: '3.1x Output' },
];

export const FullScreenHorizontalParallaxCurrencyArbitrageFlight: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flightTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !flightTrackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(flightTrackRef.current, {
        xPercent: -55,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-white text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Header */}
      <div className="relative z-10 w-full px-8 md:px-16 pt-8 pb-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>GLOBAL CAPITAL ARBITRAGE · CROSS-BORDER SCRUB</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight">
            Cross-Continental Capital <span className="text-emerald-600">Efficiency</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>UP TO 3.1X PRODUCTIVITY MULTIPLIER</span>
        </div>
      </div>

      {/* Lateral Arbitrage Cards Track */}
      <div className="relative z-20 w-full overflow-visible py-12">
        <div ref={flightTrackRef} className="flex gap-8 px-8 md:px-16 w-max">
          {HUBS.map((hub, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[460px] p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="font-extrabold text-slate-900 text-lg">{hub.hub}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-mono text-xs font-bold">
                    {hub.tz}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-mono mb-6">{hub.role}</div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">Median All-In Compensation</div>
                    <div className="text-xl font-black text-slate-900 mt-1 font-mono">{hub.compUSD}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">Tax & Zone Advantage</div>
                    <div className="text-xs text-slate-700 font-medium mt-1">{hub.taxEfficiency}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-500">Output Multiplier</span>
                <span className="text-emerald-600 font-black text-sm">{hub.effectiveMultiple}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
