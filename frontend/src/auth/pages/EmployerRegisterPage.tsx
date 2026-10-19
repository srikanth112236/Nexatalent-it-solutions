import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../shared/api-client';
import { Select } from '../../shared/ui/EnterpriseKit';
import { Logo } from '../../website/components/Logo';
import {
  Building2, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck,
  Briefcase, Check, UserCheck, Globe, Mail, Phone
} from 'lucide-react';
import {
  useFormValidation, required, email, phone, minLength, match, url,
} from '../../shared/validation';

export function EmployerRegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  /* ---------- step validation ---------- */
  const step1Form = useFormValidation(
    { companyName: '', website: '', industry: '', gstCin: '', hqAddress: '' },
    {
      companyName: [required('Company legal name'), minLength(2, 'Company legal name')],
      website: [required('Company website'), url('Website address')],
      industry: [required('Industry sector')],
      gstCin: [required('GSTIN / CIN number')],
      hqAddress: [required('Headquarters address')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );
  const step2Form = useFormValidation(
    { contactPerson: '', designation: '', email: '', phone: '', officePhone: '' },
    {
      contactPerson: [required('Executive name'), minLength(2, 'Executive name')],
      designation: [required('Designation')],
      email: [required('Corporate email'), email()],
      phone: [required('Phone number'), phone()],
    },
    { validateOnChange: true, validateOnBlur: true }
  );
  const step3Form = useFormValidation(
    { companySize: '', targetLocations: '', monthlyHiringVolume: '', preferredModel: '', estimatedBudget: '' },
    {
      companySize: [required('Company size')],
      targetLocations: [required('Target hiring locations')],
      monthlyHiringVolume: [required('Monthly hiring volume')],
      preferredModel: [required('Preferred hiring model')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );
  const step4Form = useFormValidation(
    { password: '', confirmPassword: '', agreeTerms: false },
    {
      password: [required('Create password'), minLength(10, 'Password')],
      confirmPassword: [required('Confirm password'), match('password', 'Confirm password', 'Password')],
      agreeTerms: [(v) => (v === true || v === 'true') ? undefined : 'You must accept the terms to continue.'],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const handleNext = (next: number) => {
    if (step === 1) { const { isValid, validationMessages } = step1Form.validateForm(); if (!isValid) { setFormError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.')); return; } }
    if (step === 2) { const { isValid, validationMessages } = step2Form.validateForm(); if (!isValid) { setFormError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.')); return; } }
    if (step === 3) { const { isValid, validationMessages } = step3Form.validateForm(); if (!isValid) { setFormError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.')); return; } }
    setStep(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const { isValid, validationMessages } = step4Form.validateForm();
    if (!isValid) { setFormError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.')); return; }
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<any>('/api/v1/auth/register/employer', {
        name: step2Form.values.contactPerson.trim(),
        email: step2Form.values.email.trim(),
        password: step4Form.values.password,
        companyName: step1Form.values.companyName.trim(),
        phone: step2Form.values.phone.trim(),
      });
      const created = (res as { data?: { id?: string } })?.data;
      setRefId(created?.id || 'RECEIVED');
      setSubmitted(true);
      setTimeout(() => { navigate('/login', { replace: true }); }, 2800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error)?.message || 'Registration failed. Please try again.';
      setFormError(msg);
    } finally { setIsSubmitting(false); }
  };

  const [formData, setFormData] = useState({
    companyName: '', website: '', industry: '', gstCin: '', hqAddress: '',
    contactPerson: '', designation: '', email: '', phone: '', officePhone: '',
    companySize: '', targetLocations: '', monthlyHiringVolume: '', preferredModel: '', estimatedBudget: '',
    password: '', confirmPassword: '', ndaRequired: false, agreeTerms: false
  });

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="mb-8"><Link to="/" className="inline-block bg-white p-2.5 rounded-xl shadow-sm"><Logo height={34} /></Link></div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20 mb-4">
              <Building2 className="w-3.5 h-3.5" /><span>Employer KYC & Hiring Portal</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">Enterprise Hiring Partner Registration</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Register your company to post jobs, invite agencies, and hire verified tech talent with transparent fee payouts.
            </p>
            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 1 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 1 ? 'bg-white text-black' : step === 1 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>{step > 1 ? <Check size={13} /> : '1'}</span><span>1. Corporate Legal Details</span>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 2 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 2 ? 'bg-white text-black' : step === 2 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>{step > 2 ? <Check size={13} /> : '2'}</span><span>2. Executive Contact</span>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 3 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 3 ? 'bg-white text-black' : step === 3 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>{step > 3 ? <Check size={13} /> : '3'}</span><span>3. Hiring Scale & Locations</span>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 4 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 4 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>4</span><span>4. Account Security</span>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-white font-bold"><ShieldCheck size={14} /> Corporate KYC Verified</span>
          </div>
        </div>

        <div className="lg:col-span-8 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employer KYC Registration</h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Register your organization to post jobs and hire talent.</p>
              </div>
              <span className="text-xs font-bold text-black bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-full">Step {step} of 4</span>
            </div>
            {formError && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">{formError}</div>}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="submitted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 text-black border border-neutral-300 flex items-center justify-center mx-auto shadow-md"><CheckCircle2 size={36} /></div>
                  <div><h3 className="text-2xl font-extrabold text-slate-900">Employer Account Calibrated</h3><p className="text-sm text-slate-600 mt-1">Registration Reference: <strong className="text-black font-mono">{refId}</strong></p></div>
                  <div className="text-xs font-bold text-slate-500 animate-pulse">Redirecting to Sign In...</div>
                </motion.div>
              ) : (
                <form noValidate>
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 text-xs">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2"><Building2 size={16} /> Step 1: Corporate Legal & Incorporation Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Company Legal Registered Name *</label>
                          <input type="text" value={formData.companyName} onChange={(e) => { setFormData({...formData, companyName: e.target.value}); step1Form.setField('companyName', e.target.value); }} onBlur={() => step1Form.setTouchedField('companyName')} placeholder="e.g. Fintech ScaleOps Technologies Ltd" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('companyName') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step1Form.errorFor('companyName') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('companyName')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Official Corporate Website *</label>
                          <div className="relative"><Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="url" value={formData.website} onChange={(e) => { setFormData({...formData, website: e.target.value}); step1Form.setField('website', e.target.value); }} onBlur={() => step1Form.setTouchedField('website')} placeholder="https://company.io" className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('website') ? 'border-red-400 focus:border-red-400' : ''}`} /></div>
                          {step1Form.errorFor('website') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('website')}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Industry Sector & Domain *</label>
                          <input type="text" value={formData.industry} onChange={(e) => { setFormData({...formData, industry: e.target.value}); step1Form.setField('industry', e.target.value); }} onBlur={() => step1Form.setTouchedField('industry')} placeholder="e.g. BFSI / FinTech / Healthcare AI" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('industry') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step1Form.errorFor('industry') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('industry')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">GSTIN / CIN Certificate Number *</label>
                          <input type="text" value={formData.gstCin} onChange={(e) => { setFormData({...formData, gstCin: e.target.value}); step1Form.setField('gstCin', e.target.value); }} onBlur={() => step1Form.setTouchedField('gstCin')} placeholder="e.g. 29AAACF1234H1Z1" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold font-mono focus:bg-white focus:border-black outline-none ${step1Form.errorFor('gstCin') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step1Form.errorFor('gstCin') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('gstCin')}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Headquarters Address *</label>
                        <textarea rows={2} value={formData.hqAddress} onChange={(e) => { setFormData({...formData, hqAddress: e.target.value}); step1Form.setField('hqAddress', e.target.value); }} onBlur={() => step1Form.setTouchedField('hqAddress')} placeholder="Full registered office address..." className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:bg-white focus:border-black outline-none ${step1Form.errorFor('hqAddress') ? 'border-red-400 focus:border-red-400' : ''}`} />
                        {step1Form.errorFor('hqAddress') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('hqAddress')}</p>}
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 text-xs">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-black"><UserCheck size={16} /> Step 2: Primary Authorized Contact & Executive Lead</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Executive Full Name *</label>
                          <input type="text" value={formData.contactPerson} onChange={(e) => { setFormData({...formData, contactPerson: e.target.value}); step2Form.setField('contactPerson', e.target.value); }} onBlur={() => step2Form.setTouchedField('contactPerson')} placeholder="e.g. Aditi Deshmukh" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step2Form.errorFor('contactPerson') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step2Form.errorFor('contactPerson') && <p className="text-xs text-red-600 font-bold mt-1">{step2Form.errorFor('contactPerson')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Designation *</label>
                          <input type="text" value={formData.designation} onChange={(e) => { setFormData({...formData, designation: e.target.value}); step2Form.setField('designation', e.target.value); }} onBlur={() => step2Form.setTouchedField('designation')} placeholder="e.g. VP Talent Acquisition" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step2Form.errorFor('designation') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step2Form.errorFor('designation') && <p className="text-xs text-red-600 font-bold mt-1">{step2Form.errorFor('designation')}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
                          <div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" value={formData.email} onChange={(e) => { setFormData({...formData, email: e.target.value}); step2Form.setField('email', e.target.value); }} onBlur={() => step2Form.setTouchedField('email')} placeholder="hr@company.io" className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step2Form.errorFor('email') ? 'border-red-400 focus:border-red-400' : ''}`} /></div>
                          {step2Form.errorFor('email') && <p className="text-xs text-red-600 font-bold mt-1">{step2Form.errorFor('email')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                          <div className="relative"><Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="tel" value={formData.phone} onChange={(e) => { setFormData({...formData, phone: e.target.value}); step2Form.setField('phone', e.target.value); }} onBlur={() => step2Form.setTouchedField('phone')} placeholder="+91 98450 12890" className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step2Form.errorFor('phone') ? 'border-red-400 focus:border-red-400' : ''}`} /></div>
                          {step2Form.errorFor('phone') && <p className="text-xs text-red-600 font-bold mt-1">{step2Form.errorFor('phone')}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Office Phone</label>
                        <input type="tel" value={formData.officePhone} onChange={(e) => setFormData({...formData, officePhone: e.target.value})} placeholder="+91 22 1234 5678" className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none" />
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 text-xs">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-black"><Briefcase size={16} /> Step 3: Hiring Scale & Target Locations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Company Size *</label>
                          <Select value={formData.companySize} onChange={(v) => { setFormData({...formData, companySize: v}); step3Form.setField('companySize', v); }} ariaLabel="Company size" options={['1-10','11-50','51-200','201-500','501-1000','1000+'].map(o => ({value: o, label: o}))} />
                          {step3Form.errorFor('companySize') && <p className="text-xs text-red-600 font-bold mt-1">{step3Form.errorFor('companySize')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Target Hiring Locations *</label>
                          <input type="text" value={formData.targetLocations} onChange={(e) => { setFormData({...formData, targetLocations: e.target.value}); step3Form.setField('targetLocations', e.target.value); }} onBlur={() => step3Form.setTouchedField('targetLocations')} placeholder="e.g. Bengaluru, Mumbai, Remote" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step3Form.errorFor('targetLocations') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step3Form.errorFor('targetLocations') && <p className="text-xs text-red-600 font-bold mt-1">{step3Form.errorFor('targetLocations')}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Monthly Hiring Volume *</label>
                          <input type="text" value={formData.monthlyHiringVolume} onChange={(e) => { setFormData({...formData, monthlyHiringVolume: e.target.value}); step3Form.setField('monthlyHiringVolume', e.target.value); }} onBlur={() => step3Form.setTouchedField('monthlyHiringVolume')} placeholder="e.g. 5-10 roles" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step3Form.errorFor('monthlyHiringVolume') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step3Form.errorFor('monthlyHiringVolume') && <p className="text-xs text-red-600 font-bold mt-1">{step3Form.errorFor('monthlyHiringVolume')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Preferred Hiring Model *</label>
                          <Select value={formData.preferredModel} onChange={(v) => { setFormData({...formData, preferredModel: v}); step3Form.setField('preferredModel', v); }} ariaLabel="Hiring model" options={['Contingent','Retained','Executive Search','Bulk Hiring','Contract Staffing'].map(o => ({value: o, label: o}))} />
                          {step3Form.errorFor('preferredModel') && <p className="text-xs text-red-600 font-bold mt-1">{step3Form.errorFor('preferredModel')}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Estimated Annual Hiring Budget</label>
                        <input type="text" value={formData.estimatedBudget} onChange={(e) => setFormData({...formData, estimatedBudget: e.target.value})} placeholder="e.g. ₹50,00,000" className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold font-mono focus:bg-white focus:border-black outline-none" />
                      </div>
                    </motion.div>
                  )}
                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 text-xs">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-black"><ShieldCheck size={16} /> Step 4: Account Security</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Create Password *</label>
                          <input type="password" value={formData.password} onChange={(e) => { setFormData({...formData, password: e.target.value}); step4Form.setField('password', e.target.value); }} onBlur={() => step4Form.setTouchedField('password')} autoComplete="new-password" placeholder="••••••••••••" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step4Form.errorFor('password') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step4Form.errorFor('password') && <p className="text-xs text-red-600 font-bold mt-1">{step4Form.errorFor('password')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Confirm Password *</label>
                          <input type="password" value={formData.confirmPassword} onChange={(e) => { setFormData({...formData, confirmPassword: e.target.value}); step4Form.setField('confirmPassword', e.target.value); }} onBlur={() => step4Form.setTouchedField('confirmPassword')} autoComplete="new-password" placeholder="••••••••••••" className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step4Form.errorFor('confirmPassword') ? 'border-red-400 focus:border-red-400' : ''}`} />
                          {step4Form.errorFor('confirmPassword') && <p className="text-xs text-red-600 font-bold mt-1">{step4Form.errorFor('confirmPassword')}</p>}
                        </div>
                      </div>
                      <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                        <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => { setFormData({...formData, agreeTerms: e.target.checked}); step4Form.setField('agreeTerms', e.target.checked); }} className="w-4 h-4 mt-0.5 text-black accent-black rounded border-slate-300" />
                        <span>I accept the <Link to="/terms" target="_blank" className="text-black font-bold underline">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-black font-bold underline">Privacy Policy</Link> *</span>
                      </label>
                      {step4Form.errorFor('agreeTerms') && <p className="text-xs text-red-600 font-bold mt-1">{step4Form.errorFor('agreeTerms')}</p>}
                      <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-black font-medium">
                        <div className="flex items-center gap-2"><Building2 size={14} className="text-black" /><span>Your GST registration and corporate domain will be matched against ministry records.</span></div>
                      </div>
                    </motion.div>
                  )}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    {step > 1 ? (<button type="button" onClick={handleBack} className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"><ArrowLeft size={15} /><span>Previous Step</span></button>) : <div />}
                    {step < 4 ? (<button type="button" onClick={() => handleNext(step + 1)} className="px-7 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md shadow-black/10 flex items-center gap-2 transition-all cursor-pointer"><span>Proceed to Step {step + 1}</span><ArrowRight size={15} /></button>) : (<button type="button" onClick={() => handleSubmit({ preventDefault: () => {} } as unknown as React.FormEvent)} disabled={isSubmitting} className="px-8 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg shadow-black/10 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"><span>{isSubmitting ? 'Creating Account…' : 'Create Verified Employer Account'}</span><CheckCircle2 size={16} /></button>)}
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium"><span>Already registered as an employer?</span><Link to="/login" className="text-black font-bold hover:underline">Sign In to Employer Portal →</Link></div>
        </div>
      </div>
    </div>
  );
}
