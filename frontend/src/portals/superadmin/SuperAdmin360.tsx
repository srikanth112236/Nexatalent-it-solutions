import { useEffect, useState } from 'react';
import { directoryApi, jobsApi, workforceApi } from '../../shared/enterprise/phaseApi';
import { DetailDrawer, KeyValues, StatusPill, ExportButton } from '../common/CrudKit';
import { Modal, RowMenu } from '../../shared/ui/EnterpriseKit';
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
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);
  const [branchForm, setBranchForm] = useState({ name: '', city: '' });
  const [invite, setInvite] = useState({ name: '', email: '', role: 'company_admin' });
  const [inviteCreds, setInviteCreds] = useState<{ email: string; password: string } | null>(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await directoryApi.tenant360(tenantId);
      setData((res as { data?: any })?.data || res);
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [tenantId]);
  const act = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true); setError(''); setOk('');
    try { await fn(); await load(); onChanged?.(); setOk(done); }
    catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const genPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#';
    const buf = new Uint32Array(14);
    try { crypto.getRandomValues(buf); } catch { for (let i = 0; i < 14; i++) buf[i] = Math.floor(Math.random() * 4294967296); }
    return Array.from(buf, (n) => chars[n % chars.length]).join('');
  };

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
              {data.organization.logoUrl && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img src={data.organization.logoUrl} alt={`${data.organization.displayName || 'Company'} logo`} className="h-10 w-auto object-contain" />
                  <span className="text-[11px] text-slate-500 font-medium">Company logo</span>
                </div>
              )}
              <KeyValues data={[
                ['Legal name', data.organization.legalName || data.organization.name],
                ['Brand', data.organization.displayName || '—'],
                ['Plan / Seats', `${data.organization.plan || '—'} / ${data.organization.seats || '—'}`],
                ['Subscription', (() => { const s = (data.subscriptions || [])[0]; return s ? `${s.planId} v${s.planVersion} — ${s.status}` : '—'; })()],
                ['Verification', <StatusPill value={data.organization.verificationStatus || 'Pending'} />],
                ['Account', <StatusPill value={data.organization.accountStatus || data.organization.status} />],
                ['Active jobs', String(data.computed?.activeJobs ?? '—')],
                ['Outstanding', `₹${Number(data.computed?.outstanding || 0).toLocaleString('en-IN')}`],
                ['Commissions due', String(data.computed?.commissionsDue ?? '—')],
                ['Registered', data.organization.createdDate || (data.organization.createdAt ? String(data.organization.createdAt).slice(0, 10) : '—')],
              ]} />
              <div className="flex gap-2">
                <ExportButton filename={`company-${tenantId}-users.csv`} rows={data.users || []} columns={['id', 'name', 'email', 'role', 'status']} label="Export users" />
                <ExportButton filename={`company-${tenantId}-invoices.csv`} rows={data.invoices || []} columns={['id', 'number', 'total', 'balance', 'status']} label="Export invoices" />
              </div>
            </div>
          )}
          {tab === 'Profile' && (
            <KeyValues data={[
              ['Entity type', data.organization.entityType], ['Industry', data.organization.industry], ['Sub-industry', data.organization.subIndustry],
              ['Company size', data.organization.companySize], ['Website', data.organization.website], ['Description', data.organization.description],
              ['Country of incorporation', data.organization.countryOfIncorporation], ['Reg. number', data.organization.registrationNumber], ['GSTIN', data.organization.gstin],
              ['Tax IDs', data.organization.taxIds], ['Registered address', data.organization.registeredAddress], ['Headquarters', data.organization.headquarters],
              ['Operating locations', data.organization.operatingLocations], ['Logo URL', data.organization.logoUrl],
              ['Primary contact', `${data.organization.primaryContact || data.organization.primaryContactName || ''}${data.organization.primaryContactDesignation ? ` (${data.organization.primaryContactDesignation})` : ''}`],
              ['Business email/phone', `${data.organization.businessEmail || ''} ${data.organization.businessPhone || ''}`],
              ['Billing contact', data.organization.billingContact], ['Finance email', data.organization.financeEmail],
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
          {tab === 'Users' && (
            <div className="space-y-3">
              {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
              {inviteCreds ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                  <div className="font-extrabold text-emerald-900">Invited. Share this one-time password securely:</div>
                  <code className="block p-2 rounded-lg bg-white border border-emerald-200 font-mono font-bold break-all">{inviteCreds.email} / {inviteCreds.password}</code>
                  <button type="button" onClick={() => setInviteCreds(null)} className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 font-bold text-[11px]">Done</button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder="Full name"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                  <input value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="admin@company.com *" type="email"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                  <button type="button" disabled={busy || !invite.email.trim()}
                    onClick={() => act(async () => {
                      const password = genPassword();
                      await directoryApi.createUser({ name: invite.name.trim() || invite.email.split('@')[0], email: invite.email.trim(), role: invite.role, tenantId, password });
                      setInviteCreds({ email: invite.email.trim(), password });
                      setInvite({ name: '', email: '', role: 'company_admin' });
                    }, 'Administrator invited.')}
                    className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50 shrink-0">Invite admin</button>
                </div>
              )}
              <Rows items={data.users || []} empty="No users in this organization." render={(u) => (
                <div key={u.id} className={rowCls}><strong>{u.name}</strong> • {u.email} • {u.role} • <StatusPill value={u.status} /></div>
              )} />
            </div>
          )}
          {tab === 'Branches' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <input value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} placeholder="Branch name *"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                <input value={branchForm.city} onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })} placeholder="City"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                <button type="button" disabled={busy || !branchForm.name.trim()}
                  onClick={() => act(async () => {
                    await directoryApi.createBranch({ name: branchForm.name.trim(), city: branchForm.city.trim(), orgId: tenantId });
                    setBranchForm({ name: '', city: '' });
                  }, 'Branch added to this organization.')}
                  className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50 shrink-0">Add branch</button>
              </div>
              <Rows items={data.branches || []} empty="No branches yet." render={(b) => (
                <div key={b.id} className={rowCls}><strong>{b.name}</strong> • {b.city || '—'} • {b.status}</div>
              )} />
            </div>
          )}
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
const CANDIDATE_TABS = ['Overview', 'Personal information', 'Professional profile', 'Education', 'Experience', 'Skills and certifications', 'Resume and documents', 'Applications', 'Interviews', 'Consent and privacy', 'Activity timeline', 'Administrative history'];

export function Candidate360Drawer({ candidateId, onClose }: { candidateId: string; onClose: () => void }) {
  const [tab, setTab] = useState('Overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);
  const [infoMsg, setInfoMsg] = useState('');
  const [delReason, setDelReason] = useState('');
  const [decideNote, setDecideNote] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await directoryApi.candidate360(candidateId);
      setData((res as { data?: any })?.data || res);
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [candidateId]);
  const act = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true); setError(''); setOk('');
    try { await fn(); await load(); setOk(done); }
    catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

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
          {tab === 'Personal information' && (
            <KeyValues data={[['Full name', p.name], ['Email', p.email], ['Phone', p.phone], ['Location', p.location], ['Preferred location', p.preferredLocation], ['Country', p.country], ['Contact prefs', p.contactPrefs]].map(([k, v]) => [k, (v as React.ReactNode) || '—'] as [string, React.ReactNode])} />
          )}
          {tab === 'Professional profile' && (
            <KeyValues data={[['Headline', p.headline], ['Role', p.roleTitle], ['Experience (yrs)', p.experienceYears], ['Current CTC', p.currentCtc], ['Expected CTC', p.expectedCtc], ['Pay period', p.payPeriod], ['Notice', p.noticePeriod], ['Availability', p.availability], ['Source', p.source || p.sourceType], ['Assigned recruiter', p.assignedRecruiter || p.submittedBy], ['Summary', p.summary], ['Objectives', p.objectives]].map(([k, v]) => [k, (v as React.ReactNode) ?? '—'] as [string, React.ReactNode])} />
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
          {tab === 'Skills and certifications' && (
            <div className="space-y-2">
              <div className={`${rowCls} font-bold`}>{skills || 'No skills listed.'}</div>
              <Rows items={Array.isArray(p.certifications) ? p.certifications : []} empty="No certifications on file." render={(c: any, i: number) => (
                <div key={i} className={rowCls}>{typeof c === 'string' ? c : `${c.name || ''} — ${c.issuer || ''}`}</div>
              )} />
            </div>
          )}
          {tab === 'Resume and documents' && <Rows items={data.documents || []} empty="No documents uploaded." render={(d: any) => (
            <div key={d.id} className={rowCls}><strong>{d.name}</strong> • {d.mime} • v{d.version} • {String(d.uploadedAt || '').slice(0, 10)}</div>
          )} />}
          {tab === 'Applications' && <Rows items={data.applications || []} empty="No applications." render={(a: any) => (
            <div key={a.id} className={rowCls}><strong>{a.jobTitle || a.jobId}</strong> • <StatusPill value={a.stage} /> • {String(a.updatedAt || a.createdAt || '').slice(0, 10)}</div>
          )} />}
          {tab === 'Interviews' && <Rows items={data.interviews || []} empty="No interviews." render={(i: any) => (
            <div key={i.id} className={rowCls}><strong>{i.round || i.roundName || ''}</strong> • {i.jobTitle || ''} • {String(i.scheduledAt || i.date || '').slice(0, 16).replace('T', ' ')} • {i.status}</div>
          )} />}
          {tab === 'Consent and privacy' && <Rows items={data.consents || []} empty="No consent records." render={(c: any) => (
            <div key={c.id} className={rowCls}>marketing: <strong>{String(c.marketing)}</strong> • visibility: <strong>{c.visibility || '—'}</strong>{c.withdrawn ? ` • withdrawn ${String(c.withdrawnAt || '').slice(0, 10)}` : ''}</div>
          )} />}
          {tab === 'Activity timeline' && <Rows items={[...(data.stageHistory || [])].reverse().slice(0, 100)} empty="No timeline events." render={(h: any) => (
            <div key={h.id} className={rowCls}>{h.from} → <strong>{h.to}</strong> • {h.actor} • <span className="text-slate-500">{String(h.createdAt || '').slice(0, 16).replace('T', ' ')}</span></div>
          )} />}
          {tab === 'Administrative history' && (
            <div className="space-y-4">
              <KeyValues data={[
                ['Status', <StatusPill value={p.status || 'Active'} />],
                ['Status reason', p.statusReason || '—'], ['Status at', p.statusAt ? String(p.statusAt).slice(0, 16).replace('T', ' ') : '—'],
                ['Review / expiry date', p.statusReviewDate || '—'],
                ['Resume ref', p.resumeRef || '—'], ['Resume version', p.resumeVersion ?? '—'],
                ['Registered', p.createdAt ? String(p.createdAt).slice(0, 10) : '—'], ['Updated', p.updatedAt ? String(p.updatedAt).slice(0, 10) : '—'],
              ]} />
              {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
              <div className="text-xs font-extrabold text-slate-900">Information requests ({(data.infoRequests || []).length})</div>
              <Rows items={data.infoRequests || []} empty="No information requested yet." render={(r: any) => (
                <div key={r.id} className={rowCls}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{r.status}</span>
                    <span className="text-slate-500">{String(r.createdAt || '').slice(0, 10)} • by {r.by}</span>
                  </div>
                  <div className="mt-1">{r.message}</div>
                  {r.status === 'Open' && (
                    <button type="button" disabled={busy} onClick={() => act(() => directoryApi.setInfoRequest(candidateId, r.id, 'Responded'), 'Marked responded.')}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Mark responded</button>
                  )}
                </div>
              )} />
              <div className="flex gap-2">
                <input value={infoMsg} onChange={(e) => setInfoMsg(e.target.value)} placeholder="Request payslip, ID proof, …"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                <button type="button" disabled={busy || !infoMsg.trim()}
                  onClick={() => act(() => directoryApi.requestInfo(candidateId, infoMsg.trim()).then(() => setInfoMsg('')), 'Information requested (candidate notified).')}
                  className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">Request info</button>
              </div>
              <div className="text-xs font-extrabold text-slate-900">Privacy deletion requests ({(data.deletionRequests || []).length})</div>
              <Rows items={data.deletionRequests || []} empty="No deletion requests." render={(r: any) => (
                <div key={r.id} className={rowCls}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{r.status}</span>
                    <span className="text-slate-500">{String(r.createdAt || '').slice(0, 10)} • by {r.by}</span>
                  </div>
                  <div className="mt-1 text-slate-600">{r.reason}</div>
                  {r.status === 'Pending' && (
                    <div className="mt-2 flex gap-2">
                      <input value={decideNote} onChange={(e) => setDecideNote(e.target.value)} placeholder="Decision note (optional)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold outline-none" />
                      <button type="button" disabled={busy} onClick={() => act(() => directoryApi.decideDeletion(candidateId, r.id, 'approve', decideNote), 'Approved — PII anonymized, records preserved.')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px]">Approve</button>
                      <button type="button" disabled={busy} onClick={() => act(() => directoryApi.decideDeletion(candidateId, r.id, 'reject', decideNote), 'Request rejected.')}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Reject</button>
                    </div>
                  )}
                  {r.status !== 'Pending' && <div className="mt-1 text-[11px] text-slate-500">Decided by {r.decidedBy || '—'} • {String(r.decidedAt || '').slice(0, 10)}{r.note ? ` • ${r.note}` : ''}</div>}
                </div>
              )} />
              <div className="flex gap-2">
                <input value={delReason} onChange={(e) => setDelReason(e.target.value)} placeholder="Open a deletion request — reason…"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                <button type="button" disabled={busy || !delReason.trim()}
                  onClick={() => act(() => directoryApi.requestDeletion(candidateId, delReason.trim()).then(() => setDelReason('')), 'Deletion request opened.')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">Open request</button>
              </div>
            </div>
          )}
        </div>
      )}
    </DetailDrawer>
  );
}

/* ---------------- Agency 360° — spec §6.5 ---------------- */
const AGENCY_TABS = ['Overview', 'Assignments & Jobs', 'Submissions', 'Agreements & Payouts', 'Audit Log'];
const SUBMISSION_REVIEWS = ['Under Review', 'Shortlisted', 'Selected', 'Rejected'];

export function AgencyDrawer({ agencyId, onClose }: { agencyId: string; onClose: () => void }) {
  const [tab, setTab] = useState('Overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [assignSel, setAssignSel] = useState<Set<string>>(new Set());

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await workforceApi.agency360(agencyId);
      setData((res as { data?: any })?.data || res);
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [agencyId]);
  const nameOf = (a: any) => a?.displayName || a?.legalName || '';
  const openAssign = async () => {
    setShowAssign(true); setJobs([]);
    try {
      const res: any = await jobsApi.list('?page=1&pageSize=100');
      const all = ((res as { data?: any })?.data || []) as any[];
      setJobs(all.filter((j) => j.status === 'Published'));
      const mine = new Set<string>();
      for (const j of all) {
        const listed = [...(j.assignedAgencies || [])].map((x: string) => String(x).toLowerCase());
        const me = nameOf(data?.profile).toLowerCase();
        if (me && listed.some((l) => l.includes(me) || me.includes(l))) mine.add(j.id);
      }
      setAssignSel(mine);
    } catch (e) { setError(errMsg(e)); }
  };
  const saveAssign = async () => {
    setBusy(true); setError(''); setOk('');
    try {
      const me = nameOf(data?.profile);
      for (const j of jobs) {
        const listed = [...(j.assignedAgencies || [])];
        const has = listed.some((l: string) => { const a = String(l).toLowerCase(); const b = me.toLowerCase(); return a.includes(b) || b.includes(a); });
        const want = assignSel.has(j.id);
        if (want && !has) await jobsApi.update(j.id, { assignedAgencies: [...listed, me] });
        else if (!want && has) await jobsApi.update(j.id, { assignedAgencies: listed.filter((l: string) => { const a = String(l).toLowerCase(); const b = me.toLowerCase(); return !(a.includes(b) || b.includes(a)); }) });
      }
      setShowAssign(false); await load(); setOk('Job assignments updated.');
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const reviewSubmission = async (id: string, status: string) => {
    setBusy(true); setError('');
    try {
      const { salesApi } = await import('../../shared/enterprise/phaseApi');
      await salesApi.setSubmission(id, status);
      await load(); setOk(`Submission ${id} → ${status}.`);
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  const p = data?.profile || {};
  return (
    <DetailDrawer title={nameOf(p) || agencyId} subtitle={`${agencyId} • Agency 360° • spec §6.5`} onClose={onClose} width="max-w-4xl">
      {loading ? <InlineLoading message="Loading agency 360°…" /> : error && !data ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-3">
          <span>{error}</span><button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold">Retry</button>
        </div>
      ) : !data ? <div className="text-xs text-slate-500">No data.</div> : (
        <div className="space-y-4">
          <TabBar tabs={AGENCY_TABS} active={tab} onPick={setTab} />
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{error}</div>}
          {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
          {tab === 'Overview' && (
            <KeyValues data={[
              ['Agency ID', <span className="font-mono">{agencyId}</span>],
              ['Legal name', p.legalName], ['Display name', p.displayName], ['Entity type', p.entityType],
              ['Registration number', p.registrationNumber], ['Tax IDs', p.taxIds], ['Country', p.country],
              ['Website', p.website], ['Address', p.address],
              ['Primary contact', `${p.contactName || ''} ${p.contactEmail || ''} ${p.contactPhone || ''}`],
              ['Specialties', p.specialties], ['Locations served', p.locations], ['Recruiters', p.recruiterCount ?? '—'],
              ['Verification', <StatusPill value={p.verificationStatus || 'Pending'} />],
              ['Agreement', p.agreementStatus || '—'], ['Commercial model', p.commercialModel || '—'],
              ['Account', <StatusPill value={p.accountStatus || 'Invited'} />],
              ['Account manager', p.accountManager || '—'], ['Login tenant', <span className="font-mono">{p.tenantId || '—'}</span>],
              ['Active assignments', p.activeAssignments ?? '—'], ['Submissions', p.submissions ?? '—'],
              ['Placements', p.placements ?? '—'], ['Payout due', `₹${Number(p.payoutBalance || 0).toLocaleString('en-IN')}`],
            ].map(([k, v]) => [k, (v as React.ReactNode) || '—'] as [string, React.ReactNode])} />
          )}
          {tab === 'Assignments & Jobs' && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button type="button" onClick={openAssign} className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs">Assign jobs…</button>
              </div>
              <Rows items={data.jobs || []} empty="No jobs assigned. Use Assign jobs to allocate published requisitions." render={(j: any) => (
                <div key={j.id} className={rowCls}><strong>{j.title}</strong> • {j.id} • {j.location || '—'} • <StatusPill value={j.status} /></div>
              )} />
            </div>
          )}
          {tab === 'Submissions' && (
            <Rows items={data.submissions || []} empty="No candidate submissions from this agency." render={(s: any) => (
              <div key={s.id} className={`${rowCls} flex items-center justify-between gap-2`}>
                <div className="min-w-0"><strong>{s.candidateEmail}</strong> → {s.jobId} • <StatusPill value={s.status} />
                  <div className="text-slate-500 text-[11px]">by {s.submittedBy} • {String(s.createdAt || '').slice(0, 10)}</div>
                </div>
                <RowMenu label="Review submission" items={SUBMISSION_REVIEWS.filter((x) => x !== s.status).map((x) => ({ label: `Mark ${x}`, onSelect: () => reviewSubmission(s.id, x) }))} />
              </div>
            )} />
          )}
          {tab === 'Agreements & Payouts' && (
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-900">Commission agreements ({(data.agreements || []).length})</div>
              <Rows items={data.agreements || []} empty="No commission agreements." render={(a: any) => (
                <div key={a.id} className={rowCls}><strong>{a.id}</strong> • {a.feeModel} {a.rate}% • trigger {a.trigger} • {a.status}</div>
              )} />
              <div className="text-xs font-extrabold text-slate-900">Commissions ({(data.commissions || []).length})</div>
              <Rows items={data.commissions || []} empty="No commissions yet." render={(c: any) => (
                <div key={c.id} className={rowCls}><strong>{c.id}</strong> • gross ₹{c.gross} • total ₹{c.total || c.net} • {c.approvalStatus}/{c.paymentStatus}</div>
              )} />
              <div className="text-xs font-extrabold text-slate-900">Payouts ({(data.payouts || []).length})</div>
              <Rows items={data.payouts || []} empty="No payouts yet." render={(x: any) => (
                <div key={x.id} className={rowCls}><strong>{x.id}</strong> • ₹{x.amount} • {x.status}</div>
              )} />
            </div>
          )}
          {tab === 'Audit Log' && (
            <Rows items={data.activity || []} empty="No audit rows for this agency." render={(l: any, i: number) => (
              <div key={l.id || i} className={`${rowCls} font-mono`}>{l.action} • {l.actor} • {String(l.timestamp || '').slice(0, 16).replace('T', ' ')}</div>
            )} />
          )}
        </div>
      )}
      <Modal open={showAssign} onClose={() => setShowAssign(false)} title={`Assign jobs — ${nameOf(data?.profile)}`} subtitle="Only explicitly assigned jobs accept this agency's submissions" wide>
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {jobs.length === 0 && <div className="text-xs text-slate-500">No published jobs available.</div>}
          {jobs.map((j) => (
            <label key={j.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-pointer">
              <input type="checkbox" checked={assignSel.has(j.id)} onChange={() => setAssignSel((s) => { const n = new Set(s); if (n.has(j.id)) n.delete(j.id); else n.add(j.id); return n; })} className="w-4 h-4 accent-[#087BFF]" />
              <span className="min-w-0"><strong>{j.title}</strong> • <span className="font-mono text-slate-500">{j.id}</span> • {j.location || '—'}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <button type="button" onClick={() => setShowAssign(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
          <button type="button" disabled={busy} onClick={saveAssign} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Saving…' : `Save (${assignSel.size} assigned)`}</button>
        </div>
      </Modal>
    </DetailDrawer>
  );
}
