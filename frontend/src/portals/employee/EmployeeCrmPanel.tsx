import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Handshake, RefreshCw, Search, Target, Users } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { usePortalSync } from '../../shared/data/store';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

type Row = Record<string, any>;

const OPEN_REQ = ['Approved', 'Sourcing', 'Pending Approval'];

function chip(tone: 'green' | 'amber' | 'red' | 'slate' | 'blue', text: string) {
  const map = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-[#0B5FD9] border-blue-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  } as const;
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${map[tone]}`}>{text}</span>;
}

export function EmployeeCrmPanel() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'accounts' | 'leads'>('accounts');
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await apiClient.get<any>('/api/v1/crm');
      const body = res?.data ?? res;
      const list: Row[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
      setRows(list);
      setSummary(body?.summary || {});
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not load client accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  usePortalSync(load);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((r) => (view === 'accounts' ? r.kind !== 'lead' : r.kind === 'lead'))
      .filter((r) => !needle || `${r.clientName || ''} ${r.industry || ''} ${r.accountOwner || ''} ${r.id || ''}`.toLowerCase().includes(needle));
  }, [rows, view, q]);

  const accounts = rows.filter((r) => r.kind !== 'lead');
  const leads = rows.filter((r) => r.kind === 'lead');

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Client accounts &amp; sales pipeline</h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Converted clients and the leads that feed them. Scoped to the company you are acting on.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5" role="tablist" aria-label="CRM view">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'accounts'}
              onClick={() => setView('accounts')}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-extrabold transition ${view === 'accounts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Accounts ({accounts.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'leads'}
              onClick={() => setView('leads')}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-extrabold transition ${view === 'leads' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Leads ({leads.length})
            </button>
          </div>
          <button
            type="button"
            onClick={load}
            aria-label="Refresh client accounts"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Accounts', value: summary.accounts ?? accounts.length, icon: <Building2 size={15} />, tone: 'text-[#0B5FD9] bg-blue-50' },
          { label: 'Leads', value: summary.leads ?? leads.length, icon: <Handshake size={15} />, tone: 'text-violet-700 bg-violet-50' },
          { label: 'Open reqs', value: summary.openReqs ?? accounts.reduce((n, a) => n + (Number(a.activeReqs) || 0), 0), icon: <Target size={15} />, tone: 'text-emerald-700 bg-emerald-50' },
          { label: 'Overdue follow-ups', value: summary.overdueFollowUps ?? 0, icon: <Users size={15} />, tone: 'text-amber-800 bg-amber-50' },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{k.label}</span>
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${k.tone}`}>{k.icon}</span>
            </div>
            <div className="mt-1.5 text-2xl font-extrabold text-slate-900">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex-1">
            <span className="sr-only">Search accounts and leads</span>
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by client, industry or owner…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#0B5FD9] focus:bg-white"
            />
          </label>
          <span className="text-[11px] font-bold text-slate-500">{filtered.length} row{filtered.length === 1 ? '' : 's'}</span>
        </div>

        {loading ? (
          <InlineLoading message="Loading accounts…" />
        ) : error ? (
          <div className="p-4 text-xs font-bold text-red-700">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="Nothing here yet" message="Converted accounts and owned leads will appear in this list." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Industry</th>
                  <th className="px-4 py-2.5">Owner</th>
                  <th className="px-4 py-2.5">Open reqs</th>
                  <th className="px-4 py-2.5">Health</th>
                  <th className="px-4 py-2.5"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((r) => {
                  const overdue = r.slaHealth === 'Follow-up overdue';
                  return (
                    <tr key={r.id} className="group hover:bg-slate-50/80">
                      <td className="px-4 py-2.5">
                        <div className="font-extrabold text-slate-900">{r.clientName || '—'}</div>
                        <div className="font-mono text-[10px] text-slate-500">{r.id}</div>
                      </td>
                      <td className="px-4 py-2.5">{r.kind === 'lead' ? chip('blue', r.stage || 'Lead') : chip('green', r.stage || 'Account')}</td>
                      <td className="px-4 py-2.5 text-slate-700">{r.industry || '—'}</td>
                      <td className="px-4 py-2.5 text-slate-700">{r.accountOwner || 'Unassigned'}</td>
                      <td className="px-4 py-2.5 font-mono font-extrabold text-slate-900">{r.activeReqs || 0}</td>
                      <td className="px-4 py-2.5">{overdue ? chip('red', 'Follow-up overdue') : chip('green', r.slaHealth || 'On Track')}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/employee/requisitions?req_org=${encodeURIComponent(r.id)}`)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-extrabold text-slate-700 opacity-0 transition group-hover:opacity-100 focus:opacity-100 hover:bg-white"
                        >
                          Requirements <ChevronRight size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="px-1 text-[10px] font-semibold text-slate-500">
        Open requirements counted from live mandates in {OPEN_REQ.join(' / ')} state.
      </p>
    </div>
  );
}
