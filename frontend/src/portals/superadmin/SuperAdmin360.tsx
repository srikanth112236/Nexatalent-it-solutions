import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { directoryApi, jobsApi, workforceApi } from '../../shared/enterprise/phaseApi';
import { DetailDrawer, KeyValues, StatusPill, ExportButton, DrawerCard, DrawerList } from '../common/CrudKit';
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

/* ---------------- Company 360° — spec §6.4, 15 tabs ---------------- */
const COMPANY_TABS = ['Overview', 'Profile', 'Verification', 'Users', 'Branches', 'Requisitions', 'Jobs', 'Applications', 'Interviews', 'Subscription', 'Invoices', 'Payments', 'Commissions', 'Activity', 'Audit Log'];

export function Company360Drawer({ tenantId, onClose, onChanged }: { tenantId: string; onClose: () => void; onChanged?: () => void }) {
  const navigate = useNavigate();
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
                    className="px-4 py-2 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs disabled:opacity-50 shrink-0">Invite admin</button>
                </div>
              )}
              <DrawerList items={data.users || []} empty="No users in this organization." label="Organization users"
                render={(u) => (
                  <DrawerCard key={u.id} status={u.status} title={u.name || u.email}
                    meta={<>{u.email} • <span className="font-mono">{u.role}</span></>}
                    right={<StatusPill value={u.status} />} />
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
                  className="px-4 py-2 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs disabled:opacity-50 shrink-0">Add branch</button>
              </div>
              <DrawerList items={data.branches || []} empty="No branches yet." label="Branches"
                render={(b) => (
                  <DrawerCard key={b.id} status={b.status} title={b.name}
                    meta={<>{b.city || '—'} • <span className="font-mono">{b.id}</span></>}
                    right={<StatusPill value={b.status || 'Active'} />} />
                )} />
            </div>
          )}
          {tab === 'Requisitions' && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <button type="button" onClick={() => { onClose(); navigate(`/superadmin/requisitions/new?orgId=${encodeURIComponent(tenantId)}`); }}
                  className="px-4 py-2 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs">+ Create requirement for this company</button>
              </div>
              <DrawerList items={data.requisitions || []} empty="No requisitions." label="Requisitions"
                render={(r) => (
                  <DrawerCard key={r.id} status={r.status} title={r.title || r.id}
                    meta={<>{r.id} • {r.openings || 1} opening(s)</>}
                    right={<StatusPill value={r.status} />} />
                )} />
            </div>
          )}
          {tab === 'Jobs' && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <button type="button" onClick={() => { onClose(); navigate(`/superadmin/jobs/new?orgId=${encodeURIComponent(tenantId)}`); }}
                  className="px-4 py-2 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs">+ Create job for this company</button>
              </div>
              <DrawerList items={data.jobs || []} empty="No jobs." label="Jobs"
                render={(j) => (
                  <DrawerCard key={j.id} status={j.status} title={j.title || j.id}
                    meta={<>{j.id} • {j.location || '—'}</>}
                    right={<StatusPill value={j.status} />} />
                )} />
            </div>
          )}
          {tab === 'Applications' && <DrawerList items={data.applications || []} empty="No applications." label="Applications"
            render={(a) => (
              <DrawerCard key={a.id} status={a.stage} title={a.jobTitle || a.jobId}
                meta={a.candidateEmail}
                right={<StatusPill value={a.stage} />} />
            )} />}
          {tab === 'Interviews' && <DrawerList items={data.interviews || []} empty="No interviews." label="Interviews"
            render={(i: any) => (
              <DrawerCard key={i.id} status={i.status} title={i.candidateName || i.candidateEmail}
                meta={<>{i.round || i.roundName || ''} • {String(i.scheduledAt || i.date || '').slice(0, 16).replace('T', ' ')}</>}
                right={<StatusPill value={i.status} />} />
            )} />}
          {tab === 'Invoices' && <DrawerList items={data.invoices || []} empty="No invoices." label="Invoices"
            render={(i: any) => (
              <DrawerCard key={i.id} status={i.status} title={i.number || i.id}
                meta={<>₹{i.total} • bal ₹{i.balance}</>}
                right={<StatusPill value={i.status} />} />
            )} />}
          {tab === 'Payments' && <DrawerList items={data.payments || []} empty="No payments." label="Payments"
            render={(p: any) => (
              <DrawerCard key={p.id} status={p.status} title={`${p.id} • ₹${p.amount}`}
                meta={String(p.transactionDate || p.createdAt || '').slice(0, 10)}
                right={<StatusPill value={p.status} />} />
            )} />}
          {tab === 'Commissions' && <DrawerList items={data.commissions || []} empty="No commissions." label="Commissions"
            render={(c: any) => (
              <DrawerCard key={c.id} status={c.approvalStatus} title={`${c.id} • gross ₹${c.gross}`}
                meta={<>total ₹{c.total || c.net} • {c.approvalStatus}/{c.paymentStatus}</>}
                right={<StatusPill value={c.approvalStatus} />} />
            )} />}
          {tab === 'Activity' && <DrawerList items={data.activity || []} empty="No activity." label="Activity"
            render={(l: any, i: number) => (
              <DrawerCard key={l.id || i} status={l.status} title={l.action}
                meta={<>{l.actor} • <span className="font-mono">{String(l.timestamp || '').slice(0, 16).replace('T', ' ')}</span></>} />
            )} />}
          {tab === 'Audit Log' && <DrawerList items={data.activity || []} empty="No audit rows." label="Audit log"
            render={(l: any, i: number) => (
              <DrawerCard key={l.id || i} title={`${l.resource || ''}/${l.recordId || ''} • ${l.action}`}
                meta={<span className="font-mono">{l.actor} • {l.ipAddress || ''}</span>} mono />
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
  const skillList: string[] = Array.isArray(p.skills) ? p.skills : String(p.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const skillsDetail: any[] = data?.skillsDetail?.length ? data.skillsDetail : skillList.map((s) => ({ skill: s, level: 'Intermediate' }));
  const eduRows: any[] = data?.education?.length ? data.education : [];
  const expRows: any[] = data?.experience?.length ? data.experience : (Array.isArray(p.experienceList) ? p.experienceList : []);
  const certRows: any[] = data?.certifications?.length ? data.certifications : (Array.isArray(p.certificationsList) ? p.certificationsList : []);
  const inr = (n: unknown) => (n === null || n === undefined || n === '' ? '—' : `₹${Number(n).toLocaleString('en-IN')}`);
  const initials = String(p.name || candidateId).split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const apps: any[] = data?.applications || [];
  const interviews: any[] = data?.interviews || [];
  const stageCounts: Record<string, number> = apps.reduce((m: Record<string, number>, a: any) => { m[a.stage || 'Unknown'] = (m[a.stage || 'Unknown'] || 0) + 1; return m; }, {});
  const Section = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
    <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <header className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/60">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">{title}</h4>
        {action}
      </header>
      <div className="p-4 space-y-3">{children}</div>
    </section>
  );
  const Empty = ({ title, hint }: { title: string; hint: string }) => (
    <div className="text-center py-8 px-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
      <div className="mx-auto w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-extrabold">○</div>
      <div className="mt-2 text-[13px] font-extrabold text-slate-900">{title}</div>
      <div className="mt-0.5 text-[11px] text-slate-500 font-medium max-w-md mx-auto">{hint}</div>
    </div>
  );
  const Fact = ({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) => (
    <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</div><div className={`font-bold text-slate-900 text-[13px] mt-0.5 ${mono ? 'font-mono text-xs' : ''}`}>{v || '—'}</div></div>
  );

  return (
    <DetailDrawer title={p.name || candidateId} subtitle={`${candidateId} • ${p.email || ''} • Candidate 360°`} onClose={onClose} width="max-w-4xl">
      {loading ? <InlineLoading message="Loading candidate 360°…" /> : error ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-3">
          <span>{error}</span><button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold">Retry</button>
        </div>
      ) : !data ? <div className="text-xs text-slate-500">No data.</div> : (
        <div className="space-y-4">
          <TabBar tabs={CANDIDATE_TABS} active={tab} onPick={setTab} />
          {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
          {/* KPI strip — funnel snapshot on every tab */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="px-3.5 py-3 rounded-2xl bg-slate-900 text-white"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applications</div><div className="text-lg font-extrabold mt-0.5">{apps.length}</div></div>
            <div className="px-3.5 py-3 rounded-2xl bg-slate-900 text-white"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interviews</div><div className="text-lg font-extrabold mt-0.5">{interviews.length}</div></div>
            <div className="px-3.5 py-3 rounded-2xl bg-slate-900 text-white"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offers / Placements</div><div className="text-lg font-extrabold mt-0.5">{(data?.offers || []).length} / {(data?.placements || []).length}</div></div>
            <div className="px-3.5 py-3 rounded-2xl bg-emerald-600 text-white"><div className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Profile complete</div><div className="text-lg font-extrabold mt-0.5">{data.completeness ?? 0}%</div></div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill value={p.status || 'Active'} />
            {p.stage ? <StatusPill value={p.stage} /> : null}
            <span className="text-[11px] font-semibold text-slate-500">Visibility: <strong className="text-slate-800">{p.visibility || 'standard'}</strong></span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">{candidateId}</span>
          </div>
          {tab === 'Overview' && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-lg font-extrabold shrink-0">{initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-extrabold truncate">{p.name || candidateId}</div>
                  <div className="text-[12px] text-slate-300 font-medium truncate">{p.headline || p.roleTitle || ''}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">{p.roleTitle || ''}{p.experienceYears != null ? ` • ${p.experienceYears}y` : ''} • {p.location || ''} • match {p.matchScore ?? '—'}/100</div>
                </div>
                <div className="text-right shrink-0"><div className="text-[10px] font-bold uppercase text-slate-400">Notice</div><div className="text-[13px] font-extrabold">{p.noticePeriod || '—'}</div></div>
              </div>
              <Section title="Key facts">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                  <Fact k="Email" v={p.email} /><Fact k="Phone" v={p.phone} mono /><Fact k="Location" v={p.location} />
                  <Fact k="Preferred" v={p.preferredLocation} /><Fact k="Compensation" v={`${inr(p.currentCtc)} → ${inr(p.expectedCtc)}`} /><Fact k="Source" v={`${p.source || p.sourceType || 'direct'} • ${p.assignedRecruiter || p.submittedBy || 'self'}`} />
                </div>
              </Section>
              <Section title="Funnel snapshot" action={<span className="text-[11px] font-bold text-slate-500">{apps.length} applications</span>}>
                {apps.length === 0 ? <Empty title="No applications yet" hint="Applications, interviews and offers for this candidate will summarize here." /> : (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(stageCounts).map(([st, n]) => (
                      <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700"><StatusPill value={st} /> × {String(n)}</span>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          )}
          {tab === 'Personal information' && (
            <div className="space-y-3">
              <Section title="Contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <Fact k="Full name" v={p.name} /><Fact k="Email" v={p.email} mono />
                  <Fact k="Phone" v={p.phone} mono /><Fact k="Country" v={p.country || 'India'} />
                  <div className="sm:col-span-2"><Fact k="Location" v={p.location} /></div>
                  <div className="sm:col-span-2"><Fact k="Preferred location" v={p.preferredLocation} /></div>
                </div>
              </Section>
              <Section title="Preferences & identity">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="sm:col-span-2"><Fact k="Contact preferences" v={p.contactPrefs} /></div>
                  <Fact k="Candidate ID" v={candidateId} mono /><Fact k="Visibility" v={p.visibility || 'standard'} />
                  <Fact k="Registered" v={p.createdAt ? String(p.createdAt).slice(0, 10) : '—'} mono /><Fact k="Updated" v={p.updatedAt ? String(p.updatedAt).slice(0, 10) : '—'} mono />
                </div>
              </Section>
            </div>
          )}
          {tab === 'Professional profile' && (
            <div className="space-y-3">
              <Section title="Role & compensation">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                  <div className="col-span-2"><Fact k="Headline" v={p.headline} /></div>
                  <Fact k="Experience" v={p.experienceYears != null ? `${p.experienceYears} yrs` : '—'} />
                  <Fact k="Current CTC" v={inr(p.currentCtc)} /><Fact k="Expected CTC" v={inr(p.expectedCtc)} /><Fact k="Pay period" v={p.payPeriod || 'annual'} />
                  <Fact k="Notice period" v={p.noticePeriod} /><Fact k="Availability" v={p.availability} /><Fact k="Match score" v={p.matchScore != null ? `${p.matchScore}/100` : '—'} />
                </div>
              </Section>
              <Section title="Sourcing">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <Fact k="Source" v={p.source || p.sourceType || 'direct'} /><Fact k="Recruiter / submitted by" v={p.assignedRecruiter || p.submittedBy || 'self-apply'} mono />
                </div>
              </Section>
              <Section title="Summary & objectives">
                <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Summary</div><p className="text-[13px] font-medium text-slate-800 leading-5 mt-1">{p.summary || '—'}</p></div>
                <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Objectives</div><p className="text-[13px] font-medium text-slate-800 leading-5 mt-1">{p.objectives || '—'}</p></div>
              </Section>
            </div>
          )}
          {tab === 'Education' && (
            <div className="space-y-3">
              {eduRows.length === 0 ? <Empty title="No education on file" hint={p.education ? '' : 'Verified degrees will appear here.'} /> : null}
              {p.education && eduRows.length === 0 ? (
                <Section title="Summary"><p className="text-[13px] font-semibold text-slate-800">{p.education}</p></Section>
              ) : null}
              {eduRows.length > 0 && (
                <DrawerList items={eduRows} empty="" label={`Education (${eduRows.length})`}
                  render={(e: any, i: number) => (
                    <DrawerCard key={e.id || i} status="Active" title={e.institution || e.label || 'Education'}
                      meta={<>{e.qualification || ''}{e.field ? ` • ${e.field}` : ''}{e.year ? ` • ${e.year}` : ''}{e.score ? ` • ${e.score}` : ''}</>}
                      right={e.year ? <span className="text-[11px] font-mono font-bold text-slate-500">{e.year}</span> : undefined} />
                  )} />
              )}
            </div>
          )}
          {tab === 'Experience' && (
            <div className="space-y-3">
              {expRows.length === 0 ? <Empty title="No experience entries" hint="Verified employment history will appear here as a timeline." /> : (
                <Section title={`Experience (${expRows.length}) • ${p.experienceYears ?? 0}y total`}>
                  <ol className="relative ml-1.5 border-l-2 border-slate-100 space-y-3">
                    {expRows.map((e: any, i: number) => (
                      <li key={e.id || i} className="ml-4 relative">
                        <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-slate-100 ${e.current ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div className="text-[13px] font-extrabold text-slate-900">{e.designation || '—'} <span className="font-semibold text-slate-500">@ {e.employer || '—'}</span></div>
                        <div className="text-[11px] text-slate-500 font-medium font-mono">{e.startDate || ''} → {e.current ? 'present' : (e.endDate || '')}{e.years ? ` • ${e.years}y` : ''}</div>
                        {e.current ? <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">CURRENT</span> : null}
                      </li>
                    ))}
                  </ol>
                </Section>
              )}
            </div>
          )}
          {tab === 'Skills and certifications' && (
            <div className="space-y-3">
              <Section title={`Skills (${skillsDetail.length})`}>
                {skillsDetail.length === 0 ? <Empty title="No skills listed" hint="Parsed resume skills will appear here with proficiency levels." /> : (
                  <div className="flex flex-wrap gap-1.5">
                    {skillsDetail.map((s: any, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-bold text-[11px]">{s.skill || s}<span className="font-semibold text-blue-500">• {s.level || 'Intermediate'}</span></span>
                    ))}
                  </div>
                )}
              </Section>
              <Section title={`Certifications (${certRows.length})`}>
                <DrawerList items={certRows} empty="No certifications on file."
                  render={(c: any, i: number) => (
                    <DrawerCard key={c.id || i} status="Active" title={typeof c === 'string' ? c : (c.name || 'Certificate')}
                      meta={typeof c === 'string' ? undefined : <>{c.issuer || ''}{c.year ? ` • ${c.year}` : ''}</>}
                      right={c.year ? <span className="text-[11px] font-mono font-bold text-slate-500">{c.year}</span> : undefined} />
                  )} />
              </Section>
            </div>
          )}
          {tab === 'Resume and documents' && (
            <div className="space-y-3">
              {(data.documents || []).length === 0 ? <Empty title="No documents uploaded" hint="Resumes and ID proofs land here with version history." /> : (
                <DrawerList items={data.documents || []} empty="" label={`Documents (${(data.documents || []).length})`}
                  render={(d: any) => (
                    <DrawerCard key={d.id} status="Active" title={d.name || d.ref}
                      meta={<><span className="font-semibold">{d.kind || d.mime}</span> • v{d.version ?? 1} • {String(d.uploadedAt || d.createdAt || '').slice(0, 10)} • <span className="font-mono">{d.ref || ''}</span></>}
                      right={<span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[10px] uppercase">{String(d.kind || 'file')}</span>} />
                  )} />
              )}
            </div>
          )}
          {tab === 'Applications' && (
            <div className="space-y-3">
              {apps.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(stageCounts).map(([st, n]) => (
                    <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700"><StatusPill value={st} /> × {String(n)}</span>
                  ))}
                </div>
              )}
              {apps.length === 0 ? <Empty title="No applications" hint="Every job application by this candidate will appear here with live stage." /> : (
                <DrawerList items={apps} empty="" label={`Applications (${apps.length})`}
                  render={(a: any) => (
                    <DrawerCard key={a.id} status={a.stage} title={a.jobTitle || a.jobId}
                      meta={<><span className="font-mono">{a.jobId}</span> • {a.orgId || ''} • {String(a.updatedAt || a.createdAt || '').slice(0, 10)}{a.source ? ` • ${a.source}` : ''}</>}
                      right={<StatusPill value={a.stage} />} />
                  )} />
              )}
            </div>
          )}
          {tab === 'Interviews' && (
            <div className="space-y-3">
              {interviews.length === 0 ? <Empty title="No interviews" hint="Scheduled rounds, feedback and outcomes will appear here." /> : (
                <DrawerList items={interviews} empty="" label={`Interviews (${interviews.length})`}
                  render={(x: any) => (
                    <DrawerCard key={x.id} status={x.status} title={x.round || x.roundName || 'Interview'}
                      meta={<>{x.candidateName || ''} • {x.jobTitle || x.jobId || ''} • <span className="font-mono">{String(x.scheduledAt || x.date || '').slice(0, 16).replace('T', ' ')}</span>{x.mode ? ` • ${x.mode}` : ''}{x.timezone ? ` (${x.timezone})` : ''}</>}
                      right={<StatusPill value={x.status} />} />
                  )} />
              )}
            </div>
          )}
          {tab === 'Consent and privacy' && (
            <div className="space-y-3">
              {(data.consents || []).length === 0 ? <Empty title="No consent records" hint="Placement, marketing and visibility consents are recorded here." /> : (
                <DrawerList items={data.consents || []} empty="" label={`Consents (${(data.consents || []).length})`}
                  render={(c: any) => (
                    <DrawerCard key={c.id} status={c.withdrawn ? 'Withdrawn' : 'Active'}
                      title={`${c.purpose || 'processing'} • marketing ${c.marketing ? 'on' : 'off'}`}
                      meta={<>{c.visibility ? `visibility: ${c.visibility} • ` : ''}{c.withdrawn ? `withdrawn ${String(c.withdrawnAt || '').slice(0, 10)}` : `consent active since ${String(c.createdAt || '').slice(0, 10)}`}</>}
                      right={<StatusPill value={c.withdrawn ? 'Withdrawn' : 'Active'} />} />
                  )} />
              )}
            </div>
          )}
          {tab === 'Activity timeline' && (
            <div className="space-y-3">
              {(data.stageHistory || []).length === 0 ? <Empty title="No timeline events" hint="Stage moves across every application stream here, newest first." /> : (
                <Section title={`Pipeline movement (${(data.stageHistory || []).length})`}>
                  <ol className="relative ml-1.5 border-l-2 border-slate-100 space-y-3">
                    {(data.stageHistory || []).slice(0, 100).map((h: any) => (
                      <li key={h.id} className="ml-4 relative">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-100" />
                        <div className="font-bold text-[13px] text-slate-900">{h.from} → {h.to}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{h.actor} • <span className="font-mono">{String(h.createdAt || '').slice(0, 16).replace('T', ' ')}</span> • <span className="font-mono">{h.applicationId}</span></div>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}
            </div>
          )}
          {tab === 'Administrative history' && (
            <div className="space-y-3">
              <Section title="Account standing">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</div><div className="mt-1"><StatusPill value={p.status || 'Active'} /></div></div>
                  <Fact k="Status reason" v={p.statusReason || '—'} /><Fact k="Status at" v={p.statusAt ? String(p.statusAt).slice(0, 16).replace('T', ' ') : '—'} mono />
                  <Fact k="Review / expiry" v={p.statusReviewDate || '—'} mono /><Fact k="Resume ref" v={p.resumeRef || '—'} mono /><Fact k="Resume version" v={p.resumeVersion != null ? `v${p.resumeVersion}` : '—'} />
                </div>
              </Section>
              <Section title={`Information requests (${(data.infoRequests || []).length})`}>
                <DrawerList items={data.infoRequests || []} empty="No information requested yet."
                  render={(r: any) => (
                    <DrawerCard key={r.id} status={r.status} title={r.message ? String(r.message).slice(0, 80) : r.status}
                      meta={<><span className="font-mono">{String(r.createdAt || '').slice(0, 10)}</span> • by {r.by || r.requester || '—'}{r.status ? ` • ${r.status}` : ''}</>}
                      right={<StatusPill value={r.status} />}>
                      {r.status === 'Open' && (
                        <button type="button" disabled={busy} onClick={() => act(() => directoryApi.setInfoRequest(candidateId, r.id, 'Responded'), 'Marked responded.')}
                          className="mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">Mark responded</button>
                      )}
                    </DrawerCard>
                  )} />
                <div className="flex gap-2">
                  <input value={infoMsg} onChange={(e) => setInfoMsg(e.target.value)} placeholder="Request payslip, ID proof, …"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500" />
                  <button type="button" disabled={busy || !infoMsg.trim()}
                    onClick={() => act(() => directoryApi.requestInfo(candidateId, infoMsg.trim()).then(() => setInfoMsg('')), 'Information requested (candidate notified).')}
                    className="px-4 py-2 rounded-xl bg-[#0B5FD9] hover:bg-blue-600 text-white font-bold text-xs disabled:opacity-50">Request info</button>
                </div>
              </Section>
              <Section title={`Privacy deletion requests (${(data.deletionRequests || []).length})`}>
                <DrawerList items={data.deletionRequests || []} empty="No deletion requests."
                  render={(r: any) => (
                    <DrawerCard key={r.id} status={r.status} title={`${r.type || 'deletion'} • ${r.status}`}
                      meta={<><span className="font-mono">{String(r.createdAt || '').slice(0, 10)}</span> • by {r.by || '—'}{r.reason ? ` • ${r.reason}` : ''}</>}
                      right={<StatusPill value={r.status} />}>
                      {r.status === 'Pending' && (
                        <div className="flex gap-2">
                          <input value={decideNote} onChange={(e) => setDecideNote(e.target.value)} placeholder="Decision note (optional)"
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold outline-none" />
                          <button type="button" disabled={busy} onClick={() => act(() => directoryApi.decideDeletion(candidateId, r.id, 'approve', decideNote), 'Approved — PII anonymized, records preserved.')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px]">Approve</button>
                          <button type="button" disabled={busy} onClick={() => act(() => directoryApi.decideDeletion(candidateId, r.id, 'reject', decideNote), 'Request rejected.')}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Reject</button>
                        </div>
                      )}
                      {r.status !== 'Pending' && <div className="text-[11px] text-slate-500 font-medium">Decided by {r.decidedBy || '—'} • {String(r.decidedAt || '').slice(0, 10)}{r.note ? ` • ${r.note}` : ''}</div>}
                    </DrawerCard>
                  )} />
                <div className="flex gap-2">
                  <input value={delReason} onChange={(e) => setDelReason(e.target.value)} placeholder="Open a deletion request — reason…"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500" />
                  <button type="button" disabled={busy || !delReason.trim()}
                    onClick={() => act(() => directoryApi.requestDeletion(candidateId, delReason.trim()).then(() => setDelReason('')), 'Deletion request opened.')}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">Open request</button>
                </div>
              </Section>
            </div>
          )}
        </div>
      )}
    </DetailDrawer>
  );
}

/* ---------------- Agency 360° — spec §6.5 ---------------- */
const AGENCY_TABS = ['Overview', 'Verification', 'Assignments & Jobs', 'Submissions', 'Agreements & Payouts', 'Audit Log'];
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
  const [verifyReason, setVerifyReason] = useState('');
  const decideVerification = async (to: 'Approved' | 'Rejected') => {
    if (!verifyReason.trim()) { setError('A verification reason is required.'); return; }
    setBusy(true); setError(''); setOk('');
    try {
      await workforceApi.updateAgency(agencyId, { verificationStatus: to, reason: verifyReason.trim() });
      setVerifyReason(''); await load(); setOk(`Agency verification → ${to}.`);
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await workforceApi.agency360(agencyId);
      setData((res as { data?: any })?.data || res);
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [agencyId]);
  const nameOf = (a: any) => a?.displayName || a?.legalName || '';
  const isAssigned = (j: any, profile: any) => {
    const listed = [...(j.assignedAgencies || []), ...(j.assignedVendors || [])].map((x: string) => String(x).toLowerCase());
    const idKey = String(profile?.id || agencyId || '').toLowerCase();
    const keys = [profile?.displayName, profile?.legalName].filter(Boolean).map((s: string) => String(s).toLowerCase());
    return listed.some((l) => {
      if (idKey && (l === idKey || l.includes(idKey))) return true;
      return keys.some((k) => l.includes(k) || k.includes(l));
    });
  };
  const openAssign = async () => {
    setShowAssign(true); setJobs([]);
    try {
      const res: any = await jobsApi.list('?page=1&pageSize=100');
      const all = ((res as { data?: any })?.data || []) as any[];
      setJobs(all.filter((j) => j.status === 'Published'));
      const mine = new Set<string>();
      for (const j of all) if (isAssigned(j, data?.profile)) mine.add(j.id);
      setAssignSel(mine);
    } catch (e) { setError(errMsg(e)); }
  };
  const saveAssign = async () => {
    setBusy(true); setError(''); setOk('');
    try {
      for (const j of jobs) {
        const listed = [...(j.assignedAgencies || [])];
        const has = listed.some((l: string) => String(l).toLowerCase() === String(agencyId).toLowerCase()) || isAssigned(j, data?.profile);
        const want = assignSel.has(j.id);
        // Canonical assignment key is the agency ID (AGC-xxx / VND-xxx) — stable, no name drift.
        if (want && !listed.some((l: string) => String(l) === String(agencyId))) await jobsApi.update(j.id, { assignedAgencies: [...listed.filter((l: string) => String(l) !== String(nameOf(data?.profile))), agencyId] });
        else if (!want && has) await jobsApi.update(j.id, { assignedAgencies: listed.filter((l: string) => String(l) !== String(agencyId) && String(l) !== String(nameOf(data?.profile))) });
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
  const inr = (n: unknown) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const pills = (csv: unknown) => String(csv || '').split(',').map((s) => s.trim()).filter(Boolean);
  const kpis = [
    { label: 'Active assignments', value: String(p.activeAssignments ?? (data?.jobs || []).filter((j: any) => ['Published', 'Approved'].includes(j.status)).length ?? 0) },
    { label: 'Submissions', value: String(p.submissions ?? (data?.submissions || []).length ?? 0) },
    { label: 'Placements', value: String(p.placements ?? (data?.placements || []).length ?? 0) },
    { label: 'Payout due', value: inr(p.payoutBalance) },
  ];
  const Section = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
    <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <header className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/60">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">{title}</h4>
        {action}
      </header>
      <div className="p-4 space-y-3">{children}</div>
    </section>
  );
  const Empty = ({ title, hint, action }: { title: string; hint: string; action?: React.ReactNode }) => (
    <div className="text-center py-8 px-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
      <div className="mx-auto w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-extrabold">○</div>
      <div className="mt-2 text-[13px] font-extrabold text-slate-900">{title}</div>
      <div className="mt-0.5 text-[11px] text-slate-500 font-medium max-w-md mx-auto">{hint}</div>
      {action ? <div className="mt-3 flex justify-center">{action}</div> : null}
    </div>
  );
  return (
    <DetailDrawer title={nameOf(p) || agencyId} subtitle={`${agencyId} • ${p.legalName || ''} • Agency 360°`} onClose={onClose} width="max-w-4xl">
      {loading ? <InlineLoading message="Loading agency 360°…" /> : error && !data ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-3">
          <span>{error}</span><button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold">Retry</button>
        </div>
      ) : !data ? <div className="text-xs text-slate-500">No data.</div> : (
        <div className="space-y-4">
          <TabBar tabs={AGENCY_TABS} active={tab} onPick={setTab} />
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{error}</div>}
          {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
          {/* KPI strip — always visible, crisp performance snapshot */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {kpis.map((k) => (
              <div key={k.label} className="px-3.5 py-3 rounded-2xl bg-slate-900 text-white">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k.label}</div>
                <div className="text-lg font-extrabold mt-0.5">{k.value}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill value={p.verificationStatus || 'Pending'} />
            <StatusPill value={p.accountStatus || 'Invited'} />
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">{agencyId}</span>
            {p.tenantId ? <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">{p.tenantId}</span> : null}
          </div>
          {tab === 'Overview' && (
            <div className="space-y-3">
              <Section title="Identity & registration">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legal name</div><div className="font-bold text-slate-900">{p.legalName || '—'}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Display name</div><div className="font-bold text-slate-900">{p.displayName || '—'}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entity type</div><div className="font-semibold text-slate-800">{p.entityType || p.type || 'Private Limited'}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</div><div className="font-semibold text-slate-800">{p.country || 'India'}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration (CIN)</div><div className="font-mono font-bold text-slate-900 text-xs">{p.registrationNumber || '—'}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax IDs (GSTIN / PAN)</div><div className="font-mono font-bold text-slate-900 text-xs">{p.taxIds || '—'}</div></div>
                  <div className="sm:col-span-2"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered address</div><div className="font-semibold text-slate-800">{p.address || '—'}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website</div>{p.website ? <a href={p.website} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline break-all">{p.website}</a> : <span className="font-semibold text-slate-400">—</span>}</div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account manager</div><div className="font-semibold text-slate-800">{p.accountManager || 'operations@nexatalent.com'}</div></div>
                </div>
              </Section>
              <Section title="Contact & coverage">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary contact</div><div className="font-bold text-slate-900">{p.contactName || '—'}</div><div className="text-xs font-semibold text-slate-600">{p.contactEmail || ''}{p.contactPhone ? ` • ${p.contactPhone}` : ''}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team size</div><div className="font-bold text-slate-900">{(data?.users || []).length || p.recruiterCount || 0} members <span className="font-semibold text-slate-500">({p.recruiterCount ?? 0} recruiters)</span></div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Specialties</div><div className="flex flex-wrap gap-1.5">{pills(p.specialties).map((s) => <span key={s} className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px]">{s}</span>)}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Locations served</div><div className="flex flex-wrap gap-1.5">{pills(p.locations).map((s) => <span key={s} className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px]">{s}</span>)}</div></div>
                </div>
              </Section>
              <Section title="Commercials">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-[13px]">
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Commercial model</div><div className="font-bold text-slate-900 capitalize">{p.commercialModel || 'percentage'}</div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agreement</div><div className="mt-0.5"><StatusPill value={p.agreementStatus || 'Signed'} /></div></div>
                  <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payout due</div><div className="font-extrabold text-slate-900">{inr(p.payoutBalance)}</div></div>
                </div>
              </Section>
            </div>
          )}
          {tab === 'Verification' && (
            <div className="space-y-3">
              <Section title="Verification status" action={<StatusPill value={p.verificationStatus || 'Pending'} />}>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{p.verificationStatus || 'Pending'}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Badge reflects onboarding checklist + auditor decision below.</div>
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-500">Account<br /><span className="text-slate-900 font-extrabold">{p.accountStatus || 'Invited'}</span></div>
                </div>
              </Section>
              <Section title="Onboarding checklist — all must hold before approval">
                <div className="space-y-1.5">
                  {[['Legal name + CIN registration', !!(p.legalName && p.registrationNumber), `${p.registrationNumber || 'missing CIN'}`], ['GSTIN / PAN on file', !!p.taxIds, `${p.taxIds || 'missing tax IDs'}`.slice(0, 42)], ['Contact person + email + phone', !!(p.contactName && p.contactEmail), `${p.contactName || '—'} • ${p.contactEmail || '—'}`], ['Specialties + coverage', !!(p.specialties && p.locations), `${p.specialties || '—'}`], ['Commercial model set', !!p.commercialModel, `${p.commercialModel || '—'}`], ['MSA / agreement signed', p.agreementStatus === 'Signed', `${p.agreementStatus || 'Draft'}`]].map(([label, met, hint]) => (
                    <DrawerCard key={label as string} status={met ? 'Active' : 'Pending'} title={label as string}
                      meta={<span className="truncate block max-w-full">{hint as string}</span>}
                      right={<span className={met ? 'text-emerald-600 font-extrabold text-[11px]' : 'text-amber-600 font-extrabold text-[11px]'}>{met ? '✓ met' : '○ missing'}</span>} />
                  ))}
                </div>
              </Section>
              <Section title="Decision — reason required, audited">
                <input value={verifyReason} onChange={(e) => setVerifyReason(e.target.value)} placeholder="e.g. GSTIN + MSA verified against MCA records" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500" />
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy || !verifyReason.trim()} onClick={() => decideVerification('Approved')} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Working…' : '✓ Approve verification'}</button>
                  <button type="button" disabled={busy || !verifyReason.trim()} onClick={() => decideVerification('Rejected')} className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-700 font-bold text-xs hover:bg-red-50 disabled:opacity-50">{busy ? 'Working…' : 'Reject verification'}</button>
                </div>
              </Section>
              <Section title={`Decision history (${(p.verificationHistory || []).length})`}>
                <DrawerList items={p.verificationHistory || []} empty="No verification decisions yet."
                  render={(h: any, i: number) => (
                    <DrawerCard key={i} status={h.to} title={`${h.from} → ${h.to}`}
                      meta={<><span className="font-semibold">{h.by}</span> • <span className="font-mono">{String(h.at || '').slice(0, 16).replace('T', ' ')}</span>{h.reason ? <span className="block text-slate-600 mt-0.5">“{h.reason}”</span> : ''}</>}
                      right={<StatusPill value={h.to} />} />
                  )} />
              </Section>
            </div>
          )}
          {tab === 'Assignments & Jobs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="text-[11px] font-bold text-slate-500">{(data.jobs || []).length} assigned • {(data.jobs || []).filter((j: any) => j.status === 'Published').length} live published</div>
                <button type="button" onClick={openAssign} className="px-4 py-2 rounded-xl bg-[#0B5FD9] hover:bg-blue-600 text-white font-bold text-xs shadow-md">+ Assign jobs</button>
              </div>
              {(data.jobs || []).length === 0 ? (
                <Empty title="No jobs assigned yet" hint="Allocate published requisitions so this agency can start submitting candidates. Only explicitly assigned jobs accept their submissions." action={<button type="button" onClick={openAssign} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">Assign jobs…</button>} />
              ) : (
                <DrawerList items={data.jobs || []} empty="" label="Assigned jobs"
                  render={(j: any) => (
                    <DrawerCard key={j.id} status={j.status} title={j.title || j.id}
                      meta={<><span className="font-mono">{j.id}</span> • {j.requisitionId || j.orgId || ''} • {j.location || '—'}{j.salaryMin ? ` • ₹${Number(j.salaryMin).toLocaleString('en-IN')}–₹${Number(j.salaryMax || j.salaryMin).toLocaleString('en-IN')}` : ''}</>}
                      right={<><StatusPill value={j.status} /><span className="text-[11px] font-bold text-slate-500">{j.applicantsCount != null ? `${j.applicantsCount} appl.` : ''}</span></>} />
                  )} />
              )}
            </div>
          )}
          {tab === 'Submissions' && (
            <div className="space-y-3">
              {(data.submissions || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries((data.submissions || []).reduce((m: Record<string, number>, s: any) => { m[s.status || 'Unknown'] = (m[s.status || 'Unknown'] || 0) + 1; return m; }, {})).map(([st, n]) => (
                    <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700"><StatusPill value={st} /> × {String(n)}</span>
                  ))}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold">Placements: {(data.placements || []).length}</span>
                </div>
              )}
              {(data.submissions || []).length === 0 ? (
                <Empty title="No submissions yet" hint="Candidate profiles submitted by this agency's recruiters will appear here with review actions (Under Review → Shortlisted → Selected / Rejected)." />
              ) : (
                <DrawerList items={data.submissions || []} empty="" label={`Submissions (${(data.submissions || []).length})`}
                  render={(s: any) => (
                    <DrawerCard key={s.id} status={s.status} title={`${s.candidateEmail}`}
                      meta={<>→ <span className="font-mono">{s.jobId}</span> • by <span className="font-semibold">{s.submittedBy}</span> • {String(s.createdAt || '').slice(0, 10)}{s.resumeRef ? ` • ${s.resumeRef}` : ''}</>}
                      right={<><StatusPill value={s.status} /><RowMenu label="Review submission" items={SUBMISSION_REVIEWS.filter((x) => x !== s.status).map((x) => ({ label: `Mark ${x}`, onSelect: () => reviewSubmission(s.id, x) }))} /></>} />
                  )} />
              )}
            </div>
          )}
          {tab === 'Agreements & Payouts' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="px-3 py-2.5 rounded-2xl bg-white border border-slate-200"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agreements</div><div className="text-base font-extrabold">{(data.agreements || []).length}</div></div>
                <div className="px-3 py-2.5 rounded-2xl bg-white border border-slate-200"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Commissions</div><div className="text-base font-extrabold">{(data.commissions || []).length}</div></div>
                <div className="px-3 py-2.5 rounded-2xl bg-slate-900 text-white"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payout due</div><div className="text-base font-extrabold">{inr(p.payoutBalance)}</div></div>
              </div>
              <Section title={`Commission agreements (${(data.agreements || []).length})`}>
                <DrawerList items={data.agreements || []} empty="No commission agreements — countersigned MSA appears here."
                  render={(a: any) => (
                    <DrawerCard key={a.id} status={a.status} title={`${a.id} • ${a.feeModel || 'percentage'} ${a.rate ?? ''}%`}
                      meta={<>{a.hiringType || ''} • trigger: {a.trigger || 'Joined'} • {a.paymentTermsDays || 30}-day terms{a.gstApplicable ? ' • +18% GST' : ''}</>}
                      right={<StatusPill value={a.status} />} />
                  )} />
              </Section>
              <Section title={`Commissions (${(data.commissions || []).length})`}>
                <DrawerList items={data.commissions || []} empty="No commissions yet — placement fees land here on Join."
                  render={(c: any) => (
                    <DrawerCard key={c.id} status={c.approvalStatus} title={`${c.id} • gross ${inr(c.gross)}`}
                      meta={<>net {inr(c.total ?? c.net)} • <span className="font-mono">{c.jobId || ''}</span> • {c.hiringType || ''} @ {c.rate}%</>}
                      right={<><StatusPill value={c.approvalStatus} /><StatusPill value={c.paymentStatus} /></>} />
                  )} />
              </Section>
              <Section title={`Payouts (${(data.payouts || []).length})`}>
                <DrawerList items={data.payouts || []} empty="No payouts yet — finance releases show here."
                  render={(x: any) => (
                    <DrawerCard key={x.id} status={x.status} title={`${x.id} • ${inr(x.amount)}`}
                      meta={<>{x.type || 'agency_payout'}{x.commissionId ? <> • <span className="font-mono">{x.commissionId}</span></> : ''}{x.period ? ` • ${x.period}` : ''}</>}
                      right={<StatusPill value={x.status} />} />
                  )} />
              </Section>
            </div>
          )}
          {tab === 'Audit Log' && (
            <div className="space-y-3">
              {(data.activity || []).length === 0 ? (
                <Empty title="No audit rows" hint="Onboarding, verification, assignment and payout events for this agency are recorded here." />
              ) : (
                <Section title={`Audit trail (${(data.activity || []).length})`}>
                  <ol className="relative ml-1.5 border-l-2 border-slate-100 space-y-3">
                    {(data.activity || []).map((l: any, i: number) => (
                      <li key={l.id || i} className="ml-4 relative">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-100" />
                        <div className="font-mono font-bold text-[12px] text-slate-900">{l.action}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{l.actor} • {l.tenantId || ''} • {String(l.timestamp || '').slice(0, 16).replace('T', ' ')}{l.ipAddress ? ` • ${l.ipAddress}` : ''}</div>
                        {l.recordId ? <div className="text-[11px] font-mono text-slate-400">{l.resource || ''}/{l.recordId}</div> : null}
                      </li>
                    ))}
                  </ol>
                </Section>
              )}
            </div>
          )}
        </div>
      )}
      <Modal open={showAssign} onClose={() => setShowAssign(false)} title={`Assign jobs — ${nameOf(data?.profile)}`} subtitle={`${agencyId} • only checked jobs accept this agency's submissions`} wide>
        <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-800">{assignSel.size} selected • {jobs.length} published jobs • assignment key: {agencyId}</div>
        <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pt-1">
          {jobs.length === 0 && <div className="text-xs text-slate-500">No published jobs available.</div>}
          {jobs.map((j) => (
            <label key={j.id} className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${assignSel.has(j.id) ? 'bg-blue-50/60 border-blue-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
              <input type="checkbox" checked={assignSel.has(j.id)} onChange={() => setAssignSel((s) => { const n = new Set(s); if (n.has(j.id)) n.delete(j.id); else n.add(j.id); return n; })} className="w-4 h-4 accent-[#0B5FD9] shrink-0" />
              <span className="min-w-0 flex-1"><strong className="text-[13px]">{j.title}</strong><span className="block text-[11px] text-slate-500 font-medium"><span className="font-mono">{j.id}</span> • {j.orgId || ''} • {j.location || '—'}</span></span>
              <StatusPill value={j.status} />
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <button type="button" onClick={() => setShowAssign(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
          <button type="button" disabled={busy} onClick={saveAssign} className="px-4 py-2.5 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Saving…' : `Save (${assignSel.size} assigned)`}</button>
        </div>
      </Modal>
    </DetailDrawer>
  );
}
