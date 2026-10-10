import { useEffect, useState } from 'react';
import { directoryApi } from '../../shared/enterprise/phaseApi';
import { DetailDrawer, KeyValues, StatusPill, downloadCsv } from '../common/CrudKit';
import { InlineLoading } from '../../shared/ui/DataState';

function errMsg(err: unknown): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error)?.message || 'Request failed. Try again.';
}
function TabBar({ tabs, active, onPick }: { tabs: string[]; active: string; onPick: (t: string) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Detail sections">
      {tabs.map((t) => (
        <button key={t} role="tab" aria-selected={t === active} type="button" onClick={() => onPick(t)}
          className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap border ${t === active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
          {t}
        </button>
      ))}
    </div>
  );
}
function Rows({ items, empty, render }: { items: any[]; empty: string; render: (x: any, i: number) => React.ReactNode }) {
  if (items.length === 0) return <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-slate-200">{empty}</div>;
  return <div className="space-y-2">{items.map(render)}</div>;
}
const rowCls = 'p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs';

/* ---------------- Company 360° — spec §6.4, 15 tabs ---------------- */
const COMPANY_TABS = ['Overview', 'Profile', 'Verification', 'Users', 'Branches', 'Requisitions', 'Jobs', 'Applications', 'Interviews', 'Subscription', 'Invoices', 'Payments', 'Commissions', 'Activity', 'Audit Log'];

export function Company360Drawer({ tenantId, onClose, onChanged }: { tenantId: string; onClose: () => void; onChanged?: () => void }) {
  const [tab, setTab] = useState('Overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await directoryApi.tenant360(tenantId);
      setData((res as { data?: any })?.data || res);
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [tenantId]);
  void onChanged;

  return (
    <DetailDrawer title={data?.organization?.displayName || data?.organization?.legalName || tenantId} subtitle={`${tenantId} • Company 360° • spec §6.4`} onClose={onClose} width="max-w-4xl">
      {loading ? <InlineLoading message="Loading company 360°…" /> : error ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-3">
          <span>{error}</span><button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold">Retry</button>
        </div>
      ) : !data ? <div className="text-xs text-slate-500">No data.</div> : (
        <div className="space-y-4">
          <TabBar tabs={COMPANY_TABS} active={tab} onPick={setTab} />
          {tab === 'Overview' && (
            <div className="space-y-3">
              <KeyValues data={[
                ['Legal name', data.organization.legalName || data.organization.name],
                ['Brand', data.organization.displayName || '—'],
                ['Plan / Seats', `${data.organization.plan || '—'} / ${data.organization.seats || '—'}`],
                ['Verification', <StatusPill value={data.organization.verificationStatus || 'Pending'} />],
                ['Account', <StatusPill value={data.organization.accountStatus || data.organization.status} />],
                ['Active jobs', String(data.computed?.activeJobs ?? '—')],
                ['Outstanding', `₹${Number(data.computed?.outstanding || 0).toLocaleString('en-IN')}`],
                ['Commissions due', String(data.computed?.commissionsDue ?? '—')],
              ]} />
              <div className="flex gap-2">
                <button type="button" onClick={() => downloadCsv(`company-${tenantId}-users.csv`, data.users || [], ['id', 'name', 'email', 'role', 'status'])} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export users</button>
                <button type="button" onClick={() => downloadCsv(`company-${tenantId}-invoices.csv`, data.invoices || [], ['id', 'number', 'total', 'balance', 'status'])} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export invoices</button>
              </div>
            </div>
          )}
          {tab === 'Profile' && (
            <KeyValues data={[
              ['Entity type', data.organization.entityType], ['Industry', data.organization.industry], ['Sub-industry', data.organization.subIndustry],
              ['Company size', data.organization.companySize], ['Website', data.organization.website], ['Description', data.organization.description],
              ['Country', data.organization.countryOfIncorporation], ['Reg. number', data.organization.registrationNumber], ['GSTIN', data.organization.gstin],
              ['Tax IDs', data.organization.taxIds], ['Registered address', data.organization.registeredAddress], ['Headquarters', data.organization.headquarters],
              ['Operating locations', data.organization.operatingLocations], ['Contact', `${data.organization.primaryContactName || ''} ${data.organization.primaryContactDesignation || ''}`],
              ['Business email/phone', `${data.organization.businessEmail || ''} ${data.organization.businessPhone || ''}`],
              ['Billing / Finance', `${data.organization.billingContact || ''} ${data.organization.financeEmail || ''}`],
              ['Sales owner', data.organization.salesOwner], ['Account manager', data.organization.accountManager],
            ].map(([k, v]) => [k, (v as React.ReactNode) || '—'] as [string, React.ReactNode])} />
          )}
          {tab === 'Verification' && (
            <KeyValues data={[
              ['Status', <StatusPill value={data.verification?.status || 'Pending'} />],
              ['Verified at', data.verification?.verifiedAt ? String(data.verification.verifiedAt).slice(0, 16).replace('T', ' ') : '—'],
              ['Verified by', data.verification?.verifiedBy || '—'],
              ['Suspension reason', data.organization.suspendReason || '—'],
              ['Closed reason', data.organization.closeReason || '—'],
            ]} />
          )}
          {tab === 'Users' && <Rows items={data.users || []} empty="No users in this organization." render={(u) => (
            <div key={u.id} className={rowCls}><strong>{u.name}</strong> • {u.email} • {u.role} • <StatusPill value={u.status} /></div>
          )} />}
          {tab === 'Branches' && <Rows items={data.branches || []} empty="No branches. Create one from the Branches page." render={(b) => (
            <div key={b.id} className={rowCls}><strong>{b.name}</strong> • {b.city || '—'} • {b.status}</div>
          )} />}
          {tab === 'Requisitions' && <Rows items={data.requisitions || []} empty="No requisitions." render={(r) => (
            <div key={r.id} className={rowCls}><strong>{r.title}</strong> • {r.id} • {r.openings || 1} opening(s) • <StatusPill value={r.status} /></div>
          )} />}
          {tab === 'Jobs' && <Rows items={data.jobs || []} empty="No jobs." render={(j) => (
            <div key={j.id} className={rowCls}><strong>{j.title}</strong> • {j.id} • {j.location || '—'} • <StatusPill value={j.status} /></div>
          )} />}
          {tab === 'Applications' && <Rows items={data.applications || []} empty="No applications." render={(a) => (
            <div key={a.id} className={rowCls}><strong>{a.jobTitle || a.jobId}</strong> • {a.candidateEmail} • <StatusPill value={a.stage} /></div>
          )} />}
          {tab === 'Interviews' && <Rows items={data.interviews || []} empty="No interviews." render={(i: any) => (
            <div key={i.id} className={rowCls}><strong>{i.candidateName || i.candidateEmail}</strong> • {i.round || i.roundName || ''} • {String(i.scheduledAt || i.date || '').slice(0, 16).replace('T', ' ')} • {i.status}</div>
          )} />}
          {tab === 'Subscription' && <Rows items={data.subscriptions || []} empty="No subscriptions." render={(s) => (
            <div key={s.id} className={rowCls}><strong>{s.id}</strong> • {s.planId} (v{s.planVersion}) • <StatusPill value={s.status} /> • renews {String(s.renewalDate || '').slice(0, 10)}</div>
          )} />}
          {tab === 'Invoices' && <Rows items={data.invoices || []} empty="No invoices." render={(i: any) => (
            <div key={i.id} className={rowCls}><strong>{i.number || i.id}</strong> • ₹{i.total} • bal ₹{i.balance} • <StatusPill value={i.status} /></div>
          )} />}
          {tab === 'Payments' && <Rows items={data.payments || []} empty="No payments." render={(p: any) => (
            <div key={p.id} className={rowCls}><strong>{p.id}</strong> • ₹{p.amount} • {p.status} • {String(p.transactionDate || p.createdAt || '').slice(0, 10)}</div>
          )} />}
          {tab === 'Commissions' && <Rows items={data.commissions || []} empty="No commissions." render={(c: any) => (
            <div key={c.id} className={rowCls}><strong>{c.id}</strong> • gross ₹{c.gross} • total ₹{c.total || c.net} • {c.approvalStatus}/{c.paymentStatus}</div>
          )} />}
          {tab === 'Activity' && <Rows items={data.activity || []} empty="No activity." render={(l: any, i: number) => (
            <div key={l.id || i} className={rowCls}><strong>{l.action}</strong> • {l.actor} • <span className="text-slate-500">{String(l.timestamp || '').slice(0, 16).replace('T', ' ')}</span></div>
          )} />}
          {tab === 'Audit Log' && <Rows items={data.activity || []} empty="No audit rows." render={(l: any, i: number) => (
            <div key={l.id || i} className={`${rowCls} font-mono`}>{l.id} • {l.resource}/{l.recordId} • {l.action} • {l.actor} • {l.ipAddress}</div>
          )} />}
        </div>
      )}
    </DetailDrawer>
  );
}

/* ---------------- Candidate 360° — spec §6.3, 12 tabs ---------------- */
const CANDIDATE_TABS = ['Overview', 'Personal', 'Professional', 'Education', 'Experience', 'Skills', 'Documents', 'Applications', 'Interviews', 'Consent', 'Timeline', 'Admin'];

export function Candidate360Drawer({ candidateId, onClose }: { candidateId: string; onClose: () => void }) {
  const [tab, setTab] = useState('Overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await directoryApi.candidate360(candidateId);
      setData((res as { data?: any })?.data || res);
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [candidateId]);

  const p = data?.profile || {};
  const skills = Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || '');

  return (
    <DetailDrawer title={p.name || candidateId} subtitle={`${candidateId} • Candidate 360° • ${p.email || ''}`} onClose={onClose} width="max-w-4xl">
      {loading ? <InlineLoading message="Loading candidate 360°…" /> : error ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-3">
          <span>{error}</span><button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold">Retry</button>
        </div>
      ) : !data ? <div className="text-xs text-slate-500">No data.</div> : (
        <div className="space-y-4">
          <TabBar tabs={CANDIDATE_TABS} active={tab} onPick={setTab} />
          {tab === 'Overview' && (
            <KeyValues data={[
              ['Candidate ID', <span className="font-mono">{candidateId}</span>],
              ['Name / Email', `${p.name || '—'} / ${p.email || '—'}`],
              ['Designation', p.roleTitle || '—'], ['Experience', p.experienceYears ?? '—'], ['Location', p.location || '—'],
              ['Completeness', `${data.completeness ?? '—'}%`], ['Account status', <StatusPill value={p.status || 'Active'} />],
              ['Applications', String((data.applications || []).length)], ['Visibility', p.visibility || 'standard'],
            ]} />
          )}
          {tab === 'Personal' && (
            <KeyValues data={[['Full name', p.name], ['Email', p.email], ['Phone', p.phone], ['Location', p.location], ['Country', p.country], ['Contact prefs', p.contactPrefs]].map(([k, v]) => [k, (v as React.ReactNode) || '—'] as [string, React.ReactNode])} />
          )}
          {tab === 'Professional' && (
            <KeyValues data={[['Headline', p.headline], ['Role', p.roleTitle], ['Experience (yrs)', p.experienceYears], ['Current CTC', p.currentCtc], ['Expected CTC', p.expectedCtc], ['Pay period', p.payPeriod], ['Notice', p.noticePeriod], ['Availability', p.availability], ['Summary', p.summary], ['Objectives', p.objectives]].map(([k, v]) => [k, (v as React.ReactNode) ?? '—'] as [string, React.ReactNode])} />
          )}
          {tab === 'Education' && (
            <Rows items={Array.isArray(p.education) ? p.education : (p.education ? [{ label: String(p.education) }] : [])} empty="No education on file." render={(e: any, i: number) => (
              <div key={i} className={rowCls}>{typeof e === 'string' ? e : `${e.institution || e.label || ''} — ${e.qualification || ''}`}</div>
            )} />
          )}
          {tab === 'Experience' && (
            <Rows items={Array.isArray((p as any).experience) ? (p as any).experience : []} empty="No experience entries on file." render={(e: any, i: number) => (
              <div key={i} className={rowCls}><strong>{e.designation || ''}</strong> @ {e.employer || ''} • {e.startDate || ''} → {e.current ? 'present' : (e.endDate || '')}</div>
            )} />
          )}
          {tab === 'Skills' && (
            <div className="space-y-2">
              <div className={`${rowCls} font-bold`}>{skills || 'No skills listed.'}</div>
              <Rows items={Array.isArray(p.certifications) ? p.certifications : []} empty="No certifications on file." render={(c: any, i: number) => (
                <div key={i} className={rowCls}>{typeof c === 'string' ? c : `${c.name || ''} — ${c.issuer || ''}`}</div>
              )} />
            </div>
          )}
          {tab === 'Documents' && <Rows items={data.documents || []} empty="No documents uploaded." render={(d: any) => (
            <div key={d.id} className={rowCls}><strong>{d.name}</strong> • {d.mime} • v{d.version} • {String(d.uploadedAt || '').slice(0, 10)}</div>
          )} />}
          {tab === 'Applications' && <Rows items={data.applications || []} empty="No applications." render={(a: any) => (
            <div key={a.id} className={rowCls}><strong>{a.jobTitle || a.jobId}</strong> • <StatusPill value={a.stage} /> • {String(a.updatedAt || a.createdAt || '').slice(0, 10)}</div>
          )} />}
          {tab === 'Interviews' && <Rows items={data.interviews || []} empty="No interviews." render={(i: any) => (
            <div key={i.id} className={rowCls}><strong>{i.round || i.roundName || ''}</strong> • {i.jobTitle || ''} • {String(i.scheduledAt || i.date || '').slice(0, 16).replace('T', ' ')} • {i.status}</div>
          )} />}
          {tab === 'Consent' && <Rows items={data.consents || []} empty="No consent records." render={(c: any) => (
            <div key={c.id} className={rowCls}>marketing: <strong>{String(c.marketing)}</strong> • visibility: <strong>{c.visibility || '—'}</strong>{c.withdrawn ? ` • withdrawn ${String(c.withdrawnAt || '').slice(0, 10)}` : ''}</div>
          )} />}
          {tab === 'Timeline' && <Rows items={[...(data.stageHistory || [])].reverse().slice(0, 100)} empty="No timeline events." render={(h: any) => (
            <div key={h.id} className={rowCls}>{h.from} → <strong>{h.to}</strong> • {h.actor} • <span className="text-slate-500">{String(h.createdAt || '').slice(0, 16).replace('T', ' ')}</span></div>
          )} />}
          {tab === 'Admin' && (
            <KeyValues data={[
              ['Status', <StatusPill value={p.status || 'Active'} />],
              ['Status reason', p.statusReason || '—'], ['Status at', p.statusAt ? String(p.statusAt).slice(0, 16).replace('T', ' ') : '—'],
              ['Resume ref', p.resumeRef || '—'], ['Resume version', p.resumeVersion ?? '—'],
              ['Registered', p.createdAt ? String(p.createdAt).slice(0, 10) : '—'], ['Updated', p.updatedAt ? String(p.updatedAt).slice(0, 10) : '—'],
            ]} />
          )}
        </div>
      )}
    </DetailDrawer>
  );
}
