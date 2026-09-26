import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface TimelineStage {
  day: number;
  label: string;
  badge: string;
  headline: string;
  deliverables: string[];
  slaGuarantee: string;
  teamInvolved: string;
  outputArtifact: string;
}

const STAGES: TimelineStage[] = [
  {
    day: 1,
    label: 'Day 01',
    badge: 'Inception',
    headline: 'Mandate Calibration & Competency Archetyping',
    deliverables: [
      'Bilateral NDA execution and confidential scope alignment',
      'Target company poaching list & off-limit exclusions defined',
      'System architecture scorecard and rubric established',
      'Dedicated Managing Director and Partner Pod assigned'
    ],
    slaGuarantee: 'Complete Rubric Signed within 24 Hours',
    teamInvolved: 'Managing Partner + Principal Architect',
    outputArtifact: 'Calibrated Hiring Blueprint (PDF)'
  },
  {
    day: 3,
    label: 'Day 03',
    badge: 'Shortlist Delivery',
    headline: '72-Hour Pre-Vetted Candidate Dossiers',
    deliverables: [
      '3 to 5 verified candidates delivered with architectural defense recordings',
      'Compensation benchmarks, current notice periods & expectations pre-aligned',
      'Live code submission benchmarks and profiling reports',
      'Direct scheduling links with candidate priority holds'
    ],
    slaGuarantee: 'Contractual 72-Hour SLA or 25% Fee Credit',
    teamInvolved: 'Executive Technical Talent Pod',
    outputArtifact: 'Executive Dossier & Radar Profiles'
  },
  {
    day: 14,
    label: 'Day 14',
    badge: 'Calibration & Offers',
    headline: 'Final Client Interviews & Counter-Offer Defense',
    deliverables: [
      'Client architectural deep-dive interviews and cultural syncs',
      'Proactive counter-offer insulation & resignation coaching',
      'Multi-source reference audit & criminal / education background pre-check',
      'Formal offer presentation with equity vesting alignment'
    ],
    slaGuarantee: '94.8% Offer Acceptance Conversion',
    teamInvolved: 'Partner Pod + Candidate Talent Advocate',
    outputArtifact: 'Formal Acceptance Letter & Resignation Proof'
  },
  {
    day: 21,
    label: 'Day 21',
    badge: 'Squad Scale',
    headline: 'Squad Expansion & Continuity Management',
    deliverables: [
      'Founding leaders in place; automated pipeline unlocks downstream ICs',
      'Continuous weekly pulse check and joining milestone tracking',
      'Pre-joining engagement and architecture reading pack distribution',
      'Relocation and cross-border mobility logistics cleared'
    ],
    slaGuarantee: '100% Talent Joining Escrow Backed',
    teamInvolved: 'Talent Success & Mobility Pod',
    outputArtifact: 'Signed Onboarding Schedule'
  },
  {
    day: 75,
    label: 'Day 75',
    badge: 'Turnkey GCC',
    headline: '120-Engineer Center of Excellence Operational',
    deliverables: [
      'Complete GCC facility, hardware provisioning & SEZ compliance finalized',
      'Full leadership cadre + 100+ individual contributor engineers deployed',
      'Operational velocity matches headquarters sprint benchmarks',
      'Governance structure ready for optional Build-Operate-Transfer'
    ],
    slaGuarantee: '180-Day Comprehensive Warranty',
    teamInvolved: 'Full GCC Practice Practice Leadership',
    outputArtifact: 'Turnkey Transfer Certificate'
  }
];

export const SignatureInteractiveTimelineDial: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(1);
  const currentStage = STAGES[activeStageIdx];

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 46 • Precision Velocity Timeline Dial</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Day 01 to Day 75 Delivery Trajectory
          </h2>
          <p className="text-lg text-slate-600">
            Every mandate is managed against strict, legally backed SLA milestones. Drag the scrubber or select a milestone to view deliverables.
          </p>
        </div>

        {/* Milestone Dial / Stepper Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative flex items-center justify-between">
            {/* Connecting Track */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 rounded-full z-0" />
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-blue-600 rounded-full z-0"
              initial={false}
              animate={{ width: `${(activeStageIdx / (STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />

            {/* Stage Buttons */}
            {STAGES.map((st, idx) => {
              const isActive = idx === activeStageIdx;
              const isPast = idx < activeStageIdx;
              return (
                <button
                  key={st.day}
                  onClick={() => setActiveStageIdx(idx)}
                  className={`relative z-10 flex flex-col items-center group cursor-pointer`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs md:text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 ring-4 ring-blue-100 scale-110'
                        : isPast
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white border-2 border-slate-300 text-slate-500 group-hover:border-slate-400'
                    }`}
                  >
                    {st.day}d
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 whitespace-nowrap transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    {st.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestone Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-200/50"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-50 text-blue-700">
                    Milestone {currentStage.label}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">•</span>
                  <span className="text-xs font-bold text-slate-500">{currentStage.teamInvolved}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900">{currentStage.headline}</h3>
              </div>

              <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{currentStage.slaGuarantee}</span>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="my-8 space-y-3.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                Mandatory Stage Deliverables & Proof Points:
              </span>
              {currentStage.deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Footer with Artifact */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="font-bold text-slate-700">Verified Output:</span>
                <span className="font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-800">
                  {currentStage.outputArtifact}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStageIdx(prev => Math.max(0, prev - 1))}
                  disabled={activeStageIdx === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveStageIdx(prev => Math.min(STAGES.length - 1, prev + 1))}
                  disabled={activeStageIdx === STAGES.length - 1}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center gap-1"
                >
                  <span>Next Milestone</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
