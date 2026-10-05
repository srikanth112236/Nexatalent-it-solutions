import React, { useState } from 'react';
import { Upload, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const JobsQuickApplicationDrawerModal: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>60-Second Confidential Application Drawer</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">Frictionless Intake</span>
      </div>

      <section className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Confidential Candidate Intake</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Apply to All Retained Mandates in 60 Seconds
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Your current employer will never see your profile. We strip all identifiable metadata before client presentation.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-lg">Application Encrypted & Dispatched</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto font-light leading-relaxed">
              A NexaTalent IT Solutions Managing Partner will review your GitHub/dossier and reach out via Signal or WhatsApp within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Varma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Signal / Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98800 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">GitHub / Code Profile</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 text-center cursor-pointer transition-all bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700">Drop PDF Resume or Click to Browse</div>
              <div className="text-[10px] text-slate-400 mt-1">PDF, DOCX up to 10MB</div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
            >
              <span>Submit Encrypted Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
