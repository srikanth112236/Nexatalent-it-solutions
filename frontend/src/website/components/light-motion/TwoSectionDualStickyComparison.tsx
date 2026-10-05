import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Columns2, Quote, ShieldCheck, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TwoSectionDualStickyComparison: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !leftColRef.current || !rightColRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1400',
          pin: true,
          scrub: 0.8,
        }
      });

      // Left column scale & fade-in reveal
      tl.fromTo(leftColRef.current, {
        opacity: 0.4,
        scale: 0.95,
      }, {
        opacity: 1,
        scale: 1,
        ease: 'power1.out',
      }, 0);

      // Right column scale & fade-in reveal
      tl.fromTo(rightColRef.current, {
        opacity: 0.4,
        scale: 0.95,
      }, {
        opacity: 1,
        scale: 1,
        ease: 'power1.out',
      }, 0.2);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Columns2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Dual Sticky Comparison • Client Sponsor & Squad Architecture</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Dual Pinned Sponsor & Squad Architecture
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Both columns lock onto the viewport while you scroll, providing a synchronized view of executive endorsement and exact pod engineering structure.
          </p>
        </div>

        {/* 2-Column Dual Pinned Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Executive Sponsor Endorsement */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">PINNED SPONSOR VIEW</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                Tier-1 FinTech
              </span>
            </div>

            <div className="relative pl-6">
              <Quote className="w-5 h-5 text-blue-500 absolute left-0 top-0" />
              <p className="text-sm md:text-base text-slate-700 italic leading-relaxed">
                "Within 45 days, NexaTalent IT Solutions built an elite 35-engineer low-latency C++ and FPGA trading pod in Bangalore. Their technical depth ensured zero training lag."
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Julian Henderson</h4>
                <p className="text-xs text-slate-500">Global Head of Quantitative Technology</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                100% Retention
              </span>
            </div>
          </div>

          {/* Right Column: Squad Architecture Breakdown */}
          <div
            ref={rightColRef}
            className="lg:col-span-7 p-8 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400">PINNED SQUAD ARCHITECTURE</span>
              <span className="text-xs font-mono font-bold text-slate-400">35 Total Engineers</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white">
              Deconstructed Trading Pod Hierarchy
            </h3>

            <div className="space-y-3">
              {[
                { role: '1x Site Managing Director (Ex-Goldman Sachs VP)', tag: 'Executive Lead', comp: '₹1.85 Cr' },
                { role: '4x Principal Low-Latency C++ Architects (Kernel Bypass)', tag: 'L6 Principal', comp: '₹95L – ₹1.15 Cr' },
                { role: '6x FPGA Acceleration Engineers (Verilog / HLS)', tag: 'L5 Senior', comp: '₹65L – ₹80L' },
                { role: '24x Core Distributed Systems Backend Engineers', tag: 'L4/L5 Core', comp: '₹45L – ₹60L' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-200">{item.role}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[11px]">{item.tag}</span>
                    <span className="font-mono font-bold text-emerald-400">{item.comp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Escrow-Backed 180-Day Guarantee</span>
              </span>
              <button className="text-blue-400 font-bold hover:underline flex items-center gap-1">
                <span>View Full Spec</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
