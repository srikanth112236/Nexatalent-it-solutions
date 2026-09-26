import React from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';

export const JobsRecruiterHiringDashboardPreview: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>37 · Employer Hiring Pipeline Dashboard Preview</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">ATS Telemetry</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Real-Time Client Hiring Portal</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Live Pipeline Visibility for Client VPs & Talent Leads
            </h2>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <span>Request ATS Demo Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard Mockup Container */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 block mb-1">Active Sprints</span>
              <div className="text-2xl font-bold font-mono text-white">4 Pods</div>
              <span className="text-[10px] text-emerald-400">32 Engineers Placed</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 block mb-1">Avg Time to Offer</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">14.2 Days</div>
              <span className="text-[10px] text-slate-400">Industry avg: 68 days</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 block mb-1">Shortlist Pass Rate</span>
              <div className="text-2xl font-bold font-mono text-blue-400">89.4%</div>
              <span className="text-[10px] text-slate-400">High calibration precision</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 block mb-1">Total Capital Saved</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">$3.84M</div>
              <span className="text-[10px] text-slate-400">vs Onshore US Headcount</span>
            </div>
          </div>

          {/* Pipeline Stage Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Active Mandate: Principal ML Infra Engineer (Indiranagar Hub)</span>
              <span className="text-emerald-400">Stage: Offer Calibration</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
                1. Sandbox Cleared (3)
              </div>
              <div className="p-2 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
                2. CTO Debrief (2)
              </div>
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                3. Offer Drafted (1)
              </div>
              <div className="p-2 rounded-lg bg-slate-900 text-slate-500 border border-slate-800">
                4. Onboarding (Pending)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
