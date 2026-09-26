import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, CheckCircle2, DollarSign, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitConvergenceFinancialEscrow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEscrowRef = useRef<HTMLDivElement>(null);
  const rightEscrowRef = useRef<HTMLDivElement>(null);
  const sealBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftEscrowRef.current,
        { xPercent: -50 },
        { xPercent: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightEscrowRef.current,
          { xPercent: 50 },
          { xPercent: 0, ease: 'power2.out' },
          0
        )
        .fromTo(
          sealBadgeRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.6)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-100 text-slate-900 overflow-hidden flex items-stretch m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Pattern 19: Left Side - US Enterprise Deposit */}
      <div
        ref={leftEscrowRef}
        className="w-1/2 min-h-screen p-8 md:p-14 lg:p-20 flex flex-col justify-between bg-white border-r border-slate-300 shadow-xl"
      >
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-mono text-xs font-bold mb-4">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>ESCROW LEDGER 01 · WESTERN CLIENT DEPOSIT</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Secured Mandate Capital
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Enterprise retention deposits held securely in FDIC-insured institutional escrow accounts with conditional release milestones.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Escrow Custodian</span>
              <span className="text-slate-900 font-bold">J.P. Morgan Chase / BNY Mellon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Milestone SLA</span>
              <span className="text-blue-600 font-bold">90-Day Guaranteed Placement</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          WESTERN ESCROW CONVERGENCE FLANK
        </div>
      </div>

      {/* Pattern 19: Right Side - Indian RBI Regulatory Clearance */}
      <div
        ref={rightEscrowRef}
        className="w-1/2 min-h-screen p-8 md:p-14 lg:p-20 flex flex-col justify-between bg-slate-50 border-l border-slate-300 shadow-xl text-right"
      >
        <div>
          <div className="flex items-center justify-end gap-2 text-emerald-700 font-mono text-xs font-bold mb-4">
            <span>ESCROW LEDGER 02 · RBI STATUTORY CLEARANCE</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Statutory Cross-Border Routing
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            100% compliant cross-border payroll, FEMA transfer governance, and SEZ incentive attestation across Indian jurisdictions.
          </p>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 font-mono text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Statutory Compliance</span>
              <span className="text-emerald-600 font-bold">FEMA & SEZ Certified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Audit Status</span>
              <span className="text-slate-900 font-bold">Big-4 Independently Audited</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          EASTERN ESCROW CONVERGENCE FLANK
        </div>
      </div>

      {/* Center Unified Escrow Seal */}
      <div
        ref={sealBadgeRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 p-7 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex flex-col items-center text-center"
      >
        <ShieldCheck className="w-8 h-8 text-emerald-400 mb-2" />
        <div className="text-xs font-mono font-bold text-slate-400 uppercase">Pattern 19 Escrow</div>
        <div className="text-sm font-black text-white flex items-center gap-1.5 mt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Legally Sealed & Bound</span>
        </div>
      </div>
    </section>
  );
};
