import { useState, useEffect } from 'react';
import { Briefcase, Users, Calendar, CheckCircle2, TrendingUp, ArrowRight, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';

export function AtsDashboardView({ onNavigateTab }: { onNavigateTab: (tab: string) => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await atsApi.dashboard();
      if (res?.data) setData(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load ATS dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
        <InlineLoading message="Loading recruitment pipeline metrics…" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-3xl border border-red-200 p-6 text-center space-y-3">
        <AlertCircle size={32} className="mx-auto text-red-500" />
        <h4 className="text-base font-extrabold text-slate-900">Dashboard Unavailable</h4>
        <p className="text-xs text-slate-500">{error || 'Could not fetch metrics.'}</p>
        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  const kpis = [
    { label: 'Active Mandates', val: data.activeJobsCount, icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-200', tab: 'ats-jobs' },
    { label: 'Active Pipeline', val: data.activeApplicationsCount, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', tab: 'ats-pipeline' },
    { label: 'Interviews This Week', val: data.interviewsThisWeek, icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-200', tab: 'ats-interviews' },
    { label: 'Offers in Negotiation', val: data.offersCount, icon: TrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-200', tab: 'ats-pipeline' },
    { label: 'Hired & Placed', val: data.hiredCount, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', tab: 'ats-pipeline' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
            NexaTalent ATS Module
          </span>
          <h2 className="text-xl font-extrabold tracking-tight">Recruiter Command Center</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live recruitment pipeline, mandate delivery stages, interview rounds, and candidate sourcing overview.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('ats-pipeline')}
            className="px-4 py-2.5 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <span>Open Kanban Pipeline</span>
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('ats-reports')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <TrendingUp size={14} />
            <span>Reports & Velocity</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('ats-import')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-colors"
          >
            + Bulk Import Resumes
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            onClick={() => onNavigateTab(k.tab)}
            className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm hover:border-[#0265FF]/40 cursor-pointer transition-all hover:shadow group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{k.label}</span>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${k.color}`}>
                <k.icon size={16} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tabular-nums">
              {k.val}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Pipeline Stage Distribution + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Stage Distribution Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Active Pipeline Stages</h3>
              <p className="text-xs text-slate-500 font-medium">Candidate distribution across active recruitment milestones</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('ats-pipeline')}
              className="text-xs font-bold text-[#0265FF] hover:underline flex items-center gap-1"
            >
              View Board <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(data.stageBreakdown || {}).map(([stage, count]: any) => {
              const max = Math.max(...Object.values(data.stageBreakdown || {}).map(Number), 1);
              const pct = Math.round((count / max) * 100);
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{stage}</span>
                    <span className="text-slate-900 tabular-nums">{count} candidates</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-[#0265FF] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Pipeline Activity */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Recent Stage Moves</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time candidate workflow progression</p>
            </div>
            <Clock size={16} className="text-slate-400" />
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {(!data.recentActivity || data.recentActivity.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No recent stage activity logged.</p>
            ) : (
              data.recentActivity.map((act: any) => (
                <div key={act.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 truncate max-w-[170px]">
                      {act.candidateName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {act.timestamp ? new Date(act.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{act.jobTitle}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{act.from || 'New'}</span>
                    <span className="text-slate-400">→</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">{act.to}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
