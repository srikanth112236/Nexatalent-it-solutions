import { useEffect, useState } from 'react';
import { mfaApi } from '../../shared/enterprise/phaseApi';
import { Modal, Field } from '../../shared/ui/EnterpriseKit';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { useFormValidation, required } from '../../shared/validation';

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
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showDisable, setShowDisable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  // Phase 6.3: own session visibility + revoke-all
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessNote, setSessNote] = useState('');

  /* ---------- validation for MFA forms ---------- */
  const mfaOtpForm = useFormValidation(
    { otp: '' },
    { otp: [required('Authenticator code')] },
    { validateOnChange: true, validateOnBlur: true }
  );
  const mfaResetForm = useFormValidation(
    { resetEmail: '' },
    { resetEmail: [required('Email address')] },
    { validateOnChange: true, validateOnBlur: true }
  );
  const mfaDisableForm = useFormValidation(
    { password: '' },
    { password: [required('Current password')] },
    { validateOnChange: true, validateOnBlur: true }
  );

  const loadSessions = async () => {
    try {
      const res: any = await mfaApi.sessions();
      const list = (res as any)?.data?.data || (res as any)?.data || [];
      setSessions(Array.isArray(list) ? list : []);
      setSessNote(String((res as any)?.data?.note || ''));
    } catch { setSessions([]); }
  };
  useEffect(() => { loadSessions(); }, []);
  const revokeAll = async () => {
    if (!window.confirm('Sign out all other sessions? You stay signed in here; others expire within 15 minutes.')) return;
    setBusy(true); setError('');
    try {
      const res: any = await mfaApi.revokeAllSessions();
      setOk((res as any)?.message || (res as any)?.data?.message || 'Sessions revoked.');
      loadSessions();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

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
    const { isValid, validationMessages } = mfaOtpForm.validateForm();
    if (!isValid) {
      setError(validationMessages[0] || 'Please enter the 6-digit authenticator code.');
      setBusy(false);
      return;
    }
    try {
      const res: any = await mfaApi.verify(mfaOtpForm.values.otp.replace(/\D/g, ''));
      const d = (res as { data?: any })?.data || {};
      setBackupCodes(d.backupCodes || []);
      setSetup(null); setEnabled(true);
      setOk('Two-factor authentication enabled for your account.');
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { isValid, validationMessages } = mfaDisableForm.validateForm();
    if (!isValid) {
      setError(validationMessages[0] || 'Please enter your current password.');
      setBusy(false);
      return;
    }
    try {
      await mfaApi.disable(mfaDisableForm.values.password);
      setShowDisable(false); setEnabled(false);
      setOk('Two-factor authentication disabled.');
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { isValid, validationMessages } = mfaResetForm.validateForm();
    if (!isValid) {
      setError(validationMessages[0] || 'Please enter a valid email address.');
      setBusy(false);
      return;
    }
    try {
      await mfaApi.reset(mfaResetForm.values.resetEmail.trim());
      setOk('MFA reset — the user can re-enroll on next sign-in.');
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
          <button type="button" disabled={busy} onClick={startSetup} className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shrink-0 disabled:opacity-50">{busy ? 'Starting…' : 'Enable MFA'}</button>
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
          <form onSubmit={confirmSetup} className="flex gap-2" noValidate>
            <input
              type="text" inputMode="numeric" maxLength={6} value={mfaOtpForm.values.otp}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); mfaOtpForm.setField('otp', v); }}
              onBlur={() => mfaOtpForm.setTouchedField('otp')}
              placeholder="6-digit code" aria-label="Authenticator code"
              className={`flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-center tracking-[0.4em] outline-none ${mfaOtpForm.errorFor('otp') ? 'border-red-400 focus:border-red-400' : ''}`}
            />
            {mfaOtpForm.errorFor('otp') && <span className="text-xs text-red-600 font-bold">{mfaOtpForm.errorFor('otp')}</span>}
            <button disabled={busy || !mfaOtpForm.isValid} className="px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Verifying…' : 'Verify & Enable'}</button>
          </form>
        </div>
      )}
      {backupCodes.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="text-xs font-extrabold text-amber-900">Backup codes — shown once. Store them somewhere safe, then dismiss.</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {backupCodes.map((c) => <code key={c} className="p-2 rounded-lg bg-white border border-amber-200 font-mono font-bold text-[11px] text-center">{c}</code>)}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={() => { setBackupCodes([]); setOk('Backup codes dismissed from this screen. Keep your saved copy.'); }} className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs">I've saved them — clear screen</button>
          </div>
        </div>
      )}
      {admin && (
        <form onSubmit={doReset} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2" noValidate>
          <div className="text-xs font-extrabold text-slate-900">Admin: reset a user's MFA (audited, requires manage_permissions)</div>
          <div className="flex gap-2">
            <input
              type="email" value={mfaResetForm.values.resetEmail}
              onChange={(e) => { mfaResetForm.setField('resetEmail', e.target.value); }}
              onBlur={() => mfaResetForm.setTouchedField('resetEmail')}
              placeholder="user@company.com"
              className={`flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none ${mfaResetForm.errorFor('resetEmail') ? 'border-red-400 focus:border-red-400' : ''}`}
            />
            {mfaResetForm.errorFor('resetEmail') && <span className="text-xs text-red-600 font-bold">{mfaResetForm.errorFor('resetEmail')}</span>}
            <button disabled={busy || !mfaResetForm.isValid} className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs disabled:opacity-50">Reset MFA</button>
          </div>
        </form>
      )}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-xs font-extrabold text-slate-900">Active sessions ({sessions.length})</div>
          <button type="button" onClick={revokeAll} disabled={busy || sessions.length === 0} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] disabled:opacity-50">Revoke all others…</button>
        </div>
        {sessions.length === 0 ? (
          <div className="text-[11px] text-slate-500 font-medium">No other sessions on record.</div>
        ) : (
          <div className="space-y-1.5">
            {sessions.slice(0, 8).map((s: any, i: number) => (
              <div key={String(s.id || i)} className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
                <span className="font-mono truncate">{String(s.id || '').slice(0, 18)}…</span>
                <span className="truncate">{s.role || ''} • {String(s.createdAt || '').slice(0, 16).replace('T', ' ')}</span>
                {s.revoked && <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[10px]">revoked</span>}
              </div>
            ))}
          </div>
        )}
        {sessNote && <div className="text-[11px] text-slate-500 font-medium">{sessNote}</div>}
      </div>
      <Modal open={showDisable} onClose={() => setShowDisable(false)} title="Disable two-factor authentication" subtitle="Confirm with your password">
        <form onSubmit={doDisable} className="space-y-3" noValidate>
          <Field label="Current password *"><input type="password" autoComplete="current-password" value={mfaDisableForm.values.password} onChange={(e) => { mfaDisableForm.setField('password', e.target.value); }} onBlur={() => mfaDisableForm.setTouchedField('password')} className={`w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none ${mfaDisableForm.errorFor('password') ? 'border-red-400 focus:border-red-400' : ''}`} /></Field>
          {mfaDisableForm.errorFor('password') && <span className="text-xs text-red-600 font-bold">{mfaDisableForm.errorFor('password')}</span>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowDisable(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy || !mfaDisableForm.isValid} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Working…' : 'Disable MFA'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
