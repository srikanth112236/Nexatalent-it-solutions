import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, FileCheck, CheckCircle2, Globe2, Building } from 'lucide-react';

interface TrustCredential {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge: string;
}

const CREDENTIALS: TrustCredential[] = [
  {
    icon: Shield,
    title: 'SOC 2 Type II Certified',
    subtitle: 'Annual third-party audit across data handling, candidate PII, and client secrecy protocols.',
    badge: 'Audited 2026'
  },
  {
    icon: Lock,
    title: 'ISO/IEC 27001:2022',
    subtitle: 'Global information security standard certification covering digital talent infrastructure.',
    badge: 'Accredited'
  },
  {
    icon: Award,
    title: 'GDPR & DPDP Act Compliant',
    subtitle: 'Strict candidate consent management, zero unauthorized resume distribution, and right-to-erasure compliance.',
    badge: 'Global Privacy'
  },
  {
    icon: FileCheck,
    title: '180-Day Placement Warranty',
    subtitle: 'Enterprise-grade talent guarantee offering immediate replacement or fee credit protections.',
    badge: '100% Backed'
  }
];

export const LightTrustSignalStrip: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Banner strip */}
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enterprise Governance & Compliance Standards</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Trusted by Tier-1 Enterprises & High-Growth Technology Leaders
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>US, UK & India Legal Entities</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Fortune 500 Vetted</span>
              </span>
            </div>
          </div>

          {/* 4 Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {CREDENTIALS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.35 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Under-strip notice */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>
              All confidential searches are bound by bilateral non-disclosure agreements (NDAs) and encrypted candidate management systems.
            </p>
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
              Download Security Whitepaper (PDF) &rarr;
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
