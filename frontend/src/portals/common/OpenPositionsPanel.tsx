import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Radio, ExternalLink, RefreshCw, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { jobsApi } from '../../shared/enterprise/phaseApi';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { bulkPublish, unpublishJob, type PublishResult } from './jobPublish';

/**
 * Superadmin → Recruitment → Open Positions.
 * Manage what appears on the public /jobs board: view live positions,
 * search all jobs and add any of them (single or multi-select), or create new.
 */

const ADDABLE_STATUSES = ['Draft', 'Pending Review', 'Approved', 'Paused', 'Closed'];
const BOARD_STATUS_TONE: Record<string, string> = {
  Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Paused: 'bg-amber-50 text-amber-700 border-amber-200',
};

function unwrapList(res: unknown): any[] {
  const d = (res as any)?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  return [];
}

export function OpenPositionsPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const base = location.pathname.startsWith('/employee') ? '/employee' : '/superadmin';
  const [tab, setTab] = useState<'board' | 'add'>('board');
  const [liveJobs, setLiveJobs] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<PublishResult[] | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNote('');
      try {
        const [pubRes, allRes] = await Promise.all([
          jobsApi.list('?page=1&pageSize=200&status=Published'),
          jobsApi.list('?page=1&pageSize=500'),
        ]);
        setLiveJobs(unwrapList(pubRes));
        setAllJobs(unwrapList(allRes));
      } catch {
        setNote('Could not load jobs — is the API running?');
      } finally {
        setLoading(false);
      }
    })();
  }, [tick]);

  const addable = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allJobs.filter((j) => {
      if (j.status === 'Published') return false;
      if (statusF && j.status !== statusF) return false;
      if (!term) return true;
      return `${j.id} ${j.title} ${j.location} ${j.orgId}`.toLowerCase().includes(term);
    });
  }, [allJobs, q, statusF]);

  const expiringSoon = useMemo(() => {
    const in7 = Date.now() + 7 * 86400000;
    return liveJobs.filter((j) => j.expiryDate && new Date(j.expiryDate).getTime() < in7).length;
  }, [liveJobs]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addJobs = async (ids: string[]) => {
    if (!ids.length || busy) return;
    setBusy(true);
    setResults(null);
    const targets = ids
      .map((id) => allJobs.find((j) => j.id === id))
      .filter(Boolean)
      .map((j: any) => ({ id: j.id, status: j.status }));
    const res = await bulkPublish(targets);
    setResults(res);
    setBusy(false);
    setSelected(new Set());
    setTick((t) => t + 1);
  };

  const removeJob = async (id: string) => {
    setBusy(true);
    const res = await unpublishJob(id);
    setResults([res]);
    setBusy(false);
    setTick((t) => t + 1);
  };

  const sel = 'min-h-[36px] rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]';

  return (
    <div className="space-y-4">
      {/* header actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(`${base}/jobs/new`)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#0265FF] px-4 text-xs font-bold text-white hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
        >
          <Plus size={14} aria-hidden /> Create new position
        </button>
        <a
          href="/jobs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:border-slate-300"
        >
          View public board <ExternalLink size={13} aria-hidden />
        </a>
        <button
          type="button"
          onClick={() => setTick((t) => t + 1)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:border-slate-300"
        >
          <RefreshCw size={13} aria-hidden /> Refresh
        </button>
        {/* tabs */}
        <div className="ml-auto flex rounded-lg border border-slate-200 bg-slate-100 p-0.5" role="tablist" aria-label="Open positions views">
          <button role="tab" aria-selected={tab === 'board'} type="button" onClick={() => setTab('board')}
            className={`min-h-[34px] rounded-md px-4 text-xs font-bold ${tab === 'board' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
            On the board ({liveJobs.length})
          </button>
          <button role="tab" aria-selected={tab === 'add'} type="button" onClick={() => setTab('add')}
            className={`min-h-[34px] rounded-md px-4 text-xs font-bold ${tab === 'add' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
            Add positions
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Open on board', String(liveJobs.length)],
          ['Expiring in 7 days', String(expiringSoon)],
          ['Addable jobs', String(addable.length)],
          ['Selected', String(selected.size)],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{l}</p>
            <p className="mt-1 text-lg font-black tabular-nums text-slate-900">{v}</p>
          </div>
        ))}
      </div>

      {note && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800" role="alert">{note}</p>}

      {/* bulk results */}
      {results && (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-bold text-slate-700">Bulk result</p>
          <ul className="mt-2 space-y-1">
            {results.map((r) => (
              <li key={r.id} className={`flex items-start gap-2 text-[11.5px] ${r.ok ? 'text-emerald-700' : 'text-red-700'}`}>
                {r.ok ? <CheckCircle2 size={13} className="mt-0.5 shrink-0" aria-hidden /> : <XCircle size={13} className="mt-0.5 shrink-0" aria-hidden />}
                <span><strong>{r.id}</strong> — {r.message}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setResults(null)} className="mt-2 text-[11px] font-bold text-slate-400 hover:text-slate-600">Dismiss</button>
        </div>
      )}

      {loading ? (
        <InlineLoading message="Loading positions…" />
      ) : tab === 'board' ? (
        /* ===== LIVE ON PUBLIC BOARD ===== */
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-3 py-2.5 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-1.5"><Radio size={13} className="text-emerald-500" aria-hidden /> Live on /jobs — Published jobs visible to candidates</span>
          </div>
          {liveJobs.length === 0 ? (
            <EmptyState title="No open positions yet" message="Use the Add positions tab or create a new position to publish to the public board." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="px-3 py-2.5 font-bold">Title</th>
                    <th className="px-3 py-2.5 font-bold">ID</th>
                    <th className="px-3 py-2.5 font-bold">Org</th>
                    <th className="px-3 py-2.5 font-bold">Location</th>
                    <th className="px-3 py-2.5 font-bold">Applicants</th>
                    <th className="px-3 py-2.5 font-bold">Expiry</th>
                    <th className="px-3 py-2.5 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {liveJobs.map((j) => (
                    <tr key={j.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 font-bold text-slate-900">{j.title}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500">{j.id}</td>
                      <td className="px-3 py-2.5 text-slate-600">{j.orgId || '—'}</td>
                      <td className="px-3 py-2.5 text-slate-600">{j.location || '—'}</td>
                      <td className="px-3 py-2.5 tabular-nums text-slate-700">{j.applicantsCount ?? 0}</td>
                      <td className="px-3 py-2.5 text-slate-600">{j.expiryDate || '—'}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`/jobs/${j.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-h-[30px] items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[11px] font-bold text-slate-600 hover:border-[#0265FF]/40 hover:text-[#0265FF]"
                          >
                            <Eye size={12} aria-hidden /> View
                          </a>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => removeJob(j.id)}
                            className="min-h-[30px] rounded-lg border border-red-200 px-2.5 text-[11px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* ===== ADD FROM ALL JOBS ===== */
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title, ID, org…"
                aria-label="Search all jobs"
                className="min-h-[36px] w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]"
              />
            </div>
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)} aria-label="Filter by status" className={sel}>
              <option value="">All statuses (except Published)</option>
              {ADDABLE_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              type="button"
              disabled={busy || selected.size === 0}
              onClick={() => addJobs([...selected])}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#0265FF] px-4 text-xs font-bold text-white hover:bg-[#0055db] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
            >
              {busy ? 'Adding…' : `Add ${selected.size || ''} to open positions`}
            </button>
          </div>
          {addable.length === 0 ? (
            <EmptyState title="No jobs to add" message="All matching jobs are already on the public board." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        className="h-4 w-4 accent-[#0265FF]"
                        checked={selected.size > 0 && addable.every((j) => selected.has(j.id))}
                        onChange={(e) => setSelected(e.target.checked ? new Set(addable.map((j) => j.id)) : new Set())}
                      />
                    </th>
                    <th className="px-3 py-2.5 font-bold">Title</th>
                    <th className="px-3 py-2.5 font-bold">ID</th>
                    <th className="px-3 py-2.5 font-bold">Status</th>
                    <th className="px-3 py-2.5 font-bold">Org</th>
                    <th className="px-3 py-2.5 font-bold">Location</th>
                    <th className="px-3 py-2.5 font-bold">Requisition</th>
                    <th className="px-3 py-2.5 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {addable.map((j) => (
                    <tr key={j.id} className={`border-b border-slate-50 hover:bg-slate-50/60 ${selected.has(j.id) ? 'bg-[#0265FF]/5' : ''}`}>
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          aria-label={`Select ${j.title}`}
                          className="h-4 w-4 accent-[#0265FF]"
                          checked={selected.has(j.id)}
                          onChange={() => toggle(j.id)}
                        />
                      </td>
                      <td className="px-3 py-2.5 font-bold text-slate-900">{j.title}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500">{j.id}</td>
                      <td className="px-3 py-2.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${BOARD_STATUS_TONE[j.status] || 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                          {j.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{j.orgId || '—'}</td>
                      <td className="px-3 py-2.5 text-slate-600">{j.location || '—'}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500">{j.requisitionId || '—'}</td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => addJobs([j.id])}
                          className="min-h-[30px] rounded-lg border border-[#0265FF]/30 bg-[#0265FF]/5 px-2.5 text-[11px] font-bold text-[#0265FF] hover:bg-[#0265FF] hover:text-white disabled:opacity-50"
                        >
                          Add to board
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="border-t border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-400">
            Publishing walks the legal chain (Draft → Review → Approved → Published). Jobs without an approved requirement with openings will report why they failed.
          </p>
        </div>
      )}
    </div>
  );
}
