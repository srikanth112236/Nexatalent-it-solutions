import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, Star, FileText, CheckCircle2, Shield, Download } from 'lucide-react';
import { usePortalState, normalizeSkills } from './PortalStateContext';

export function CandidateInspectionDrawer() {
  const { selectedCandidate, inspectDrawerOpen, closeInspectDrawer, moveCandidateStage } = usePortalState();

  if (!selectedCandidate) return null;

  const skillList = normalizeSkills((selectedCandidate as { skills?: unknown }).skills);
  const workList = Array.isArray((selectedCandidate as { workHistory?: unknown }).workHistory)
    ? (selectedCandidate as { workHistory: { company: string; role: string; period: string; details: string }[] }).workHistory
    : [];
  const ratingList = Array.isArray(selectedCandidate.ratings) ? selectedCandidate.ratings : [];

  return (
    <AnimatePresence>
      {inspectDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm font-sans">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInspectDrawer}
            className="absolute inset-0"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-2xl bg-[#0d1322] border-l border-slate-800 text-slate-100 h-full flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Top Header Bar */}
            <div className="p-6 border-b border-slate-800 bg-[#111827] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  {selectedCandidate.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white tracking-tight">{selectedCandidate.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedCandidate.matchScore}% Profile Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{selectedCandidate.roleTitle} • {selectedCandidate.experienceYears} Yrs Exp</p>
                </div>
              </div>
              <button
                onClick={closeInspectDrawer}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Status & Key Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Pipeline Stage</div>
                  <div className="text-sm font-extrabold text-blue-400 mt-0.5">{selectedCandidate.stage}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Current / Expected CTC</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{selectedCandidate.currentCtc} → <span className="text-emerald-400">{selectedCandidate.expectedCtc}</span></div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Notice Period</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">{selectedCandidate.noticePeriod}</div>
                </div>
              </div>

              {/* Source & Metadata */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield size={14} className="text-blue-400" /> Sourced via: <strong className="text-slate-200">{selectedCandidate.submittedBy} ({selectedCandidate.sourceType})</strong>
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <MapPin size={13} /> {selectedCandidate.location}
                </span>
              </div>

              {/* Candidate Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={15} className="text-blue-400" /> Executive Executive Summary & Resume Vetting
                </h3>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
                  {selectedCandidate.resumeSummary || (selectedCandidate as { summary?: string }).summary || 'No summary available.'}
                </p>
              </div>

              {/* Technical Skill Breakdown Radar */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Star size={15} className="text-amber-400" /> Verified Technical Skill Taxonomy
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {skillList.length === 0 ? (
                    <div className="col-span-2 text-xs text-slate-500 font-medium">No skills recorded yet.</div>
                  ) : skillList.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{skill.name}</span>
                        <span className="text-blue-400">{skill.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={15} className="text-emerald-400" /> Proven Career History & Deployments
                </h3>
                <div className="space-y-2 border-l-2 border-slate-800 ml-2 pl-4">
                  {workList.length === 0 ? (
                    <div className="text-xs text-slate-500 font-medium">No work history recorded yet.</div>
                  ) : workList.map((work, idx) => (
                    <div key={idx} className="relative pb-3">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-950" />
                      <div className="font-bold text-slate-100">{work.role}</div>
                      <div className="text-[11px] text-blue-400 font-semibold">{work.company} • {work.period}</div>
                      <p className="text-slate-400 mt-1">{work.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluator Ratings */}
              {ratingList.length > 0 && (
                <div className="space-y-3 p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40">
                  <h3 className="text-xs font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-400" /> Technical Assessment Scorecard
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ratingList.map((rate, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-300 font-medium">
                        <span>{rate.category}:</span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          {rate.score} / 5 <Star size={12} className="fill-amber-400 text-amber-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 border-t border-slate-800 bg-[#111827] flex items-center justify-between gap-3">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download size={14} /> Download Original CV
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    moveCandidateStage(selectedCandidate.id, 'Tech Round')
                      .then(() => closeInspectDrawer())
                      .catch((e: unknown) => console.warn('Stage move failed:', e));
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Advance to Tech Round →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    moveCandidateStage(selectedCandidate.id, 'Offer Issued')
                      .then(() => closeInspectDrawer())
                      .catch((e: unknown) => console.warn('Stage move failed:', e));
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Issue Offer Letter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
