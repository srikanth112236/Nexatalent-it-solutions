import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';
import { Logo } from '../../website/components/Logo';
import { apiClient } from '../../shared/api-client';
import { persistSession } from '../../shared/auth/session';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Key,
  CheckCircle2,
  HelpCircle,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const logoutReason = queryParams.get('reason');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < lockedUntil) {
      const waitSec = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLoginError(`Too many failed attempts. Try again in ${waitSec}s.`);
      return;
    }
    setIsSubmitting(true);
    setLoginError('');

    try {
      // No workspace picker: the server owns role assignment and returns the
      // stored role for this account. We navigate by the server's answer only.
      const res = await apiClient.post<any>('/api/v1/auth/login', {
        email: email.trim(),
        password,
      });

      // Accept both ApiResponse-wrapped and legacy top-level shapes. Never fabricate.
      const body = res?.data && (res.data.accessToken || res.data.user) ? res.data : res;
      const accessToken: string | undefined = body?.accessToken || body?.token;
      const serverRole = body?.user?.role as UserRole | undefined;
      if (!accessToken || !serverRole || !ROLE_DEFAULT_REDIRECTS[serverRole]) {
        throw new Error('Invalid email or password. Please try again.');
      }
      const user = body?.user;
      persistSession({
        accessToken,
        refreshToken: body?.refreshToken,
        role: serverRole,
        tenantId: user.tenantId,
        email: user.email || email.trim(),
      });

      navigate(ROLE_DEFAULT_REDIRECTS[serverRole], { replace: true });
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message || err?.message || 'Sign in failed. Check your credentials and try again.';
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        // Client-side brute-force throttle (backend rate-limit is the real control)
        setLockedUntil(Date.now() + 30_000);
        setFailedAttempts(0);
        setLoginError('Too many failed attempts. Try again in 30s.');
      } else {
        setLoginError(serverMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    try {
      await apiClient.post('/api/v1/auth/forgot-password', { email: forgotEmail.trim() });
      setForgotSent(true);
    } catch {
      // Always show a generic message to prevent account enumeration.
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative">
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.3,
          pointerEvents: 'none'
        }}
      />

      <div className="relative z-10 w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Brand Column */}
        <div className="md:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="mb-8">
              <Link to="/" className="inline-block bg-white p-2.5 rounded-xl shadow-sm">
                <Logo height={34} />
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise Single Sign-On (SSO)</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
              NexaTalent IT Solutions <br /> Authentication Gateway
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Unified authentication console for enterprise clients, candidates, recruiters, and administrative leads across India & global tech hubs.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>72-Hour Calibrated Technical Shortlists</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audited Open-Book Cost-Plus Margin Terms</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>90-Day Placement Replacement Protection</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock size={13} className="text-emerald-400" /> ISO 27001 & DPDP Act Certified
            </span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Account Sign In
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Enter your account email and password. You will land in your assigned workspace automatically.
              </p>
            </div>

            {logoutReason === 'inactivity' && (
              <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You have been securely signed out due to 15 minutes of inactivity. Please sign in again.</span>
              </div>
            )}
            {logoutReason === 'session_expired' && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Your session token has expired. Please sign in again to resume your session.</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Corporate or Account Email *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@nexatalent.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-semibold text-xs focus:bg-white focus:border-[#087BFF] outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-bold text-[#087BFF] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-semibold text-xs focus:bg-white focus:border-[#087BFF] outline-none"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle size={15} /> {loginError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Signing you in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Registration Links for All Roles */}
          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs font-bold text-slate-600">
            <div className="text-[11px] uppercase text-slate-600 tracking-wider font-extrabold mb-1">New Account Onboarding Portals:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Link to="/candidate/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 transition-all">
                Candidate Reg →
              </Link>
              <Link to="/employer/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 transition-all">
                Employer KYC Reg →
              </Link>
              <Link to="/recruiter/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 transition-all">
                Agency Recruiter Reg →
              </Link>
              <Link to="/vendor/register" className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-purple-400 text-slate-700 hover:text-purple-600 transition-all">
                Vendor Partner Reg →
              </Link>
            </div>
          </div>
        </div>

      </div>

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
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#087BFF] flex items-center justify-center mb-2">
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
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-center space-y-2">
                  <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                  <div className="font-bold">If an account exists, a reset link was sent</div>
                  <p className="text-slate-600">
                    Check your inbox for further instructions. The link expires shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Registered Email Address *</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="user@company.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-[#087BFF] outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Send Reset Verification Link
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
