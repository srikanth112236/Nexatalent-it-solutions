import { useEffect, useState } from 'react';
import { mfaApi } from '../../shared/enterprise/phaseApi';
import { Modal, Field } from '../../shared/ui/EnterpriseKit';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

function errMsg(err: unknown): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error)?.message || 'Request failed. Try again.';
}

/** Self-service second factor (§4): TOTP enrol / verify / disable + admin reset. */
export function MfaPanel({ admin = false }: { admin?: boolean }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [setup, setSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [otp, setOtp] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showDisable, setShowDisable] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await mfaApi.status();
      setEnabled(!!((res as { data?: any })?.data?.enabled ?? (res as any)?.enabled));
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const startSetup = async () => {
    setBusy(true); setError(''); setOk('');
    try {
      const res: any = await mfaApi.setup();
      const d = (res as { data?: any })?.data || {};
      setSetup({ secret: d.secret, otpauthUrl: d.otpauthUrl });
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const confirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const res: any = await mfaApi.verify(otp.replace(/\D/g, ''));
      const d = (res as { data?: any })?.data || {};
      setBackupCodes(d.backupCodes || []);
      setSetup(null); setOtp(''); setEnabled(true);
      setOk('Two-factor authentication enabled for your account.');
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await mfaApi.disable(password);
      setShowDisable(false); setPassword(''); setEnabled(false);
      setOk('Two-factor authentication disabled.');
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setBusy(true); setError('');
    try {
      await mfaApi.reset(resetEmail.trim());
      setResetEmail(''); setOk('MFA reset — the user can re-enroll on next sign-in.');
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-slate-900">Two-Factor Authentication</h3>
        <p className="text-xs text-slate-500 font-medium">TOTP second factor (Google Authenticator, Authy, 1Password). Backup codes are single-use.</p>
      </div>
      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{error}</div>}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {loading ? <InlineLoading message="Checking MFA status…" /> : enabled === null ? (
        <EmptyState title="Status unavailable" message="Could not reach the auth service." />
      ) : enabled ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
          <div className="text-xs font-bold text-emerald-900">MFA is ON for your account. Every sign-in needs password + authenticator code.</div>
          <button type="button" onClick={() => setShowDisable(true)} className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs shrink-0">Disable…</button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-700">MFA is OFF. Enable it to protect password-only sign-in.</div>
          <button type="button" disabled={busy} onClick={startSetup} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 disabled:opacity-50">{busy ? 'Starting…' : 'Enable MFA'}</button>
        </div>
      )}
      {setup && (
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
          <div className="text-xs font-extrabold text-slate-900">Step 1 — add this key to your authenticator app</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xs break-all">{setup.secret}</code>
            <button type="button" onClick={() => { try { navigator.clipboard.writeText(setup.secret); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ } }} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs shrink-0">{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <div className="text-[11px] text-slate-500 font-medium break-all">otpauth URI (for QR-capable apps): {setup.otpauthUrl}</div>
          <form onSubmit={confirmSetup} className="flex gap-2">
            <input type="text" inputMode="numeric" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code" aria-label="Authenticator code"
              className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-center tracking-[0.4em] outline-none" />
            <button disabled={busy || otp.length !== 6} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Verifying…' : 'Verify & Enable'}</button>
          </form>
        </div>
      )}
      {backupCodes.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="text-xs font-extrabold text-amber-900">Backup codes — shown once. Store them somewhere safe.</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {backupCodes.map((c) => <code key={c} className="p-2 rounded-lg bg-white border border-amber-200 font-mono font-bold text-[11px] text-center">{c}</code>)}
          </div>
        </div>
      )}
      {admin && (
        <form onSubmit={doReset} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-extrabold text-slate-900">Admin: reset a user's MFA (audited, requires manage_permissions)</div>
          <div className="flex gap-2">
            <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="user@company.com"
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
            <button disabled={busy} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">Reset MFA</button>
          </div>
        </form>
      )}
      <Modal open={showDisable} onClose={() => setShowDisable(false)} title="Disable two-factor authentication" subtitle="Confirm with your password">
        <form onSubmit={doDisable} className="space-y-3">
          <Field label="Current password *"><input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowDisable(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Working…' : 'Disable MFA'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
