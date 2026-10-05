import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

interface TierModel {
  id: string;
  name: string;
  badge: string;
  headline: string;
  description: string;
  recommendedFor: string;
  commitment: string;
  sla: string;
  warranty: string;
  features: string[];
  popular?: boolean;
}

const SERVICE_TIERS: TierModel[] = [
  {
    id: 'contingent',
    name: 'Precision Search',
    badge: 'Contingency',
    headline: 'High-Velocity Technical Placements',
    description: 'Zero upfront commitment. Ideal for scaling specialized mid-to-senior individual contributor roles with immediate velocity.',
    recommendedFor: 'Series A–C Startups & Mid-Market',
    commitment: 'Success Fee Only',
    sla: 'Calibrated Shortlist Flow',
    warranty: 'Defined Replacement Terms',
    features: [
      'Access to assessed talent pipeline',
      'System Architecture technical evaluation',
      'Direct interview orchestration & calibration',
      'Standard reference & credential check',
      'Single point of contact recruiter'
    ]
  },
  {
    id: 'retained',
    name: 'Retained Executive',
    badge: 'Most Popular',
    headline: 'Dedicated Director & C-Suite Search',
    description: 'Dedicated delivery with an exclusive senior partner pod for confidential leadership and VP-level mandates.',
    recommendedFor: 'Enterprise Scale-ups & Global MNCs',
    commitment: 'Structured 3-Stage Retainer',
    sla: 'Priority Shortlist Flow',
    warranty: 'Defined Leadership Terms',
    features: [
      'Dedicated Partner-led search team',
      'Confidential headhunting & market mapping',
      'Deep psychometric & leadership assessment',
      'Custom compensation & equity benchmarking',
      'Defined executive tenure terms',
      'Weekly transparent board-level pipeline reports'
    ],
    popular: true
  },
  {
    id: 'gcc-bot',
    name: 'GCC Turnkey / BOT',
    badge: 'Strategic Enterprise',
    headline: 'Build-Operate-Transfer Capability Center',
    description: 'End-to-end talent and operational engine to launch capability centers of excellence in India with documented IP governance.',
    recommendedFor: 'Global Enterprises & Fortune 500',
    commitment: 'Monthly Platform + Volume Model',
    sla: 'Phased Squad Deployment',
    warranty: 'Continuous Talent Assurance',
    features: [
      'Complete legal entity & compliance advisory',
      'Turnkey facility & hardware infrastructure',
      'Employer-of-Record (EOR) transition management',
      'Leadership + engineer squad buildout',
      'Documented intellectual property transfer process',
      'Optional entity transfer per agreement term'
    ]
  }
];

export const LightServiceTierComparison: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'flexible'>('flexible');

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Tailored Engagement Frameworks</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Commercial Models Engineered for Growth
          </h2>
          <p className="text-lg text-slate-600">
            Choose the engagement model that matches your hiring velocity, organizational complexity, and geographic expansion strategy.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-slate-200/80 rounded-2xl">
            <button
              onClick={() => setBillingCycle('flexible')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                billingCycle === 'flexible'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard Engagement
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Enterprise Retainer
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-extrabold rounded bg-emerald-100 text-emerald-700">
                15% Savings
              </span>
            </button>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {SERVICE_TIERS.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-3xl p-8 flex flex-col justify-between border transition-all ${
                tier.popular
                  ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/10 ring-4 ring-blue-50'
                  : 'bg-white border-slate-200 shadow-lg shadow-slate-100'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-extrabold uppercase px-4 py-1 rounded-full tracking-wider shadow">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recommended for Scale
                  </span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                    tier.popular ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tier.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {tier.recommendedFor}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mb-4">
                  {tier.headline}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {tier.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">First Shortlist</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      {tier.sla}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Warranty</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {tier.warranty}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                    What is Included:
                  </span>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Engage Under This Framework</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2.5">
                  {tier.commitment}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
