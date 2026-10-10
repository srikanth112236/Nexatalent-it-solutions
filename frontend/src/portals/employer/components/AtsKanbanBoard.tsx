import { useState, useEffect } from 'react';
import { usePortalState, Candidate } from '../../common/PortalStateContext';
import { Eye, ArrowRight, UserCheck } from 'lucide-react';
import { Select } from '../../../shared/ui/EnterpriseKit';
import { RowMenu } from '../../../shared/ui/EnterpriseKit';
import { applicationsApi } from '../../../shared/enterprise/phaseApi';
import { apiClient } from '../../../shared/api-client';
import { EmptyState, InlineLoading } from '../../../shared/ui/DataState';

/** Kanban columns follow the APPLICATION lifecycle (§8.8) — one truth with the ATS list. */
const STAGES = ['Applied', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Offer', 'Hired'] as const;
type Stage = (typeof STAGES)[number];

const STAGE_COLORS: Record<Stage, string> = {
  Applied: 'border-slate-700 bg-slate-900/60 text-slate-300',
  Screening: 'border-blue-900/60 bg-blue-950/20 text-blue-400',
  Shortlisted: 'border-purple-900/60 bg-purple-950/20 text-purple-400',
  'Interview Scheduled': 'border-amber-900/60 bg-amber-950/20 text-amber-400',
  'Interview Completed': 'border-orange-900/60 bg-orange-950/20 text-orange-400',
  Offer: 'border-emerald-900/60 bg-emerald-950/20 text-emerald-400',
  Hired: 'border-emerald-700 bg-emerald-900/30 text-emerald-300',
};

function unwrapList(res: unknown): any[] {
  const d = (res as { data?: unknown })?.data;
  return Array.isArray(d) ? d : [];
}

export function AtsKanbanBoard() {
  const { requisitions, openInspectDrawer } = usePortalState();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('ALL');

  const load = async () => {
    setLoading(true); setError('');
    try { setApps(unwrapList(await applicationsApi.list())); }
    catch (e) { setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load pipeline.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const move = async (id: string, stage: string) => {
    try {
      const updated = ((await applicationsApi.setStage(id, stage)) as { data?: any })?.data;
      setApps((rows) => rows.map((a) => (a.id === id ? updated || { ...a, stage } : a)));
    } catch (e) { setError((e as Error)?.message || 'Move failed.'); }
  };

  const inspect = async (app: any) => {
    // Resolve the authoritative candidate profile for the drawer; fall back
    // to a shell built from the application so Inspect never crashes.
    let profile: any = null;
    try {
      const res = await apiClient.get<any>(`/api/v1/candidate/profile?email=${encodeURIComponent(app.candidateEmail)}`);
      profile = (res as { data?: any })?.data || null;
    } catch { /* shell fallback below */ }
    const cand: Candidate = {
      id: profile?.id || `APP-${app.id}`,
      name: profile?.name || app.candidateName || app.candidateEmail,
      email: app.candidateEmail,
      phone: profile?.phone || '',
      roleTitle: profile?.roleTitle || app.jobTitle || '',
      experienceYears: Number(profile?.experienceYears || 0),
      location: profile?.location || '',
      currentCtc: String(profile?.currentCtc || ''),
      expectedCtc: String(profile?.expectedCtc || ''),
      noticePeriod: profile?.noticePeriod || '',
      skills: Array.isArray(profile?.skills) ? profile.skills : [],
      matchScore: Number(profile?.matchScore || 0),
      stage: 'Applied',
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      submittedBy: app.source || 'Direct',
      sourceType: 'Direct',
      resumeSummary: profile?.summary || '',
      workHistory: [],
    };
    openInspectDrawer(cand);
  };

  const filtered = selectedJobFilter === 'ALL' ? apps : apps.filter((a) => a.jobId === selectedJobFilter);
  const terminal = apps.filter((a) => ['Rejected', 'Withdrawn', 'On Hold', 'Job Closed'].includes(a.stage));

  if (loading) {
    return <div className="p-10"><InlineLoading message="Loading ATS pipeline…" /></div>;
  }
  if (error) {
    return (
      <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900 text-red-300 text-xs font-bold flex items-center justify-between">
        <span>{error}</span>
        <button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold">Retry</button>
      </div>
    );
  }
  if (apps.length === 0) {
    return (
      <div className="p-10 text-center border border-dashed border-slate-700 rounded-2xl bg-[#111726] font-sans text-xs">
        <p className="font-extrabold text-slate-200">No applications in the pipeline</p>
        <p className="text-slate-400 mt-1">Recruiter submissions and candidate applications will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans text-xs">

      {/* Top Filter Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111726] border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-200">Requisition Pipeline Filter:</span>
          <div style={{ minWidth: 260 }}>
            <Select
              dark
              value={selectedJobFilter}
              onChange={setSelectedJobFilter}
              ariaLabel="Filter by requisition"
              options={[{ value: 'ALL', label: `All Requisitions (${apps.length} Applications)` }, ...requisitions.map((r) => ({ value: r.id, label: `${r.id}: ${r.title}` }))]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <UserCheck size={15} className="text-emerald-400" /> Synced with Applications • {terminal.length} closed
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = filtered.filter((a) => a.stage === stage);
          const next = STAGES[STAGES.indexOf(stage) + 1];
          return (
            <div
              key={stage}
              className="bg-[#111726] border border-slate-800 rounded-2xl p-3 flex flex-col min-h-[450px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${STAGE_COLORS[stage]}`}>
                  {stage}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold text-[11px] flex items-center justify-center">
                  {stageApps.length}
                </span>
              </div>

              {/* Application Cards */}
              <div className="space-y-3 flex-1">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-[#090d16] border border-slate-800 hover:border-blue-500/60 transition-all shadow-md group relative space-y-2"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-100 group-hover:text-blue-400 transition-colors text-xs truncate">
                          {app.candidateEmail}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium truncate">{app.jobTitle || app.jobId}</div>
                      </div>
                      <RowMenu label={`Actions for ${app.id}`} items={[
                        ...(next ? [{ label: `Advance to ${next}`, onSelect: () => move(app.id, next).catch(() => {}) }] : []),
                        ...STAGES.filter((s) => s !== stage && s !== next).map((s) => ({ label: `Move to ${s}`, onSelect: () => move(app.id, s).catch(() => {}) })),
                      ]} />
                    </div>

                    {/* Meta */}
                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      <div className="font-mono">{app.id}</div>
                      <div>Source: <strong className="text-blue-400">{app.source || 'Direct'}</strong></div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => inspect(app)}
                        className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} /> Inspect CV
                      </button>

                      {next && (
                        <button
                          onClick={() => move(app.id, next).catch(() => {})}
                          className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer"
                        >
                          Next <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="text-center py-10 text-[11px] text-slate-600 font-medium">
                    No applications in {stage} stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {terminal.length > 0 && (
        <EmptyState title={`${terminal.length} closed applications`} message="Rejected, withdrawn, on-hold and closed applications are tracked in the Application Pipeline tab with full history." />
      )}
    </div>
  );
}
