import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  DollarSign,
  Award
} from 'lucide-react';

export function CandidateRegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Personal & Contact Details
    fullName: 'Vikram Sharma',
    email: 'vikram.sharma.dev@gmail.com',
    phone: '+91 98450 12890',
    currentCity: 'Bengaluru, Karnataka',
    preferredWorkMode: 'Hybrid (2 days office / 3 days remote)',

    // Step 2: Technical Footprint & Skills
    primaryRole: 'Full Stack & Systems Engineer',
    primaryTechStack: 'Go, React, Node.js, TypeScript, PostgreSQL',
    secondarySkills: 'Docker, Kubernetes, Redis, AWS Lambda, GraphQL',
    totalExperience: '6 Years',
    currentSeniority: 'Senior Software Engineer / Lead',

    // Step 3: Compensation & Notice Period
    currentCtc: '₹28,00,000 LPA',
    expectedCtc: '₹36,00,000 LPA',
    noticePeriod: '30 Days (Serving Notice)',
    noticeBuyoutRequired: true,
    openToRelocation: true,

    // Step 4: Social Links, Resume & Privacy
    linkedinUrl: 'https://linkedin.com/in/vikramsharmadev',
    githubUrl: 'https://github.com/vikramsharma-go',
    portfolioUrl: 'https://vikramsharma.dev',
    stealthMode: true,
    password: '',
    confirmPassword: ''
  });

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
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
    const generatedRef = 'NEXA-CAND-REG-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(generatedRef);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/candidate');
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

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <User className="w-3.5 h-3.5" />
              <span>Candidate Career & Evaluation Hub</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Accelerate Your Tech Career
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Direct access to top product companies, verified CTC benchmarks, 100% zero fees, and automatic current employer stealth protection.
            </p>

            {/* Stepper Progress Indicator */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 1 ? 'bg-emerald-600/20 border-emerald-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 1 ? 'bg-emerald-500 text-white' : step === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 1 ? <Check size={13} /> : '1'}
                </span>
                <span>1. Personal & Contact Info</span>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 2 ? 'bg-emerald-600/20 border-emerald-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 2 ? 'bg-emerald-500 text-white' : step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 2 ? <Check size={13} /> : '2'}
                </span>
                <span>2. Tech Stack & Experience</span>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 3 ? 'bg-emerald-600/20 border-emerald-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 3 ? 'bg-emerald-500 text-white' : step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {step > 3 ? <Check size={13} /> : '3'}
                </span>
                <span>3. Compensation & Notice SLA</span>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${step === 4 ? 'bg-emerald-600/20 border-emerald-500/40 text-white font-bold' : 'border-transparent text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  4
                </span>
                <span>4. Resume Upload & Stealth</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Lock size={14} /> Stealth Privacy Mode Active
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
                  Candidate Profile Registration
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Build your verified practitioner portfolio to receive direct enterprise invitations.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
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
                    <h3 className="text-2xl font-extrabold text-slate-900">Candidate Profile Calibrated</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Registration Reference: <strong className="text-emerald-600 font-mono">{refId}</strong>
                    </p>
                  </div>
                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 text-left space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <Award size={15} /> Added to Nexa AI Matching Graph
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Your resume {resumeFile ? `(${resumeFile.name})` : ''} has been parsed. Your current employer identity is locked in stealth privacy mode.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-500 animate-pulse">
                    Routing to Candidate Hub Console...
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  
                  {/* STEP 1: Personal & Contact Information */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-emerald-600">
                        <User size={16} /> Step 1: Personal & Contact Information
                      </h3>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Vikram Sharma"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="vikram@gmail.com"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Mobile / WhatsApp Number *</label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+91 98450 12890"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Current City / Location *</label>
                          <div className="relative">
                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={formData.currentCity}
                              onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                              placeholder="e.g. Bengaluru, Karnataka"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Preferred Work Mode *</label>
                          <select
                            value={formData.preferredWorkMode}
                            onChange={(e) => setFormData({ ...formData, preferredWorkMode: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          >
                            <option value="Hybrid (2 days office / 3 days remote)">Hybrid (2 days office / 3 days remote)</option>
                            <option value="100% Remote (India / Global)">100% Remote (India / Global)</option>
                            <option value="Onsite (Full Office)">Onsite (Full Office)</option>
                            <option value="Open to All Modes">Open to All Modes</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Technical Expertise & Career Footprint */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-emerald-600">
                        <Code2 size={16} /> Step 2: Technical Stack & Experience Footprint
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Primary Role / Title *</label>
                          <input
                            type="text"
                            required
                            value={formData.primaryRole}
                            onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value })}
                            placeholder="e.g. Full Stack & Systems Engineer"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Total Tech Experience *</label>
                          <select
                            value={formData.totalExperience}
                            onChange={(e) => setFormData({ ...formData, totalExperience: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          >
                            <option value="1 - 3 Years (Junior / Mid)">1 - 3 Years (Junior / Mid)</option>
                            <option value="4 - 7 Years (Senior Engineer)">4 - 7 Years (Senior Engineer)</option>
                            <option value="8 - 12 Years (Staff / Lead Architect)">8 - 12 Years (Staff / Lead Architect)</option>
                            <option value="12+ Years (Principal / Engineering Director)">12+ Years (Principal / Engineering Director)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Primary Technical Stack & Frameworks *</label>
                        <input
                          type="text"
                          required
                          value={formData.primaryTechStack}
                          onChange={(e) => setFormData({ ...formData, primaryTechStack: e.target.value })}
                          placeholder="e.g. Go, React, Node.js, TypeScript, PostgreSQL"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Secondary Skills & DevOps Infrastructure</label>
                        <input
                          type="text"
                          value={formData.secondarySkills}
                          onChange={(e) => setFormData({ ...formData, secondarySkills: e.target.value })}
                          placeholder="e.g. Docker, Kubernetes, Redis, AWS Lambda"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none font-mono"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Compensation & Notice Period */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-emerald-600">
                        <DollarSign size={16} /> Step 3: Compensation Benchmarks & Notice Period
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Current Fixed & Total CTC (LPA) *</label>
                          <input
                            type="text"
                            required
                            value={formData.currentCtc}
                            onChange={(e) => setFormData({ ...formData, currentCtc: e.target.value })}
                            placeholder="e.g. ₹28,00,000 LPA"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Expected Annual CTC (LPA) *</label>
                          <input
                            type="text"
                            required
                            value={formData.expectedCtc}
                            onChange={(e) => setFormData({ ...formData, expectedCtc: e.target.value })}
                            placeholder="e.g. ₹36,00,000 LPA"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Official Notice Period *</label>
                          <select
                            value={formData.noticePeriod}
                            onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          >
                            <option value="Immediate / Serving Notice (Under 15 Days)">Immediate / Serving Notice (Under 15 Days)</option>
                            <option value="30 Days (Serving Notice)">30 Days (Serving Notice)</option>
                            <option value="60 Days Standard">60 Days Standard</option>
                            <option value="90 Days Standard">90 Days Standard</option>
                          </select>
                        </div>

                        <div className="flex flex-col justify-end">
                          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                            <input
                              type="checkbox"
                              checked={formData.noticeBuyoutRequired}
                              onChange={(e) => setFormData({ ...formData, noticeBuyoutRequired: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                            />
                            <span>Require Employer Notice Buyout Support</span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Resume Document Upload & Stealth Privacy */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-xs"
                    >
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-emerald-600">
                        <UploadCloud size={16} /> Step 4: Resume Upload & Social Profiles
                      </h3>

                      {/* File Upload Box */}
                      <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-2">
                        <UploadCloud size={28} className="text-emerald-600 mx-auto" />
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
                          className="inline-block px-4 py-2 rounded-xl bg-white border border-slate-300 text-emerald-700 font-bold text-xs shadow-sm hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          {resumeFile ? `Selected: ${resumeFile.name}` : 'Choose Resume File to Upload'}
                        </label>
                      </div>

                      {/* Social Links */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">LinkedIn Profile URL</label>
                          <input
                            type="url"
                            value={formData.linkedinUrl}
                            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">GitHub / Portfolio URL</label>
                          <input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                            placeholder="https://github.com/username"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          />
                        </div>
                      </div>

                      {/* Password Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Create Password *</label>
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Confirm Password *</label>
                          <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                          />
                        </div>
                      </div>

                      {/* Stealth Privacy Switch */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <Lock size={16} className="text-emerald-400 shrink-0" />
                          <div>
                            <div className="font-bold">Stealth Privacy Shield Active</div>
                            <div className="text-[11px] text-slate-300">Hides current employer name from your existing company recruiters.</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.stealthMode}
                          onChange={(e) => setFormData({ ...formData, stealthMode: e.target.checked })}
                          className="w-4 h-4 text-emerald-500 rounded"
                        />
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
                        className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Proceed to Step {step + 1}</span>
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Create Verified Candidate Account</span>
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
            <span>Already registered as a candidate?</span>
            <Link to="/login" className="text-emerald-600 font-bold hover:underline">
              Sign In to Candidate Portal →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
