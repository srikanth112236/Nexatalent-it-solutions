import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Check, X, Calendar, RefreshCw, Database, Sparkles } from 'lucide-react';

interface ShortlistCandidate {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  source: string;
  experience: string;
  location: string;
  notice: string;
  ctc: string;
  highlights: string[];
  status?: 'shortlisted' | 'rejected' | 'interview_requested';
}

const SHORTLIST_DATA: ShortlistCandidate[] = [
  {
    id: 'C-01',
    name: 'Candidate 1 (Arun Patel)',
    title: 'Staff Java / Microservices Architect',
    matchScore: 96,
    source: 'Nexa Internal Candidate Database',
    experience: '6.8 YOE',
    location: 'Bangalore (On-site / Hybrid)',
    notice: 'Immediate (Serving notice)',
    ctc: '₹17.8 LPA',
    highlights: ['Kafka Partitioning', 'Spring Boot 3', 'High-Frequency Trading API', 'Kubernetes Helm']
  },
  {
    id: 'C-02',
    name: 'Candidate 2 (Divya Nambiar)',
    title: 'Senior Java Backend Engineer',
    matchScore: 93,
    source: 'Approved Vendor Submission (TalentSquad Tech)',
    experience: '5.5 YOE',
    location: 'Bangalore (Indiranagar)',
    notice: '15 Days Notice',
    ctc: '₹16.5 LPA',
    highlights: ['Microservices Mesh', 'AWS EKS', 'PostgreSQL Tuning', 'Docker Compose']
  },
  {
    id: 'C-03',
    name: 'Candidate 3 (Tanmay Roy)',
    title: 'Cloud Java & Distributed Systems Specialist',
    matchScore: 91,
    source: 'Direct Candidate Application',
    experience: '6.0 YOE',
    location: 'Bangalore / Remote',
    notice: '30 Days (Negotiable)',
    ctc: '₹18.0 LPA',
    highlights: ['Spring Cloud Gateway', 'Redis Caching', 'JUnit 5 / Mockito', 'CI/CD Pipelines']
  },
  {
    id: 'C-04',
    name: 'Candidate 4 (Siddharth G.)',
    title: 'Senior Backend Engineer (Java / Go)',
    matchScore: 88,
    source: 'Previously Screened Talent Pool',
    experience: '5.2 YOE',
    location: 'Bangalore (Whitefield)',
    notice: 'Immediate Joiner',
    ctc: '₹17.0 LPA',
    highlights: ['REST APIs', 'Spring Boot', 'GCP PubSub', 'PostgreSQL']
  }
];

export function ClientAiShortlistDeck() {
  const [candidates, setCandidates] = useState<ShortlistCandidate[]>(SHORTLIST_DATA);
  const [searchingMore, setSearchingMore] = useState(false);

  const handleAction = (id: string, action: 'shortlisted' | 'rejected' | 'interview_requested') => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action } : c))
    );
  };

  const handleSearchMore = () => {
    setSearchingMore(true);
    setTimeout(() => {
      setSearchingMore(false);
      alert('Nexa AI queried 50,000+ candidate profiles and 120 approved vendor partners. 4 additional verified profiles queued for recruiter validation.');
    }, 1000);
  };

  return (
    <section id="client-shortlist-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>SYNCHRONIZED TALENT INVENTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Client AI Shortlist & Multi-Source Roster
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              AI aggregates profiles from 4 distinct channels: Internal Candidate Database, Approved Vendor Submissions, Direct Applicant Inflow, and Recruiter Networks.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSearchMore}
            disabled={searchingMore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 transition-all shadow-sm active:scale-95"
          >
            {searchingMore ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Scanning Databases...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Request More Candidates</span>
              </>
            )}
          </button>
        </div>

        {/* Shortlist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {candidates.map((cand, idx) => (
            <motion.div
              key={cand.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                cand.status === 'shortlisted'
                  ? 'bg-emerald-50/50 border-emerald-400 shadow-md ring-1 ring-emerald-400/20'
                  : cand.status === 'interview_requested'
                  ? 'bg-purple-50/50 border-purple-400 shadow-md ring-1 ring-purple-400/20'
                  : cand.status === 'rejected'
                  ? 'bg-rose-50/40 border-rose-300 opacity-60'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header row: Match score + Source */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    {cand.name} — {cand.matchScore}% Match
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[180px]">
                    {cand.source}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{cand.title}</h3>
                <div className="text-xs text-slate-500 mb-4 flex flex-wrap gap-2 font-medium">
                  <span>{cand.experience}</span>
                  <span>•</span>
                  <span>{cand.location}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{cand.notice}</span>
                  <span>•</span>
                  <span>Target: <strong className="text-slate-900">{cand.ctc}</strong></span>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cand.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status or Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                {cand.status === 'shortlisted' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <Check className="w-4 h-4" />
                    Shortlisted for Technical Round
                  </span>
                ) : cand.status === 'interview_requested' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700">
                    <Calendar className="w-4 h-4" />
                    Interview Slot Requested (Nexa Coordinating)
                  </span>
                ) : cand.status === 'rejected' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                    <X className="w-4 h-4" />
                    Profile Passed
                  </span>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 w-full justify-end">
                    <button
                      type="button"
                      onClick={() => handleAction(cand.id, 'rejected')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(cand.id, 'shortlisted')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all"
                    >
                      Shortlist
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(cand.id, 'interview_requested')}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                    >
                      Request Interview
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
