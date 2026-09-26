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
  accent: string;
}

const CAMPUSES: CampusItem[] = [
  { city: 'Bangalore', country: 'India · Outer Ring Road & Indiranagar', focus: 'AI Architecture & Distributed Core', engineers: '28,000+ Vetted', facilities: 'Tier-4 Datacenter Peering', accent: 'from-blue-600 to-indigo-600' },
  { city: 'Hyderabad', country: 'India · HITEC City & Financial District', focus: 'FinTech, Payments & Low-Latency HFT', engineers: '14,000+ Vetted', facilities: 'Campus Hardware Security Enclaves', accent: 'from-indigo-600 to-emerald-600' },
  { city: 'London', country: 'United Kingdom · Bank & Canary Wharf', focus: 'European Regulatory & Quant Strategy', engineers: '4,500+ Vetted', facilities: 'EMEA Executive Liaison Suite', accent: 'from-purple-600 to-blue-600' },
  { city: 'San Francisco', country: 'United States · SoMa & Silicon Valley', focus: 'Founding Staff & GenAI Innovation', engineers: '3,200+ Vetted', facilities: 'Global Mandate Headquarters', accent: 'from-blue-600 to-teal-600' },
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
      className="relative w-screen min-h-screen bg-slate-900 text-white overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 w-full px-8 md:px-16 pt-8 pb-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-mono font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL GCC CAMPUS TOUR · HORIZONTAL PARALLAX SCRUB</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Sovereign Engineering <span className="text-blue-400">Hubs</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>4 STRATEGIC GLOBAL HUBS</span>
        </div>
      </div>

      {/* Panoramic Campus Track */}
      <div className="relative z-20 w-full overflow-visible py-12">
        <div ref={campusTrackRef} className="flex gap-8 px-8 md:px-16 w-max">
          {CAMPUSES.map((item, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[480px] p-8 rounded-3xl bg-slate-850 bg-slate-800/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-black text-white">{item.city}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
                    HUB 0{idx + 1}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400 mb-6">{item.country}</div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Core Practice Focus</div>
                    <div className="text-sm font-bold text-white mt-1">{item.focus}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Dedicated Facilities</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">{item.facilities}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Capacity</span>
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
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
