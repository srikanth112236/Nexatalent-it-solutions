import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Award, UserCheck, BarChart3 } from 'lucide-react';

interface MatchCandidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  location: string;
  noticePeriod: string;
  currentCTC: string;
  expectedCTC: string;
  overallMatch: number;
  factors: {
    technicalSkills: number;
    experience: number;
    responsibilities: number;
    location: number;
    noticePeriod: number;
    ctc: number;
  };
  skills: string[];
  companies: string[];
  education: string;
  recruiterNote: string;
}

const SAMPLE_CANDIDATES: MatchCandidate[] = [
  {
    id: 'CAND-01',
    name: 'Candidate A (Rohit S.)',
    role: 'Senior Java Developer / Spring Boot Microservices',
    experience: '6.2 Years Experience',
    location: 'Bangalore, India (Indiranagar / Remote Ready)',
    noticePeriod: 'Immediate Joiner (Serving last 3 days)',
    currentCTC: '₹14.8 LPA',
    expectedCTC: '₹17.5 LPA',
    overallMatch: 94,
    factors: {
      technicalSkills: 97,
      experience: 95,
      responsibilities: 94,
      location: 100,
      noticePeriod: 100,
      ctc: 91,
    },
    skills: ['Java 17', 'Spring Boot', 'Microservices', 'Kafka', 'Docker', 'PostgreSQL', 'AWS'],
    companies: ['Fintech Payments Unicorn', 'Global Tier-1 Tier R&D Center'],
    education: 'B.Tech Computer Science (VTU, 2018)',
    recruiterNote: 'Vetted by Nexa Senior Recruiter (Priya M.): Demonstrated solid concurrency primitives, thread-safety, and API design in live technical screening.'
  },
  {
    id: 'CAND-02',
    name: 'Candidate B (Sneha V.)',
    role: 'Backend Java & Distributed Systems Lead',
    experience: '5.8 Years Experience',
    location: 'Bangalore, India (Whitefield)',
    noticePeriod: '15 Days Notice',
    currentCTC: '₹15.2 LPA',
    expectedCTC: '₹18.0 LPA',
    overallMatch: 91,
    factors: {
      technicalSkills: 94,
      experience: 92,
      responsibilities: 90,
      location: 100,
      noticePeriod: 90,
      ctc: 89,
    },
    skills: ['Java', 'Spring Cloud', 'Kubernetes', 'Redis', 'Microservices', 'MongoDB'],
    companies: ['Enterprise SaaS Platform', 'Consulting IT Major'],
    education: 'B.E Information Technology (NIT Surathkal)',
    recruiterNote: 'Verified background check, hands-on microservices decomposition expertise.'
  },
  {
    id: 'CAND-03',
    name: 'Candidate C (Karthik R.)',
    role: 'Full Stack Java & Cloud Architect',
    experience: '7.1 Years Experience',
    location: 'Bangalore / Ready to Relocate',
    noticePeriod: '30 Days (Buyout Eligible)',
    currentCTC: '₹16.5 LPA',
    expectedCTC: '₹18.5 LPA',
    overallMatch: 88,
    factors: {
      technicalSkills: 92,
      experience: 96,
      responsibilities: 91,
      location: 85,
      noticePeriod: 80,
      ctc: 84,
    },
    skills: ['Java 21', 'Spring Boot', 'React', 'GCP', 'Terraform', 'CI/CD'],
    companies: ['Healthtech Enterprise', 'Digital Agency'],
    education: 'M.Tech Software Engineering (BITS Pilani)',
    recruiterNote: 'Strong system design; notice period negotiation ongoing with current employer.'
  }
];

export function AiMatchEngineRadar() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const candidate = SAMPLE_CANDIDATES[selectedIdx];

  return (
    <section id="ai-match-engine-section" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Section Pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>NEXA AI MATCH ENGINE (6-FACTOR ANALYSIS)</span>
          </div>
        </motion.div>

        {/* Section Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 mb-3">
            Multi-Vector Candidate Scoring Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            When a requisition is submitted, Nexa searches 50,000+ internal candidates across 6 predictive vectors. Every AI match requires mandatory human verification by senior recruiters before presentation.
          </p>
        </motion.div>

        {/* Mandatory Human Safeguard Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start sm:items-center gap-3 shadow-sm"
        >
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm text-amber-900">
            <strong className="text-amber-950 font-bold block sm:inline mr-2">
              🛡️ AI Recommendation — Recruiter Verification Required
            </strong>
            Nexa AI provides statistical matching and screening acceleration, but never makes unilateral hiring decisions. Nexa Talent senior recruiters conduct mandatory pedigree, communication, and technical interview verification.
          </div>
        </motion.div>

        {/* Main Candidate Card & Breakdown Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Candidate Selector Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
              Top Database Matches (3 of 42)
            </div>
            {SAMPLE_CANDIDATES.map((cand, idx) => (
              <motion.button
                key={cand.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedIdx === idx
                    ? 'bg-slate-50 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-900">{cand.name}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                    cand.overallMatch >= 90
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-teal-100 text-teal-800 border border-teal-200'
                  }`}>
                    {cand.overallMatch}% Match
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-semibold truncate mb-2">{cand.role}</div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span>{cand.experience}</span>
                  <span>•</span>
                  <span>{cand.location.split('(')[0]}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{cand.noticePeriod.split('(')[0]}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detailed Match Breakdown Card (8 cols) */}
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-8 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/40"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Match Profile</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">{candidate.name}</h3>
                <p className="text-sm text-slate-700 font-medium">{candidate.role} • {candidate.experience}</p>
                <p className="text-xs text-slate-500 mt-1">{candidate.location} • <span className="text-emerald-700 font-bold">{candidate.noticePeriod}</span></p>
              </div>

              {/* Overall Score Badge */}
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-emerald-200 shadow-sm">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Overall AI Match</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">{candidate.overallMatch}%</div>
                </div>
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
            </div>

            {/* 6-Factor Match Breakdown Bars */}
            <div className="mt-6 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
                <span>Multi-Factor Fit Breakdown</span>
                <span className="text-emerald-700 font-mono text-[11px] font-bold">Weighted Precision Index</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* 1. Technical Skills */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Technical Skills (Java, Spring, Microservices)</span>
                    <span className="font-bold text-emerald-700">{candidate.factors.technicalSkills}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${candidate.factors.technicalSkills}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>

                {/* 2. Experience */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Experience Depth & Tenancy</span>
                    <span className="font-bold text-emerald-700">{candidate.factors.experience}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${candidate.factors.experience}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>

                {/* 3. Responsibilities */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Architecture & Role Responsibilities</span>
                    <span className="font-bold text-emerald-700">{candidate.factors.responsibilities}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${candidate.factors.responsibilities}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>

                {/* 4. Location */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Location Proximity (Bangalore)</span>
                    <span className="font-bold text-emerald-700">{candidate.factors.location}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${candidate.factors.location}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>

                {/* 5. Notice Period */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Notice Period Match (Immediate)</span>
                    <span className="font-bold text-emerald-700">{candidate.factors.noticePeriod}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${candidate.factors.noticePeriod}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>

                {/* 6. CTC / Budget */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">CTC & Budget Alignment (Under ₹18 LPA)</span>
                    <span className="font-bold text-emerald-700">{candidate.factors.ctc}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${candidate.factors.ctc}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter Human Note */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 mb-6 flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-blue-900 font-bold block mb-0.5">Recruiter Verification Assessment</span>
                <span className="text-blue-800 leading-relaxed">{candidate.recruiterNote}</span>
              </div>
            </div>

            {/* Actions for Client */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-600 font-medium">
                Current CTC: <strong className="text-slate-900">{candidate.currentCTC}</strong> • Expected: <strong className="text-emerald-700 font-bold">{candidate.expectedCTC}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Shortlisted ${candidate.name} for Client Review.`)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  Shortlist Candidate
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Interview request submitted for ${candidate.name}. Nexa account manager will coordinate.`)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-all active:scale-95"
                >
                  Request Interview
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
