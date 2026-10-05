import { motion } from 'framer-motion';
import { Layers, CheckCircle, Users, ArrowUpRight } from 'lucide-react';

interface RequirementRow {
  role: string;
  openings: number;
  candidates: number;
  shortlisted: number;
  status: 'Active' | 'Interview' | 'Offer';
  location: string;
  budget: string;
}

const REQUIREMENTS: RequirementRow[] = [
  {
    role: 'Java Developer / Microservices Lead',
    openings: 5,
    candidates: 32,
    shortlisted: 7,
    status: 'Active',
    location: 'Bangalore (Hybrid)',
    budget: '₹18–22 LPA'
  },
  {
    role: 'Senior React Developer / Frontend Lead',
    openings: 3,
    candidates: 19,
    shortlisted: 4,
    status: 'Interview',
    location: 'Pune (Hybrid)',
    budget: '₹22–26 LPA'
  },
  {
    role: 'Data Engineer (PySpark, Snowflake)',
    openings: 2,
    candidates: 14,
    shortlisted: 3,
    status: 'Active',
    location: 'Hyderabad (On-site)',
    budget: '₹20–24 LPA'
  }
];

export function ClientRequirementDashboard() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2 shadow-sm">
              <Layers className="w-3.5 h-3.5" />
              <span>CLIENT REQUIREMENT TELEMETRY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Active Requisitions & Pipeline Status
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Live tracking of open mandates, total candidate submissions, shortlists, and interview stages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-semibold shadow-xs">
              Total Openings: <strong className="text-slate-900">10 Roles</strong>
            </span>
            <span className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold shadow-xs">
              65 Candidates Screened
            </span>
          </div>
        </div>

        {/* Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-4 px-5">Role Designation</th>
                  <th className="py-4 px-4 text-center">Openings</th>
                  <th className="py-4 px-4 text-center">Candidates Matched</th>
                  <th className="py-4 px-4 text-center">Shortlisted</th>
                  <th className="py-4 px-4 text-center">Pipeline Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REQUIREMENTS.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-all">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 text-sm sm:text-base">{req.role}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{req.location} • {req.budget}</div>
                    </td>
                    <td className="py-4 px-4 text-center font-black text-slate-900 text-sm">
                      {req.openings}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        {req.candidates}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-black text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {req.shortlisted}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Interview'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${req.status === 'Interview' ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}`} />
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('client-shortlist-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all shadow-xs"
                      >
                        <span>View Profiles</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
