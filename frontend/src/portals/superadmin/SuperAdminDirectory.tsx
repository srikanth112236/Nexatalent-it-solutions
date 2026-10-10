import { useMemo, useState } from 'react';
import { directoryApi } from '../../shared/enterprise/phaseApi';
import { syncAll } from '../common/EnterprisePanels';
import { Modal, Select, Field, ConfirmDialog, RowMenu } from '../../shared/ui/EnterpriseKit';
import { CrudToolbar, DetailDrawer, KeyValues, StatusPill, downloadCsv } from '../common/CrudKit';
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
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ displayName: '', industry: '', companySize: '', website: '', plan: '', seats: '', accountManager: '', businessEmail: '', businessPhone: '' });
  const [suspendFor, setSuspendFor] = useState<any>(null);
  const [suspendForm, setSuspendForm] = useState({ reason: '', action: 'suspend' });
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tenants.filter((t) => {
      if (status && String(t.accountStatus || t.status) !== status) return false;
      if (!q) return true;
      return `${t.id} ${t.name || t.legalName} ${t.displayName} ${t.plan}`.toLowerCase().includes(q);
    });
  }, [tenants, search, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const refreshAudit = onAudit;

  const openEdit = (t: any) => {
    setEditing(t);
    setEditForm({
      displayName: t.displayName || t.name || '', industry: t.industry || '', companySize: t.companySize || '',
      website: t.website || '', plan: t.plan || '', seats: String(t.seats || '').split('/')[0].trim() || String(t.seats || ''),
      accountManager: t.accountManager || '', businessEmail: t.businessEmail || '', businessPhone: t.businessPhone || '',
    });
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
        onExport={() => downloadCsv('organizations.csv', filtered, ['id', 'legalName', 'displayName', 'entityType', 'industry', 'companySize', 'website', 'plan', 'seats', 'businessEmail', 'businessPhone', 'accountManager', 'salesOwner', 'verificationStatus', 'accountStatus', 'createdDate'])} />
      {pageRows.length === 0 ? <EmptyState title="No organizations match" message="Adjust filters or provision a new tenant." /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
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
                  <td className="px-4 py-3"><div className="flex justify-end">
                    <RowMenu items={[
                      { label: 'View 360°', onSelect: () => setDetail(t) },
                      { label: 'Edit details', onSelect: () => openEdit(t) },
                      ...((t.verificationStatus === 'Pending') ? [
                        { label: 'Verify — Approve', onSelect: () => doVerify(t, 'approve') },
                        { label: 'Verify — Reject', onSelect: () => doVerify(t, 'reject') },
                      ] : []),
                      { label: (t.accountStatus === 'Suspended' || t.status === 'Suspended') ? 'Reactivate' : 'Suspend…', onSelect: () => { setSuspendFor(t); setSuspendForm({ reason: '', action: (t.accountStatus === 'Suspended') ? 'reactivate' : 'suspend' }); } },
                      { label: 'Close / Delete…', onSelect: () => setDeleteFor(t) },
                    ]} />
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit — ${editing?.id || ''}`} subtitle="Changes are audited with actor + timestamp">
        <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Brand / display name"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.displayName} onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })} /></Field></div>
          <Field label="Industry"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.industry} onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} /></Field>
          <Field label="Company size"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.companySize} onChange={(e) => setEditForm({ ...editForm, companySize: e.target.value })} placeholder="e.g. 51–200" /></Field>
          <Field label="Website"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} /></Field>
          <Field label="Plan"><Select value={editForm.plan} onChange={(v) => setEditForm({ ...editForm, plan: v })} options={['Enterprise Custom', 'Growth Tier', 'Starter SaaS', 'Platform'].map((p) => ({ value: p, label: p }))} /></Field>
          <Field label="Seats"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.seats} onChange={(e) => setEditForm({ ...editForm, seats: e.target.value })} /></Field>
          <Field label="Account manager"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.accountManager} onChange={(e) => setEditForm({ ...editForm, accountManager: e.target.value })} /></Field>
          <Field label="Business email"><input type="email" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.businessEmail} onChange={(e) => setEditForm({ ...editForm, businessEmail: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Saving…' : 'Save changes'}</button>
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
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', department: '', designation: '', branch: '', employeeId: '', reportingManager: '', role: '' });
  const [statusFor, setStatusFor] = useState<any>(null);
  const [statusForm, setStatusForm] = useState({ status: 'Suspended', reason: '', reassignTo: '' });
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (role && u.role !== role) return false;
      if (status && u.status !== status) return false;
      if (!q) return true;
      return `${u.id} ${u.name} ${u.email} ${u.tenantId}`.toLowerCase().includes(q);
    });
  }, [users, search, role, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openEdit = (u: any) => {
    setEditing(u);
    setEditForm({ name: u.name || '', department: u.department || '', designation: u.designation || '', branch: u.branch || '', employeeId: u.employeeId || '', reportingManager: u.reportingManager || '', role: u.role || '' });
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
          onExport={() => downloadCsv('users.csv', filtered, ['id', 'name', 'email', 'role', 'tenantId', 'status', 'lastLogin'])} /></div>
        <div className="flex gap-2">
          <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none">
            <option value="">All roles</option>{ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none">
            <option value="">All statuses</option>{['Active', 'Suspended', 'Deleted'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {pageRows.length === 0 ? <EmptyState title="No users match" message="Adjust search or role filters." /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs min-w-[920px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Last active</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pageRows.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{u.name}</div><div className="text-slate-500 text-[11px]">{u.email} • <span className="font-mono">{u.id}</span></div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px] capitalize">{u.role}</span></td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-700">{u.tenantId}</td>
                  <td className="px-4 py-3 text-slate-500">{u.lastLogin || 'Never'}</td>
                  <td className="px-4 py-3"><StatusPill value={u.status} /></td>
                  <td className="px-4 py-3"><div className="flex justify-end"><RowMenu items={[
                    { label: 'View profile', onSelect: () => setDetail(u) },
                    { label: 'Edit details', onSelect: () => openEdit(u) },
                    { label: u.status === 'Active' ? 'Suspend…' : 'Reactivate…', onSelect: () => { setStatusFor(u); setStatusForm({ status: u.status === 'Active' ? 'Suspended' : 'Active', reason: '', reassignTo: '' }); } },
                    { label: 'Delete…', onSelect: () => setDeleteFor(u) },
                  ]} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
            ['Email', detail.email], ['Role', detail.role], ['Tenant', detail.tenantId],
            ['Employee ID', detail.employeeId || '—'], ['Department', detail.department || '—'],
            ['Designation', detail.designation || '—'], ['Branch', detail.branch || '—'],
            ['Manager', detail.reportingManager || '—'], ['Status', <StatusPill value={detail.status} />],
            ['Last login', detail.lastLogin || 'Never'],
          ]} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { openEdit(detail); setDetail(null); }} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs">Edit</button>
            <button type="button" onClick={() => { setStatusFor(detail); setDetail(null); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Suspend / Reactivate</button>
          </div>
        </DetailDrawer>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit user — ${editing?.email || ''}`} subtitle="Role changes are audited">
        <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Field>
          <Field label="Role"><Select value={editForm.role} onChange={(v) => setEditForm({ ...editForm, role: v })} options={ALL_ROLES.map((r) => ({ value: r, label: r }))} /></Field>
          <Field label="Department"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} /></Field>
          <Field label="Designation"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} /></Field>
          <Field label="Branch"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.branch} onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })} /></Field>
          <Field label="Employee ID"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.employeeId} onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Reporting manager"><input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" value={editForm.reportingManager} onChange={(e) => setEditForm({ ...editForm, reportingManager: e.target.value })} /></Field></div>
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
