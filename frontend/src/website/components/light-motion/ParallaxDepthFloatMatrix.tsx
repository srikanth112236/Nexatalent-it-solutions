import React from 'react';
import { Sparkles, ShieldCheck, Zap, Award, Users, TrendingUp } from 'lucide-react';

interface FloatingMetric {
  value: string;
  label: string;
  sub: string;
  badge: string;
  accent: string;
  icon: React.ElementType;
}

const FLOATING_METRICS: FloatingMetric[] = [
  { value: 'Structured', label: 'Shortlist Pipelines', sub: 'Requirement to shortlist workflow', badge: 'PILLAR 01', accent: '#0265FF', icon: Zap },
  { value: 'Coordinated', label: 'Interview Flow', sub: 'Scheduling, feedback and offer stages', badge: 'PILLAR 02', accent: '#059669', icon: Award },
  { value: 'Governed', label: 'Placement Tracking', sub: 'Offer to joining visibility', badge: 'PILLAR 03', accent: '#4F46E5', icon: ShieldCheck },
  { value: 'Rigorous', label: 'Technical Screening', sub: 'Systems and architecture reviews', badge: 'PILLAR 04', accent: '#0284C7', icon: Zap },
  { value: 'Scaled', label: 'GCC Hiring', sub: 'Captive and distributed team hiring', badge: 'PILLAR 05', accent: '#EA580C', icon: Users },
  { value: 'Curated', label: 'Talent Pool', sub: 'Searchable assessed candidate profiles', badge: 'PILLAR 06', accent: '#0265FF', icon: TrendingUp },
];

export const ParallaxDepthFloatMatrix: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>OUR HIRING PILLARS & DELIVERY COMMITMENTS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Our 6 Core Recruitment Pillars
          </h2>
          <p className="text-base md:text-lg text-slate-600 font-medium">
            Structured screening, transparent candidate tracking, and dedicated talent delivery for every client mandate.
          </p>
        </div>

        {/* Straight Clean Cards Grid — 3 per row on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLOATING_METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:border-blue-400 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center">
                    <Icon className="w-6 h-6" style={{ color: item.accent }} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {item.badge}
                  </span>
                </div>

                <div className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {item.value}
                </div>

                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {item.label}
                </h3>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
