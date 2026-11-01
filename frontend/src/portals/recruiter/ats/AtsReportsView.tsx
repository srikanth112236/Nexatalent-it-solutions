import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  Share2,
  Users,
  AlertTriangle,
  RotateCw,
  Zap,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';

export function AtsReportsView({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState<'funnel' | 'qualification' | 'time' | 'sources' | 'workload' | 'reminders'>('funnel');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(true);

  // Report States
  const [funnelData, setFunnelData] = useState<any>(null);
  const [qualificationData, setQualificationData] = useState<any>(null);
  const [timeData, setTimeData] = useState<any>(null);
  const [sourceData, setSourceData] = useState<any>(null);
  const [workloadData, setWorkloadData] = useState<any>(null);
  const [remindersData, setRemindersData] = useState<any>(null);

  // Sweep Action
  const [sweeping, setSweeping] = useState(false);
  const [sweepMsg, setSweepMsg] = useState('');

  const loadAllReports = async () => {
    setLoading(true);
    try {
      const [fRes, qRes, tRes, sRes, wRes, rRes, jRes]: any[] = await Promise.all([
        atsApi.funnelReport(selectedJobId ? `?jobId=${selectedJobId}` : ''),
        atsApi.qualificationReport(selectedJobId ? `?jobId=${selectedJobId}` : ''),
        atsApi.timeToHireReport(),
        atsApi.sourceReport(),
        atsApi.recruiterWorkloadReport(),
        atsApi.recruiterReminders(),
        atsApi.jobs('?pageSize=50'),
      ]);

      setFunnelData(fRes?.data || null);
      setQualificationData(qRes?.data || null);
      setTimeData(tRes?.data || null);
      setSourceData(sRes?.data || null);
      setWorkloadData(wRes?.data || null);
      setRemindersData(rRes?.data || null);
      setJobs(jRes?.data?.items || jRes?.data || []);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllReports();
  }, [selectedJobId]);

  const handleRunSweep = async () => {
    setSweeping(true);
    setSweepMsg('');
    try {
      const res: any = await atsApi.automationSweep();
      const d = res?.data || {};
      setSweepMsg(
        `Automation sweep complete: ${d.remindedInterviewsCount || 0} interviews reminded, ${d.flaggedStaleCount || 0} stale candidates flagged.`
      );
      const rRes: any = await atsApi.recruiterReminders();
      setRemindersData(rRes?.data || null);
    } catch (err: any) {
      alert(`Sweep failed: ${err?.message || err}`);
    } finally {
      setSweeping(false);
    }
  };

  const handleResolveReminder = async (appId: string) => {
    try {
      await atsApi.resolveReminder(appId, 'dismiss');
      const rRes: any = await atsApi.recruiterReminders();
      setRemindersData(rRes?.data || null);
    } catch {
      /* best-effort */
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
        <InlineLoading message="Aggregating recruitment funnel metrics, time-to-hire analytics & reminders…" />
      </div>
    );
  }

  const remindersSummary = remindersData?.summary || { totalStale: 0, totalUpcoming: 0, totalPendingFeedback: 0 };
  const totalReminders = remindersSummary.totalStale + remindersSummary.totalUpcoming + remindersSummary.totalPendingFeedback;

  return (
    <div className="space-y-6">
      {/* Top Banner & Automation Sweep */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0265FF]">
                ATS Phase 5 Engine
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-Time Recruitment Intelligence</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Recruitment Automation, Velocity & Funnel Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Track conversion drop-offs, stage dwell duration, sourcing channel yield, recruiter bandwidth, and follow-up alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={sweeping}
              onClick={handleRunSweep}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Zap size={13} className={sweeping ? 'animate-bounce text-amber-400' : 'text-amber-400'} />
              <span>{sweeping ? 'Running Sweep…' : 'Trigger Automation Sweep'}</span>
            </button>
            <button
              type="button"
              onClick={loadAllReports}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Refresh Metrics"
            >
              <RotateCw size={14} />
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Filter Mandate:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF]"
            >
              <option value="">All Active Mandates (Consolidated)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* Module Navigation Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('funnel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'funnel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={13} className="text-[#0265FF]" />
              <span>Hiring Funnel</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qualification')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'qualification' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>ATS Qualification Gate</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('time')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'time' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={13} className="text-emerald-600" />
              <span>Time-to-Hire</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'sources' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 size={13} className="text-purple-600" />
              <span>Source Yield</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('workload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'workload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={13} className="text-indigo-600" />
              <span>Recruiter Workload</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reminders')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reminders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle size={13} className="text-amber-500" />
              <span>Alerts & Reminders</span>
              {totalReminders > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                  {totalReminders}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {sweepMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{sweepMsg}</span>
        </div>
      )}

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Total Pipeline Volume
          </span>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {funnelData?.totalApplications || 0}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Across active requisitions</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Avg Time-to-Hire
          </span>
          <div className="text-2xl font-black text-emerald-600 tabular-nums flex items-baseline gap-1">
            <span>{timeData?.avgTimeToHireDays || 18}</span>
            <span className="text-xs text-slate-400 font-bold">days</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">vs 24-day market benchmark</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Top Yield Source
          </span>
          <div className="text-base font-black text-purple-700 truncate">
            {sourceData?.topSource || 'Website Careers'}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Highest conversion to hire</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Actionable Alerts
          </span>
          <div className="text-2xl font-black text-amber-600 tabular-nums">
            {totalReminders}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {remindersSummary.totalStale} stale, {remindersSummary.totalUpcoming} interviews
          </span>
        </div>
      </div>

      {/* Module 1: Hiring Funnel Report */}
      {activeTab === 'funnel' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Stage-by-Stage Recruitment Funnel & Drop-Off Analysis
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Conversion velocity and attrition points across each recruitment milestone
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-[#0265FF] text-xs font-bold">
                Overall Efficiency: {funnelData?.overallFunnelEfficiency || 0}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {funnelData?.funnelSteps?.map((step: any, idx: number) => {
              const max = Math.max(...funnelData.funnelSteps.map((s: any) => s.candidatesCount), 1);
              const widthPct = Math.round((step.candidatesCount / max) * 100);

              return (
                <div key={step.stage} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-slate-900 font-extrabold">{step.stage}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {idx > 0 && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Step Conv: <strong className="text-emerald-700">{step.stepConversionPct}%</strong>
                          {step.dropOffPct > 0 && (
                            <span className="text-red-500 ml-1.5 font-bold">(-{step.dropOffPct}% drop)</span>
                          )}
                        </span>
                      )}
                      <span className="text-slate-900 tabular-nums font-black text-sm">
                        {step.candidatesCount} <span className="text-xs text-slate-400 font-medium">candidates</span>
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-[#0265FF] to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(widthPct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Module 1.5: ATS Qualification Intelligence Report */}
      {activeTab === 'qualification' && (
        <div className="space-y-5">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Evaluated Applicants
              </span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {qualificationData?.totalEvaluated || 0}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Scored via 5-Pillar Engine</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Shortlist Qualified
              </span>
              <div className="text-2xl font-black text-emerald-600 tabular-nums">
                {qualificationData?.totalQualified || 0}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Met or exceeded threshold</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Overall Pass Rate
              </span>
              <div className="text-2xl font-black text-[#0265FF] tabular-nums">
                {qualificationData?.overallPassRate || 0}%
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Threshold qualification yield</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Avg ATS Score
              </span>
              <div className="text-2xl font-black text-purple-600 tabular-nums">
                {qualificationData?.overallAvgScore || 0}%
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Mean candidate score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Match Tier Distribution */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">ATS Match Tier Distribution</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Distribution of candidate match strength against target mandate requisitions
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> High Match (&ge; 75%)
                    </span>
                    <span className="font-mono">{qualificationData?.tierDistribution?.high || 0} candidates</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${qualificationData?.totalEvaluated ? ((qualificationData.tierDistribution.high / qualificationData.totalEvaluated) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium Match (50–74%)
                    </span>
                    <span className="font-mono">{qualificationData?.tierDistribution?.medium || 0} candidates</span>
                  </div>
                  <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{
                        width: `${qualificationData?.totalEvaluated ? ((qualificationData.tierDistribution.medium / qualificationData.totalEvaluated) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Low Match (&lt; 50%)
                    </span>
                    <span className="font-mono">{qualificationData?.tierDistribution?.low || 0} candidates</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400 rounded-full transition-all"
                      style={{
                        width: `${qualificationData?.totalEvaluated ? ((qualificationData.tierDistribution.low / qualificationData.totalEvaluated) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Missing Mandatory Skills Bottlenecks */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Mandatory Skill Bottlenecks</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Top required skills most frequently missing among candidate submissions
                </p>
              </div>

              <div className="space-y-2">
                {qualificationData?.topMissingSkills?.length > 0 ? (
                  qualificationData.topMissingSkills.map((m: any) => (
                    <div key={m.skill} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                        {m.skill}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px]">
                        Missing in {m.missingCount} candidates
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    No critical missing skill bottlenecks detected.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mandate Qualification Pass Rate Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Mandate Qualification Pass Rates</h3>
              <p className="text-xs text-slate-500 font-medium">
                Real-time auto-shortlist throughput and candidate qualification yield across all active job positions
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Job Mandate</th>
                    <th className="py-3 px-4">Threshold</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Total Evaluated</th>
                    <th className="py-3 px-4">Qualified Count</th>
                    <th className="py-3 px-4">Pass Rate %</th>
                    <th className="py-3 px-4 text-right">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {qualificationData?.mandateStats?.map((m: any) => (
                    <tr key={m.jobId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{m.jobTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.jobId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-700">{m.threshold}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          m.shortlistMode === 'automatic'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-[#0265FF]'
                        }`}>
                          {m.shortlistMode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{m.totalApplicants}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{m.qualifiedCount}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800 font-mono">{m.passRate}%</span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.passRate}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-purple-700">{m.avgScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Module 2: Time-to-Hire & Velocity Report */}
      {activeTab === 'time' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Stage Dwell Times</h3>
              <p className="text-xs text-slate-500 font-medium">
                Average duration (in days) candidates spend progressing through each stage
              </p>
            </div>

            <div className="space-y-3">
              {timeData?.stageDwellTimes?.map((d: any) => (
                <div key={d.stage} className="p-3 rounded-2xl bg-slate-50 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{d.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#0265FF] font-black">{d.avgDays} days</span>
                      <span className="text-[10px] text-slate-400">(bench: {d.benchmarkDays}d)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (d.avgDays / d.benchmarkDays) * 75)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Mandate Velocity Breakdown</h3>
              <p className="text-xs text-slate-500 font-medium">Time-to-hire turnaround per active requisition</p>
            </div>

            <div className="divide-y divide-slate-100">
              {timeData?.jobBreakdown?.map((jb: any) => (
                <div key={jb.jobId} className="py-3 flex items-center justify-between">
                  <div className="max-w-[240px]">
                    <div className="font-bold text-xs text-slate-900 truncate">{jb.jobTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{jb.jobId}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-xs text-slate-900">{jb.avgDays} days avg</div>
                    <div className="text-[10px] text-emerald-600 font-bold">{jb.hiresCount} hires closed</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module 3: Source Channel Effectiveness */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Candidate Sourcing Channel Effectiveness
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Comparison of applicant volume, interview conversion rate, and final hire yield per channel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sourceData?.sources?.map((s: any) => {
              const isTop = s.channel === sourceData.topSource;
              return (
                <div
                  key={s.channel}
                  className={`p-4 rounded-3xl border transition-all ${
                    isTop ? 'bg-purple-50/40 border-purple-300 shadow-sm' : 'bg-slate-50 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-xs text-slate-900">{s.channel}</span>
                    {isTop && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider">
                        <Flame size={10} /> Top Yield
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60 my-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Applicants</span>
                      <span className="font-black text-slate-900 tabular-nums">{s.totalApplicants}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Hires Closed</span>
                      <span className="font-black text-emerald-600 tabular-nums">{s.hired}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px]">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-500">Interview Rate:</span>
                      <span className="text-slate-800">{s.interviewConversionPct}%</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-500">Hire Yield:</span>
                      <span className="text-purple-700 font-black">{s.conversionYieldPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Module 4: Recruiter Workload Report */}
      {activeTab === 'workload' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Recruiter Workload & Performance Leaderboard
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Mandate distribution, active candidate pipeline load, interviews conducted, and closed placements
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3 text-center">Assigned Mandates</th>
                  <th className="px-4 py-3 text-center">Active Pipeline</th>
                  <th className="px-4 py-3 text-center">Interviews Run</th>
                  <th className="px-4 py-3 text-center">Hires Placed</th>
                  <th className="px-4 py-3 text-center">Avg Turnaround</th>
                  <th className="px-4 py-3 text-right">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {workloadData?.recruiters?.map((rec: any) => (
                  <tr key={rec.email} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{rec.name}</div>
                      <div className="text-[11px] text-slate-400">{rec.email}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800">
                      {rec.assignedJobsCount}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-[#0265FF]">
                      {rec.activeCandidatesCount}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-purple-700">
                      {rec.interviewsScheduled}
                    </td>
                    <td className="px-4 py-3 text-center font-black text-emerald-600">
                      {rec.hiresCompleted}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-slate-600">
                      {rec.avgTurnaroundDays} days
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs">
                        {rec.performanceScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 5: Follow-Up Alerts & Reminders Center */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          {/* Stale Candidate Alerts */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-500" />
                  <span>Stale Candidate Follow-Up Alerts ({remindersData?.staleApplications?.length || 0})</span>
                </h3>
                <p className="text-xs text-slate-500">Candidates with no stage movement for &gt; 3 days</p>
              </div>
            </div>

            {remindersData?.staleApplications?.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No stale candidates! All active applications have recent recruiter actions.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {remindersData?.staleApplications?.map((item: any) => (
                  <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{item.candidateName}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.jobTitle} • Current Stage: <span className="font-bold text-slate-700">{item.stage}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {item.daysInStage} days without action
                      </span>
                      {onNavigateTab && (
                        <button
                          type="button"
                          onClick={() => onNavigateTab('ats-pipeline')}
                          className="px-3 py-1 rounded-lg bg-blue-50 text-[#0265FF] hover:bg-blue-100 font-bold text-xs"
                        >
                          Advance Stage →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleResolveReminder(item.applicationId)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Interview Alerts (<48h) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar size={15} className="text-[#0265FF]" />
                <span>Upcoming Interviews in Next 48 Hours ({remindersData?.upcomingInterviews?.length || 0})</span>
              </h3>
              <p className="text-xs text-slate-500">Automated reminder dispatched to candidate and interviewer</p>
            </div>

            {remindersData?.upcomingInterviews?.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No interviews scheduled in the next 48 hours.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {remindersData?.upcomingInterviews?.map((iv: any) => (
                  <div key={iv.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{iv.candidateName}</div>
                      <div className="text-[11px] text-slate-500">
                        {iv.round} • Scheduled for:{' '}
                        <span className="font-bold text-slate-800">
                          {new Date(iv.scheduledAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          atsApi.remindInterview(iv.id).then(() => alert('Interview reminder sent!'));
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs"
                      >
                        Resend Reminder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Interviews Pending Scorecard Feedback */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Layers size={15} className="text-purple-600" />
                <span>Completed Interviews Awaiting Feedback ({remindersData?.pendingFeedback?.length || 0})</span>
              </h3>
              <p className="text-xs text-slate-500">Interviews past scheduled time without evaluation scorecards</p>
            </div>

            {remindersData?.pendingFeedback?.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                All completed interviews have submitted evaluation scorecards!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {remindersData?.pendingFeedback?.map((pf: any) => (
                  <div key={pf.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{pf.candidateName}</div>
                      <div className="text-[11px] text-slate-500">{pf.round}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 font-bold text-xs">
                        {pf.hoursOverdue}h overdue
                      </span>
                      {onNavigateTab && (
                        <button
                          type="button"
                          onClick={() => onNavigateTab('ats-interviews')}
                          className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1"
                        >
                          Submit Scorecard <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
