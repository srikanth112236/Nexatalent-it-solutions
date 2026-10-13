import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, Search, ExternalLink, Filter, ArrowUpRight, Eye, Download } from 'lucide-react';
import { salesApi } from '../../shared/enterprise/phaseApi';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { Modal } from '../../shared/ui/EnterpriseKit';

/** Website-sourced leads (all forms) — form / service / source-page tracking for Sales + Superadmin. */

const STAGES = ['', 'New', 'Contacted', 'Qualified', 'Discovery Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurture'] as const;
const PAGE_SIZE = 200;

function unwrapList(res: unknown): any[] {
  const d = (res as any)?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray((res as any)?.data?.items)) return (res as any).data.items;
  return [];
}

const inr = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export function WebsiteLeadsPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState('');
  const [formF, setFormF] = useState('');
  const [serviceF, setServiceF] = useState('');
  const [industryF, setIndustryF] = useState('');
  const [stageF, setStageF] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [actLoading, setActLoading] = useState(false);
  const [resumeBusy, setResumeBusy] = useState(false);
  const pipelineBase = location.pathname.startsWith('/employee') ? '/employee' : '/superadmin';

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res: any = await salesApi.leads(`?page=1&pageSize=${PAGE_SIZE}`);
        const all = unwrapList(res);
        // Website leads = anything created from the public site (source Website / has formName / sourcePage)
        const web = all.filter((l: any) =>
          l?.source === 'Website' || l?.formName || l?.sourcePage || String(l?.notes || '').includes('enquiry'),
        );
        setRows(web);
      } catch {
        setError('Could not load leads — is the API running?');
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [tick]);

  const forms = useMemo(() => [...new Set(rows.map((r) => r.formName).filter(Boolean))].sort(), [rows]);
  const services = useMemo(() => [...new Set(rows.map((r) => r.service).filter(Boolean))].sort(), [rows]);
  const industries = useMemo(() => [...new Set(rows.map((r) => r.industry).filter(Boolean))].sort(), [rows]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (formF && r.formName !== formF) return false;
      if (serviceF && r.service !== serviceF) return false;
      if (industryF && r.industry !== industryF) return false;
      if (stageF && r.stage !== stageF) return false;
      if (!term) return true;
      return [r.contactName, r.companyName, r.email, r.phone, r.formName, r.service, r.enquiryTopic, r.preferredOffice, r.budgetRange, r.timeline, r.industry, r.sourcePage, r.notes]
        .filter(Boolean)
        .some((v: any) => String(v).toLowerCase().includes(term));
    });
  }, [rows, q, formF, serviceF, industryF, stageF]);

  const kpis = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const thisWeek = rows.filter((r) => new Date(r.createdAt || 0).getTime() > weekAgo).length;
    const byForm = forms.map((f) => [f, rows.filter((r) => r.formName === f).length] as const);
    byForm.sort((a, b) => b[1] - a[1]);
    return { total: rows.length, thisWeek, byForm: byForm.slice(0, 4), newCount: rows.filter((r) => r.stage === 'New').length };
  }, [rows, forms]);

  const moveStage = async (id: string, stage: string) => {
    try {
      await salesApi.setLeadStage(id, stage, undefined);
      setRows((x) => x.map((l) => (l.id === id ? { ...l, stage } : l)));
      setDetail((d: any) => (d && d.id === id ? { ...d, stage } : d));
    } catch (e: any) {
      setError(e?.message || 'Stage update failed.');
    }
  };

  const openDetail = async (l: any) => {
    setDetail(l);
    setActLoading(true);
    setActivities([]);
    try {
      const res: any = await salesApi.activities(l.id);
      const d = res?.data;
      setActivities(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
    } catch {
      setActivities([]);
    } finally {
      setActLoading(false);
    }
  };

  const sel = 'min-h-[36px] rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]';

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Total website leads', String(kpis.total)],
          ['New (unworked)', String(kpis.newCount)],
          ['Last 7 days', String(kpis.thisWeek)],
          ['Top form', kpis.byForm[0] ? `${kpis.byForm[0][0]} (${kpis.byForm[0][1]})` : '—'],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{l}</p>
            <p className="mt-1 text-lg font-black tabular-nums text-slate-900">{v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Filter size={13} aria-hidden /> Filters
          </span>
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search contact, company, form…"
              aria-label="Search website leads"
              className="min-h-[36px] w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]"
            />
          </div>
          <select value={formF} onChange={(e) => setFormF(e.target.value)} aria-label="Filter by form" className={sel}>
            <option value="">All forms</option>
            {forms.map((f) => <option key={f}>{f}</option>)}
          </select>
          <select value={serviceF} onChange={(e) => setServiceF(e.target.value)} aria-label="Filter by service" className={sel}>
            <option value="">All services</option>
            {services.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={industryF} onChange={(e) => setIndustryF(e.target.value)} aria-label="Filter by industry" className={sel}>
            <option value="">All industries</option>
            {industries.map((i) => <option key={i}>{i}</option>)}
          </select>
          <select value={stageF} onChange={(e) => setStageF(e.target.value)} aria-label="Filter by stage" className={sel}>
            {STAGES.map((s) => <option key={s} value={s}>{s || 'All stages'}</option>)}
          </select>
          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
          >
            <RefreshCw size={13} aria-hidden /> Refresh
          </button>
        </div>

        {error && <p className="border-b border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700" role="alert">{error}</p>}

        {loading ? (
          <InlineLoading message="Loading website leads…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No website leads yet" message="Leads submitted from contact, mandate, careers, modal and newsletter forms appear here in real time." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2.5 font-bold">Contact</th>
                  <th className="px-3 py-2.5 font-bold">Company</th>
                  <th className="px-3 py-2.5 font-bold">Form</th>
                  <th className="px-3 py-2.5 font-bold">Service</th>
                  <th className="px-3 py-2.5 font-bold">Industry</th>
                  <th className="px-3 py-2.5 font-bold">Source page</th>
                  <th className="px-3 py-2.5 font-bold">Stage</th>
                  <th className="px-3 py-2.5 font-bold">Value</th>
                  <th className="px-3 py-2.5 font-bold">Received</th>
                  <th className="px-3 py-2.5 font-bold"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    className="cursor-pointer border-b border-slate-50 align-top hover:bg-slate-50/60"
                    onClick={() => openDetail(l)}
                  >
                    <td className="px-3 py-2.5">
                      <p className="font-bold text-slate-900">{l.contactName || '—'}</p>
                      {l.email && (
                        <a href={`mailto:${l.email}`} className="block text-[11px] font-semibold text-[#0265FF] hover:underline">{l.email}</a>
                      )}
                      {l.phone && <p className="text-[11px] text-slate-500">{l.phone}</p>}
                      {l.resumeRef || l.resumeName ? (
                        <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          <Download size={10} aria-hidden /> Resume attached
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-700">{l.companyName || '—'}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded-full bg-[#0265FF]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#0265FF]">
                        {l.formName || 'Website'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-700">{l.service || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-600">{l.industry || '—'}</td>
                    <td className="px-3 py-2.5">
                      {l.sourcePage ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500">
                          {l.sourcePage} <ExternalLink size={10} aria-hidden />
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={l.stage || 'New'}
                        onChange={(e) => moveStage(l.id, e.target.value)}
                        aria-label={`Stage for ${l.contactName || l.id}`}
                        className="min-h-[30px] rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]"
                      >
                        {STAGES.filter(Boolean).map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2.5 font-semibold tabular-nums text-slate-700">{l.value ? inr(l.value) : '—'}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-500">
                      {l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openDetail(l); }}
                        aria-label={`View details for ${l.contactName || l.id}`}
                        className="flex min-h-[30px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-slate-600 hover:border-[#0265FF]/40 hover:text-[#0265FF] focus-visible:outline-2 focus-visible:outline-[#0265FF]"
                      >
                        <Eye size={12} aria-hidden /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <p className="border-t border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-400">
            {filtered.length} of {rows.length} website leads · stage changes sync to the main Leads &amp; Pipeline
          </p>
        )}
      </div>

      {/* ===== LEAD DETAIL DRAWER ===== */}
      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={`${detail?.contactName || 'Lead'} — ${detail?.companyName || ''}`}
        subtitle={`${detail?.id || ''} • ${detail?.formName || 'Website'} • ${detail?.stage || 'New'}`}
        wide
      >
        {detail && (
          <div className="space-y-4">
            {/* actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(`${pipelineBase}/leads?open_lead=${encodeURIComponent(detail.id)}`)}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#0265FF] px-4 text-xs font-bold text-white hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
              >
                Open in Leads &amp; Pipeline <ArrowUpRight size={14} aria-hidden />
              </button>
              <select
                value={detail.stage || 'New'}
                onChange={(e) => moveStage(detail.id, e.target.value)}
                aria-label="Update lead stage"
                className="min-h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]"
              >
                {STAGES.filter(Boolean).map((s) => <option key={s}>{s}</option>)}
              </select>
              {detail.email && (
                <a href={`mailto:${detail.email}`} className="inline-flex min-h-[38px] items-center rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-slate-300">
                  Email
                </a>
              )}
              {detail.phone && (
                <a href={`tel:${detail.phone}`} className="inline-flex min-h-[38px] items-center rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-slate-300">
                  Call
                </a>
              )}
            </div>

            {/* tracking fields */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Form', detail.formName || 'Website'],
                ['Service', detail.service || '—'],
                ['Topic', detail.enquiryTopic || '—'],
                ['Preferred office', detail.preferredOffice || '—'],
                ['Budget', detail.budgetRange || '—'],
                ['Timeline', detail.timeline || '—'],
                ['Industry', detail.industry || '—'],
                ['Enquiry type', detail.enquiryType || '—'],
                ['Source page', detail.sourcePage || '—'],
                ['Source', detail.source || 'Website'],
                ['Owner', detail.owner || 'Unassigned'],
                ['Received', detail.createdAt ? new Date(detail.createdAt).toLocaleString('en-IN') : '—'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{k}</p>
                  <p className="mt-0.5 break-words text-[11.5px] font-bold text-slate-800">{v}</p>
                </div>
              ))}
            </div>

            {/* contact + notes */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Contact</p>
                <p className="mt-1 text-xs font-bold text-slate-800">{detail.contactName || '—'}</p>
                {detail.email && <p className="text-[11px] text-slate-600">{detail.email}</p>}
                {detail.phone && <p className="text-[11px] text-slate-600">{detail.phone}</p>}
                <p className="text-[11px] text-slate-600">{detail.companyName || '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Message / notes</p>
                <p className="mt-1 whitespace-pre-wrap text-[11.5px] leading-relaxed text-slate-700">{detail.notes || detail.hiringNeed || '—'}</p>
              </div>
            </div>

            {/* resume (Careers / candidate applications) */}
            {detail.resumeRef || detail.resumeName ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Attached resume</p>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-800">
                    {detail.resumeName || 'Resume'}
                    {detail.resumeSize ? <span className="font-semibold text-slate-500"> · {(Number(detail.resumeSize) / 1024).toFixed(0)} KB</span> : null}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={resumeBusy}
                  onClick={async () => {
                    setResumeBusy(true);
                    try {
                      const blob: Blob = await salesApi.leadResume(detail.id);
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = detail.resumeName || `resume-${detail.id}`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch {
                      setError('Could not download resume — file may no longer be available.');
                    } finally {
                      setResumeBusy(false);
                    }
                  }}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#0265FF] px-4 text-xs font-bold text-white hover:bg-[#0055db] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
                >
                  <Download size={14} aria-hidden /> {resumeBusy ? 'Preparing…' : 'Download resume'}
                </button>
              </div>
            ) : null}

            {/* activities */}
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Activity log</p>
              {actLoading ? (
                <p className="mt-2 text-[11px] text-slate-400">Loading activities…</p>
              ) : activities.length === 0 ? (
                <p className="mt-2 text-[11.5px] text-slate-500">No activities yet — stage moves and notes logged from the pipeline appear here.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {activities.slice(0, 8).map((a: any) => (
                    <li key={a.id} className="flex items-start justify-between gap-3 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-[11.5px] font-bold text-slate-800">{a.type || 'activity'}{a.outcome ? ` · ${a.outcome}` : ''}</p>
                        {a.notes && <p className="text-[11px] text-slate-600">{a.notes}</p>}
                      </div>
                      <span className="shrink-0 text-[10px] text-slate-400">
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500">
              Full editing, meetings, proposals and conversion live in{' '}
              <button
                type="button"
                onClick={() => navigate(`${pipelineBase}/leads?open_lead=${encodeURIComponent(detail.id)}`)}
                className="font-bold text-[#0265FF] hover:underline"
              >
                Leads &amp; Pipeline
              </button>
              .
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
