import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../../website/components/Logo';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiClient } from '../../shared/api-client';

export function VendorRegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorName: '',
    contactName: '',
    designation: '',
    email: '',
    phone: '',
    contractorCapacity: '',
    gstin: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<any>('/api/v1/auth/register/vendor', {
        name: formData.contactName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        companyName: formData.vendorName.trim(),
        phone: formData.phone.trim(),
      });
      const created = (res as { data?: { id?: string } })?.data;
      setRefId(created?.id || 'RECEIVED');
      setSubmitted(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Registration failed. Please try again.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="mb-8">
              <Link to="/" className="inline-block bg-white p-2.5 rounded-xl shadow-sm">
                <Logo height={34} />
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise Vendor Partner Program</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Contingent Staff Augmentation & SOW Vendors
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Deploy contract resources, manage SOW rate cards, submit automated timesheets, and streamline enterprise vendor compliance.
            </p>
          </div>
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck size={14} /> Vendor Compliance Audit: SLA 24h
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vendor Partner Registration</h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Register as an approved enterprise vendor partner for contract staffing.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Vendor Account Submitted</h3>
                <p className="text-xs text-slate-600">Reference ID: <strong className="text-purple-600 font-mono">{refId}</strong></p>
                <div className="text-xs font-bold text-slate-500 animate-pulse">Redirecting to Sign In...</div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vendor Firm Registered Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Authorized Representative *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contingent Contractor Capacity *</label>
                  <input
                    type="text"
                    required
                    value={formData.contractorCapacity}
                    onChange={(e) => setFormData({ ...formData, contractorCapacity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                  />
                </div>
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center gap-2">
                    <AlertCircle size={15} /> {formError}
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Create Password (min 8 characters) *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-purple-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Submitting…' : 'Submit Vendor Application'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Already an approved Vendor Partner?</span>
            <Link to="/login" className="text-purple-600 font-bold hover:underline">Sign In to Vendor Portal →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
