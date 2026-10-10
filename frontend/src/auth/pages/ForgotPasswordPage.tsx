import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../website/components/Logo';
import { Check, ShieldCheck, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../shared/api-client';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/auth/forgot-password', { email: email.trim() });
    } catch {
      // Generic message regardless — prevents account enumeration
    } finally {
      setSent(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      {/* Hand-Crafted Bespoke Container */}
      <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Hand-Tailored Brand Column */}
        <div className="md:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="mb-10">
              <Link to="/" className="inline-block bg-white p-2.5 rounded-xl shadow-sm">
                <Logo height={34} />
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity & Security Safeguard</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              Encrypted Access Recovery
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed mb-8 font-normal">
              Self-service credentials recovery protected by AES-256 token verification & multi-factor OAuth session clearance.
            </p>

            <div className="space-y-3.5 pt-4 border-t border-slate-800/80 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Single-Use Encrypted Reset Links</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Immediate Token Expiry Safety</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Zero Breach Identity Protection</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span>SOC 2 Type II Security Standard</span>
          </div>
        </div>

        {/* Right Clean Accessible Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Enter your registered corporate or candidate email address below.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">If an account exists, a reset link was sent</h3>
              <p className="text-xs text-slate-600 mb-5 font-medium leading-relaxed">
                Check your inbox for further instructions. The link expires shortly.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Account Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Registered Account Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@nexatalent.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold text-xs placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending…' : 'Send Password Reset Link'}</span>
              </button>
            </form>
          )}

          {!sent && (
            <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs font-bold text-slate-600">
              <Link to="/login" className="text-blue-600 hover:underline inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

