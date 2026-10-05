import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const JobsInterviewProcessRoadmap: React.FC = () => {
  const steps = [
    {
      day: 'Day 1-3',
      title: 'Partner Intake & Technical Deep-Dive',
      desc: '30-minute confidential discussion with a NexaTalent IT Solutions technical partner. We align on your career trajectory, compensation floors, and target architecture.',
    },
    {
      day: 'Day 4-7',
      title: 'Sandbox Calibration Defense',
      desc: 'One 60-minute technical evaluation covering system architecture or concurrent code debugging. Cleared once, valid across all client mandates.',
    },
    {
      day: 'Day 8-14',
      title: 'Client VP & CTO Final Conversations',
      desc: 'Meet directly with the hiring VP of Engineering or CTO. No redundant junior recruiter screenings.',
    },
    {
      day: 'Day 15-21',
      title: 'Offer Package & US RSU Allocation',
      desc: 'Pre-negotiated compensation package issued with legally binding Carta equity grants and Day-1 onboarding confirmation.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>21-Day Candidate Interview Process Roadmap</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Zero Redundancy</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>21-Day Turnaround Guarantee</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Respect for Senior Engineering Time
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            We don't subject candidates to 7-round bureaucratic recruitment marathons. Our streamlined process closes in under 3 weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 inline-block mb-3">
                  {s.day}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{s.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Stage Cleared In Advance</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
