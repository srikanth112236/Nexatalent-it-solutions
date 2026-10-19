import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';
import { apiClient } from '../../shared/api-client';
import { persistSession } from '../../shared/auth/session';
import { AuthLayout } from '../../shared/ui/AuthLayout';
import { PasswordInput } from '../../shared/ui/PasswordInput';
import {
  ArrowRight,
  Mail,
  Key,
  CheckCircle2,
  HelpCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { useFormValidation, required, email } from '../../shared/validation';

export function LoginPage() {
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  /* ---- Main login form validation ---- */
  const loginForm = useFormValidation(
    { email: '', password: '' },
    {
      email: [required('Email address'), email()],
      password: [required('Password')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < lockedUntil) {
      const waitSec = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLoginError(`Too many failed attempts. Try again in ${waitSec}s.`);
      return;
    }
    const { isValid, validationMessages } = loginForm.validateForm();
    if (!isValid) {
      setLoginError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.'));
      return;
    }
    setLoginError('');

    try {
      const res = await apiClient.post<any>('/api/v1/auth/login', {
        email: loginForm.values.email.trim(),
        password: loginForm.values.password,
      });

      const body = res?.data && (res.data.accessToken || res.data.user || res.data.mfaRequired || res.data.emailVerificationRequired) ? res.data : res;
      const accessToken: string | undefined = body?.accessToken || body?.token;
      const serverRole = body?.user?.role as UserRole | undefined;
      
      // Email verification required before sign-in
      if (body?.emailVerificationRequired) {
        navigate(`/auth/otp-verify?email=${encodeURIComponent(body.data.email)}&mode=login`, { replace: true });
        return;
      }
      
      if (!accessToken || !serverRole || !ROLE_DEFAULT_REDIRECTS[serverRole]) {
        throw new Error('Invalid email or password. Please try again.');
      }
      const user = body?.user;
      persistSession({
        accessToken,
        refreshToken: body?.refreshToken,
        role: serverRole,
        tenantId: user.tenantId,
        email: user.email || loginForm.values.email.trim(),
      });

      navigate(ROLE_DEFAULT_REDIRECTS[serverRole], { replace: true });
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message || err?.message || 'Sign in failed. Check your credentials and try again.';
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setLockedUntil(Date.now() + 30_000);
        setFailedAttempts(0);
        setLoginError('Too many failed attempts. Try again in 30s.');
      } else {
        setLoginError(serverMsg);
      }
    } finally {
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const forgotEmailVal = forgotEmail.trim();
    if (!forgotEmailVal) {
      setForgotError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmailVal)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    try {
      await apiClient.post('/api/v1/auth/forgot-password', { email: forgotEmailVal });
      setForgotSent(true);
    } catch {
      setForgotSent(true);
    }
  };

  return (
    <>
      <AuthLayout title="Welcome back" subtitle="Sign in to your NexaTalent account">
        {loginError && (
          <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
            <AlertCircle size={15} /> {loginError}
          </div>
        )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Corporate or Account Email *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  value={loginForm.values.email}
                  onChange={(e) => loginForm.setField('email', e.target.value)}
                  onBlur={() => loginForm.setTouchedField('email')}
                  placeholder="user@nexatalent.com"
                  className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-semibold text-xs focus:bg-white focus:border-black outline-none ${
                    loginForm.errorFor('email') ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                />
              </div>
              {loginForm.errorFor('email') && (
                <p className="text-xs text-red-600 font-bold mt-1">{loginForm.errorFor('email')}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-bold text-black hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <PasswordInput
                  value={loginForm.values.password}
                  onChange={(v) => loginForm.setField('password', v)}
                  onBlur={() => loginForm.setTouchedField('password')}
                  placeholder="••••••••••••"
                  error={!!loginForm.errorFor('password')}
                  autoComplete="current-password"
                  inputClassName="pl-10"
                />
              </div>
              {loginForm.errorFor('password') && (
                <p className="text-xs text-red-600 font-bold mt-1">{loginForm.errorFor('password')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginForm.isSubmitting || !loginForm.isValid}
              className="w-full py-3.5 px-5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loginForm.isSubmitting ? 'Signing you in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
           </form>

      {/* Registration Links for All Roles */}
      <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs font-bold text-slate-600">
        <div className="text-[11px] uppercase text-slate-600 tracking-wider font-extrabold mb-1">New Account Onboarding Portals:</div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <Link to="/candidate/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all">
            Candidate Reg →
          </Link>
          <Link to="/employer/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all">
            Employer KYC Reg →
          </Link>
          <Link to="/recruiter/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all">
            Agency Recruiter Reg →
          </Link>
          <Link to="/vendor/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all">
            Vendor Partner Reg →
          </Link>
        </div>
      </div>
      </AuthLayout>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => { setForgotModalOpen(false); setForgotSent(false); }}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-2">
                  <HelpCircle size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Reset Account Password</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Enter your registered corporate or personal email to receive a secure reset link.
                </p>
              </div>

              {forgotError && (
                <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">{forgotError}</div>
              )}
              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs text-black text-center space-y-2">
                  <CheckCircle2 size={24} className="text-black mx-auto" />
                  <div className="font-bold">If an account exists, a reset link was sent</div>
                  <p className="text-slate-600">
                    Check your inbox for further instructions. The link expires shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs" noValidate>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Registered Email Address *</label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="user@company.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!forgotEmail.trim()}
                    className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Send Reset Verification Link
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
