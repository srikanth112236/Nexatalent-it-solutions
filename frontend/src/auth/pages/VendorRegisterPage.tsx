import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../../website/components/Logo';
import { Briefcase, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import {
  useFormValidation, required, email, phone, minLength, match,
} from '../../shared/validation';

export function VendorRegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  /* ---------- validation ---------- */
  const regForm = useFormValidation(
    {
      vendorName: '', contactName: '', designation: '', email: '',
      phone: '', contractorCapacity: '', password: '', confirmPassword: '',
    },
    {
      vendorName: [required('Vendor firm name'), minLength(2, 'Vendor firm name')],
      contactName: [required('Authorized representative name'), minLength(2, 'Authorized representative name')],
      designation: [required('Designation / title')],
      email: [required('Corporate email'), email()],
      phone: [required('Phone number'), phone()],
      contractorCapacity: [required('Contingent contractor capacity')],
      password: [required('Create password'), minLength(10, 'Password')],
      confirmPassword: [required('Confirm password'), match('password', 'Confirm password', 'Password')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const { isValid, validationMessages } = regForm.validateForm();
    if (!isValid) {
      setFormError(validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post<any>('/api/v1/auth/register/vendor', {
        name: regForm.values.vendorName.trim(),
        email: regForm.values.email.trim(),
        password: regForm.values.password,
        phone: regForm.values.phone.trim(),
        companyName: regForm.values.vendorName.trim(),
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20 mb-4">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Vendor Partner Onboarding</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Join the Contingent Staffing Network
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Supply vetted contingent talent to enterprise clients, manage contractor deployments, and track transparent payouts.
            </p>
          </div>
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-white">
              <ShieldCheck size={14} /> Vendor Compliance Verified
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vendor Partner Registration</h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Register your staffing vendor to receive contingent hiring requisitions.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 text-black flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Vendor Account Submitted</h3>
                <p className="text-xs text-slate-600">Reference ID: <strong className="text-black font-mono">{refId}</strong></p>
                <div className="text-xs font-bold text-slate-500 animate-pulse">Redirecting to Sign In...</div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vendor Firm Registered Name *</label>
                  <input
                    type="text"
                    value={regForm.values.vendorName}
                    onChange={(e) => regForm.setField('vendorName', e.target.value)}
                    onBlur={() => regForm.setTouchedField('vendorName')}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('vendorName') ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {regForm.errorFor('vendorName') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('vendorName')}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Authorized Representative *</label>
                    <input
                      type="text"
                      value={regForm.values.contactName}
                      onChange={(e) => regForm.setField('contactName', e.target.value)}
                      onBlur={() => regForm.setTouchedField('contactName')}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('contactName') ? 'border-red-400 focus:border-red-400' : ''}`}
                    />
                    {regForm.errorFor('contactName') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('contactName')}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Designation *</label>
                    <input
                      type="text"
                      value={regForm.values.designation}
                      onChange={(e) => regForm.setField('designation', e.target.value)}
                      onBlur={() => regForm.setTouchedField('designation')}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('designation') ? 'border-red-400 focus:border-red-400' : ''}`}
                    />
                    {regForm.errorFor('designation') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('designation')}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      value={regForm.values.email}
                      onChange={(e) => regForm.setField('email', e.target.value)}
                      onBlur={() => regForm.setTouchedField('email')}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('email') ? 'border-red-400 focus:border-red-400' : ''}`}
                    />
                    {regForm.errorFor('email') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('email')}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={regForm.values.phone}
                      onChange={(e) => regForm.setField('phone', e.target.value)}
                      onBlur={() => regForm.setTouchedField('phone')}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('phone') ? 'border-red-400 focus:border-red-400' : ''}`}
                    />
                    {regForm.errorFor('phone') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('phone')}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contingent Contractor Capacity *</label>
                  <input
                    type="text"
                    value={regForm.values.contractorCapacity}
                    onChange={(e) => regForm.setField('contractorCapacity', e.target.value)}
                    onBlur={() => regForm.setTouchedField('contractorCapacity')}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('contractorCapacity') ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {regForm.errorFor('contractorCapacity') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('contractorCapacity')}</p>}
                </div>
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center gap-2">
                    <AlertCircle size={15} /> {formError}
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Create Password (min 10 characters) *</label>
                  <input
                    type="password"
                    value={regForm.values.password}
                    onChange={(e) => regForm.setField('password', e.target.value)}
                    onBlur={() => regForm.setTouchedField('password')}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('password') ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {regForm.errorFor('password') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('password')}</p>}
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={regForm.values.confirmPassword}
                    onChange={(e) => regForm.setField('confirmPassword', e.target.value)}
                    onBlur={() => regForm.setTouchedField('confirmPassword')}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('confirmPassword') ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {regForm.errorFor('confirmPassword') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('confirmPassword')}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !regForm.isValid}
                  className="w-full py-3.5 px-5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Registering Vendor…' : 'Register Vendor Partner'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Already have a vendor account?</span>
            <Link to="/login" className="text-black font-bold hover:underline">
              Sign In to Vendor Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
