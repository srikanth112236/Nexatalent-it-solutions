import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Magnet, Users, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceMagneticRails: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRailRef = useRef<HTMLDivElement>(null);
  const rightRailRef = useRef<HTMLDivElement>(null);
  const podCarrierRef = useRef<HTMLDivElement>(null);

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
        leftRailRef.current,
        { xPercent: -100 },
        { xPercent: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightRailRef.current,
          { xPercent: 100 },
          { xPercent: 0, ease: 'power2.out' },
          0
        )
        .fromTo(
          podCarrierRef.current,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          0.2
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-100 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Precision Rail Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Left Magnetic Rail Caliper */}
      <div
        ref={leftRailRef}
        className="absolute left-0 top-0 bottom-0 w-full md:w-1/3 bg-white/95 border-r border-slate-300 p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-6">
            <Magnet className="w-3.5 h-3.5 text-blue-600" />
            <span>MAGNETIC RAIL 01 · WESTERN ANCHOR</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Autonomous Pod Specification
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Fortune 500 product leaders configuring 4-member dedicated capability pods with dedicated senior leadership.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
            <div>Pod Composition: 1 Staff Lead + 3 Senior SDEs</div>
            <div className="text-blue-600 font-bold">Latency SLA: &lt; 5ms Dedicated VPC</div>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          LEFT MAGNETIC SUSPENSION ACTIVE
        </div>
      </div>

      {/* Right Magnetic Rail Caliper */}
      <div
        ref={rightRailRef}
        className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 bg-white/95 border-l border-slate-300 p-8 md:p-12 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl text-right"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold mb-6">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>MAGNETIC RAIL 02 · GCC ANCHOR</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Day-1 Production Readiness
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Bangalore Outer Ring Road facilities providing pre-provisioned developer workstations with hardened MDM clearance.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 text-left">
            <div>Clearance: 100% Background Attested</div>
            <div className="text-emerald-600 font-bold">First Commit: Within 48 Hours</div>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          RIGHT MAGNETIC SUSPENSION ACTIVE
        </div>
      </div>

      {/* Center 4-Seat Pod Carrier */}
      <div
        ref={podCarrierRef}
        className="relative z-30 p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl text-center max-w-lg mx-4"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">
          RAIL CONVERGENCE SEALED
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">
          4-Seat Elite Engineering Pod
        </h3>
        <p className="text-slate-600 text-xs mb-6 leading-relaxed">
          Both magnetic rails clamp firmly into place, locking an autonomous high-velocity engineering squad into production execution.
        </p>

        <div className="grid grid-cols-2 gap-3 text-left font-mono text-xs mb-6">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Staff Distributed Lead</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Senior Rust Architect</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>AI Inference Specialist</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Site Reliability Eng</span>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-200">
          Total Pod Cost: $340K vs US Equiv: $1.2M (-71.6% Spend)
        </div>
      </div>
    </section>
  );
};
