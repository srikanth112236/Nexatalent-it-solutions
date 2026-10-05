import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface Stage {
  number: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  details: string;
  actor: 'Automated' | 'AI Risk Engine' | 'Nexa Operations Admin';
}

const PIPELINE_STAGES: Stage[] = [
  {
    number: 1,
    title: 'Application Received',
    subtitle: 'Submission Dossier Logged',
    status: 'completed',
    details: 'Corporate PAN, GST, CIN, recruiter headcount, and placement history ingested into Nexa Alliance Core.',
    actor: 'Automated'
  },
  {
    number: 2,
    title: 'Document Verification',
    subtitle: 'MCA & GSTN Direct Validation',
    status: 'completed',
    details: 'Real-time API cross-check with Ministry of Corporate Affairs and GST Portal confirming active operating status.',
    actor: 'Automated'
  },
  {
    number: 3,
    title: 'AI Risk / Completeness Check',
    subtitle: 'Algorithmic Anomaly Detection',
    status: 'completed',
    details: 'Nexa AI screens anti-poaching records, duplicate vendor profiles, and past candidate disputes (Risk Score: Low - 4%).',
    actor: 'AI Risk Engine'
  },
  {
    number: 4,
    title: 'Nexa Admin Review',
    subtitle: 'Mandatory Human Operations Sign-off',
    status: 'in_progress',
    details: 'Partner Alliance Director conducts a 30-min operational fitment review and counter-signs the Master Supplier Agreement.',
    actor: 'Nexa Operations Admin'
  },
  {
    number: 5,
    title: 'Approved Vendor Status',
    subtitle: 'Vendor Portal Activated',
    status: 'upcoming',
    details: 'Official partner badge issued, API credentials provided, and direct access to live Fortune 500 tech mandates unlocked.',
    actor: 'Automated'
  }
];

export function VendorVerificationPipeline() {
  const [activeStage, setActiveStage] = useState(3);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI RISK EVALUATION & GOVERNANCE GATEWAY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mb-3">
            5-Stage Recruitment Partner Verification Pipeline
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We hold our supplier ecosystem to institutional compliance standards. Every empanelment progresses through multi-layer document audits, AI risk checks, and mandatory human executive review.
          </p>
        </motion.div>

        {/* Human Safeguard Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-10 p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start sm:items-center gap-3 shadow-sm"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm text-amber-900">
            <strong className="text-amber-950 font-bold block sm:inline mr-2">
              ⚖️ Human-in-the-Loop Governance: AI Alone Never Approves Vendors
            </strong>
            While Nexa AI performs forensic tax verification and conflict-of-interest analysis, the final empanelment decision is exclusively authorized by NexaTalent IT Solutions’s Vice President of Partner Operations.
          </div>
        </motion.div>

        {/* Visual Pipeline Progression (Desktop horizontal / Mobile vertical) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {PIPELINE_STAGES.map((stg, idx) => (
            <motion.div
              key={stg.number}
              whileHover={{ y: -2 }}
              onClick={() => setActiveStage(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                stg.status === 'completed'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : stg.status === 'in_progress'
                  ? 'bg-purple-50/50 border-purple-300 shadow-md ring-1 ring-purple-300'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    stg.status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : stg.status === 'in_progress'
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {stg.status === 'completed' ? '✓' : stg.number}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    stg.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : stg.status === 'in_progress'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {stg.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">{stg.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{stg.subtitle}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Actor:</span>
                <strong className="text-slate-800">{stg.actor}</strong>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Stage Inspector Card */}
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700">STAGE {PIPELINE_STAGES[activeStage].number} OF 5</span>
              <h3 className="text-xl font-bold text-slate-950 mt-0.5">{PIPELINE_STAGES[activeStage].title}</h3>
              <p className="text-xs text-slate-500 font-medium">{PIPELINE_STAGES[activeStage].subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Responsible Unit:</span>
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-emerald-800 shadow-xs">
                {PIPELINE_STAGES[activeStage].actor}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium">
            {PIPELINE_STAGES[activeStage].details}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block mb-1 font-semibold">Turnaround Time (SLA)</span>
              <strong className="text-slate-900 font-bold">24 to 48 Hours</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block mb-1 font-semibold">Audit Trail Record</span>
              <strong className="text-emerald-700 font-bold">SHA-256 Tamper-Proof Log</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block mb-1 font-semibold">Empanelment Validity</span>
              <strong className="text-slate-900 font-bold">Annual Renewable MSA</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
