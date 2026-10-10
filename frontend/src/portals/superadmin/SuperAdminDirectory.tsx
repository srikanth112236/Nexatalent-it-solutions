import { useEffect, useMemo, useState } from 'react';
import { directoryApi, mfaApi, permissionsApi } from '../../shared/enterprise/phaseApi';
import { syncAll } from '../common/EnterprisePanels';
import { Modal, Select, Field, ConfirmDialog, RowMenu, DatePicker } from '../../shared/ui/EnterpriseKit';
import { CrudToolbar, DetailDrawer, KeyValues, StatusPill, useQueryState, useDebounced } from '../common/CrudKit';
import { Company360Drawer } from './SuperAdmin360';
import { EmptyState } from '../../shared/ui/DataState';

function _unwrapList(res: unknown): any[] {
  const d = (res as { data?: unknown })?.data;
  if (Array.isArray(d)) return d;
  const paged = (res as { data?: { data?: unknown[] } })?.data;
  if (paged && Array.isArray((paged as { data?: unknown[] }).data)) return (paged as { data: unknown[] }).data;
  return [];
}
void _unwrapList;
function errMsg(err: unknown): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error)?.message || 'Request failed. Try again.';
}

/* ---------------- Organizations — full CRUD ---------------- */
export function OrganizationsManager({ tenants, setTenants, onAudit }: {
  tenants: any[]; setTenants: (t: any[]) => void; onAudit?: () => void;
}) {
  const [search, setSearch] = useQueryState('org_q');
  const [status, setStatus] = useQueryState('org_status');
  const [page, setPage] = useState(1);
  const dq = useDebounced(search);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const blankOrg: Record<string, string> = { legalName: '', displayName: '', entityType: '', industry: '', subIndustry: '', companySize: '', website: '', description: '', countryOfIncorporation: '', registrationNumber: '', gstin: '', taxIds: '', registeredAddress: '', headquarters: '', operatingLocations: '', logoUrl: '', primaryContact: '', primaryContactDesignation: '', businessEmail: '', businessPhone: '', billingContact: '', financeEmail: '', plan: '', seats: '', accountManager: '', salesOwner: '' };
  const [editForm, setEditForm] = useState<Record<string, string>>({ ...blankOrg });
  const [suspendFor, setSuspendFor] = useState<any>(null);
  const [suspendForm, setSuspendForm] = useState({ reason: '', action: 'suspend' });
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [inviteFor, setInviteFor] = useState<any>(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'company_admin' });
  const [inviteCreds, setInviteCreds] = useState<{ email: string; password: string } | null>(null);
  const [mgrFor, setMgrFor] = useState<any>(null);
  const [mgrForm, setMgrForm] = useState({ accountManager: '', salesOwner: '' });
  const pageSize = 10;
  const setF = (k: string, v: string) => setEditForm((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    const q = dq.toLowerCase();
    return tenants.filter((t) => {
      if (status && String(t.accountStatus || t.status) !== status) return false;
      if (!q) return true;
      return `${t.id} ${t.name || t.legalName} ${t.displayName} ${t.plan}`.toLowerCase().includes(q);
    });
  }, [tenants, dq, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const menuFor = (t: any) => (
    <RowMenu items={[
      { label: 'View 360°', onSelect: () => setDetail(t) },
      { label: 'Edit details', onSelect: () => openEdit(t) },
      { label: 'Invite administrator…', onSelect: () => { setInviteFor(t); setInviteForm({ name: '', email: '', role: 'company_admin' }); setInviteCreds(null); } },
      { label: 'Assign managers…', onSelect: () => { setMgrFor(t); setMgrForm({ accountManager: t.accountManager || '', salesOwner: t.salesOwner || '' }); } },
      ...((t.verificationStatus === 'Pending') ? [
        { label: 'Verify — Approve', onSelect: () => doVerify(t, 'approve') },
        { label: 'Verify — Reject', onSelect: () => doVerify(t, 'reject') },
      ] : []),
      { label: (t.accountStatus === 'Suspended' || t.status === 'Suspended') ? 'Reactivate' : 'Suspend…', onSelect: () => { setSuspendFor(t); setSuspendForm({ reason: '', action: (t.accountStatus === 'Suspended') ? 'reactivate' : 'suspend' }); } },
      { label: 'Close / Delete…', onSelect: () => setDeleteFor(t) },
    ]} />
  );

  const refreshAudit = onAudit;

  const openEdit = (t: any) => {
    setEditing(t);
    const next: Record<string, string> = { ...blankOrg };
    for (const k of Object.keys(blankOrg)) {
      if (k === 'seats') next[k] = String(t.seats || '').split('/')[0].trim() || String(t.seats || '');
      else if (k === 'displayName') next[k] = t.displayName || t.name || '';
      else next[k] = t[k] === undefined || t[k] === null ? '' : String(t[k]);
    }
    setEditForm(next);
  };
  const genPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#';
    let out = '';
    const buf = new Uint32Array(14);
    try {
      crypto.getRandomValues(buf);
      for (let i = 0; i < 14; i++) out += chars[buf[i] % chars.length];
    } catch {
      for (let i = 0; i < 14; i++) out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  };
  const doInvite = async (e: React.FormEvent) => {
    e.preventDefault(); if (!inviteFor || !inviteForm.email.trim()) return;
    setBusy(true); setError('');
    try {
      const password = genPassword();
      const res: any = await directoryApi.createUser({ name: inviteForm.name.trim() || inviteForm.email.split('@')[0], email: inviteForm.email.trim(), role: inviteForm.role, tenantId: inviteFor.id, password });
      if ((res as { data?: any })?.data || (res as any)?.id) {
        setInviteCreds({ email: inviteForm.email.trim(), password });
        setOk(`Administrator invited to ${inviteFor.id}. Share the one-time password securely.`);
        syncAll(); refreshAudit?.();
      }
    } catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };
  const doAssignMgr = async (e: React.FormEvent) => {
    e.preventDefault(); if (!mgrFor) return;
    setBusy(true); setError('');
    try {
      const res: any = await directoryApi.updateTenant(mgrFor.id, mgrForm);
      const updated = res?.data || res;
      setTenants(tenants.map((x) => (x.id === mgrFor.id ? { ...x, ...updated } : x)));
      setMgrFor(null); setOk(`Account team assigned for ${mgrFor.id}.`); syncAll();
    } catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editing) return;
    setBusy(true); setError('');
    try {
      const res: any = await directoryApi.updateTenant(editing.id, editForm);
      const updated = res?.data || res;
      setTenants(tenants.map((x) => (x.id === editing.id ? { ...x, ...updated } : x)));
      setEditing(null); setOk(`Organization ${editing.id} updated.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doSuspend = async () => {
    if (!suspendFor || !suspendForm.reason.trim()) { setError('Suspension reason is required (audit).'); return; }
    setBusy(true); setError('');
    try {
      const res: any = await directoryApi.suspendTenant(suspendFor.id, suspendForm.reason.trim(), suspendForm.action);
      const updated = res?.data || res;
      setTenants(tenants.map((x) => (x.id === suspendFor.id ? { ...x, ...updated } : x)));
      setSuspendFor(null); setSuspendForm({ reason: '', action: 'suspend' });
      setOk(`Organization ${suspendFor.id} ${suspendForm.action === 'reactivate' ? 'reactivated' : 'suspended'}.`); syncAll(); refreshAudit?.();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doVerify = async (t: any, decision: 'approve' | 'reject') => {
    setBusy(true); setError('');
    try {
      const res: any = await directoryApi.verifyTenant(t.id, decision);
      const updated = res?.data || res;
      setTenants(tenants.map((x) => (x.id === t.id ? { ...x, ...updated } : x)));
      setOk(`Organization ${t.id} ${decision === 'approve' ? 'verified' : 'rejected'}.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDelete = async () => {
    if (!deleteFor) return;
    setBusy(true); setError('');
    try {
      const res: any = await directoryApi.deleteTenant(deleteFor.id, 'admin-console-close');
      const updated = (res as { data?: any })?.data;
      if (updated && updated.accountStatus === 'Closed') {
        setTenants(tenants.map((x) => (x.id === deleteFor.id ? { ...x, ...updated } : x)));
        setOk(`Organization ${deleteFor.id} has dependent records — closed safely instead of hard delete.`);
      } else {
        setTenants(tenants.filter((x) => x.id !== deleteFor.id));
        setOk(`Organization ${deleteFor.id} deleted.`);
      }
      setDeleteFor(null); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Client Organizations — Full Lifecycle</h3>
          <p className="text-xs text-slate-500 font-medium">Create → Verify → Edit → Suspend/Reactivate → Close/Delete. {filtered.length} of {tenants.length} shown.</p>
        </div>
      </div>
      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{error}</div>}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <CrudToolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPh="Search ID, legal name, brand, plan…"
        status={status} onStatus={(v) => { setStatus(v); setPage(1); }} statuses={['Active', 'Invited', 'Suspended', 'Closed']}
        exportProps={{ filename: 'organizations.csv', rows: filtered, columns: ['id', 'legalName', 'displayName', 'entityType', 'industry', 'subIndustry', 'companySize', 'website', 'description', 'countryOfIncorporation', 'registrationNumber', 'gstin', 'taxIds', 'registeredAddress', 'headquarters', 'operatingLocations', 'primaryContact', 'primaryContactDesignation', 'businessEmail', 'businessPhone', 'billingContact', 'financeEmail', 'plan', 'seats', 'accountManager', 'salesOwner', 'verificationStatus', 'accountStatus', 'createdDate'] }} />
      {pageRows.length === 0 ? <EmptyState title="No organizations match" message="Adjust filters or provision a new tenant." /> : (<>
        <div className="space-y-2 md:hidden">
          {pageRows.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{t.displayName || t.name || t.legalName}</div>
                  <div className="font-mono text-[11px] text-amber-700">{t.id} • {t.plan}</div>
                </div>
                {menuFor(t)}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusPill value={t.verificationStatus || 'Pending'} />
                <StatusPill value={t.accountStatus || t.status} />
              </div>
              <div className="text-slate-600 font-medium">{t.industry || '—'} • {t.businessEmail || '—'}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[1060px]">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-3">Tenant</th><th className="px-4 py-3">Organization</th><th className="px-4 py-3">Industry</th><th className="px-4 py-3">Business contact</th><th className="px-4 py-3">Plan / Seats</th>
                <th className="px-4 py-3">Verification</th><th className="px-4 py-3">Account</th><th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {pageRows.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold text-amber-700">{t.id}</td>
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{t.displayName || t.name || t.legalName}</div>
                    <div className="text-slate-500 text-[11px]">{t.legalName && t.displayName ? t.legalName : (t.entityType || '')}</div></td>
                  <td className="px-4 py-3"><div>{t.industry || '—'}</div><div className="text-slate-500 text-[11px]">{t.companySize || ''}</div></td>
                  <td className="px-4 py-3"><div>{t.businessEmail || '—'}</div><div className="text-slate-500 text-[11px]">{t.businessPhone || t.accountManager || ''}</div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{t.plan}</span>
                    <div className="text-slate-500 text-[11px] mt-1">{t.seats} seats</div></td>
                  <td className="px-4 py-3"><StatusPill value={t.verificationStatus || 'Pending'} /></td>
                  <td className="px-4 py-3"><StatusPill value={t.accountStatus || t.status} /></td>
                  <td className="px-4 py-3"><div className="flex justify-end">{menuFor(t)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span>Page {page} of {totalPages} • {filtered.length} records</span>
        <span className="flex gap-1.5">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40">← Prev</button>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40">Next →</button>
        </span>
      </div>

      {detail && (
        <Company360Drawer tenantId={detail.id} onClose={() => setDetail(null)} />
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit — ${editing?.id || ''}`} subtitle="All company fields (§6.4). Changes are audited with actor + timestamp" wide>
        <form onSubmit={saveEdit} className="space-y-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Identity</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Legal entity name *"><input required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.legalName} onChange={(e) => setF('legalName', e.target.value)} /></Field>
              <Field label="Display / brand name"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.displayName} onChange={(e) => setF('displayName', e.target.value)} /></Field>
              <Field label="Entity type"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.entityType} onChange={(e) => setF('entityType', e.target.value)} placeholder="Pvt Ltd / LLP / …" /></Field>
              <Field label="Logo URL"><input type="url" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.logoUrl} onChange={(e) => setF('logoUrl', e.target.value)} placeholder="https://…" /></Field>
              <div className="sm:col-span-2"><Field label="Company description"><textarea rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none" value={editForm.description} onChange={(e) => setF('description', e.target.value)} /></Field></div>
              <Field label="Industry"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.industry} onChange={(e) => setF('industry', e.target.value)} /></Field>
              <Field label="Sub-industry"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.subIndustry} onChange={(e) => setF('subIndustry', e.target.value)} /></Field>
              <Field label="Company size"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.companySize} onChange={(e) => setF('companySize', e.target.value)} placeholder="e.g. 51–200" /></Field>
              <Field label="Website"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.website} onChange={(e) => setF('website', e.target.value)} /></Field>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Registration & tax</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Country of incorporation"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.countryOfIncorporation} onChange={(e) => setF('countryOfIncorporation', e.target.value)} /></Field>
              <Field label="Registration number"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none font-mono" value={editForm.registrationNumber} onChange={(e) => setF('registrationNumber', e.target.value)} /></Field>
              <Field label="GSTIN"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none font-mono" value={editForm.gstin} onChange={(e) => setF('gstin', e.target.value)} /></Field>
              <Field label="Other tax IDs"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.taxIds} onChange={(e) => setF('taxIds', e.target.value)} /></Field>
              <Field label="Registered address"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.registeredAddress} onChange={(e) => setF('registeredAddress', e.target.value)} /></Field>
              <Field label="Headquarters"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.headquarters} onChange={(e) => setF('headquarters', e.target.value)} /></Field>
              <div className="sm:col-span-2"><Field label="Operating & hiring locations"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.operatingLocations} onChange={(e) => setF('operatingLocations', e.target.value)} /></Field></div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Contacts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Primary contact name"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.primaryContact} onChange={(e) => setF('primaryContact', e.target.value)} /></Field>
              <Field label="Primary contact designation"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.primaryContactDesignation} onChange={(e) => setF('primaryContactDesignation', e.target.value)} /></Field>
              <Field label="Business email"><input type="email" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.businessEmail} onChange={(e) => setF('businessEmail', e.target.value)} /></Field>
              <Field label="Business phone"><input type="tel" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.businessPhone} onChange={(e) => setF('businessPhone', e.target.value)} /></Field>
              <Field label="Billing contact"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.billingContact} onChange={(e) => setF('billingContact', e.target.value)} /></Field>
              <Field label="Finance email"><input type="email" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.financeEmail} onChange={(e) => setF('financeEmail', e.target.value)} /></Field>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Commercial assignment</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Plan"><Select value={editForm.plan} onChange={(v) => setF('plan', v)} options={['Enterprise Custom', 'Growth Tier', 'Starter SaaS', 'Platform'].map((p) => ({ value: p, label: p }))} /></Field>
              <Field label="Seats"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.seats} onChange={(e) => setF('seats', e.target.value)} /></Field>
              <Field label="Account manager"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.accountManager} onChange={(e) => setF('accountManager', e.target.value)} /></Field>
              <Field label="Sales owner"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.salesOwner} onChange={(e) => setF('salesOwner', e.target.value)} /></Field>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy || !editForm.legalName.trim()} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={inviteFor !== null} onClose={() => { setInviteFor(null); setInviteCreds(null); }} title={`Invite administrator — ${inviteFor?.displayName || inviteFor?.legalName || inviteFor?.id || ''}`} subtitle="Creates a company admin scoped to this tenant. One-time password shown once.">
        {inviteCreds ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <div className="font-extrabold text-emerald-900">Administrator created. Share these credentials securely — the password will not be shown again.</div>
              <div className="flex items-center gap-2"><span className="font-bold text-slate-600 w-16">Email</span><code className="flex-1 p-2 rounded-lg bg-white border border-emerald-200 font-mono font-bold break-all">{inviteCreds.email}</code></div>
              <div className="flex items-center gap-2"><span className="font-bold text-slate-600 w-16">Password</span><code className="flex-1 p-2 rounded-lg bg-white border border-emerald-200 font-mono font-bold break-all">{inviteCreds.password}</code>
                <button type="button" onClick={() => { try { navigator.clipboard.writeText(inviteCreds.password); } catch { /* noop */ } }} className="px-3 py-2 rounded-lg bg-white border border-emerald-300 font-bold text-[11px] shrink-0">Copy</button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => { setInviteFor(null); setInviteCreds(null); }} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={doInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full name"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder="e.g. Priya Sharma" /></Field>
            <Field label="Work email *"><input type="email" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="admin@company.com" /></Field>
            <Field label="Role"><Select value={inviteForm.role} onChange={(v) => setInviteForm({ ...inviteForm, role: v })} options={[{ value: 'company_admin', label: 'Company Admin' }, { value: 'hiring_manager', label: 'Hiring Manager' }, { value: 'company_recruiter', label: 'Company Recruiter' }]} /></Field>
            <div className="flex items-end"><span className="text-[11px] text-slate-500 font-medium pb-2">Tenant: <strong className="font-mono">{inviteFor?.id}</strong></span></div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setInviteFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
              <button disabled={busy || !inviteForm.email.trim()} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Inviting…' : 'Invite administrator'}</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={mgrFor !== null} onClose={() => setMgrFor(null)} title={`Assign account team — ${mgrFor?.id || ''}`} subtitle="Sales owner + account manager own this relationship">
        <form onSubmit={doAssignMgr} className="space-y-3">
          <Field label="Account manager"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={mgrForm.accountManager} onChange={(e) => setMgrForm({ ...mgrForm, accountManager: e.target.value })} placeholder="Name or email" /></Field>
          <Field label="Sales owner"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={mgrForm.salesOwner} onChange={(e) => setMgrForm({ ...mgrForm, salesOwner: e.target.value })} placeholder="Name or email" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setMgrFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Saving…' : 'Assign'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={suspendFor !== null} onClose={() => setSuspendFor(null)} title={`${suspendForm.action === 'reactivate' ? 'Reactivate' : 'Suspend'} — ${suspendFor?.id || ''}`} subtitle="Reason is mandatory and written to the audit log. Active sessions are revoked on suspend.">
        <div className="space-y-3">
          <Field label="Action"><Select value={suspendForm.action} onChange={(v) => setSuspendForm({ ...suspendForm, action: v })} options={[{ value: 'suspend', label: 'Suspend' }, { value: 'reactivate', label: 'Reactivate' }]} /></Field>
          <Field label="Reason *"><textarea rows={3} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={suspendForm.reason} onChange={(e) => setSuspendForm({ ...suspendForm, reason: e.target.value })} placeholder="e.g. Non-payment — finance ticket FIN-221" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setSuspendFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !suspendForm.reason.trim()} onClick={doSuspend} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Working…' : 'Confirm'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={deleteFor !== null} onCancel={() => setDeleteFor(null)} title={`Close / delete ${deleteFor?.id || ''}?`}
        body="Orgs with jobs, applications, invoices or placements are CLOSED (recoverable) instead of hard-deleted to preserve financial audit. Orgs with no dependents are deleted."
        confirmLabel="Close / Delete" onConfirm={doDelete} />
    </div>
  );
}

/* ---------------- Users — full CRUD ---------------- */
const ALL_ROLES = ['superadmin', 'operations_admin', 'finance_admin', 'sales_admin', 'support_admin', 'company_admin', 'hiring_manager', 'company_recruiter', 'internal_recruiter', 'bda', 'sales_manager', 'candidate', 'agency_admin', 'agency_recruiter', 'finance_staff', 'employee', 'employer', 'recruiter', 'vendor'];

export function UsersManager({ users, setUsers }: { users: any[]; setUsers: (u: any[]) => void }) {
  const [search, setSearch] = useQueryState('usr_q');
  const [role, setRole] = useQueryState('usr_role');
  const [status, setStatus] = useQueryState('usr_status');
  const [page, setPage] = useState(1);
  const dq = useDebounced(search);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', department: '', designation: '', branch: '', employeeId: '', reportingManager: '', role: '', startDate: '', endDate: '' });
  const [statusFor, setStatusFor] = useState<any>(null);
  const [statusForm, setStatusForm] = useState({ status: 'Suspended', reason: '', reassignTo: '' });
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [mfaFor, setMfaFor] = useState<any>(null);
  const [assignments, setAssignments] = useState<any>(null);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [excForm, setExcForm] = useState({ permission: 'export', effect: 'grant' });
  const [history, setHistory] = useState<any[]>([]);
  const pageSize = 10;
  useEffect(() => {
    if (!detail) { setAssignments(null); setExceptions([]); setHistory([]); return; }
    (async () => {
      try {
        const [aRes, eRes, hRes] = await Promise.all([
          directoryApi.userAssignments(detail.id).catch(() => null),
          permissionsApi.all(detail.email).catch(() => null),
          directoryApi.auditLogs(`?actor=${encodeURIComponent(detail.email)}`).catch(() => null),
        ]);
        const unwrap = (r: unknown): any[] => {
          const d = (r as { data?: unknown })?.data;
          return Array.isArray(d) ? d : [];
        };
        if (aRes) setAssignments((aRes as { data?: any })?.data || null);
        if (eRes) setExceptions(unwrap(eRes));
        if (hRes) {
          const hbody = (hRes as { data?: unknown })?.data;
          const rows = Array.isArray(hbody) ? hbody : ((hbody as { data?: unknown[] })?.data || []);
          setHistory(Array.isArray(rows) ? rows.slice(0, 20) : []);
        }
      } catch { /* sections are best-effort */ }
    })();
  }, [detail]);

  const filtered = useMemo(() => {
    const q = dq.toLowerCase();
    return users.filter((u) => {
      if (role && u.role !== role) return false;
      if (status && u.status !== status) return false;
      if (!q) return true;
      return `${u.id} ${u.name} ${u.email} ${u.tenantId}`.toLowerCase().includes(q);
    });
  }, [users, dq, role, status]);
  const userMenuFor = (u: any) => (
    <RowMenu items={[
      { label: 'View profile', onSelect: () => setDetail(u) },
      { label: 'Edit details', onSelect: () => openEdit(u) },
      { label: u.status === 'Active' ? 'Suspend…' : 'Reactivate…', onSelect: () => { setStatusFor(u); setStatusForm({ status: u.status === 'Active' ? 'Suspended' : 'Active', reason: '', reassignTo: '' }); } },
      ...(u.mfaEnabled ? [{ label: 'Reset MFA…', onSelect: () => setMfaFor(u) }] : []),
      { label: 'Delete…', onSelect: () => setDeleteFor(u) },
    ]} />
  );
  const doMfaReset = async () => {
    if (!mfaFor) return;
    setBusy(true); setError('');
    try {
      await mfaApi.reset(mfaFor.email);
      setUsers(users.map((x) => (x.id === mfaFor.id ? { ...x, mfaEnabled: false } : x)));
      setMfaFor(null); setOk(`MFA reset for ${mfaFor.email}.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const saveException = async (email: string) => {
    setBusy(true); setError('');
    try {
      const res: any = await permissionsApi.grant(email, excForm.permission, excForm.effect as 'grant' | 'revoke');
      const created = (res as { data?: any })?.data;
      if (created?.id) setExceptions((x) => [created, ...x.filter((o) => !(o.permission === created.permission))]);
      setOk(`Permission ${excForm.effect} ${excForm.permission} for ${email}.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const clearException = async (email: string, permission: string, id: string) => {
    setBusy(true); setError('');
    try {
      await permissionsApi.clear(email, permission);
      setExceptions((x) => x.filter((o) => o.id !== id)); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openEdit = (u: any) => {
    setEditing(u);
    setEditForm({ name: u.name || '', phone: u.phone || '', department: u.department || '', designation: u.designation || '', branch: u.branch || '', employeeId: u.employeeId || '', reportingManager: u.reportingManager || '', role: u.role || '', startDate: u.startDate ? String(u.startDate).slice(0, 10) : '', endDate: u.endDate ? String(u.endDate).slice(0, 10) : '' });
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editing) return;
    setBusy(true); setError('');
    try {
      const res: any = await directoryApi.editUser(editing.id, editForm);
      const updated = res?.data || res;
      setUsers(users.map((x) => (x.id === editing.id ? { ...x, ...updated } : x)));
      setEditing(null); setOk(`User ${editing.email} updated.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doStatus = async () => {
    if (!statusFor || !statusForm.reason.trim()) { setError('Reason is required (actor + timestamp recorded).'); return; }
    setBusy(true); setError('');
    try {
      const res: any = await directoryApi.setUserStatus(statusFor.id, statusForm.status, statusForm.reason.trim(), statusForm.reassignTo || undefined);
      const updated = (res as { data?: any })?.data || res;
      setUsers(users.map((x) => (x.id === statusFor.id ? { ...x, ...(updated?.id ? updated : { status: statusForm.status }) } : x)));
      setStatusFor(null); setStatusForm({ status: 'Suspended', reason: '', reassignTo: '' });
      setOk(`User ${statusFor.email} → ${statusForm.status}. Sessions revoked.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDelete = async () => {
    if (!deleteFor) return;
    setBusy(true); setError('');
    try {
      await directoryApi.deleteUser(deleteFor.id, 'leaver-cleanup');
      setUsers(users.map((x) => (x.id === deleteFor.id ? { ...x, status: 'Deleted' } : x)));
      setDeleteFor(null); setOk(`User ${deleteFor.email} soft-deleted. Reassign their open work.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-slate-900">Global Directory — User Lifecycle</h3>
        <p className="text-xs text-slate-500 font-medium">View → Edit → Suspend/Reactivate → Delete (soft). {filtered.length} of {users.length} shown.</p>
      </div>
      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{error}</div>}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-1"><CrudToolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPh="Search name, email, tenant…"
          exportProps={{ filename: 'users.csv', rows: filtered, columns: ['id', 'name', 'email', 'phone', 'employeeId', 'department', 'designation', 'role', 'branch', 'reportingManager', 'tenantId', 'status', 'invitationStatus', 'mfaEnabled', 'startDate', 'endDate', 'lastLogin'] }} /></div>
        <div className="flex gap-2">
          <div className="w-40 shrink-0">
            <Select value={role} onChange={(v) => { setRole(v); setPage(1); }} ariaLabel="Role filter" placeholder="All roles"
              options={[{ value: '', label: 'All roles' }, ...ALL_ROLES.map((r) => ({ value: r, label: r }))]} />
          </div>
          <div className="w-40 shrink-0">
            <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} ariaLabel="Status filter" placeholder="All statuses"
              options={[{ value: '', label: 'All statuses' }, ...['Active', 'Suspended', 'Deleted'].map((s) => ({ value: s, label: s }))]} />
          </div>
        </div>
      </div>
      {pageRows.length === 0 ? <EmptyState title="No users match" message="Adjust search or role filters." /> : (<>
        <div className="space-y-2 md:hidden">
          {pageRows.map((u) => (
            <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{u.name}</div>
                  <div className="text-slate-500 truncate">{u.email}</div>
                </div>
                {userMenuFor(u)}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px] capitalize">{u.role}</span>
                <StatusPill value={u.status} />
                {u.mfaEnabled ? <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">MFA on</span> : null}
              </div>
              <div className="text-slate-600 font-medium font-mono">{u.tenantId}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[1180px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Tenant</th><th className="px-4 py-3">MFA</th><th className="px-4 py-3">Invitation</th>
              <th className="px-4 py-3">Last active</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pageRows.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{u.name}</div><div className="text-slate-500 text-[11px]">{u.email}{u.phone ? ` • ${u.phone}` : ''} • <span className="font-mono">{u.id}</span></div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px] capitalize">{u.role}</span><div className="text-slate-500 text-[11px] mt-0.5">{u.designation || u.department || ''}</div></td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-700">{u.tenantId}</td>
                  <td className="px-4 py-3">{u.mfaEnabled ? <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">On</span> : <span className="text-slate-400">Off</span>}</td>
                  <td className="px-4 py-3 text-slate-500">{u.invitationStatus || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{u.lastLogin || 'Never'}</td>
                  <td className="px-4 py-3"><StatusPill value={u.status} /></td>
                  <td className="px-4 py-3"><div className="flex justify-end">{userMenuFor(u)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span>Page {page} of {totalPages} • {filtered.length} records</span>
        <span className="flex gap-1.5">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40">← Prev</button>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40">Next →</button>
        </span>
      </div>

      {detail && (
        <DetailDrawer title={detail.name} subtitle={`${detail.email} • ${detail.id}`} onClose={() => setDetail(null)}>
          <KeyValues data={[
            ['Email', detail.email], ['Work phone', detail.phone || '—'], ['Role', detail.role], ['Tenant', detail.tenantId],
            ['Employee ID', detail.employeeId || '—'], ['Department', detail.department || '—'],
            ['Designation', detail.designation || '—'], ['Branch', detail.branch || '—'],
            ['Manager', detail.reportingManager || '—'], ['Status', <StatusPill value={detail.status} />],
            ['Invitation', `${detail.invitationStatus || '—'}${detail.invitedAt ? ` • ${String(detail.invitedAt).slice(0, 10)}` : ''}`],
            ['MFA', detail.mfaEnabled ? 'Enabled' : 'Disabled'],
            ['Start date', detail.startDate ? String(detail.startDate).slice(0, 10) : '—'],
            ['End date', detail.endDate ? String(detail.endDate).slice(0, 10) : '—'],
            ['Last login', detail.lastLogin || 'Never'],
          ]} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { openEdit(detail); setDetail(null); }} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs">Edit</button>
            <button type="button" onClick={() => { setStatusFor(detail); setDetail(null); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Suspend / Reactivate</button>
            {detail.mfaEnabled && <button type="button" onClick={() => { setMfaFor(detail); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Reset MFA</button>}
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 mb-2">Assigned work — companies, jobs, leads, candidates, tasks, interviews</div>
            {!assignments ? <div className="text-[11px] text-slate-500">Loading assignments…</div> : (
              <div className="space-y-2">
                {(['companies', 'jobs', 'requisitions', 'leads', 'candidates', 'tasks', 'interviews', 'targets', 'opportunities', 'meetings'] as const).map((k) => (
                  <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="font-extrabold capitalize">{k} ({k === 'companies' ? assignments[k].length : assignments.counts?.[k] ?? assignments[k]?.length ?? 0})</div>
                    {(assignments[k] || []).slice(0, 5).map((r: any) => (
                      <div key={r.id} className="text-slate-600 font-medium truncate mt-1">
                        {r.name || r.title || r.companyName || r.candidateName || r.clientName || r.id} • {r.status || r.stage || ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 mb-2">Permission exceptions (over role template)</div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <Select value={excForm.permission} onChange={(v) => setExcForm({ ...excForm, permission: v })} ariaLabel="Permission" options={['view', 'create', 'edit', 'archive', 'delete', 'approve', 'reject', 'suspend', 'restore', 'assign', 'export', 'manage_billing', 'manage_permissions', 'view_sensitive_fields', 'reconcile', 'refund', 'adjust_commission'].map((p) => ({ value: p, label: p }))} />
              </div>
              <div className="w-28 shrink-0">
                <Select value={excForm.effect} onChange={(v) => setExcForm({ ...excForm, effect: v })} ariaLabel="Effect" options={[{ value: 'grant', label: 'Grant' }, { value: 'revoke', label: 'Revoke' }]} />
              </div>
              <button type="button" disabled={busy} onClick={() => saveException(detail.email)} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 disabled:opacity-50">Save</button>
            </div>
            {exceptions.length === 0 ? <div className="text-[11px] text-slate-500">No exceptions — role template applies.</div> : (
              <div className="space-y-1.5">
                {exceptions.map((o) => (
                  <div key={o.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
                    <span><strong className={o.effect === 'grant' ? 'text-emerald-600' : 'text-red-600'}>{o.effect}</strong> • {o.permission}</span>
                    <button type="button" onClick={() => clearException(detail.email, o.permission, o.id)} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Clear</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 mb-2">Access history (latest 20)</div>
            {history.length === 0 ? <div className="text-[11px] text-slate-500">No recorded actions by this account yet.</div> : (
              <div className="space-y-1.5">
                {history.map((h: any, i: number) => (
                  <div key={h.id || i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                    {h.action} • {h.resource}/{h.recordId} • {String(h.timestamp || '').slice(0, 16).replace('T', ' ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DetailDrawer>
      )}
      <ConfirmDialog open={mfaFor !== null} onCancel={() => setMfaFor(null)} title={`Reset MFA for ${mfaFor?.email || ''}?`}
        body="Their second factor is cleared immediately (audited). They re-enroll on next sign-in."
        confirmLabel="Reset MFA" onConfirm={doMfaReset} />

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit user — ${editing?.email || ''}`} subtitle="Role changes are audited">
        <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Field>
          <Field label="Work phone"><input type="tel" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></Field>
          <Field label="Role"><Select value={editForm.role} onChange={(v) => setEditForm({ ...editForm, role: v })} options={ALL_ROLES.map((r) => ({ value: r, label: r }))} /></Field>
          <Field label="Department"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} /></Field>
          <Field label="Designation"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} /></Field>
          <Field label="Branch"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.branch} onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })} /></Field>
          <Field label="Employee ID"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.employeeId} onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })} /></Field>
          <Field label="Reporting manager"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.reportingManager} onChange={(e) => setEditForm({ ...editForm, reportingManager: e.target.value })} /></Field>
          <Field label="Start date"><DatePicker value={editForm.startDate} onChange={(v) => setEditForm({ ...editForm, startDate: v })} ariaLabel="Start date" placeholder="Start date" /></Field>
          <Field label="End date"><DatePicker value={editForm.endDate} onChange={(v) => setEditForm({ ...editForm, endDate: v })} ariaLabel="End date" placeholder="End date" /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={statusFor !== null} onClose={() => setStatusFor(null)} title={`Change status — ${statusFor?.email || ''}`} subtitle="Sessions are revoked immediately. Reassign open work.">
        <div className="space-y-3">
          <Field label="Status"><Select value={statusForm.status} onChange={(v) => setStatusForm({ ...statusForm, status: v })} options={[{ value: 'Active', label: 'Active' }, { value: 'Suspended', label: 'Suspended' }]} /></Field>
          <Field label="Reassign open work to (email, optional)"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={statusForm.reassignTo} onChange={(e) => setStatusForm({ ...statusForm, reassignTo: e.target.value })} placeholder="successor@company.com" /></Field>
          <Field label="Reason *"><textarea rows={3} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={statusForm.reason} onChange={(e) => setStatusForm({ ...statusForm, reason: e.target.value })} placeholder="e.g. Exit 12-Oct — IT ticket EX-104" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setStatusFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !statusForm.reason.trim()} onClick={doStatus} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Working…' : 'Confirm'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={deleteFor !== null} onCancel={() => setDeleteFor(null)} title={`Delete ${deleteFor?.email || ''}?`}
        body="Soft-delete: status → Deleted, sessions revoked. Platform admins cannot be deleted — suspend them instead. Remember to reassign leads, jobs and interviews."
        confirmLabel="Delete user" onConfirm={doDelete} />
    </div>
  );
}

export function InlineFormError({ message }: { message: string }) {
  if (!message) return null;
  return <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{message}</div>;
}

export function OrgUserRefreshHint() {
  return <div className="hidden" aria-hidden="true" />;
}
