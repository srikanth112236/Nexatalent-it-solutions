import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../shared/api-client';
import { Select } from '../../shared/ui/EnterpriseKit';
import { Logo } from '../../website/components/Logo';
import { 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  Code2, 
  Check, 
  Lock,
  Mail,
  Phone,
  MapPin,
  DollarSign
} from 'lucide-react';
import {
  useFormValidation,
  required,
  email,
  phone,
  minLength,
  match,
  url,
} from '../../shared/validation';

export function CandidateRegisterPage() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const navigate = useNavigate();

  /* ---------- shared step state ---------- */
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentCity: '',
    country: '',
    preferredWorkMode: '',
    primaryRole: '',
    primaryTechStack: '',
    secondarySkills: '',
    totalExperience: '',
    currentSeniority: '',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: '',
    noticeBuyoutRequired: false,
    openToRelocation: false,
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    stealthMode: true,
    authMethod: 'password',
    termsAccepted: false,
    marketingOptIn: false,
    password: '',
    confirmPassword: ''
  });

  /* ---------- validation rules per step ---------- */
  const step1Form = useFormValidation(
    { fullName: '', email: '', phone: '', currentCity: '', country: '', preferredWorkMode: '' },
    {
      fullName: [required('Full name'), minLength(2, 'Full name')],
      email: [required('Email address'), email()],
      phone: [required('Phone number'), phone()],
      currentCity: [required('City / location')],
      country: [required('Country')],
      preferredWorkMode: [required('Preferred work mode')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  const step2Form = useFormValidation(
    { primaryRole: '', primaryTechStack: '', secondarySkills: '', totalExperience: '' },
    {
      primaryRole: [required('Job title / role'), minLength(2, 'Job title / role')],
      primaryTechStack: [required('Primary technical stack'), minLength(3, 'Primary technical stack')],
      totalExperience: [required('Total experience level')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  const step3Form = useFormValidation(
    { currentCtc: '', expectedCtc: '', noticePeriod: '' },
    {
      currentCtc: [required('Current CTC / compensation')],
      expectedCtc: [required('Expected annual CTC')],
      noticePeriod: [required('Official notice period')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  const step4Form = useFormValidation(
    {
      linkedinUrl: '',
      githubUrl: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    {
      linkedinUrl: [url('LinkedIn profile address')],
      githubUrl: [url('GitHub / portfolio address')],
      password: [required('Create password'), minLength(10, 'Password')],
      confirmPassword: [required('Confirm password'), match('password', 'Confirm password', 'Password')],
      termsAccepted: [(v) => (v === true || v === 'true') ? undefined : 'You must accept the Terms of Service and Privacy Policy to register.'],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = (nextStep: number) => {
    /* validate current step before allowing forward */
    if (step === 1) {
      const { isValid, validationMessages } = step1Form.validateForm();
      if (!isValid) {
        setFormError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.'));
        return;
      }
    } else if (step === 2) {
      const { isValid, validationMessages } = step2Form.validateForm();
      if (!isValid) {
        setFormError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.'));
        return;
      }
    } else if (step === 3) {
      const { isValid, validationMessages } = step3Form.validateForm();
      if (!isValid) {
        setFormError((validationMessages && validationMessages.length ? validationMessages[0] : 'Please fill in the fields above.'));
        return;
      }
    }
    setStep(nextStep);
  };

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    /* validate step 4 fields before submit */
    const s4 = step4Form.validateForm();
    if (!s4.isValid) {
      setFormError(s4.validationMessages.length ? s4.validationMessages[0] : 'Please fix the fields above.');
      return;
    }
    if (!formData.termsAccepted) {
      setFormError('You must accept the Terms of Service and Privacy Policy to register.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Your password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      /* Step 1: send OTP to email instead of creating account immediately.
         Registration data is stashed in sessionStorage and completed after OTP verification. */
      const pending = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        authMethod: formData.authMethod,
        termsAccepted: true,
        marketing: formData.marketingOptIn,
        city: formData.currentCity.trim(),
        currentCity: formData.currentCity.trim(),
        primaryRole: formData.primaryRole.trim(),
        roleTitle: formData.primaryRole.trim(),
        primaryTechStack: [formData.primaryTechStack, formData.secondarySkills].filter(Boolean).join(', '),
        currentCtc: formData.currentCtc.trim(),
        expectedCtc: formData.expectedCtc.trim(),
        noticePeriod: formData.noticePeriod,
      };
      sessionStorage.setItem('nexatalent:pending_register', JSON.stringify(pending));

      await apiClient.post<any>('/api/v1/auth/send-otp', {
        email: formData.email.trim(),
        purpose: 'register',
        data: pending,
      });
      setIsSubmitting(false);
      navigate(`/auth/otp-verify?email=${encodeURIComponent(formData.email.trim())}&mode=register`, { replace: true });
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Registration failed. Please try again.';
      setFormError(msg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Brand Column */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="mb-8">
              <Link to="/" className="inline-block bg-white p-2.5 rounded-xl shadow-sm">
                <Logo height={34} />
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-white/10 text-white border border-white/20 mb-4">
              <User className="w-3.5 h-3.5" />
              <span>Candidate Career & Evaluation Hub</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Accelerate Your Tech Career
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Direct access to top product companies, verified CTC benchmarks, 100% zero fees, and automatic current employer stealth protection.
            </p>
            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 1 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 1 ? 'bg-white text-black' : step === 1 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 1 ? <Check size={13} /> : '1'}
                </span>
                <span>1. Personal & Contact Info</span>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 2 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 2 ? 'bg-white text-black' : step === 2 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 2 ? <Check size={13} /> : '2'}
                </span>
                <span>2. Tech Stack & Experience</span>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 3 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 3 ? 'bg-white text-black' : step === 3 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 3 ? <Check size={13} /> : '3'}
                </span>
                <span>3. Compensation & Notice SLA</span>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 4 ? 'bg-white/15 border-white/30 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 4 ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>
                  4
                </span>
                <span>4. Resume Upload & Stealth</span>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <Lock size={14} /> Stealth Privacy Mode Active
            </span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-8 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Candidate Profile Registration
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Build your verified practitioner portfolio to receive direct enterprise invitations.
                </p>
              </div>
              <span className="text-xs font-bold text-black bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-full">
                Step {step} of 4
              </span>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                {formError}
              </div>
            )}

            <AnimatePresence mode="wait">
              <form noValidate>
                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                        <User size={16} /> Step 1: Personal & Contact Information
                      </h3>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Full Legal Name *</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            step1Form.setField('fullName', e.target.value);
                          }}
                          onBlur={() => step1Form.setTouchedField('fullName')}
                          placeholder="e.g. Vikram Sharma"
                          className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('fullName') ? 'border-red-400 focus:border-red-400' : ''}`}
                        />
                        {step1Form.errorFor('fullName') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('fullName')}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                step1Form.setField('email', e.target.value);
                              }}
                              onBlur={() => step1Form.setTouchedField('email')}
                              placeholder="vikram@gmail.com"
                              className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('email') ? 'border-red-400 focus:border-red-400' : ''}`}
                            />
                          </div>
                          {step1Form.errorFor('email') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('email')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Mobile / WhatsApp Number *</label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => {
                                setFormData({ ...formData, phone: e.target.value });
                                step1Form.setField('phone', e.target.value);
                              }}
                              onBlur={() => step1Form.setTouchedField('phone')}
                              placeholder="+91 98450 12890"
                              className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('phone') ? 'border-red-400 focus:border-red-400' : ''}`}
                            />
                          </div>
                          {step1Form.errorFor('phone') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('phone')}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Current City / Location *</label>
                          <div className="relative">
                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={formData.currentCity}
                              onChange={(e) => {
                                setFormData({ ...formData, currentCity: e.target.value });
                                step1Form.setField('currentCity', e.target.value);
                              }}
                              onBlur={() => step1Form.setTouchedField('currentCity')}
                              placeholder="e.g. Bengaluru, Karnataka"
                              className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('currentCity') ? 'border-red-400 focus:border-red-400' : ''}`}
                            />
                          </div>
                          {step1Form.errorFor('currentCity') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('currentCity')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Preferred Work Mode *</label>
                          <Select
                            value={formData.preferredWorkMode}
                            onChange={(v) => {
                              setFormData({ ...formData, preferredWorkMode: v });
                              step1Form.setField('preferredWorkMode', v);
                            }}
                            ariaLabel="Preferred work mode"
                            options={[
                              'Hybrid (2 days office / 3 days remote)',
                              '100% Remote (India / Global)',
                              'Onsite (Full Office)',
                              'Open to All Modes',
                            ].map((o) => ({ value: o, label: o }))}
                          />
                          {step1Form.errorFor('preferredWorkMode') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('preferredWorkMode')}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Country *</label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => {
                            setFormData({ ...formData, country: e.target.value });
                            step1Form.setField('country', e.target.value);
                          }}
                          onBlur={() => step1Form.setTouchedField('country')}
                          placeholder="e.g. India"
                          className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step1Form.errorFor('country') ? 'border-red-400 focus:border-red-400' : ''}`}
                        />
                        {step1Form.errorFor('country') && <p className="text-xs text-red-600 font-bold mt-1">{step1Form.errorFor('country')}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                        <Code2 size={16} /> Step 2: Technical Stack & Experience Footprint
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Primary Role / Title *</label>
                          <input
                            type="text"
                            value={formData.primaryRole}
                            onChange={(e) => {
                              setFormData({ ...formData, primaryRole: e.target.value });
                              step2Form.setField('primaryRole', e.target.value);
                            }}
                            onBlur={() => step2Form.setTouchedField('primaryRole')}
                            placeholder="e.g. Full Stack & Systems Engineer"
                            className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step2Form.errorFor('primaryRole') ? 'border-red-400 focus:border-red-400' : ''}`}
                          />
                          {step2Form.errorFor('primaryRole') && <p className="text-xs text-red-600 font-bold mt-1">{step2Form.errorFor('primaryRole')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Total Tech Experience *</label>
                          <Select
                            value={formData.totalExperience}
                            onChange={(v) => {
                              setFormData({ ...formData, totalExperience: v });
                              step2Form.setField('totalExperience', v);
                            }}
                            ariaLabel="Total tech experience"
                            options={[
                              '1 - 3 Years (Junior / Mid)',
                              '4 - 7 Years (Senior Engineer)',
                              '8 - 12 Years (Staff / Lead Architect)',
                              '12+ Years (Principal / Engineering Director)',
                            ].map((o) => ({ value: o, label: o }))}
                          />
                          {step2Form.errorFor('totalExperience') && <p className="text-xs text-red-600 font-bold mt-1">{step2Form.errorFor('totalExperience')}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Primary Technical Stack & Frameworks *</label>
                        <input
                          type="text"
                          value={formData.primaryTechStack}
                          onChange={(e) => {
                            setFormData({ ...formData, primaryTechStack: e.target.value });
                            step2Form.setField('primaryTechStack', e.target.value);
                          }}
                          onBlur={() => step2Form.setTouchedField('primaryTechStack')}
                          placeholder="e.g. Go, React, Node.js, TypeScript, PostgreSQL"
                          className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none font-mono ${step2Form.errorFor('primaryTechStack') ? 'border-red-400 focus:border-red-400' : ''}`}
                        />
                        {step2Form.errorFor('primaryTechStack') && <p className="text-xs text-red-600 font-bold mt-1">{step2Form.errorFor('primaryTechStack')}</p>}
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Secondary Skills & DevOps Infrastructure</label>
                        <input
                          type="text"
                          value={formData.secondarySkills}
                          onChange={(e) => setFormData({ ...formData, secondarySkills: e.target.value })}
                          placeholder="e.g. Docker, Kubernetes, Redis, AWS Lambda"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none font-mono"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                        <DollarSign size={16} /> Step 3: Compensation Benchmarks & Notice Period
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Current Fixed & Total CTC (LPA) *</label>
                          <input
                            type="text"
                            value={formData.currentCtc}
                            onChange={(e) => {
                              setFormData({ ...formData, currentCtc: e.target.value });
                              step3Form.setField('currentCtc', e.target.value);
                            }}
                            onBlur={() => step3Form.setTouchedField('currentCtc')}
                            placeholder="e.g. ₹28,00,000 LPA"
                            className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none font-mono ${step3Form.errorFor('currentCtc') ? 'border-red-400 focus:border-red-400' : ''}`}
                          />
                          {step3Form.errorFor('currentCtc') && <p className="text-xs text-red-600 font-bold mt-1">{step3Form.errorFor('currentCtc')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Expected Annual CTC (LPA) *</label>
                          <input
                            type="text"
                            value={formData.expectedCtc}
                            onChange={(e) => {
                              setFormData({ ...formData, expectedCtc: e.target.value });
                              step3Form.setField('expectedCtc', e.target.value);
                            }}
                            onBlur={() => step3Form.setTouchedField('expectedCtc')}
                            placeholder="e.g. ₹36,00,000 LPA"
                            className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none font-mono ${step3Form.errorFor('expectedCtc') ? 'border-red-400 focus:border-red-400' : ''}`}
                          />
                          {step3Form.errorFor('expectedCtc') && <p className="text-xs text-red-600 font-bold mt-1">{step3Form.errorFor('expectedCtc')}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Official Notice Period *</label>
                          <Select
                            value={formData.noticePeriod}
                            onChange={(v) => {
                              setFormData({ ...formData, noticePeriod: v });
                              step3Form.setField('noticePeriod', v);
                            }}
                            ariaLabel="Notice period"
                            options={[
                              'Immediate / Serving Notice (Under 15 Days)',
                              '30 Days (Serving Notice)',
                              '60 Days Standard',
                              '90 Days Standard',
                            ].map((o) => ({ value: o, label: o }))}
                          />
                          {step3Form.errorFor('noticePeriod') && <p className="text-xs text-red-600 font-bold mt-1">{step3Form.errorFor('noticePeriod')}</p>}
                        </div>
                        <div className="flex flex-col justify-end">
                          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                            <input
                              type="checkbox"
                              checked={formData.noticeBuyoutRequired}
                              onChange={(e) => setFormData({ ...formData, noticeBuyoutRequired: e.target.checked })}
                              className="w-4 h-4 text-black accent-black rounded border-slate-300"
                            />
                            <span>Require Employer Notice Buyout Support</span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                        <UploadCloud size={16} /> Step 4: Resume Upload & Social Profiles
                      </h3>
                      <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-2">
                        <UploadCloud size={28} className="text-black mx-auto" />
                        <div className="text-xs font-bold text-slate-800">
                          Upload Resume / Curriculum Vitae
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Supports PDF, DOCX (Max 10MB). Automatically scored by Nexa AI Parser.
                        </p>
                        <input
                          type="file"
                          id="candidate-resume"
                          accept=".pdf,.docx,.doc"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="candidate-resume"
                          className="inline-block px-4 py-2 rounded-xl bg-white border border-slate-300 text-black font-bold text-xs shadow-sm hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          {resumeFile ? `Selected: ${resumeFile.name}` : 'Choose Resume File to Upload'}
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">LinkedIn Profile URL</label>
                          <input
                            type="url"
                            value={formData.linkedinUrl}
                            onChange={(e) => {
                              setFormData({ ...formData, linkedinUrl: e.target.value });
                              step4Form.setField('linkedinUrl', e.target.value);
                            }}
                            onBlur={() => step4Form.setTouchedField('linkedinUrl')}
                            placeholder="https://linkedin.com/in/username"
                            className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step4Form.errorFor('linkedinUrl') ? 'border-red-400 focus:border-red-400' : ''}`}
                          />
                          {step4Form.errorFor('linkedinUrl') && <p className="text-xs text-red-600 font-bold mt-1">{step4Form.errorFor('linkedinUrl')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">GitHub / Portfolio URL</label>
                          <input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => {
                              setFormData({ ...formData, githubUrl: e.target.value });
                              step4Form.setField('githubUrl', e.target.value);
                            }}
                            onBlur={() => step4Form.setTouchedField('githubUrl')}
                            placeholder="https://github.com/username"
                            className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step4Form.errorFor('githubUrl') ? 'border-red-400 focus:border-red-400' : ''}`}
                          />
                          {step4Form.errorFor('githubUrl') && <p className="text-xs text-red-600 font-bold mt-1">{step4Form.errorFor('githubUrl')}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Create Password *</label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({ ...formData, password: e.target.value });
                              step4Form.setField('password', e.target.value);
                            }}
                            onBlur={() => step4Form.setTouchedField('password')}
                            autoComplete="new-password"
                            placeholder="••••••••••••"
                            className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step4Form.errorFor('password') ? 'border-red-400 focus:border-red-400' : ''}`}
                          />
                          {step4Form.errorFor('password') && <p className="text-xs text-red-600 font-bold mt-1">{step4Form.errorFor('password')}</p>}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Confirm Password *</label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                              setFormData({ ...formData, confirmPassword: e.target.value });
                              step4Form.setField('confirmPassword', e.target.value);
                            }}
                            onBlur={() => step4Form.setTouchedField('confirmPassword')}
                            autoComplete="new-password"
                            placeholder="••••••••••••"
                            className={`w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-black outline-none ${step4Form.errorFor('confirmPassword') ? 'border-red-400 focus:border-red-400' : ''}`}
                          />
                          {step4Form.errorFor('confirmPassword') && <p className="text-xs text-red-600 font-bold mt-1">{step4Form.errorFor('confirmPassword')}</p>}
                        </div>
                      </div>
                      <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                        <input
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={(e) => {
                            setFormData({ ...formData, termsAccepted: e.target.checked });
                            step4Form.setField('termsAccepted', e.target.checked);
                          }}
                          className="w-4 h-4 mt-0.5 text-black accent-black rounded border-slate-300"
                        />
                        <span>I accept the <Link to="/terms" target="_blank" className="text-black font-bold underline">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-black font-bold underline">Privacy Policy</Link> *</span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                        <input
                          type="checkbox"
                          checked={formData.marketingOptIn}
                          onChange={(e) => setFormData({ ...formData, marketingOptIn: e.target.checked })}
                          className="w-4 h-4 mt-0.5 text-black accent-black rounded border-slate-300"
                        />
                        <span>Send me job alerts and product updates (optional — you can change this anytime in Privacy settings)</span>
                      </label>
                      <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <Lock size={16} className="text-white shrink-0" />
                          <div>
                            <div className="font-bold">Stealth Privacy Shield Active</div>
                            <div className="text-[11px] text-slate-300">Hides current employer name from your existing company recruiters.</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.stealthMode}
                          onChange={(e) => setFormData({ ...formData, stealthMode: e.target.checked })}
                          className="w-4 h-4 text-black accent-black rounded"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={15} />
                        <span>Previous Step</span>
                      </button>
                    ) : <div />}
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={() => handleNext(step + 1)}
                        className="px-7 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md shadow-black/10 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Proceed to Step {step + 1}</span>
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmit({ preventDefault: () => {} } as unknown as React.FormEvent)}
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg shadow-black/10 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                      >
                        <span>{isSubmitting ? 'Creating Account…' : 'Create Verified Candidate Account'}</span>
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                </form>
            </AnimatePresence>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Already registered as a candidate?</span>
            <Link to="/login" className="text-black font-bold hover:underline">
              Sign In to Candidate Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
