import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Building2, CheckCircle2, KeyRound, Loader2, LogOut, Mail, Save, ShieldCheck, UserRound,
} from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { platformApi } from '../../shared/enterprise/phaseApi';
import { useAuth } from '../../shared/auth/AuthContext';
import { getTenantId, getUserEmail } from '../../shared/auth/session';

const KINDS: Array<{ key: string; label: string; hint: string }> = [
  { key: 'application', label: 'Applications', hint: 'New candidates landing on your mandates' },
  { key: 'interview', label: 'Interviews', hint: 'Scheduled, rescheduled and cancelled interviews' },
  { key: 'offer', label: 'Offers', hint: 'Offer approvals and candidate responses' },
  { key: 'placement', label: 'Placements', hint: 'Placements, start dates and replacements' },
  { key: 'chat', label: 'Messages', hint: 'Client and candidate conversations' },
  { key: 'info_request', label: 'Information requests', hint: 'Missing documents and clarifications' },
  { key: 'billing', label: 'Billing', hint: 'Invoices, payment terms and reminders' },
  { key: 'other', label: 'Everything else', hint: 'System notices and platform updates' },
];

function prettyName(email: string): string {
  const local = String(email || '').split('@')[0] || '';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export function EmployeeSettingsPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const email = user?.email || getUserEmail() || '';
  const role = user?.role || '';
  const tenantId = user?.tenantId || getTenantId() || '—';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [inApp, setInApp] = useState(true);
  const [emailCh, setEmailCh] = useState(true);
  const [kinds, setKinds] = useState<Record<string, boolean>>(
    Object.fromEntries(KINDS.map((k) => [k.key, true])),
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await platformApi.prefs();
      const body = res?.data ?? res;
      const row = Array.isArray(body) ? body[0] : body?.data?.[0] ?? body;
      if (row && typeof row === 'object') {
        setInApp(row.inApp !== false);
        setEmailCh((row.emailCh ?? row.email ?? true) !== false);
        setKinds((prev) => ({ ...prev, ...(row.kinds || {}) }));
      }
    } catch {
      // Defaults are fine when the account has never saved preferences.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (patch?: Partial<{ inApp: boolean; emailCh: boolean; kinds: Record<string, boolean> }>) => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await platformApi.savePrefs({
        inApp: patch?.inApp ?? inApp,
        emailCh: patch?.emailCh ?? emailCh,
        kinds: patch?.kinds ?? kinds,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not save your preferences.');
    } finally {
      setSaving(false);
    }
  };

  const revokeAll = async () => {
    if (!window.confirm('Sign out of every device? You will need to sign in again here.')) return;
    try {
      await apiClient.post('/api/v1/auth/sessions/revoke-all', {});
    } catch {
      /* even if the call fails, clear locally below */
    }
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900">Settings</h2>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          Your profile, notification preferences and session security.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* profile */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <UserRound size={15} className="text-[#0B5FD9]" /> Profile
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#071B3A] to-[#0B5FD9] text-sm font-extrabold text-white">
              {(prettyName(email) || 'U').slice(0, 1)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold text-slate-900">{prettyName(email) || 'Team member'}</div>
              <div className="truncate text-[11px] font-semibold text-slate-500">{email || 'No email on file'}</div>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-[11px]">
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <dt className="inline-flex items-center gap-1.5 font-bold text-slate-500"><ShieldCheck size={12} /> Role</dt>
              <dd className="font-extrabold capitalize text-slate-900">{role || '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <dt className="inline-flex items-center gap-1.5 font-bold text-slate-500"><Building2 size={12} /> Tenant</dt>
              <dd className="font-mono font-extrabold text-slate-900">{tenantId}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <dt className="inline-flex items-center gap-1.5 font-bold text-slate-500"><Mail size={12} /> Sign-in</dt>
              <dd className="font-extrabold text-slate-900">Password + email OTP</dd>
            </div>
          </dl>
          <p className="mt-3 text-[10px] font-semibold text-slate-500">
            Name and email changes are handled by your administrator to keep the audit trail intact.
          </p>
        </section>

        {/* notifications */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <Bell size={15} className="text-[#0B5FD9]" /> Notifications
            </h3>
            <button
              type="button"
              onClick={() => save()}
              disabled={saving || loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#071B3A] px-3 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
              {saved ? 'Saved' : 'Save preferences'}
            </button>
          </div>

          {error && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700">{error}</p>}

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
              <span>
                <span className="block text-xs font-extrabold text-slate-900">In-app alerts</span>
                <span className="block text-[10px] font-semibold text-slate-500">Bell icon and notification centre</span>
              </span>
              <input
                type="checkbox"
                checked={inApp}
                onChange={(e) => { setInApp(e.target.checked); save({ inApp: e.target.checked }); }}
                className="h-4 w-4 rounded border-slate-300 text-[#0B5FD9] focus:ring-[#0B5FD9]"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
              <span>
                <span className="block text-xs font-extrabold text-slate-900">Email alerts</span>
                <span className="block text-[10px] font-semibold text-slate-500">Sent to {email || 'your inbox'}</span>
              </span>
              <input
                type="checkbox"
                checked={emailCh}
                onChange={(e) => { setEmailCh(e.target.checked); save({ emailCh: e.target.checked }); }}
                className="h-4 w-4 rounded border-slate-300 text-[#0B5FD9] focus:ring-[#0B5FD9]"
              />
            </label>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Notify me about</div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {KINDS.map((k) => (
                <label key={k.key} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={kinds[k.key] !== false}
                    onChange={(e) => {
                      const next = { ...kinds, [k.key]: e.target.checked };
                      setKinds(next);
                      save({ kinds: next });
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0B5FD9] focus:ring-[#0B5FD9]"
                  />
                  <span>
                    <span className="block text-[11px] font-extrabold text-slate-900">{k.label}</span>
                    <span className="block text-[10px] font-semibold text-slate-500">{k.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* security */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <KeyRound size={15} className="text-[#0B5FD9]" /> Security
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/employee/security')}
            className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-left hover:bg-slate-50"
          >
            <span>
              <span className="block text-xs font-extrabold text-slate-900">Two-factor authentication</span>
              <span className="block text-[10px] font-semibold text-slate-500">Authenticator app and backup codes</span>
            </span>
            <ShieldCheck size={15} className="text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/employee/notifications')}
            className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-left hover:bg-slate-50"
          >
            <span>
              <span className="block text-xs font-extrabold text-slate-900">Notification centre</span>
              <span className="block text-[10px] font-semibold text-slate-500">Everything that happened recently</span>
            </span>
            <Bell size={15} className="text-slate-400" />
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50/60 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-extrabold text-red-800">Sign out everywhere</div>
            <div className="text-[10px] font-semibold text-red-700/80">Revokes every active session, including this one.</div>
          </div>
          <button
            type="button"
            onClick={revokeAll}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-red-300 bg-white px-3 py-1.5 text-[11px] font-extrabold text-red-700 hover:bg-red-50"
          >
            <LogOut size={12} /> Revoke all sessions
          </button>
        </div>
      </section>
    </div>
  );
}
