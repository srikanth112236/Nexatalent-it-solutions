import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const CtaExecutiveStrategyBooking: React.FC = () => {
  const [booked, setBooked] = useState(false);

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>56 · Executive Strategy Session Booking Card</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">30-Min GCC Audit</span>
      </div>

      <section className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Direct Partner Consultation</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Schedule a 30-Minute GCC Feasibility Roadmap
            </h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Meet directly with a NexaTalent Managing Partner. We’ll analyze your engineering roadmap, calculate exact 3-year savings, and model team delivery timelines.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>30 Minutes</span>
              </span>
              <span>•</span>
              <span>Strict NDA Protected</span>
              <span>•</span>
              <span>Zero Sales Pressure</span>
            </div>
          </div>

          <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
            {booked ? (
              <div className="py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Session Reserved</h4>
                <p className="text-xs text-slate-500">Check your inbox for the calendar invite and Zoom link.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  placeholder="Corporate Work Email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setBooked(true)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  <span>Confirm Strategy Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
