import React from 'react';
import { Play, Award, CheckCircle2 } from 'lucide-react';

export const CaseStudyVideoTestimonialBento: React.FC = () => {
  const testimonials = [
    {
      author: 'David Chen',
      role: 'Chief Technology Officer',
      company: 'Enterprise Distributed DB Platform (SF)',
      quote: 'We spent 9 months trying to recruit Staff C++ engineers in the Bay Area. NexaTalent placed 4 exceptional architects in Bangalore who shipped our storage engine release ahead of schedule.',
      metric: '4 Staff Engineers Placed',
    },
    {
      author: 'Sarah Jenkins',
      role: 'VP of People & Talent',
      company: 'Series D FinTech ($1.2B Valuation)',
      quote: 'The legal entity, compliance, and IP assignment was completely friction-free. We had our Bangalore development center operational in 68 days with zero legal head scratching.',
      metric: '68-Day Turnkey Hub',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>45 · Executive Video Testimonial Bento</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Client Endorsements</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Client Testimonials</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Hear Directly from Engineering VPs and CTOs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/20 hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {t.metric}
                  </span>
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6 font-light">
                  "{t.quote}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.author}</h4>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                  <div className="text-[10px] text-blue-600 font-mono">{t.company}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
