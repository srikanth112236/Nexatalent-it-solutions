import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutGrid, CheckCircle2, Shield, Cpu, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WingRoom {
  zone: string;
  name: string;
  sqft: string;
  capacity: string;
  specs: string[];
}

const ROOMS: WingRoom[] = [
  { zone: 'WING A · GROUND FLOOR', name: 'Secure Sovereign Vault Enclave', sqft: '8,500 SQ FT', capacity: '120 Dedicated Seats', specs: ['Hardware isolated network drops', 'Biometric dual-custody access', 'FIPS 140-2 cryptographic storage'] },
  { zone: 'WING B · MEZZANINE', name: 'High-Frequency Quant Trading Lab', sqft: '12,000 SQ FT', capacity: '180 Dedicated Seats', specs: ['Sub-microsecond direct dark fiber', 'Direct NYSE/LSE clock sync feeds', 'Custom cooling for FPGA test racks'] },
  { zone: 'WING C · TOWER TIER 01', name: 'Autonomous Generative AI Guild', sqft: '18,500 SQ FT', capacity: '260 Dedicated Seats', specs: ['Dedicated 100Gbps InfiniBand cluster', 'Local LLM inference sandbox', 'Air-gapped data staging rooms'] },
  { zone: 'WING D · EXECUTIVE SUITE', name: 'Site Managing Director Executive Boardroom', sqft: '6,200 SQ FT', capacity: '40 Executive Seats', specs: ['Cross-continental video telepresence', 'Zero-leak acoustic isolation', 'Dedicated board presentation salon'] },
];

export const FullScreenHorizontalParallaxArchitecturalFloorplan: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const floorplanTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !floorplanTrackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(floorplanTrackRef.current, {
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
      {/* Blueprint Floorplan Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 w-full px-8 md:px-16 pt-8 pb-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-2">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            <span>CAMPUS MASTER FLOORPLAN · CAD BLUEPRINT PARALLAX</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight">
            1,000-Seat Sovereign GCC <span className="text-blue-600">Masterplan</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>TIER-4 CAMPUS COMPLIANCE</span>
        </div>
      </div>

      {/* Lateral Floorplan Rooms Track */}
      <div className="relative z-20 w-full overflow-visible py-12">
        <div ref={floorplanTrackRef} className="flex gap-8 px-8 md:px-16 w-max">
          {ROOMS.map((room, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[480px] p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-blue-600 uppercase">
                    {room.zone}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                    {room.capacity}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                  {idx === 0 && <Lock className="w-5 h-5 text-blue-600" />}
                  {idx === 1 && <Cpu className="w-5 h-5 text-emerald-600" />}
                  {idx === 2 && <Cpu className="w-5 h-5 text-indigo-600" />}
                  {idx === 3 && <Shield className="w-5 h-5 text-amber-600" />}
                  <span>{room.name}</span>
                </h3>
                <div className="text-xs font-mono text-slate-400 mb-6">{room.sqft}</div>

                <div className="space-y-2.5 mb-6">
                  {room.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Facility Status</span>
                <span className="text-emerald-600 font-bold">Ready for Immediate Tenant</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
