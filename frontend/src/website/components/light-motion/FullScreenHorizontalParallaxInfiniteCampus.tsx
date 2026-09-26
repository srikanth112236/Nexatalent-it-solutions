import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Building, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CampusItem {
  city: string;
  country: string;
  focus: string;
  engineers: string;
  facilities: string;
}

const CAMPUSES: CampusItem[] = [
  { city: 'Bangalore', country: 'India · Outer Ring Road & Indiranagar', focus: 'AI Architecture & Distributed Core', engineers: '28,000+ Vetted', facilities: 'Tier-4 Datacenter Peering' },
  { city: 'Hyderabad', country: 'India · HITEC City & Financial District', focus: 'FinTech, Payments & Low-Latency HFT', engineers: '14,000+ Vetted', facilities: 'Campus Hardware Security Enclaves' },
  { city: 'London', country: 'United Kingdom · Bank & Canary Wharf', focus: 'European Regulatory & Quant Strategy', engineers: '4,500+ Vetted', facilities: 'EMEA Executive Liaison Suite' },
  { city: 'San Francisco', country: 'United States · SoMa & Silicon Valley', focus: 'Founding Staff & GenAI Innovation', engineers: '3,200+ Vetted', facilities: 'Global Mandate Headquarters' },
];

export const FullScreenHorizontalParallaxInfiniteCampus: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const campusTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !campusTrackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(campusTrackRef.current, {
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
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Architectural Blueprint Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '32px 32px, 64px 64px, 64px 64px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 w-full px-8 md:px-16 pt-8 pb-4 flex justify-between items-center border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-2">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>GLOBAL GCC CAMPUS TOUR · HORIZONTAL PARALLAX SCRUB</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Sovereign Engineering <span className="text-blue-600">Hubs</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>4 STRATEGIC GLOBAL HUBS</span>
        </div>
      </div>

      {/* Panoramic Campus Track */}
      <div className="relative z-20 w-full overflow-visible py-12">
        <div ref={campusTrackRef} className="flex gap-8 px-8 md:px-16 w-max">
          {CAMPUSES.map((item, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[480px] p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-black text-slate-900">{item.city}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    HUB 0{idx + 1}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-500 mb-6">{item.country}</div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">Core Practice Focus</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{item.focus}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">Dedicated Facilities</div>
                    <div className="text-sm font-bold text-emerald-600 mt-1">{item.facilities}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Capacity</span>
                <span className="font-bold text-blue-600 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  {item.engineers}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
