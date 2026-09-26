import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalParallaxGlassMural: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pane1Ref = useRef<HTMLDivElement>(null);
  const pane2Ref = useRef<HTMLDivElement>(null);
  const pane3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(pane1Ref.current, {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(pane2Ref.current, {
        y: -260,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
        },
      });

      gsap.to(pane3Ref.current, {
        y: -420,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[130vh] bg-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Prismatic Light Wash */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-blue-200/30 via-indigo-200/20 to-purple-200/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>ARCHITECTURAL PRISMATIC MURAL · VERTICAL SHIFT</span>
        </div>
        <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
          The Transparency Standard
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Multi-pane frosted architectural glass shifting on vertical scroll to reflect verified candidate clearance records and zero-conflict attestations.
        </p>
      </div>

      {/* 3 Prismatic Shifting Glass Panes */}
      <div className="relative z-20 w-full px-8 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
        <div
          ref={pane1Ref}
          className="p-8 rounded-3xl bg-white/80 border border-slate-200 shadow-xl backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-xs font-mono text-slate-400 mb-1">Pane 01 · Velocity 1.0x</div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Cryptographic Attribution</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Every technical evaluation is signed by an independent Lead Architect panel and archived onto an immutable audit ledger.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Tamper Proof</span>
          </div>
        </div>

        <div
          ref={pane2Ref}
          className="p-8 rounded-3xl bg-white/80 border border-slate-200 shadow-xl backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="text-xs font-mono text-slate-400 mb-1">Pane 02 · Velocity 1.6x</div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Zero Dual Employment</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Continuous background monitoring and EPFO credential scans eliminate moonlighting risks before candidate onboarding.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Conflict Confirmed</span>
          </div>
        </div>

        <div
          ref={pane3Ref}
          className="p-8 rounded-3xl bg-white/80 border border-slate-200 shadow-xl backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-xs font-mono text-slate-400 mb-1">Pane 03 · Velocity 2.2x</div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Enforceable Escrow</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Tier-1 search guarantees backed by 90-day escrow replacement clauses and unconditional delivery milestones.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bank-Grade Assurance</span>
          </div>
        </div>
      </div>
    </section>
  );
};
