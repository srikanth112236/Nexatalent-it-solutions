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
          end: '+=140%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftDoorRef.current,
        { x: '-100%' },
        { x: '0%', ease: 'power2.out' },
        0
      )
        .fromTo(
          rightDoorRef.current,
          { x: '100%' },
          { x: '0%', ease: 'power2.out' },
          0
        )
        .fromTo(
          lockCoreRef.current,
          { scale: 0.5, rotate: -90, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.5)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Radial Light Source */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Left Heavy Vault Door */}
      <div
        ref={leftDoorRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-slate-900 border-r-4 border-amber-500/50 p-12 flex flex-col justify-between z-20 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-widest">
            VAULT SECTOR 01 · IP QUARANTINE
          </span>
          <Lock className="w-5 h-5 text-amber-400" />
        </div>

        <div className="max-w-md">
          <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Zero-Leak IP Enclave
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Hardware-isolated virtual desktop infrastructures ensuring source code never leaves your sovereign enterprise VPC boundaries.
          </p>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
            <div>AES-256 Bit Hardened Cryptographic Keys</div>
            <div className="text-amber-400 font-semibold">SOC 2 Type II · ISO 27001 Certified</div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          STATUS: CLAMPING SYNCHRONIZED
        </div>
      </div>

      {/* Right Heavy Vault Door */}
      <div
        ref={rightDoorRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-slate-900 border-l-4 border-blue-500/50 p-12 flex flex-col justify-between z-20 shadow-2xl text-right"
      >
        <div className="flex items-center justify-between flex-row-reverse">
          <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">
            VAULT SECTOR 02 · NON-COMPETE LEDGER
          </span>
          <Key className="w-5 h-5 text-blue-400" />
        </div>

        <div className="max-w-md ml-auto">
          <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Immutable Candidate Clearance
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Cryptographically signed dual-employment audits and conflict-of-interest quarantine checks verified in real time.
          </p>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-2 text-left">
            <div>Background Attestation: 100% Cleared</div>
            <div className="text-blue-400 font-semibold">Pre-Screened Security Clearance</div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          STATUS: HYDRAULIC LOCK ENGAGED
        </div>
      </div>

      {/* Center Vault Lock Hub */}
      <div
        ref={lockCoreRef}
        className="relative z-30 flex flex-col items-center justify-center p-8 rounded-full bg-slate-900 border-4 border-amber-400 shadow-2xl shadow-amber-400/20 w-80 h-80 text-center"
      >
        <ShieldCheck className="w-14 h-14 text-amber-400 mb-3 animate-pulse" />
        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
          SOVEREIGN SEAL
        </div>
        <div className="text-xl font-black text-white tracking-tight mb-2">
          IRONCLAD GCC CORE
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <Award className="w-3.5 h-3.5 text-blue-400" />
          <span>Zero Vulnerability Verified</span>
        </div>
        <button className="mt-4 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer">
          <span>Audit Spec</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
