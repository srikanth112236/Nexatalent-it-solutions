import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../website/components/Logo';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  UploadCloud, 
  Briefcase, 
  Check, 
  UserCheck, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign
} from 'lucide-react';

export function EmployerRegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Legal Entity & Corporate Info
    companyName: 'Fintech ScaleOps Technologies Ltd',
    website: 'https://fintechscaleops.io',
    industry: 'BFSI / High-Frequency Trading & Payments',
    gstCin: '29AAACF1234H1Z1 / U72200KA2021PTC145678',
    hqAddress: '7th Floor, Prestige Tech Park, Marathahalli-Sarjapur Outer Ring Rd, Kadubeesanahalli, Bengaluru, Karnataka 560103',
    
    // Step 2: Executive Leadership & Primary Contact
    contactPerson: 'Aditi Deshmukh',
    designation: 'Vice President of Talent & Engineering Operations',
    email: 'aditi.d@fintechscaleops.io',
    phone: '+91 99800 11223',
    officePhone: '+91 80 4567 8900',

    // Step 3: Hiring Scale & Target Locations
    companySize: '250–500 Employees (Series C Funded)',
    targetLocations: 'Bengaluru, Hyderabad, Pune, Remote India',
    monthlyHiringVolume: '10–25 Engineers / Month',
    preferredModel: 'Direct Permanent Sourcing + BOT GCC Pods',
    estimatedBudget: '₹1.5 Cr – ₹4.0 Cr Annual Hiring Overhead',

    // Step 4: Password & Security
    password: '',
    confirmPassword: '',
    ndaRequired: true,
    agreeTerms: true
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = 'NEXA-ENT-REG-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(generatedRef);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/employer');
    }, 2800);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Brand Column */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="mb-8">
              <Link to="/" className="inline-block bg-white p-2.5 rounded-xl shadow-sm">
                <Logo height={34} />
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise Client KYC Protocol</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Deploy Engineering Pods & GCC Squads
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Pre-evaluated technical talent graph, 3-stage code vetting, open-book Cost-Plus pricing, and 72-hour shortlist SLAs.
            </p>

            {/* Stepper Progress Indicator */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 1 ? 'bg-blue-600/20 border-blue-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 1 ? 'bg-emerald-500 text-white' : step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 1 ? <Check size={13} /> : '1'}
                </span>
                <span>1. Corporate Legal Verification</span>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 2 ? 'bg-blue-600/20 border-blue-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 2 ? 'bg-emerald-500 text-white' : step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 2 ? <Check size={13} /> : '2'}
                </span>
                <span>2. Executive Contact Details</span>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 3 ? 'bg-blue-600/20 border-blue-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 3 ? 'bg-emerald-500 text-white' : step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 3 ? <Check size={13} /> : '3'}
                </span>
                <span>3. Hiring Scale & Scope</span>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 4 ? 'bg-blue-600/20 border-blue-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  4
                </span>
                <span>4. Documents & Security</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck size={14} /> MCA Admin Audit SLA: 2 Hours
            </span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-8 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Enterprise Client Registration
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Complete corporate KYC verification to unlock the Nexa Requisition Console.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Step {step} of 4
              </span>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">Organization Verified & Logged</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Reference ID: <strong className="text-blue-600 font-mono">{refId}</strong>
                    </p>
                  </div>
                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-slate-700 text-left space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-900">
                      <UserCheck size={15} /> Express Admin Audit Activated
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Your GST registration ({formData.gstCin.split('/')[0]}) and corporate domain have been matched against ministry records. An executive account partner has been assigned.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-500 animate-pulse">
                    Routing to Employer Workspace Console...
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  
                  {/* STEP 1: Corporate Legal Information */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-blue-600">
                        <Building2 size={16} /> Step 1: Corporate Legal & Incorporation Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Company Legal Registered Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="e.g. Fintech ScaleOps Technologies Ltd"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Official Corporate Website *</label>
                          <div className="relative">
                            <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="url"
                              required
                              value={formData.website}
                              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                              placeholder="https://company.io"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Industry Sector & Domain *</label>
                          <input
                            type="text"
                            required
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            placeholder="e.g. BFSI / FinTech / Healthcare AI"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">GSTIN / CIN Certificate Number *</label>
                          <input
                            type="text"
                            required
                            value={formData.gstCin}
                            onChange={(e) => setFormData({ ...formData, gstCin: e.target.value })}
                            placeholder="e.g. 29AAACF1234H1Z1"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold font-mono focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Headquarters Address *</label>
                        <textarea
                          rows={2}
                          required
                          value={formData.hqAddress}
                          onChange={(e) => setFormData({ ...formData, hqAddress: e.target.value })}
                          placeholder="Full registered office address..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Executive Contact Details */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-blue-600">
                        <UserCheck size={16} /> Step 2: Primary Authorized Contact & Executive Lead
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Executive Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            placeholder="e.g. Aditi Deshmukh"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Corporate Designation / Title *</label>
                          <input
                            type="text"
                            required
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            placeholder="e.g. VP of Engineering / Talent Lead"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Official Work Email *</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="aditi@company.io"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Direct Mobile Number *</label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+91 99800 11223"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Hiring Scale & Scope */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-blue-600">
                        <Briefcase size={16} /> Step 3: Hiring Scale, Target Hubs & Model
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Company Headcount Scale *</label>
                          <select
                            value={formData.companySize}
                            onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          >
                            <option value="10–50 Employees (Early Stage / Seed)">10–50 Employees (Early Stage / Seed)</option>
                            <option value="50–250 Employees (Growth / Series A-B)">50–250 Employees (Growth / Series A-B)</option>
                            <option value="250–500 Employees (Series C Funded)">250–500 Employees (Series C Funded)</option>
                            <option value="500–2500 Employees (Mid-Enterprise / Unicorn)">500–2500 Employees (Mid-Enterprise / Unicorn)</option>
                            <option value="2500+ Employees (Global Enterprise / Fortune 500)">2500+ Employees (Global Enterprise / Fortune 500)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Target Hiring Locations *</label>
                          <div className="relative">
                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={formData.targetLocations}
                              onChange={(e) => setFormData({ ...formData, targetLocations: e.target.value })}
                              placeholder="e.g. Bengaluru, Hyderabad, Remote"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Expected Monthly Hiring Volume *</label>
                          <select
                            value={formData.monthlyHiringVolume}
                            onChange={(e) => setFormData({ ...formData, monthlyHiringVolume: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          >
                            <option value="1–5 Engineers / Month">1–5 Engineers / Month</option>
                            <option value="5–10 Engineers / Month">5–10 Engineers / Month</option>
                            <option value="10–25 Engineers / Month">10–25 Engineers / Month</option>
                            <option value="25+ Engineers / Month (Turnkey GCC Setup)">25+ Engineers / Month (Turnkey GCC Setup)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Estimated Annual Hiring Spend Budget *</label>
                          <div className="relative">
                            <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={formData.estimatedBudget}
                              onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                              placeholder="e.g. ₹1.5 Cr – ₹4.0 Cr"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Documents & Security Verification */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-blue-600">
                        <UploadCloud size={16} /> Step 4: Verification Documents & Security Credentials
                      </h3>

                      {/* File Upload Box */}
                      <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-2">
                        <UploadCloud size={28} className="text-blue-600 mx-auto" />
                        <div className="text-xs font-bold text-slate-800">
                          Upload Company Certificate of Incorporation / GST Certificate / Deck
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Supports PDF, DOCX (Max 10MB). Used exclusively for express MCA verification.
                        </p>
                        <input
                          type="file"
                          id="corporate-doc"
                          accept=".pdf,.docx,.doc"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="corporate-doc"
                          className="inline-block px-4 py-2 rounded-xl bg-white border border-slate-300 text-blue-600 font-bold text-xs shadow-sm hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          {docFile ? `Selected: ${docFile.name}` : 'Choose File to Upload'}
                        </label>
                      </div>

                      {/* Password Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Create Account Password *</label>
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Confirm Account Password *</label>
                          <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-2 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            checked={formData.ndaRequired}
                            onChange={(e) => setFormData({ ...formData, ndaRequired: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                          />
                          <span>Require Mutual Non-Disclosure Agreement (MNDA) before candidate portfolio sharing</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            required
                            checked={formData.agreeTerms}
                            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                          />
                          <span>I agree to NexaTalent IT Solutions Master Services Agreement and Privacy Policy</span>
                        </label>
                      </div>

                    </motion.div>
                  )}

                  {/* Form Navigation Buttons */}
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
                        onClick={handleNext}
                        className="px-7 py-3.5 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Proceed to Step {step + 1}</span>
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Submit Organization Registration</span>
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>

                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Footer Link */}
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Already registered your company?</span>
            <Link to="/login" className="text-[#0265FF] font-bold hover:underline">
              Sign In to Employer Workspace →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
