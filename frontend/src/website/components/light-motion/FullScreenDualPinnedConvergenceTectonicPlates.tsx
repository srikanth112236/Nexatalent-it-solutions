import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ShieldAlert, Award, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceTectonicPlates: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPlateRef = useRef<HTMLDivElement>(null);
  const rightPlateRef = useRef<HTMLDivElement>(null);
  const seamBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftPlateRef.current,
        { xPercent: -50 },
        { xPercent: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightPlateRef.current,
          { xPercent: 50 },
          { xPercent: 0, ease: 'power2.out' },
          0
        )
        .fromTo(
          seamBadgeRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.8)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex items-stretch m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Left Tectonic Plate: Western Enterprise Architecture */}
      <div
        ref={leftPlateRef}
        className="w-1/2 min-h-screen p-8 md:p-16 lg:p-24 flex flex-col justify-between bg-white border-r border-slate-300 z-10 shadow-2xl"
      >
        <div className="flex items-center gap-2 text-blue-700 font-mono text-xs font-bold">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>TECTONIC PLATE 01 · PACIFIC ENTERPRISE CRUST</span>
        </div>

        <div className="max-w-lg">
          <span className="text-blue-600 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
            Global Strategy Base
          </span>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-6">
            Western Architectural Governance
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Executive leadership sets product direction, compliance guardrails, and customer-facing roadmap priorities from Silicon Valley and London headquarters.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-2">
            <div>SLA Governance: Strict Tier-1 Enterprise</div>
            <div>Timezone Alignment: 100% Core Hours Overlap</div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          WESTERN CRUSTAL MASS
        </div>
      </div>

      {/* Right Tectonic Plate: Indian GCC Engineering Bedrock */}
      <div
        ref={rightPlateRef}
        className="w-1/2 min-h-screen p-8 md:p-16 lg:p-24 flex flex-col justify-between bg-slate-100 border-l border-slate-300 z-10 text-right shadow-2xl"
      >
        <div className="flex items-center justify-end gap-2 text-emerald-700 font-mono text-xs font-bold">
          <span>TECTONIC PLATE 02 · INDIAN CONTINENTAL BEDROCK</span>
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="max-w-lg ml-auto">
          <span className="text-emerald-600 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
            Execution Bedrock
          </span>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-6">
            Deep-Tier Systems Engineering
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Uncompromising low-level engineering execution across high-throughput distributed messaging, custom kernel drivers, and generative AI deployment.
          </p>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 font-mono text-xs text-slate-700 space-y-2 text-left">
            <div>Engineering Yield: 99.4% Flawless Delivery</div>
            <div>Intellectual Property: Zero-Leak Guarantee</div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          EASTERN CRUSTAL MASS
        </div>
      </div>

      {/* Central Fault Seam Lock Badge */}
      <div
        ref={seamBadgeRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-slate-700"
      >
        <Award className="w-4 h-4 text-amber-400" />
        <span>INTERLOCKED BEDROCK FOUNDATION</span>
        <ArrowRight className="w-4 h-4 text-emerald-400" />
      </div>
    </section>
  );
};
