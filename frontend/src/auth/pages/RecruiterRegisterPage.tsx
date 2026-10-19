import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../../website/components/Logo';
import { Briefcase, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import {
  useFormValidation, required, email, phone, minLength, match,
} from '../../shared/validation';

export function RecruiterRegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  /* ---------- validation ---------- */
  const regForm = useFormValidation(
    {
      agencyName: '', contactName: '', designation: '', email: '',
      phone: '', specialties: '', location: '', gstin: '', password: '', confirmPassword: '',
    },
    {
      agencyName: [required('Agency legal name'), minLength(2, 'Agency legal name')],
      contactName: [required('Contact person name'), minLength(2, 'Contact person name')],
      designation: [required('Designation / title')],
      email: [required('Corporate email'), email()],
      phone: [required('Phone number'), phone()],
      specialties: [required('Domain / niche specialties')],
      location: [required('Office location')],
      gstin: [required('GSTIN number')],
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
      const res = await apiClient.post<any>('/api/v1/auth/register/recruiter', {
        name: regForm.values.contactName.trim(),
        email: regForm.values.email.trim(),
        password: regForm.values.password,
        companyName: regForm.values.agencyName.trim(),
        phone: regForm.values.phone.trim(),
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
              <span>Agency & Headhunter Partner Onboarding</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Partner with Enterprise Hiring Clients
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Monetize your candidate bench, deliver pre-screened tech talent to top-tier enterprise accounts, and track transparent fee payouts.
            </p>
          </div>
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-white">
              <ShieldCheck size={14} /> Agency SLA Audit: Express 4 Hours
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruiter & Agency Registration</h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Register your agency to start receiving client job requisitions.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 text-black flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Agency Registered Successfully</h3>
                <p className="text-xs text-slate-600">Reference ID: <strong className="text-black font-mono">{refId}</strong></p>
                <div className="text-xs font-bold text-slate-500 animate-pulse">Redirecting to Sign In...</div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Agency Legal Name *</label>
                  <input
                    type="text"
                    value={regForm.values.agencyName}
                    onChange={(e) => regForm.setField('agencyName', e.target.value)}
                    onBlur={() => regForm.setTouchedField('agencyName')}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('agencyName') ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {regForm.errorFor('agencyName') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('agencyName')}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Lead Contact Person *</label>
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
                  <label className="block text-slate-700 font-bold mb-1">Domain & Niche Specialties *</label>
                  <input
                    type="text"
                    value={regForm.values.specialties}
                    onChange={(e) => regForm.setField('specialties', e.target.value)}
                    onBlur={() => regForm.setTouchedField('specialties')}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('specialties') ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {regForm.errorFor('specialties') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('specialties')}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Office Location *</label>
                    <input
                      type="text"
                      value={regForm.values.location}
                      onChange={(e) => regForm.setField('location', e.target.value)}
                      onBlur={() => regForm.setTouchedField('location')}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:bg-white focus:border-black ${regForm.errorFor('location') ? 'border-red-400 focus:border-red-400' : ''}`}
                    />
                    {regForm.errorFor('location') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('location')}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">GSTIN Number *</label>
                    <input
                      type="text"
                      value={regForm.values.gstin}
                      onChange={(e) => regForm.setField('gstin', e.target.value)}
                      onBlur={() => regForm.setTouchedField('gstin')}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold font-mono outline-none focus:bg-white focus:border-black ${regForm.errorFor('gstin') ? 'border-red-400 focus:border-red-400' : ''}`}
                    />
                    {regForm.errorFor('gstin') && <p className="text-xs text-red-600 font-bold mt-1">{regForm.errorFor('gstin')}</p>}
                  </div>
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
                  <span>{isSubmitting ? 'Registering Agency…' : 'Register Agency & Start Hiring'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Already have an agency account?</span>
            <Link to="/login" className="text-black font-bold hover:underline">
              Sign In to Agency Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
