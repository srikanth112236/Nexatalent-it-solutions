import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, Lock, Award, FileCheck2, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PledgeLayer {
  id: string;
  level: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  legalTerms: string[];
  auditStamp: string;
}

const PLEDGE_LAYERS: PledgeLayer[] = [
  {
    id: 'layer-1',
    level: 'Layer 01',
    title: '180-Day Comprehensive Placement Warranty',
    badge: 'Executive Retention',
    icon: ShieldCheck,
    description: 'If an executive or founding engineer departs for any reason within the first 180 calendar days, NexaTalent IT Solutions provides an immediate priority replacement at zero additional placement fee.',
    legalTerms: [
      'Unconditional coverage across cultural alignment or voluntary resignation',
      'Dedicated Managing Director assigned to launch replacement within 48 hours',
      'No fee deductions, hidden administration charges, or prorated penalties'
    ],
    auditStamp: 'Certified by NexaTalent IT Solutions Governance Committee'
  },
  {
    id: 'layer-2',
    level: 'Layer 02',
    title: '100% Intellectual Property & Trade Secret Covenant',
    badge: 'Day-1 Ownership',
    icon: Lock,
    description: 'Every candidate undergoes bilateral NDA signing and clear background IP audits before first interview. All works created in the GCC belong strictly to the client entity.',
    legalTerms: [
      'Zero lien or claims by NexaTalent IT Solutions or third-party entity',
      'Clean room engineering verification ensuring no code contamination',
      'Comprehensive pre-employment non-compete and confidentiality covenants'
    ],
    auditStamp: 'Audited by Global Legal Counsel'
  },
  {
    id: 'layer-3',
    level: 'Layer 03',
    title: 'SOC 2 Type II & ISO 27001 Data Infrastructure',
    badge: 'Cryptographic Security',
    icon: Award,
    description: 'Candidate dossiers, proprietary architectural interview challenges, and compensation numbers are encrypted at rest with AES-256 and transmitted via TLS 1.3.',
    legalTerms: [
      'Strict GDPR & DPDP Act compliance with right-to-erasure guarantees',
      'Zero unauthorized resume circulation or public job board posting',
      'Annual independent penetration testing and compliance audit reports'
    ],
    auditStamp: 'SOC 2 Type II Report Available under NDA'
  },
  {
    id: 'layer-4',
    level: 'Layer 04',
    title: 'Milestone Escrow & Performance-Gated Commercials',
    badge: 'Zero Risk Capital',
    icon: FileCheck2,
    description: 'For turnkey GCC and retained pods, commercial payments are strictly released upon passing verifiable technical deliverables and candidate joining signatures.',
    legalTerms: [
      'Structured 3-tier milestone disbursements aligned with project velocity',
      'Contractual SLA penalties of 25% fee rebate if shortlist is missed',
      'Full escrow security protection for cross-border payroll reserves'
    ],
    auditStamp: 'Underwritten by Commercial Escrow Partners'
  }
];

export const SignatureExecutivePledgeShield: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<PledgeLayer>(PLEDGE_LAYERS[0]);

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 50 • 4-Layer Executive Guarantee Shield</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            The NexaTalent IT Solutions Enterprise Executive Pledge
          </h2>
          <p className="text-lg text-slate-600">
            Backed by a multi-layered legal covenant protecting your hiring capital, IP ownership, and operational confidentiality.
          </p>
        </div>

        {/* 2-Column Shield Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 4 Interactive Layer Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {PLEDGE_LAYERS.map((layer) => {
              const Icon = layer.icon;
              const isActive = activeLayer.id === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                        {layer.level} • {layer.badge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {layer.title}
                      </h4>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-blue-600 translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Layer Holographic Certificate Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl p-8 md:p-10 border-2 border-slate-200 shadow-2xl shadow-slate-200/60 relative overflow-hidden"
              >
                {/* Subtle Decorative Background Shield */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 text-blue-50/70 pointer-events-none">
                  <Shield className="w-full h-full stroke-[0.7]" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                        Legal Protection Clause {activeLayer.level}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {activeLayer.title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                      100% Guaranteed
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed my-6">
                    {activeLayer.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                      Contractual Covenants:
                    </span>
                    {activeLayer.legalTerms.map((term, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <span className="text-slate-400 font-medium">
                      Audit Stamp: <strong className="text-slate-700">{activeLayer.auditStamp}</strong>
                    </span>
                    <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer">
                      Download Full Pledge Certificate
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
