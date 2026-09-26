import React, { useState } from 'react';
import { Pin, CheckCircle2, ArrowRight } from 'lucide-react';

interface MilestonePhase {
  number: string;
  days: string;
  title: string;
  summary: string;
  keyOutputs: string[];
  sla: string;
}

const MILESTONES: MilestonePhase[] = [
  {
    number: '01',
    days: 'Day 01',
    title: 'Precision Mandate Calibration & Scorecard Sign-Off',
    summary: 'Executive practice lead partners directly with your CTO to codify technical non-negotiables, candidate compensation caps, and strict off-limits companies.',
    keyOutputs: ['Signed bilateral NDA & non-disclosure covenant', 'Standardized 5-axis technical grading rubric', 'Dedicated 3-person Partner Search Pod assigned'],
    sla: 'Mandate Live within 24h'
  },
  {
    number: '02',
    days: 'Day 03',
    title: '72-Hour Screened Shortlist Delivery',
    summary: 'First cohort of 3–5 fully vetted candidate dossiers delivered with recorded architectural defense interviews and verified current compensation.',
    keyOutputs: ['Recorded system design whiteboarding sessions', 'Memory & concurrency test profiling outputs', 'Direct candidate availability holds'],
    sla: 'Contractual 72h SLA'
  },
  {
    number: '03',
    days: 'Day 07',
    title: 'Client Team Deep-Dive Interviews',
    summary: 'Seamless interview orchestration with real-time feedback loops. Candidates arrive pre-calibrated on role context and company trajectory.',
    keyOutputs: ['Zero candidate ghosting or late cancellations', 'Post-interview debriefs with Practice Partner', 'Real-time candidate sentiment tracking'],
    sla: '94% Interview-to-Offer Progression'
  },
  {
    number: '04',
    days: 'Day 14',
    title: 'Offer Orchestration & Counter-Offer Defense',
    summary: 'Proactive offer presentation aligning base, variable, and equity vesting schedules while insulating candidates against resignation counter-offers.',
    keyOutputs: ['Signed formal offer acceptance letters', 'Resignation letter submission verification', 'Notice period buyout coordination'],
    sla: '94.8% Offer Acceptance Conversion'
  },
  {
    number: '05',
    days: 'Day 75',
    title: 'Full Squad Integration & Day-75 Autonomous Center',
    summary: 'Founding leadership cadre and individual contributor pods onboarded, achieving parity with headquarters sprint velocity.',
    keyOutputs: ['100% intellectual property transfer on Day 1', 'Turnkey SEZ facility & hardware operations', '180-day comprehensive placement warranty'],
    sla: '180-Day Guarantee Backed'
  }
];

export const OneSideStickySplitMilestones: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-28 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Pin className="w-3.5 h-3.5 text-blue-600" />
            <span>One-Side Sticky Pin • Left Pinned Dashboard, Right Scrolling Milestones</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            One-Side Pinned Operational Roadmap
          </h2>
          <p className="text-lg text-slate-600">
            The left executive dashboard stays pinned in place while the right timeline flows through the 5 calibrated search milestones.
          </p>
        </div>

        {/* 2-Column Sticky Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Pinned Sticky Dashboard */}
          <div
            className="lg:col-span-5"
            style={{
              position: 'sticky',
              top: '120px',
              alignSelf: 'start',
            }}
          >
            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  Search Pod Live Telemetry
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Contractual SLA Active</span>
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-snug">
                  NexaTalent Executive Search Engine
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dedicated Managing Partner Pod Assigned per Mandate
                </p>
              </div>

              {/* Stat Gauges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Shortlist SLA</span>
                  <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">72 Hours</span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-1">Guaranteed Delivery</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer Conversion</span>
                  <span className="text-xl font-black text-emerald-600 font-mono mt-0.5 block">94.8%</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Zero Drop-Offs</span>
                </div>
              </div>

              {/* Practice Quote */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 text-xs text-slate-700 leading-relaxed space-y-2">
                <p className="italic">
                  "Our SLA isn't a marketing slogan—it is written into our legal representation agreements with financial penalties if we miss delivery."
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 pt-2 border-t border-blue-200/50">
                  <span>Vikram Malhotra</span>
                  <span className="text-blue-600 font-normal">Managing Director, GCC Practice</span>
                </div>
              </div>

              <button className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                <span>Request SLA Calibration Pack</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Scrolling Milestones */}
          <div className="lg:col-span-7 space-y-8">
            {MILESTONES.map((m, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveStep(idx)}
                className={`rounded-3xl p-8 border transition-all duration-300 ${
                  activeStep === idx
                    ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/10'
                    : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center font-mono">
                    {m.number}
                  </span>
                  <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {m.days} • {m.sla}
                  </span>
                </div>

                <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-3">
                  {m.title}
                </h4>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {m.summary}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                    Verified Outputs:
                  </span>
                  {m.keyOutputs.map((out, oIdx) => (
                    <div key={oIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
