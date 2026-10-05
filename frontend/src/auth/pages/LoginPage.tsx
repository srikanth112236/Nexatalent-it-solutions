import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';
import { Logo } from '../../website/components/Logo';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Key, 
  CheckCircle2, 
  Building2, 
  User, 
  Briefcase, 
  Zap,
  HelpCircle,
  X
} from 'lucide-react';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('candidate');
  const [email, setEmail] = useState('user@nexatalent.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = 'NEXA-AUTH-' + Math.floor(100000 + Math.random() * 900000);
    setAuthToken(token);

    setTimeout(() => {
      const destination = ROLE_DEFAULT_REDIRECTS[selectedRole] || '/';
      navigate(destination);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative">
      {/* Background Subtle Grid Pattern */}
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

      {/* Main Card */}
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
              NexaTalent IT Solutions <br /> Single Sign-On Portal
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
                Select your target workspace and enter your authorized credentials.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Select Workspace Destination *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('candidate')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRole === 'candidate'
                      ? 'bg-blue-50 border-[#0265FF] text-[#0265FF] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <User size={15} />
                  <span>Candidate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRole === 'employer'
                      ? 'bg-blue-50 border-[#0265FF] text-[#0265FF] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building2 size={15} />
                  <span>Employer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('recruiter')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRole === 'recruiter'
                      ? 'bg-blue-50 border-[#0265FF] text-[#0265FF] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase size={15} />
                  <span>Recruiter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('employee')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRole === 'employee'
                      ? 'bg-blue-50 border-[#0265FF] text-[#0265FF] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <User size={15} />
                  <span>Employee</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('superadmin')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRole === 'superadmin'
                      ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Zap size={15} />
                  <span>Super Admin</span>
                </button>
              </div>
            </div>

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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-semibold text-xs focus:bg-white focus:border-[#0265FF] outline-none"
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
                    className="text-xs font-bold text-[#0265FF] hover:underline cursor-pointer"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-semibold text-xs focus:bg-white focus:border-[#0265FF] outline-none"
                  />
                </div>
              </div>

              {/* Session Token Feedback */}
              {authToken && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
                  <span>Session Authenticated Token: <strong className="font-mono text-emerald-700">{authToken}</strong></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Authenticating Credentials...' : `Sign In to ${selectedRole.toUpperCase()} Workspace`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Registration Links */}
          <div className="mt-8 pt-4 border-t border-slate-200 space-y-2 text-xs font-bold text-slate-600">
            <div className="flex items-center justify-between">
              <span>Need a new account?</span>
              <div className="flex items-center gap-3">
                <Link to="/candidate/register" className="text-[#0265FF] hover:underline">
                  Candidate Reg →
                </Link>
                <span className="text-slate-300">|</span>
                <Link to="/employer/register" className="text-[#0265FF] hover:underline">
                  Employer KYC →
                </Link>
              </div>
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
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0265FF] flex items-center justify-center mb-2">
                  <HelpCircle size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Reset Account Password</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Enter your registered corporate or personal email to receive a secure reset link.
                </p>
              </div>

              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-center space-y-2">
                  <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                  <div className="font-bold">Password Reset Email Dispatched</div>
                  <p className="text-slate-600">
                    A secure authentication token link has been sent to <strong>{forgotEmail}</strong>.
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
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-[#0265FF] outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer"
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
