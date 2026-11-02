import { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';
import { apiClient } from '../../shared/api-client';
import { persistSession } from '../../shared/auth/session';
import { useAuth, clearPermissionsCache } from '../../shared/auth/AuthContext';
import { AuthLayout } from '../../shared/ui/AuthLayout';
import { PasswordInput } from '../../shared/ui/PasswordInput';
import {
  ArrowRight,
  Mail,
  Key,
  CheckCircle2,
  HelpCircle,
  X,
  AlertCircle,
  ShieldAlert,
  Building2,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useFormValidation, required, email } from '../../shared/validation';

type PortalType = 'general' | 'superadmin' | 'employer' | 'candidate' | 'recruiter' | 'vendor' | 'employee';

interface PortalMeta {
  type: PortalType;
  title: string;
  subtitle: string;
  badge: string;
  badgeCls: string;
  icon: any;
  roleHint?: string;
  allowedRoles?: string[];
  registerLink?: string;
  registerLabel?: string;
}

function detectPortal(pathname: string): PortalMeta {
  const p = pathname.toLowerCase();
  if (p.includes('/candidate/login') || p === '/login/candidate') {
    return {
      type: 'candidate',
      title: 'Candidate Career Portal',
      subtitle: 'Sign in to track applications, attend interviews & log timesheets',
      badge: 'Candidate Portal',
      badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: UserCheck,
      roleHint: 'candidate',
      allowedRoles: ['candidate'],
      registerLink: '/candidate/register',
      registerLabel: 'New candidate? Register & upload profile →',
    };
  }
  if (p.includes('/employer/login') || p === '/login/employer') {
    return {
      type: 'employer',
      title: 'Client & Employer Console',
      subtitle: 'Sign in to raise requisitions, review talent & approve timesheets',
      badge: 'Employer Portal',
      badgeCls: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Building2,
      roleHint: 'employer',
      allowedRoles: ['employer', 'company_admin', 'hiring_manager', 'company_recruiter'],
      registerLink: '/employer/register',
      registerLabel: 'New hiring partner? Register your company →',
    };
  }
  if (p.includes('/superadmin/login') || p === '/login/superadmin') {
    return {
      type: 'superadmin',
      title: 'Operations & SuperAdmin Console',
      subtitle: 'Platform governance, ATS delivery, client requisitions & commercials',
      badge: 'NexaTalent Operations Console',
      badgeCls: 'bg-violet-50 text-violet-700 border-violet-200',
      icon: ShieldCheck,
      roleHint: 'superadmin',
      allowedRoles: [
        'superadmin', 'platform_owner', 'operations_admin', 'internal_recruiter',
        'recruiter', 'employee', 'finance_admin', 'finance_staff', 'sales_admin',
        'sales_manager', 'bda', 'support_admin'
      ],
    };
  }
  if (p.includes('/recruiter/login') || p === '/login/recruiter') {
    return {
      type: 'recruiter',
      title: 'Agency Recruiter Workspace',
      subtitle: 'Sign in to manage submissions, talent pools & client mandates',
      badge: 'Recruiter Workspace',
      badgeCls: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Sparkles,
      roleHint: 'recruiter',
      allowedRoles: ['recruiter', 'agency_admin', 'agency_recruiter', 'internal_recruiter', 'superadmin'],
      registerLink: '/recruiter/register',
      registerLabel: 'Agency partnership? Register recruiter account →',
    };
  }
  if (p.includes('/vendor/login') || p === '/login/vendor') {
    return {
      type: 'vendor',
      title: 'Vendor Partner Portal',
      subtitle: 'Sign in to manage bench consultants & staffing contracts',
      badge: 'Vendor Partner Portal',
      badgeCls: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Building2,
      roleHint: 'vendor',
      allowedRoles: ['vendor', 'superadmin', 'platform_owner'],
      registerLink: '/vendor/register',
      registerLabel: 'Staffing partner? Register vendor account →',
    };
  }
  if (p.includes('/employee/login') || p === '/login/employee') {
    return {
      type: 'employee',
      title: 'Staff & Employee Workspace',
      subtitle: 'Sign in to access your delivery mandates & internal tasks',
      badge: 'Staff Workspace',
      badgeCls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: ShieldCheck,
      roleHint: 'employee',
      allowedRoles: [
        'employee', 'operations_admin', 'internal_recruiter', 'finance_admin',
        'finance_staff', 'sales_admin', 'sales_manager', 'bda', 'superadmin'
      ],
    };
  }

  // General Unified Login (/login)
  return {
    type: 'general',
    title: 'Sign In to NexaTalent',
    subtitle: 'Unified enterprise access for Candidates, Clients, Staff & SuperAdmins',
    badge: 'Universal Login',
    badgeCls: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Sparkles,
  };
}

function getRoleLabel(role: string): string {
  if (role === 'candidate') return 'Candidate';
  if (['employer', 'company_admin', 'hiring_manager', 'company_recruiter'].includes(role)) return 'Employer / Client';
  if (['superadmin', 'platform_owner'].includes(role)) return 'SuperAdmin';
  if (['internal_recruiter', 'recruiter', 'agency_admin', 'agency_recruiter'].includes(role)) return 'Recruiter';
  if (['finance_admin', 'finance_staff'].includes(role)) return 'Finance Staff';
  if (['sales_admin', 'sales_manager', 'bda'].includes(role)) return 'Sales & Growth';
  if (['operations_admin', 'employee'].includes(role)) return 'Operations & HR';
  if (role === 'vendor') return 'Vendor Partner';
  return role;
}

function getCorrectLoginPath(role: string): string {
  if (role === 'candidate') return '/candidate/login';
  if (['employer', 'company_admin', 'hiring_manager', 'company_recruiter'].includes(role)) return '/employer/login';
  if (role === 'vendor') return '/vendor/login';
  return '/superadmin/login';
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSessionUser } = useAuth();

  const portal = useMemo(() => detectPortal(location.pathname), [location.pathname]);

  const [loginError, setLoginError] = useState('');
  const [mismatchError, setMismatchError] = useState<{ actualRole: string; targetLogin: string; roleLabel: string } | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [mfa, setMfa] = useState<{ ticket: string; email: string } | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaBusy, setMfaBusy] = useState(false);

  // Check for session notification from logout or inactivity timeout
  const searchParams = new URLSearchParams(location.search);
  const sessionReason = searchParams.get('reason');

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
    setMismatchError(null);

    if (Date.now() < lockedUntil) {
      const waitSec = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLoginError(`Too many failed attempts. For security, please wait ${waitSec}s before retrying.`);
      return;
    }
    const { isValid, validationMessages } = loginForm.validateForm();
    if (!isValid) {
      setLoginError(validationMessages && validationMessages.length ? validationMessages[0] : 'Please enter your email and password.');
      return;
    }
    setLoginError('');

    try {
      // Pass roleHint only if logging in from a dedicated portal
      const payload: Record<string, string> = {
        email: loginForm.values.email.trim(),
        password: loginForm.values.password,
      };
      if (portal.type !== 'general' && portal.roleHint) {
        payload.role = portal.roleHint;
      }

      const res = await apiClient.post<any>('/api/v1/auth/login', payload);
      const body = res?.data && (res.data.accessToken || res.data.user || res.data.mfaRequired || res.data.emailVerificationRequired) ? res.data : res;
      const accessToken: string | undefined = body?.accessToken || body?.token;
      const serverRole = body?.user?.role as UserRole | undefined;

      // Second factor required
      if (body?.mfaRequired) {
        setMfa({ ticket: String(body.ticket || body.mfaTicket || ''), email: body.email || loginForm.values.email.trim() });
        return;
      }

      // Email verification required before sign-in
      if (body?.emailVerificationRequired) {
        const target = body.email || body.data?.email || loginForm.values.email.trim();
        const params = new URLSearchParams({ email: String(target), mode: 'login' });
        if (body.devCode) params.set('devCode', String(body.devCode));
        navigate(`/auth/otp-verify?${params.toString()}`, { replace: true });
        return;
      }

      if (!accessToken || !serverRole || !ROLE_DEFAULT_REDIRECTS[serverRole]) {
        throw new Error('Incorrect email or password. Please verify your credentials and try again.');
      }

      // Client-side verification: if dedicated portal, ensure the serverRole is authorized
      if (portal.type !== 'general' && portal.allowedRoles && !portal.allowedRoles.includes(serverRole)) {
        const roleLabel = getRoleLabel(serverRole);
        const targetLogin = getCorrectLoginPath(serverRole);
        setMismatchError({ actualRole: serverRole, targetLogin, roleLabel });
        setLoginError(`This portal is for ${portal.badge} accounts. Your account is registered as ${roleLabel}.`);
        return;
      }

      const user = body?.user;
      persistSession({
        accessToken,
        refreshToken: body?.refreshToken,
        role: serverRole,
        tenantId: user?.tenantId,
        email: user?.email || loginForm.values.email.trim(),
      });
      clearPermissionsCache();

      // Immediately synchronize React Auth Context so RoleGuard recognizes user on navigate
      setSessionUser({
        id: user?.id,
        email: user?.email || loginForm.values.email.trim(),
        role: serverRole,
        tenantId: user?.tenantId,
        permissions: Array.isArray(user?.permissions) ? user.permissions : undefined,
      });

      // Target redirection
      const requestedFrom = (location.state as any)?.from?.pathname;
      const defaultTarget = ROLE_DEFAULT_REDIRECTS[serverRole] || '/superadmin';
      const finalTarget =
        requestedFrom && requestedFrom !== '/login' && !requestedFrom.endsWith('/login') && (requestedFrom === defaultTarget || requestedFrom.startsWith(`${defaultTarget}/`))
          ? requestedFrom
          : defaultTarget;

      navigate(finalTarget, { replace: true });
    } catch (err: any) {
      const errData = err?.response?.data;
      if (errData?.code === 'PORTAL_MISMATCH' && errData?.actualRole) {
        const roleLabel = getRoleLabel(errData.actualRole);
        const targetLogin = getCorrectLoginPath(errData.actualRole);
        setMismatchError({ actualRole: errData.actualRole, targetLogin, roleLabel });
        setLoginError(`This portal is for ${portal.badge} accounts. Your account is registered as ${roleLabel}.`);
        return;
      }

      const serverMsg =
        err?.response?.data?.message || err?.message || 'Incorrect email or password. Please verify your credentials and try again.';
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setLockedUntil(Date.now() + 30_000);
        setFailedAttempts(0);
        setLoginError('Too many failed attempts. For your security, this sign-in is paused for 30s.');
      } else {
        setLoginError(serverMsg);
      }
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfa) return;
    setLoginError('');
    setMismatchError(null);
    setMfaBusy(true);
    try {
      const res = await apiClient.post<any>('/api/v1/auth/mfa/challenge', { ticket: mfa.ticket, otp: mfaCode.trim() });
      const body = res?.data ?? res;
      const token: string | undefined = body?.accessToken || body?.token;
      const role = body?.user?.role as UserRole | undefined;
      if (!token || !role || !ROLE_DEFAULT_REDIRECTS[role]) {
        throw new Error('Authentication code invalid or expired. Please try again.');
      }

      if (portal.type !== 'general' && portal.allowedRoles && !portal.allowedRoles.includes(role)) {
        const roleLabel = getRoleLabel(role);
        const targetLogin = getCorrectLoginPath(role);
        setMismatchError({ actualRole: role, targetLogin, roleLabel });
        setLoginError(`This portal is for ${portal.badge} accounts. Your account is registered as ${roleLabel}.`);
        return;
      }

      persistSession({
        accessToken: token,
        refreshToken: body?.refreshToken,
        role,
        tenantId: body?.user?.tenantId,
        email: body?.user?.email || mfa.email,
      });
      clearPermissionsCache();

      setSessionUser({
        id: body?.user?.id,
        email: body?.user?.email || mfa.email,
        role,
        tenantId: body?.user?.tenantId,
        permissions: Array.isArray(body?.user?.permissions) ? body.user.permissions : undefined,
      });

      const requestedFrom = (location.state as any)?.from?.pathname;
      const defaultTarget = ROLE_DEFAULT_REDIRECTS[role] || '/superadmin';
      const finalTarget =
        requestedFrom && requestedFrom !== '/login' && !requestedFrom.endsWith('/login') && (requestedFrom === defaultTarget || requestedFrom.startsWith(`${defaultTarget}/`))
          ? requestedFrom
          : defaultTarget;

      navigate(finalTarget, { replace: true });
    } catch (err: any) {
      setLoginError(err?.response?.data?.message || err?.message || 'Two-factor verification failed. Please check the code.');
    } finally {
      setMfaBusy(false);
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

  const PortalIcon = portal.icon;

  return (
    <>
      <AuthLayout title={portal.title} subtitle={portal.subtitle}>
        {/* Portal Identifier Pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${portal.badgeCls}`}>
            <PortalIcon size={13} /> {portal.badge}
          </span>
          {portal.type !== 'general' && (
            <Link to="/login" className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition underline underline-offset-2">
              All portalls
            </Link>
          )}
        </div>

        {/* Informational Session Alerts */}
        {sessionReason === 'inactivity' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold flex items-center gap-2">
            <AlertCircle size={15} /> Your session timed out due to inactivity. Please sign in again.
          </div>
        )}
        {sessionReason === 'sign_out' && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 size={15} /> You have been safely signed out.
          </div>
        )}
        {sessionReason === 'refresh_failed' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold flex items-center gap-2">
            <AlertCircle size={15} /> Your session expired. Please sign in to reconnect.
          </div>
        )}

        {/* Portal Mismatch Card - User-Centric & Actionable */}
        {mismatchError && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2.5 shadow-sm">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">Portal Authorization Notice</h4>
                <p className="text-xs font-semibold text-amber-800 mt-0.5 leading-relaxed">
                  Your credentials belong to an active <strong className="text-amber-950 underline">{mismatchError.roleLabel}</strong> account.
                  This page is reserved for <strong>{portal.badge}</strong> users.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-amber-800">Use your dedicated login page:</span>
              <Link
                to={mismatchError.targetLogin}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow"
              >
                Go to {mismatchError.roleLabel} Sign In <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Standard User-Centric Error Notice */}
        {loginError && !mismatchError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
            <div className="leading-snug">{loginError}</div>
          </div>
        )}

        {mfa ? (
          <form onSubmit={handleMfaSubmit} className="mt-4 space-y-4" noValidate>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900">
              Two-factor authentication is on for <span className="font-extrabold">{mfa.email}</span>. Enter the 6-digit
              code from your authenticator app, or a backup code.
            </div>
            <div>
              <label htmlFor="login-mfa" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Authentication code *
              </label>
              <input
                id="login-mfa"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456 or backup code"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-900 font-mono font-bold text-sm tracking-widest focus:bg-white focus:border-black outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={mfaBusy || mfaCode.trim().length < 6}
              className="w-full py-3.5 px-5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{mfaBusy ? 'Verifying…' : 'Verify and sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { setMfa(null); setMfaCode(''); setLoginError(''); setMismatchError(null); }}
              className="w-full text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
            >
              Use a different account
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="mt-4 space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  value={loginForm.values.email}
                  onChange={(e) => loginForm.setField('email', e.target.value)}
                  onBlur={() => loginForm.setTouchedField('email')}
                  placeholder={portal.type === 'candidate' ? 'candidate@domain.com' : portal.type === 'employer' ? 'hr@company.com' : 'user@nexatalent.com'}
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
              <span>{loginForm.isSubmitting ? 'Verifying access...' : `Sign in to ${portal.badge}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Portal Switcher & Dedicated Registration Links */}
        <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
          {portal.registerLink && portal.registerLabel && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Link to={portal.registerLink} className="text-xs font-extrabold text-blue-700 hover:underline">
                {portal.registerLabel}
              </Link>
            </div>
          )}

          <div className="text-[11px] uppercase text-slate-500 tracking-wider font-extrabold">
            Dedicated Portal Sign-Ins:
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
            <Link
              to="/candidate/login"
              className={`p-2 rounded-xl border text-center transition ${
                portal.type === 'candidate' ? 'bg-black text-white border-black' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-black'
              }`}
            >
              Candidate
            </Link>
            <Link
              to="/employer/login"
              className={`p-2 rounded-xl border text-center transition ${
                portal.type === 'employer' ? 'bg-black text-white border-black' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-black'
              }`}
            >
              Employer
            </Link>
            <Link
              to="/superadmin/login"
              className={`p-2 rounded-xl border text-center transition ${
                portal.type === 'superadmin' ? 'bg-black text-white border-black' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-black'
              }`}
            >
              SuperAdmin
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
