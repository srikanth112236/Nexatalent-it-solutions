import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Lock, Unlock, KeyRound, Award, Coins } from 'lucide-react';

export const FullScreenVerticalSplitCurtainVaultDial: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Vertical split curtain movement (Top moves up, Bottom moves down)
  const topCurtainY = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '-102%']);
  const bottomCurtainY = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '102%']);

  // Central geared vault dial rotation and unlocking
  const dialRotation = useTransform(scrollYProgress, [0, 0.5, 0.8], [0, 360, 720]);
  const dialScale = useTransform(scrollYProgress, [0.45, 0.75], [1, 0]);
  const dialOpacity = useTransform(scrollYProgress, [0.45, 0.7], [1, 0]);

  // Content reveal inside the vault
  const vaultContentScale = useTransform(scrollYProgress, [0.25, 0.75], [0.88, 1]);
  const vaultContentOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[220vh] bg-neutral-950 text-white overflow-hidden"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-screen flex items-center justify-center overflow-hidden">
        
        {/* Interior Vault Content: Sovereign Compensation & Cap Table Governance */}
        <motion.div
          style={{ scale: vaultContentScale, opacity: vaultContentOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 lg:px-20 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-neutral-950 to-black"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-6">
            <Unlock className="w-3.5 h-3.5 text-amber-400" />
            Pattern 18 · Vault Access Unlocked
          </div>

          <h2 className="text-section-title font-semibold tracking-tight text-white mb-4 max-w-4xl">
            Sovereign Compensation & Equity Escrow Vault
          </h2>
          <p className="text-sm md:text-base text-neutral-300 max-w-2xl font-light mb-12">
            The vertical blast shields retract to disclose programmatic cap-table incentives, cross-border tax compliance, and multi-currency payroll infrastructure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-amber-500/20 text-left backdrop-blur-xl">
              <Coins className="w-7 h-7 text-amber-400 mb-4" />
              <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-1">
                Multi-Currency Automated Clearing
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">USD · EUR · INR · SGD</div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Automated monthly escrow dispersion through local clearing houses with automated tax withholding.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-amber-500/20 text-left backdrop-blur-xl">
              <KeyRound className="w-7 h-7 text-emerald-400 mb-4" />
              <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-1">
                409A Valuation & RSUs
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">Carta Integration</div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Instant Carta and Shareworks sync for seamless global stock option granting and vesting cliff alerts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-amber-500/20 text-left backdrop-blur-xl">
              <Award className="w-7 h-7 text-sky-400 mb-4" />
              <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-1">
                Retention Clawback Protections
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">99.4% Fulfillment</div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Legally vetted clawbacks and tenure milestones protecting enterprise client investment for 36 months.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Split Blast Curtain (50vh x 100vw) */}
        <motion.div
          style={{ y: topCurtainY }}
          className="absolute top-0 left-0 w-full h-1/2 z-30 bg-neutral-900 border-b-2 border-amber-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex flex-col justify-between p-8 lg:p-14"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              Upper Blast Hatch · Hydraulic Stage I
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span>ENGAGED</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-5xl lg:text-7xl font-black tracking-widest text-neutral-800 select-none block uppercase">
              SECURITY VAULT
            </span>
          </div>
        </motion.div>

        {/* Bottom Split Blast Curtain (50vh x 100vw) */}
        <motion.div
          style={{ y: bottomCurtainY }}
          className="absolute bottom-0 left-0 w-full h-1/2 z-30 bg-neutral-900 border-t-2 border-amber-500/40 shadow-[0_-15px_40px_rgba(0,0,0,0.9)] flex flex-col justify-between p-8 lg:p-14"
        >
          <div className="text-center">
            <span className="text-5xl lg:text-7xl font-black tracking-widest text-neutral-800 select-none block uppercase">
              CONFIDENTIAL
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>PRESSURIZATION: 100 BAR</span>
            <span>ENCRYPTION: AES-256-GCM</span>
          </div>
        </motion.div>

        {/* Central Rotating Mechanical Vault Wheel */}
        <motion.div
          style={{ rotate: dialRotation, scale: dialScale, opacity: dialOpacity }}
          className="absolute z-40 w-36 h-36 rounded-full bg-neutral-950 border-4 border-amber-500/80 shadow-[0_0_60px_rgba(245,158,11,0.4)] flex items-center justify-center pointer-events-none"
        >
          <div className="w-24 h-24 rounded-full border border-dashed border-amber-400/60 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-amber-400" />
          </div>
          {/* Spoke Markers */}
          <div className="absolute w-full h-1 bg-amber-500/40 rounded-full" />
          <div className="absolute w-1 h-full bg-amber-500/40 rounded-full" />
        </motion.div>

      </div>
    </section>
  );
};
