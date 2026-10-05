import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, ShieldAlert, KeyRound, CheckCircle } from 'lucide-react';

export const Hero12BiometricVaultPasskey: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setUnlocked(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-[90vh] bg-slate-950 text-white overflow-hidden flex items-center justify-center border-y border-slate-800">
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline & Value Prop */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CONFIDENTIAL BOARD PRACTICE & CXO VAULT</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Access Tier-1 Executive Mandates <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">
              Under Bilateral Passkey.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-light max-w-lg leading-relaxed">
            We manage non-public executive transitions, country head appointments, and board advisory setups for global captive technology centers under strict NDA protocols.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>Zero Leakage Protocol</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Anonymized Candidate Roster</span>
            </span>
          </div>

          <div className="pt-4">
            <button 
              type="button"
              onClick={triggerScan}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Simulate Biometric Verification</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Biometric Vault Scanner */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center space-y-6">
            
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
              <span className="text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                SECURITY LEVEL: CLASS-A
              </span>
              <span className={unlocked ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {unlocked ? 'AUTHORIZED' : 'LOCKED'}
              </span>
            </div>

            {/* Fingerprint Scanner Button Area */}
            <div className="py-4">
              <button 
                type="button"
                onClick={triggerScan}
                className="relative p-6 rounded-full bg-slate-950 border-2 border-slate-800 hover:border-amber-400 transition-colors mx-auto inline-block cursor-pointer group"
              >
                <Fingerprint className={`w-16 h-16 transition-colors ${
                  scanning ? 'text-amber-400 animate-pulse' : unlocked ? 'text-emerald-400' : 'text-slate-600 group-hover:text-amber-400'
                }`} />

                {scanning && (
                  <motion.div 
                    animate={{ y: [-30, 30, -30] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute left-4 right-4 h-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b]"
                  />
                )}
              </button>

              <div className="text-xs font-mono mt-3 text-slate-400">
                {scanning ? 'SCANNING FINGERPRINT HASH...' : unlocked ? '✓ PASSKEY VERIFIED • MANDATE DECRYPTED' : 'TAP SCANNER TO DECRYPT CONFIDENTIAL BRIEF'}
              </div>
            </div>

            {/* Decrypted Content Card */}
            {unlocked ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-left font-mono text-xs space-y-2"
              >
                <div className="text-emerald-400 font-bold">MANDATE #9042: MANAGING DIRECTOR</div>
                <div className="text-slate-300">Global Investment Bank · Tier-1 GCC (Bangalore)</div>
                <div className="text-slate-400 text-[11px]">Comp: $450k + Carry • 120-Day Transition Window</div>
              </motion.div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left font-mono text-xs text-slate-500 space-y-1">
                <div>MANDATE #••••: [ENCRYPTED SHA-256]</div>
                <div>Entity: [RESTRICTED UNDER MUTUAL NDA]</div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
