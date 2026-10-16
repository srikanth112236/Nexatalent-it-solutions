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
    <section className="py-24 bg-white border-b border-neutral-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-black text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Tailored Engagement Frameworks</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
            Commercial Models Engineered for Growth
          </h2>
          <p className="text-lg text-black">
            Choose the engagement model that matches your hiring velocity, organizational complexity, and geographic expansion strategy.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-neutral-200 rounded-2xl">
            <button
              onClick={() => setBillingCycle('flexible')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                billingCycle === 'flexible'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-black hover:text-black'
              }`}
            >
              Standard Engagement
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-black hover:text-black'
              }`}
            >
              Enterprise Retainer
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-extrabold rounded bg-neutral-100 text-black">
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
                  ? 'bg-white border-2 border-neutral-600 shadow-2xl shadow-black/10 ring-4 ring-neutral-50'
                  : 'bg-white border-neutral-200 shadow-lg shadow-slate-100'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-extrabold uppercase px-4 py-1 rounded-full tracking-wider shadow">
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
                    tier.popular ? 'bg-neutral-200 text-black' : 'bg-white text-black'
                  }`}>
                    {tier.badge}
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {tier.recommendedFor}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-black mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs font-semibold text-black mb-4">
                  {tier.headline}
                </p>
                <p className="text-sm text-black leading-relaxed mb-6">
                  {tier.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-neutral-100 mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider block">First Shortlist</span>
                    <span className="text-xs font-bold text-black flex items-center gap-1 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-black" />
                      {tier.sla}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider block">Warranty</span>
                    <span className="text-xs font-bold text-black flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-black" />
                      {tier.warranty}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-black block">
                    What is Included:
                  </span>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-sm text-black">
                      <div className="w-5 h-5 rounded-full bg-neutral-50 text-black flex items-center justify-center shrink-0 mt-0.5">
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
                      ? 'bg-black hover:bg-neutral-800 text-white shadow-lg shadow-black/30'
                      : 'bg-black hover:bg-neutral-800 text-white'
                  }`}
                >
                  <span>Engage Under This Framework</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-black mt-2.5">
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
