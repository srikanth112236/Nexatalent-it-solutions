import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  AlertCircle,
  Briefcase,
  Building2,
  Shield,
  Users,
  Building,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useFormValidation, required, email } from '../../shared/validation';

export interface RolePreset {
  key: string;
  role: UserRole;
  badge: string;
  title: string;
  subtitle: string;
  demoEmail: string;
  demoName: string;
  path: string;
  target: string;
  icon: any;
}

const ROLE_PRESETS: Record<string, RolePreset> = {
  recruiter: {
    key: 'recruiter',
    role: 'recruiter',
    badge: 'Agency Recruiter',
    title: 'Agency Recruiter Portal',
    subtitle: 'Access your full ATS pipeline, candidate CRM, live mandates & interview scorecards.',
    demoEmail: 'vikram@apextechsearch.com',
    demoName: 'Vikram Malhotra',
    path: '/recruiter/login',
    target: '/recruiter',
    icon: Briefcase,
  },
  employer: {
    key: 'employer',
    role: 'employer',
    badge: 'Employer / Client',
    title: 'Employer & Client Portal',
    subtitle: 'Review candidate shortlists, approve interview rounds & manage hiring requisitions.',
    demoEmail: 'aditi@fintechscaleops.io',
    demoName: 'Aditi Sharma',
    path: '/employer/login',
    target: '/employer',
    icon: Building2,
  },
  superadmin: {
    key: 'superadmin',
    role: 'superadmin',
    badge: 'Superadmin Console',
    title: 'Platform Superadmin Console',
    subtitle: 'Multi-tenant directory, global RBAC governance, ATS configuration & system audit.',
    demoEmail: 'superadmin@nexatalent.com',
    demoName: 'Super Admin',
    path: '/superadmin/login',
    target: '/superadmin',
    icon: Shield,
  },
  employee: {
    key: 'employee',
    role: 'employee',
    badge: 'Internal Operations',
    title: 'Operations & Staff Portal',
    subtitle: 'Enterprise requisition delivery, internal sourcing, and workforce fulfillment.',
    demoEmail: 'kiran@nexatalent.com',
    demoName: 'Kiran Sharma',
    path: '/employee/login',
    target: '/employee',
    icon: Users,
  },
  vendor: {
    key: 'vendor',
    role: 'vendor',
    badge: 'Vendor Partner',
    title: 'Vendor Partner Portal',
    subtitle: 'Submit candidate batches, monitor SLA fulfillment & track commission payouts.',
    demoEmail: 'rajesh@techsolutionsvendor.com',
    demoName: 'Rajesh Verma',
    path: '/vendor/login',
    target: '/vendor',
    icon: Building,
  },
  candidate: {
    key: 'candidate',
    role: 'candidate',
    badge: 'Candidate Portal',
    title: 'Candidate Career Portal',
    subtitle: 'Track your applied jobs, view 5-pillar match scores, schedule rounds & accept offers.',
    demoEmail: 'candidate@nexatalent.com',
    demoName: 'Siddharth Nair',
    path: '/candidate/login',
    target: '/candidate',
    icon: GraduationCap,
  },
};

const ENTERPRISE_ROLES: string[] = ['recruiter', 'employer', 'superadmin', 'employee', 'vendor'];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Detect role context from URL path (e.g. /recruiter/login) or query string (?role=recruiter)
  const pathRole = useMemo(() => {
    const p = location.pathname.toLowerCase();
    if (p.startsWith('/recruiter')) return 'recruiter';
    if (p.startsWith('/employer')) return 'employer';
    if (p.startsWith('/superadmin')) return 'superadmin';
    if (p.startsWith('/employee')) return 'employee';
    if (p.startsWith('/vendor')) return 'vendor';
    if (p.startsWith('/candidate')) return 'candidate';

    const params = new URLSearchParams(location.search);
    const qRole = params.get('role')?.toLowerCase();
    if (qRole && ROLE_PRESETS[qRole]) return qRole;
    return null;
  }, [location.pathname, location.search]);

  // Is this an individual role login route (/recruiter/login, /employer/login, etc.) vs general (/login)?
  const isIndividualRoleRoute = Boolean(pathRole);

  // Selected role tab for the unified login page (defaults to recruiter or pathRole)
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>(() => pathRole || 'recruiter');

  useEffect(() => {
    if (pathRole) setSelectedRoleKey(pathRole);
  }, [pathRole]);

  // Read session notification reason (inactivity, sign_out, etc.)
  const sessionNotice = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get('reason');
    if (r === 'inactivity') {
      return {
        type: 'warning',
        message: 'Your session timed out due to inactivity. Please sign in again to continue.',
      };
    }
    if (r === 'sign_out') {
      return {
        type: 'info',
        message: 'You have been safely signed out. Please sign in to resume your session.',
      };
    }
    if (r === 'refresh_failed') {
      return {
        type: 'warning',
        message: 'Your security token expired. Please enter your credentials to reconnect.',
      };
    }
    if (r === 'tenant_missing') {
      return {
        type: 'warning',
        message: 'Tenant verification required. Please sign in to establish your workspace.',
      };
    }
    return null;
  }, [location.search]);

  const activePreset = ROLE_PRESETS[selectedRoleKey] || ROLE_PRESETS.recruiter;

  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [mfa, setMfa] = useState<{ ticket: string; email: string } | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaBusy, setMfaBusy] = useState(false);

  /* ---- Main login form validation ---- */
  const loginForm = useFormValidation(
    { email: '', password: '' },
    {
      email: [required('Email address'), email()],
      password: [required('Password')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  // 1-Click Quick Fill Helper
  const handleAutofillPreset = (preset: RolePreset) => {
    setSelectedRoleKey(preset.key);
    loginForm.setField('email', preset.demoEmail);
    loginForm.setField('password', 'NexaTalent123');
    setLoginError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < lockedUntil) {
      const waitSec = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLoginError(`Too many failed attempts. Try again in ${waitSec}s.`);
      return;
    }
    const { isValid, validationMessages } = loginForm.validateForm();
    if (!isValid) {
      setLoginError(validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.');
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

      // Second factor required — verify the TOTP code before issuing tokens.
      if (body?.mfaRequired) {
        setMfa({ ticket: String(body.ticket || body.mfaTicket || ''), email: body.email || loginForm.values.email.trim() });
        return;
      }

      // Email verification required before sign-in.
      if (body?.emailVerificationRequired) {
        const target = body.email || body.data?.email || loginForm.values.email.trim();
        const params = new URLSearchParams({ email: String(target), mode: 'login' });
        if (body.devCode) params.set('devCode', String(body.devCode));
        navigate(`/auth/otp-verify?${params.toString()}`, { replace: true });
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
        tenantId: user?.tenantId,
        email: user?.email || loginForm.values.email.trim(),
      });

      // Target redirection: deep link in location.state.from (if within user's allowed workspace) or default dashboard
      const requestedFrom = (location.state as any)?.from?.pathname;
      const defaultTarget = ROLE_DEFAULT_REDIRECTS[serverRole] || '/login';
      const finalTarget =
        requestedFrom && (requestedFrom === defaultTarget || requestedFrom.startsWith(`${defaultTarget}/`))
          ? requestedFrom
          : defaultTarget;

      navigate(finalTarget, { replace: true });
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
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfa) return;
    setLoginError('');
    setMfaBusy(true);
    try {
      const res = await apiClient.post<any>('/api/v1/auth/mfa/challenge', { ticket: mfa.ticket, otp: mfaCode.trim() });
      const body = res?.data ?? res;
      const token: string | undefined = body?.accessToken || body?.token;
      const role = body?.user?.role as UserRole | undefined;
      if (!token || !role || !ROLE_DEFAULT_REDIRECTS[role]) {
        throw new Error('That code did not work. Please try again.');
      }
      persistSession({
        accessToken: token,
        refreshToken: body?.refreshToken,
        role,
        tenantId: body?.user?.tenantId,
        email: body?.user?.email || mfa.email,
      });

      const requestedFrom = (location.state as any)?.from?.pathname;
      const defaultTarget = ROLE_DEFAULT_REDIRECTS[role] || '/login';
      const finalTarget =
        requestedFrom && (requestedFrom === defaultTarget || requestedFrom.startsWith(`${defaultTarget}/`))
          ? requestedFrom
          : defaultTarget;

      navigate(finalTarget, { replace: true });
    } catch (err: any) {
      setLoginError(err?.response?.data?.message || err?.message || 'Second factor verification failed.');
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

  const pageTitle = isIndividualRoleRoute ? activePreset.title : 'Welcome to NexaTalent';
  const pageSubtitle = isIndividualRoleRoute
    ? activePreset.subtitle
    : 'Unified Enterprise Sign In — Connect to your recruiter, client, or staff workspace.';

  return (
    <>
      <AuthLayout title={pageTitle} subtitle={pageSubtitle}>
        {/* Session Status Notice (Inactivity, Sign Out, etc.) */}
        {sessionNotice && (
          <div
            className={`mt-4 p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-xs ${
              sessionNotice.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            {sessionNotice.type === 'warning' ? <AlertCircle size={16} className="text-amber-600 shrink-0" /> : <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
            <span>{sessionNotice.message}</span>
          </div>
        )}

        {/* Login Error Notification */}
        {loginError && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2 shadow-xs">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE SELECTION TABS & CANDIDATE BANNER (When on Unified /login)           */}
        {/* ========================================================================= */}
        {!isIndividualRoleRoute ? (
          <div className="mt-5 space-y-3">
            {/* Enterprise Role Selector Tabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Select Enterprise Role
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Direct login supported
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                {ENTERPRISE_ROLES.map((k) => {
                  const p = ROLE_PRESETS[k];
                  const Icon = p.icon;
                  const isSelected = selectedRoleKey === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleAutofillPreset(p)}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80 scale-[1.02]'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                      title={`Sign in as ${p.badge}`}
                    >
                      <Icon size={14} className={isSelected ? 'text-[#0265FF]' : 'text-slate-400'} />
                      <span className="truncate max-w-full text-[10px]">{p.badge.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Demo Pill Bar */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div className="truncate">
                <span className="font-extrabold text-slate-800 flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  {activePreset.demoName} ({activePreset.badge})
                </span>
                <span className="font-mono text-[11px] text-slate-500 truncate block mt-0.5">
                  {activePreset.demoEmail}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAutofillPreset(activePreset)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer transition"
              >
                <Sparkles size={12} className="text-amber-300" />
                Fill Demo
              </button>
            </div>

            {/* Candidate Portal Separate Entrypoint */}
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-[#0265FF] flex items-center justify-center shrink-0">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">Are you a Job Seeker / Candidate?</p>
                  <p className="text-[11px] text-slate-500">Track your applications, interviews & offers.</p>
                </div>
              </div>

              <Link
                to="/candidate/login"
                className="px-3 py-1.5 rounded-xl bg-[#0265FF] hover:bg-[#0256da] text-white font-extrabold text-[11px] flex items-center gap-1 shrink-0 shadow-sm transition"
              >
                Candidate Sign In &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* When on Individual Role Route (e.g. /recruiter/login) */
          <div className="mt-5 space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Dedicated Portal Authentication
                </span>
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {activePreset.badge} &bull; {activePreset.demoName}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {activePreset.demoEmail}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAutofillPreset(activePreset)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer transition"
              >
                <Sparkles size={12} className="text-amber-300" />
                Fill Demo
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <Link to="/login" className="hover:text-slate-900 transition flex items-center gap-1">
                &larr; Switch to Unified Sign In
              </Link>
              {pathRole === 'candidate' ? (
                <Link to="/candidate/register" className="text-[#0265FF] hover:underline font-extrabold">
                  Create Candidate Account &rarr;
                </Link>
              ) : (
                <Link to={`/register/${pathRole}`} className="text-[#0265FF] hover:underline font-extrabold">
                  Register {activePreset.badge} &rarr;
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOGIN FORM & MFA                                                          */}
        {/* ========================================================================= */}
        {mfa ? (
          <form onSubmit={handleMfaSubmit} className="mt-6 space-y-4" noValidate>
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900">
              Two-factor authentication is active for <strong className="font-extrabold">{mfa.email}</strong>. Enter
              the 6-digit verification code from your authenticator app or backup code.
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
              <span>{mfaBusy ? 'Verifying…' : 'Verify & Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { setMfa(null); setMfaCode(''); setLoginError(''); }}
              className="w-full text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
            >
              Use a different account
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="mt-5 space-y-4" noValidate>
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
                  placeholder="user@nexatalent.com"
                  className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-semibold text-xs focus:bg-white focus:border-black outline-none transition ${
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
              className="w-full py-3.5 px-5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loginForm.isSubmitting ? 'Authenticating…' : `Sign In to ${activePreset.badge}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Dedicated Registration Links */}
        <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs font-bold text-slate-600">
          <div className="text-[11px] uppercase text-slate-500 tracking-wider font-extrabold mb-1">
            New Account Registration Portals:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Link
              to="/candidate/register"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all flex items-center justify-between"
            >
              <span>Candidate Career Reg</span>
              <ArrowRight size={12} />
            </Link>
            <Link
              to="/employer/register"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all flex items-center justify-between"
            >
              <span>Employer Client Reg</span>
              <ArrowRight size={12} />
            </Link>
            <Link
              to="/recruiter/register"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all flex items-center justify-between"
            >
              <span>Agency Recruiter Reg</span>
              <ArrowRight size={12} />
            </Link>
            <Link
              to="/vendor/register"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-black text-black hover:text-black transition-all flex items-center justify-between"
            >
              <span>Vendor Partner Reg</span>
              <ArrowRight size={12} />
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
                <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                  {forgotError}
                </div>
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
