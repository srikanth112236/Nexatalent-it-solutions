import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Lock, Key, Award, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenDualPinnedConvergenceVault: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const lockCoreRef = useRef<HTMLDivElement>(null);

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
        leftDoorRef.current,
        { xPercent: -100 },
        { xPercent: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightDoorRef.current,
          { xPercent: 100 },
          { xPercent: 0, ease: 'power2.out' },
          0
        )
        .fromTo(
          lockCoreRef.current,
          { scale: 0.6, rotate: -90, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.5)' },
          0.3
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
      {/* Background Microdot Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Left Sovereign Satin Vault Door */}
      <div
        ref={leftDoorRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-white/95 border-r border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-blue-600 font-extrabold uppercase tracking-widest">
            SWISS ARCHITECTURE VAULT · SECTOR 01
          </span>
          <Lock className="w-5 h-5 text-blue-600" />
        </div>

        <div className="max-w-md">
          <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Zero-Leak IP Enclave
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Hardware-isolated virtual desktop infrastructures ensuring source code never leaves your sovereign enterprise VPC boundaries.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-2">
            <div>AES-256 Bit Hardened Cryptographic Enclave</div>
            <div className="text-blue-600 font-bold">SOC 2 Type II · ISO 27001 Certified</div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          STATUS: HYDRAULIC ALIGNMENT CONFIRMED
        </div>
      </div>

      {/* Right Sovereign Satin Vault Door */}
      <div
        ref={rightDoorRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/95 border-l border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-md text-right"
      >
        <div className="flex items-center justify-between flex-row-reverse">
          <span className="font-mono text-xs text-emerald-600 font-extrabold uppercase tracking-widest">
            SWISS ARCHITECTURE VAULT · SECTOR 02
          </span>
          <Key className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="max-w-md ml-auto">
          <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Candidate Clearance Ledger
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Cryptographically signed dual-employment audits and conflict-of-interest quarantine checks verified in real time.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-2 text-left">
            <div>Background Attestation: 100% Cleared</div>
            <div className="text-emerald-600 font-bold">Pre-Screened Security Clearance Sealed</div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          STATUS: ESCROW CONVERGENCE READY
        </div>
      </div>

      {/* Center Vault Lock Dial */}
      <div
        ref={lockCoreRef}
        className="relative z-30 flex flex-col items-center justify-center p-8 rounded-full bg-white border-4 border-slate-900 shadow-2xl shadow-slate-900/15 w-84 h-84 text-center"
      >
        <ShieldCheck className="w-14 h-14 text-blue-600 mb-3" />
        <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">
          SOVEREIGN SEAL
        </div>
        <div className="text-xl font-black text-slate-900 tracking-tight mb-2">
          SWISS-GRADE CORE
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Vulnerability Verified</span>
        </div>
        <button className="mt-4 px-5 py-2 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-600 transition-colors cursor-pointer">
          <span>Audit Specs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
