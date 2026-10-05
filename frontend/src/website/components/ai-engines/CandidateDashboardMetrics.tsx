import { motion } from 'framer-motion';
import { UserCheck, Sparkles, Briefcase, Send, CheckCircle2, Calendar, Eye, TrendingUp } from 'lucide-react';

export function CandidateDashboardMetrics() {
  const metrics = [
    {
      label: 'Profile Completion',
      value: '87%',
      sub: 'Add certifications to reach 100%',
      icon: UserCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      progress: 87,
    },
    {
      label: 'AI Resume Score',
      value: '82/100',
      sub: 'Top 15% in Bangalore Tech Hub',
      icon: Sparkles,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      progress: 82,
    },
    {
      label: 'Jobs Matching Profile',
      value: '24',
      sub: '14 Immediate joiner mandates',
      icon: Briefcase,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Applications Submitted',
      value: '8',
      sub: 'All sent with verified tags',
      icon: Send,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    },
    {
      label: 'Client Shortlists',
      value: '3',
      sub: 'Tier-1 GCCs reviewing profiles',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      label: 'Interviews Scheduled',
      value: '2',
      sub: 'Next round: Tomorrow 3:00 PM',
      icon: Calendar,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: 'Profile Views (30d)',
      value: '17',
      sub: '+8 views from Fintech recruiters',
      icon: Eye,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    }
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>CANDIDATE INTELLIGENCE HUB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Candidate Performance & Requisition Dashboard
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Real-time telemetry showing your NexaTalent IT Solutions profile health, recruiter views, and interview pipelines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Verified Active Candidate
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`p-5 rounded-2xl bg-white border ${m.border} flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">{m.label}</span>
                    <div className={`p-2 rounded-xl ${m.bg} ${m.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {m.sub}
                  </div>
                </div>

                {m.progress !== undefined && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
