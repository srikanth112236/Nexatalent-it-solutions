/* ============================================================================
   NexaTalent — Email OTP Verification
   6-digit code sent to email, valid 10 minutes. Plain-English messages only.
   ============================================================================ */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { Logo } from '../../website/components/Logo';
import { persistSession } from '../../shared/auth/session';
import type { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';

export function OtpVerifyPage({ email, purpose, mode }: { email?: string; purpose?: string; mode?: 'register' | 'login' | 'reset' }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // The route is mounted without props, so the address travels in the query
  // string (?email=…&mode=login). Without this the page showed a blank address
  // and every verification request failed with "email required".
  const queryEmail = params.get('email') || '';
  const queryMode = params.get('mode');
  const targetEmail = (email || queryEmail).trim();
  const effectiveMode: 'register' | 'login' | 'reset' | 'verify' =
    mode || (queryMode === 'register' || queryMode === 'login' || queryMode === 'reset' ? queryMode : 'verify');
  const effectivePurpose = purpose || (effectiveMode === 'register' ? 'register' : 'verify');
  const devCode = params.get('devCode') || '';

  const splitCode = (value: string) => {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 6).split('');
    while (digits.length < 6) digits.push('');
    return digits;
  };

  const [code, setCode] = useState(devCode.replace(/\D/g, '').slice(0, 6));
  const [activeCode, setActiveCode] = useState<string[]>(splitCode(devCode));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) setResendEnabled(true);
  }, [secondsLeft]);

  const handleDigitChange = (idx: number, val: string) => {
    const next = [...activeCode];
    next[idx] = val;
    setActiveCode(next);
    setCode(next.join(''));
    setError('');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = pasted.split('');
    while (next.length < 6) next.push('');
    setActiveCode(next);
    setCode(next.join(''));
    setError('');
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      const next = [...activeCode];
      next[idx] = '';
      if (idx > 0) {
        setTimeout(() => {
          const el = document.getElementById(`otp-${idx - 1}`);
          el?.focus();
        }, 10);
      }
      setActiveCode(next);
      setCode(next.join(''));
      setError('');
    } else if (e.key === 'ArrowRight' && idx < 5) {
      setTimeout(() => {
        const el = document.getElementById(`otp-${idx + 1}`);
        el?.focus();
      }, 10);
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      setTimeout(() => {
        const el = document.getElementById(`otp-${idx - 1}`);
        el?.focus();
      }, 10);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');
    if (!targetEmail) {
      setError('No email address to verify. Please sign in again.');
      return;
    }
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the code.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<any>('/api/v1/auth/verify-otp', {
        email: targetEmail,
        code,
      });
      const body = res?.data ?? res;

      /* If this was a registration, complete the account creation now that
         email is verified, then start onboarding animation. */
      if (effectiveMode === 'register') {
        const pendingRaw = sessionStorage.getItem('nexatalent:pending_register');
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          const regRes = await apiClient.post<any>('/api/v1/auth/register/candidate', pending);
          const created = regRes?.data ?? regRes;
          sessionStorage.removeItem('nexatalent:pending_register');
          setOk(`Account created. Verification ID: ${created?.id || 'RECEIVED'}`);
        }
        setTimeout(() => {
          navigate('/onboarding/animation?role=candidate', { replace: true });
        }, 1500);
      } else {
        // Sign-in verification hands back a real session — persist it and land
        // in the caller's own workspace instead of bouncing to /login.
        const token: string | undefined = body?.accessToken || body?.token;
        const role = body?.user?.role as UserRole | undefined;
        if (token && role && ROLE_DEFAULT_REDIRECTS[role]) {
          persistSession({
            accessToken: token,
            refreshToken: body?.refreshToken,
            role,
            tenantId: body?.user?.tenantId,
            email: body?.user?.email || targetEmail,
          });
          setOk('Email verified. Taking you to your workspace…');
          setTimeout(() => {
            navigate(ROLE_DEFAULT_REDIRECTS[role], { replace: true });
          }, 700);
        } else {
          setOk(body?.message || 'Email verified successfully.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setOk('');
    try {
      const res = await apiClient.post<any>('/api/v1/auth/resend-otp', {
        email: targetEmail,
        purpose: effectivePurpose,
      });
      // Local/dev convenience: the API may echo the generated code.
      const echoed = (res as any)?.data?.devCode || (res as any)?.devCode;
      if (echoed) {
        setActiveCode(splitCode(String(echoed)));
        setCode(String(echoed));
      }
      setSecondsLeft(600);
      setResendEnabled(false);
      setOk('A new code has been sent to your email.');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Could not resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
          padding: '2.5rem',
          minWidth: '360px',
          width: '100%',
          maxWidth: '420px',
        }}
        className="relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-neutral-100 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Logo />
          <div className="mt-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {effectiveMode === 'register' ? 'Verify Your Email' : 'Verify Your Identity'}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Enter the 6-digit code sent to{' '}
              <span className="font-bold text-slate-900">{targetEmail || 'your email'}</span>.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Code expires in{' '}
              <span className="font-bold text-slate-900">
                {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s
              </span>
            </p>
          </div>

          {error && (
            <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          {ok && (
            <div className="mt-5 p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-black font-bold flex items-center gap-2">
              <CheckCircle2 size={15} className="text-black" /> {ok}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={activeCode[i]}
                  onChange={(e) => handleDigitChange(i, e.target.value.replace(/\D/g, ''))}
                  onPaste={handlePaste}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoComplete="one-time-code"
                  className="w-10 h-11 rounded-xl bg-slate-50 border border-slate-300 text-center font-mono font-bold text-lg text-slate-900 focus:bg-white focus:border-black outline-none transition-all"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">
                Didn't receive a code?
                {resendEnabled ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="ml-1 text-xs font-bold text-black hover:underline cursor-pointer"
                  >
                    Resend code
                  </button>
                ) : (
                  <span className="ml-1 text-xs text-slate-500">
                    Resend in {Math.ceil(secondsLeft / 60)}m
                  </span>
                )}
              </span>
              <button
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg shadow-black/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowRight size={16} />
                <span>{isSubmitting ? 'Verifying…' : 'Verify Code'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need help?{' '}
              <Link to="/login" className="text-black font-bold hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
