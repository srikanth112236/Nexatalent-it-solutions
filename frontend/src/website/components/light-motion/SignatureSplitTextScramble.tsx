import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, Play } from 'lucide-react';

interface ScrambleRole {
  encrypted: string;
  decrypted: string;
  company: string;
  comp: string;
  sla: string;
}

const ROLES: ScrambleRole[] = [
  { encrypted: 'X9F#82_VP_A1_KL9', decrypted: 'VP of AI Platform Infrastructure', company: 'Global GenAI Foundation Lab', comp: '₹1.85 Cr + Equity', sla: 'Delivered in 48h' },
  { encrypted: 'Q7M$14_PR1NC_C20', decrypted: 'Principal Low-Latency C++ Architect', company: 'Wall Street High-Frequency Fund', comp: '₹1.15 Cr Base', sla: 'Delivered in 72h' },
  { encrypted: 'D2K*99_STF_RFT_0', decrypted: 'Staff Distributed Storage Engineer', company: 'Multi-Cloud Database Enterprise', comp: '₹85 Lakhs + RSUs', sla: 'Delivered in 5 Days' },
  { encrypted: 'Z1B@55_SITE_DIR_X', decrypted: 'Founding GCC Site Managing Director', company: 'Fortune 100 Financial Hub', comp: '₹2.10 Cr + Escrow', sla: 'Delivered in 14 Days' },
];

const CHARS = '!@#$%^&*()_+{}:"<>?~`-=[]\\;\',./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const SignatureSplitTextScramble: React.FC = () => {
  const [displayText, setDisplayText] = useState<string[]>(ROLES.map(r => r.encrypted));
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);

  const runDecrypt = () => {
    setIsDecrypted(true);
    ROLES.forEach((role, idx) => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayText(prev => {
          const next = [...prev];
          next[idx] = role.decrypted
            .split('')
            .map((_, charIdx) => {
              if (charIdx < iteration) return role.decrypted[charIdx];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('');
          return next;
        });

        if (iteration >= role.decrypted.length) {
          clearInterval(interval);
        }
        iteration += 1.5;
      }, 30);
    });
  };

  useEffect(() => {
    runDecrypt();
  }, []);

  return (
    <section className="py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Reveal 03 • Real-Time Text Decryption Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Encrypted Mandate Decryption Engine
          </h2>
          <p className="text-lg text-slate-600">
            Confidential executive search codes decrypt in real time as verified candidate profiles clear our 4-stage evaluation gates.
          </p>
        </div>

        {/* Action Trigger */}
        <div className="flex justify-center mb-10">
          <button
            onClick={runDecrypt}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isDecrypted ? 'Re-Run Decryption Sequence' : 'Execute Decryption Sequence'}</span>
          </button>
        </div>

        {/* 4 Decrypted Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROLES.map((r, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-md hover:border-blue-500 hover:shadow-xl transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  CONFIDENTIAL DOSSIER #{idx + 101}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {r.sla}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black font-mono text-slate-900 leading-snug min-h-[56px] flex items-center">
                {displayText[idx]}
              </h3>

              <p className="text-xs font-semibold text-blue-600">
                {r.company}
              </p>

              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Compensation: <strong className="text-slate-800 font-mono">{r.comp}</strong></span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Placed</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
