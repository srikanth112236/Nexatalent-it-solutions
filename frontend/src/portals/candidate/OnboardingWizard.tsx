import { useState, useRef, useEffect } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  SlidersHorizontal,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Trash2,
  Plus,
  X,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Globe,
  Linkedin,
  Github,
  Check,
  FileCheck,
} from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { ModernDatePicker } from '../../shared/ui/ModernDatePicker';

export interface OnboardingWizardProps {
  profile: any;
  setProfile: (updater: any) => void;
  hasProfile?: boolean;
  onSaveSection: (step: number) => Promise<void>;
  onFinish: () => Promise<void>;
  saveError: string;
}

const OB_STEPS = [
  { id: 1, title: 'Personal Details', icon: User, subtitle: 'Identity & contact info' },
  { id: 2, title: 'Headline & Bio', icon: Sparkles, subtitle: 'Your career pitch' },
  { id: 3, title: 'Experience', icon: Briefcase, subtitle: 'Past & current employment' },
  { id: 4, title: 'Education', icon: GraduationCap, subtitle: 'Degrees & academics' },
  { id: 5, title: 'Skills & Badges', icon: Code2, subtitle: 'Verified tech stack' },
  { id: 6, title: 'Portfolio & Links', icon: FolderGit2, subtitle: 'GitHub, LinkedIn & work' },
  { id: 7, title: 'Job Preferences', icon: SlidersHorizontal, subtitle: 'Roles, CTC, notice & location' },
  { id: 8, title: 'Resume Upload', icon: FileText, subtitle: 'Verified CV on Azure Storage' },
  { id: 9, title: 'Visibility & Privacy', icon: ShieldCheck, subtitle: 'Consent & recruiter access' },
];

const POPULAR_ROLES = [
  'Full-Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps / SRE Engineer',
  'Cloud Architect (AWS/Azure)',
  'Data Engineer',
  'Machine Learning / AI Engineer',
  'Mobile Developer (React Native/Flutter)',
  'QA Automation Engineer',
  'Tech Lead / Engineering Manager',
  'System Architect',
  'Product Manager'
];

const TOP_TECH_HUBS = [
  'Bengaluru (Bangalore)',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi NCR (Gurgaon / Noida)',
  'Chennai',
  'Kolkata',
  'Remote - India',
  'Worldwide Remote',
  'USA / Canada',
  'UK / Europe',
  'UAE / Dubai',
  'Singapore'
];

const SKILL_SUGGESTIONS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'Next.js', 'Go', 'AWS',
  'Azure', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Tailwind CSS',
  'GraphQL', 'Redis', 'Spring Boot', 'Express', 'FastAPI', 'Microservices',
  'CI/CD', 'Terraform', 'Kafka', 'Machine Learning', 'TensorFlow', 'LangChain'
];

const DEGREE_OPTIONS = [
  'B.Tech / B.E (Engineering)',
  'M.Tech / M.E',
  'MCA (Master of Computer Applications)',
  'BCA (Bachelor of Computer Applications)',
  'B.Sc Computer Science / IT',
  'M.Sc Computer Science / IT',
  'MBA (Technology / Operations)',
  'Diploma in Engineering',
  'Other Bachelor Degree',
  'Other Master Degree'
];

const NOTICE_PERIODS = [
  { id: 'immediate', label: 'Immediate Joiner', sub: 'Available within 0–15 days' },
  { id: '30_days', label: '30 Days Notice', sub: 'Standard 1-month serving period' },
  { id: '60_days', label: '60 Days Notice', sub: '2 months notice period' },
  { id: '90_days', label: '90 Days Notice', sub: 'Negotiable / buyout supported' },
];

export function OnboardingWizard({
  profile,
  setProfile,
  hasProfile: _hasProfile,
  onSaveSection,
  onFinish,
  saveError,
}: OnboardingWizardProps) {
  const startAt = Math.min(Math.max(Number(profile?.onboarding?.step || 1), 1), 9);
  const [step, setStep] = useState(startAt);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isFresher, setIsFresher] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safe accessor helpers
  const asArray = (val: any): any[] => (Array.isArray(val) ? val : []);

  // Ensure default values are populated into state immediately
  useEffect(() => {
    setProfile((prev: any) => {
      const initial = prev || {};
      const updates: any = {};
      if (!initial.country) updates.country = 'India';
      if (!initial.contactPrefs) updates.contactPrefs = 'WhatsApp & Email';
      if (Object.keys(updates).length > 0) {
        return { ...initial, ...updates };
      }
      return initial;
    });
  }, []);

  const clearErrorsFor = (keys: string[]) => {
    setErrors((prev) => {
      let changed = false;
      const copy = { ...prev };
      for (const k of keys) {
        if (copy[k]) {
          delete copy[k];
          changed = true;
        }
      }
      return changed ? copy : prev;
    });
  };

  const updateProfile = (patch: any) => {
    setProfile((prev: any) => ({ ...prev, ...patch }));

    // Instant real-time error dismissal when user edits fields
    setErrors((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      const copy = { ...prev };
      let changed = false;

      for (const [key, val] of Object.entries(patch)) {
        // Any modification to this field clears its direct validation error
        if (copy[key]) {
          delete copy[key];
          changed = true;
        }

        // Sub-array checks
        if (key === 'experiences') {
          if (copy.experience) { delete copy.experience; changed = true; }
          const arr = Array.isArray(val) ? val : [];
          arr.forEach((item: any, idx: number) => {
            if ((item?.employer || '').trim() && copy[`exp_emp_${idx}`]) {
              delete copy[`exp_emp_${idx}`];
              changed = true;
            }
            if ((item?.designation || '').trim() && copy[`exp_des_${idx}`]) {
              delete copy[`exp_des_${idx}`];
              changed = true;
            }
          });
        } else if (key === 'educations') {
          if (copy.education) { delete copy.education; changed = true; }
          const arr = Array.isArray(val) ? val : [];
          arr.forEach((item: any, idx: number) => {
            if ((item?.institution || '').trim() && copy[`edu_inst_${idx}`]) {
              delete copy[`edu_inst_${idx}`];
              changed = true;
            }
          });
        } else if (key === 'skillLevels' || key === 'skills') {
          if (copy.skills) { delete copy.skills; changed = true; }
        } else if (key === 'resumeRef' || key === 'resume') {
          if (copy.resume) { delete copy.resume; changed = true; }
        } else if (key === 'termsConsent') {
          if (copy.termsConsent) { delete copy.termsConsent; changed = true; }
        }
      }

      return changed ? copy : prev;
    });
  };

  const updateJobPref = (patch: any) => {
    setProfile((prev: any) => ({
      ...prev,
      jobPreferences: {
        ...(prev?.jobPreferences || {}),
        ...patch,
      },
    }));

    const keysToClear: string[] = [];
    if ('roles' in patch) keysToClear.push('roles');
    if ('locations' in patch) keysToClear.push('locations');
    if ('availability' in patch) keysToClear.push('noticePeriod');
    if ('expectedCtc' in patch) keysToClear.push('expectedCtc');
    clearErrorsFor(keysToClear);
  };

  // Step Validation logic
  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};

    if (s === 1) {
      const name = (profile?.name || '').trim();
      const phone = (profile?.phone || '').trim();
      const loc = (profile?.location || '').trim();
      const country = (profile?.country || 'India').trim();

      if (name.length < 2) {
        errs.name = 'Full name must be at least 2 characters.';
      }
      if (phone.length < 7) {
        errs.phone = 'Valid phone number with country code is required.';
      }
      if (loc.length < 2) {
        errs.location = 'Current city / location is required for recruiter matching.';
      }
      if (!country) {
        errs.country = 'Country is required.';
      }
    } else if (s === 2) {
      const headline = (profile?.headline || '').trim();
      const summary = (profile?.summary || '').trim();
      if (headline.length < 3) {
        errs.headline = 'Professional headline is required (e.g. "Senior React Developer").';
      }
      if (summary.length < 10) {
        errs.summary = 'Please provide a brief professional summary (min 10 characters).';
      }
    } else if (s === 3) {
      if (!isFresher) {
        const exps = asArray(profile?.experiences);
        if (exps.length === 0) {
          errs.experience = 'Please add at least one work experience or toggle "I am a fresher / entry-level".';
        } else {
          for (let i = 0; i < exps.length; i++) {
            if (!exps[i]?.employer || exps[i].employer.trim().length < 1) {
              errs[`exp_emp_${i}`] = 'Company name is required.';
            }
            if (!exps[i]?.designation || exps[i].designation.trim().length < 1) {
              errs[`exp_des_${i}`] = 'Job title is required.';
            }
          }
        }
      }
    } else if (s === 4) {
      const edus = asArray(profile?.educations);
      if (edus.length === 0) {
        errs.education = 'Please add your primary education or highest qualification.';
      } else {
        for (let i = 0; i < edus.length; i++) {
          if (!edus[i]?.institution || edus[i].institution.trim().length < 1) {
            errs[`edu_inst_${i}`] = 'College / University name is required.';
          }
        }
      }
    } else if (s === 5) {
      const skills = asArray(profile?.skillLevels);
      if (skills.length < 1) {
        errs.skills = 'Please add at least 1 technical skill.';
      }
    } else if (s === 7) {
      // Step 7: Job Preferences
      const roles = profile?.jobPreferences?.roles || profile?.roleTitle || '';
      if (!roles || String(roles).trim().length === 0) {
        errs.roles = 'Please select at least 1 target job role.';
      }
      const locs = profile?.jobPreferences?.locations || '';
      if (!locs || String(locs).trim().length === 0) {
        errs.locations = 'Please select at least 1 preferred work location or Remote.';
      }
      const ctc = profile?.expectedCtc || profile?.jobPreferences?.expectedCtc || '';
      if (!ctc || String(ctc).trim().length === 0) {
        errs.expectedCtc = 'Expected CTC is required (e.g. 18 LPA).';
      }
      const notice = profile?.noticePeriod || profile?.jobPreferences?.availability || '';
      if (!notice || String(notice).trim().length === 0) {
        errs.noticePeriod = 'Please select your notice period / availability.';
      }
    } else if (s === 8) {
      if (!profile?.resumeRef && !profile?.resumeUrl && !profile?.resume) {
        errs.resume = 'Please upload your resume to complete your candidate verification.';
      }
    } else if (s === 9) {
      if (!profile?.termsConsent) {
        errs.termsConsent = 'You must acknowledge the data matching consent to complete onboarding.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    const ok = validateStep(step);
    if (!ok) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }
    setBusy(true);
    try {
      if (onSaveSection) {
        try {
          await onSaveSection(step + 1);
        } catch (saveErr) {
          console.warn('Auto-save step error (proceeding anyway):', saveErr);
        }
      }
      setErrors({});
      setStep((curr) => Math.min(curr + 1, 9));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (e: any) {
      console.error('Failed to advance step:', e);
      setStep((curr) => Math.min(curr + 1, 9));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } finally {
      setBusy(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((curr) => curr - 1);
      setErrors({});
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(9)) return;
    setBusy(true);
    try {
      await onSaveSection(9);
      await onFinish();
    } finally {
      setBusy(false);
    }
  };

  // Resume Upload Handler (directly to /api/v1/documents)
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      setResumeUploadError('Only PDF, DOC, or DOCX documents are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeUploadError('File size exceeds 5 MB limit.');
      return;
    }

    setUploadingResume(true);
    setResumeUploadError('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const mime =
            ext === 'doc'
              ? 'application/msword'
              : ext === 'docx'
              ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : 'application/pdf';

          const res: any = await apiClient.post('/api/v1/documents', {
            name: file.name,
            mime,
            kind: 'resume',
            data: base64Data,
            candidateEmail: profile.email,
          });

          if (res?.data?.id) {
            updateProfile({
              resumeRef: res.data.id,
              resumeName: file.name,
              resumeVersion: res.data.version || 1,
              resumeUploadedAt: new Date().toISOString(),
              resumeSize: file.size,
            });
            // Clear error
            setErrors((prev) => {
              const cp = { ...prev };
              delete cp.resume;
              return cp;
            });
          }
        } catch (err: any) {
          setResumeUploadError(err?.message || 'Failed to upload resume to Azure Storage.');
        } finally {
          setUploadingResume(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setResumeUploadError(err?.message || 'Error reading file.');
      setUploadingResume(false);
    }
  };

  // Helper arrays for multi-selects
  const selectedRoles: string[] = (profile.jobPreferences?.roles || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const toggleRole = (r: string) => {
    let next: string[];
    if (selectedRoles.includes(r)) {
      next = selectedRoles.filter((x) => x !== r);
    } else {
      next = [...selectedRoles, r];
    }
    updateJobPref({ roles: next.join(', ') });
    setErrors((prev) => {
      const cp = { ...prev };
      delete cp.roles;
      return cp;
    });
  };

  const selectedLocations: string[] = (profile.jobPreferences?.locations || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const toggleLocation = (loc: string) => {
    let next: string[];
    if (selectedLocations.includes(loc)) {
      next = selectedLocations.filter((x) => x !== loc);
    } else {
      next = [...selectedLocations, loc];
    }
    updateJobPref({ locations: next.join(', ') });
    setErrors((prev) => {
      const cp = { ...prev };
      delete cp.locations;
      return cp;
    });
  };

  const selectedSkills: any[] = asArray(profile.skillLevels);

  const addSkill = (skillName: string, level = 'Advanced') => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (selectedSkills.some((s) => s.skill.toLowerCase() === trimmed.toLowerCase())) return;
    const next = [...selectedSkills, { skill: trimmed, level }];
    updateProfile({
      skillLevels: next,
      skills: next.map((x) => x.skill).join(', '),
    });
    setErrors((prev) => {
      const cp = { ...prev };
      delete cp.skills;
      return cp;
    });
  };

  const removeSkill = (index: number) => {
    const next = selectedSkills.filter((_, i) => i !== index);
    updateProfile({
      skillLevels: next,
      skills: next.map((x) => x.skill).join(', '),
    });
  };

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087BFF]/20 focus:border-[#087BFF] text-slate-800 text-xs transition placeholder:text-slate-400 bg-white font-medium';
  const inputErrCls =
    'w-full px-4 py-2.5 rounded-xl border border-red-300 bg-red-50/20 focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-500 text-slate-800 text-xs transition font-medium';

  const progressPercent = Math.round(((step - 1) / 8) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1e3a] to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-bold tracking-wide uppercase mb-3">
              <Sparkles size={13} className="text-blue-300" />
              Verified Talent Onboarding
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Complete Your Candidate Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Matched directly with Fortune 500 tech teams, GCC pods, and verified enterprise recruiters.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-center shrink-0 min-w-[130px]">
            <div className="text-2xl font-black text-blue-300">{progressPercent}%</div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Completed</div>
          </div>
        </div>

        {/* Dynamic Progress Stepper Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>Step {step} of 9: {OB_STEPS[step - 1].title}</span>
            <span className="text-blue-300">{OB_STEPS[step - 1].subtitle}</span>
          </div>
          <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Mini Navigator Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {OB_STEPS.map((s) => {
          const isDone = s.id < step;
          const isCurrent = s.id === step;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (s.id <= step) setStep(s.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                isCurrent
                  ? 'bg-[#087BFF] text-white shadow-sm'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={14} className="text-emerald-600" />
              ) : (
                <Icon size={14} />
              )}
              <span>{s.id}. {s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {saveError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{saveError}</span>
          </div>
        )}

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Personal & Contact Details</h3>
              <p className="text-xs text-slate-500">Provide accurate contact information so recruiters can reach you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Siddharth Nair"
                  value={profile.name || ''}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className={errors.name ? inputErrCls : inputCls}
                />
                {errors.name && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-slate-400 font-normal">(Verified Account)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={profile.phone || ''}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  className={errors.phone ? inputErrCls : inputCls}
                />
                {errors.phone && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current City / Base Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={profile.location || ''}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  className={errors.location ? inputErrCls : inputCls}
                />
                {errors.location && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.country || 'India'}
                  onChange={(e) => updateProfile({ country: e.target.value })}
                  className={errors.country ? inputErrCls : inputCls}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="Australia">Australia</option>
                </select>
                {errors.country && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.country}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Preferred Contact Method
                </label>
                <select
                  value={profile.contactPrefs || 'WhatsApp & Email'}
                  onChange={(e) => updateProfile({ contactPrefs: e.target.value })}
                  className={inputCls}
                >
                  <option value="WhatsApp & Email">WhatsApp & Email (Fastest)</option>
                  <option value="Email Only">Email Only</option>
                  <option value="Phone Call Only">Phone Call Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Headline & Bio */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Professional Headline & Summary</h3>
              <p className="text-xs text-slate-500">Capture hiring manager attention in search results with a crisp pitch.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Professional Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Full-Stack Architect | 7+ Yrs | React, Node.js, AWS Cloud"
                  value={profile.headline || ''}
                  onChange={(e) => updateProfile({ headline: e.target.value })}
                  className={errors.headline ? inputErrCls : inputCls}
                />
                {errors.headline && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.headline}</p>}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-bold">Quick add:</span>
                  {[
                    'Full-Stack Engineer',
                    'Frontend Developer (React / Next.js)',
                    'Backend Engineer (Python / Node.js)',
                    'DevOps & Cloud Engineer'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => updateProfile({ headline: chip })}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Total Years of Experience
                </label>
                <select
                  value={profile.experienceYears || '3-5'}
                  onChange={(e) => updateProfile({ experienceYears: e.target.value })}
                  className={inputCls}
                >
                  <option value="0-1">Fresher / Entry-Level (&lt; 1 Year)</option>
                  <option value="1-3">1 – 3 Years</option>
                  <option value="3-5">3 – 5 Years</option>
                  <option value="5-8">5 – 8 Years (Mid-Senior)</option>
                  <option value="8-12">8 – 12 Years (Lead / Staff)</option>
                  <option value="12+">12+ Years (Principal / Director)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Professional Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Summarize your engineering journey, core architectures built, teams mentored, and significant performance or business impacts..."
                  value={profile.summary || ''}
                  onChange={(e) => updateProfile({ summary: e.target.value })}
                  className={errors.summary ? inputErrCls : inputCls}
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>Minimum 20 characters recommended.</span>
                  <span>{(profile.summary || '').length} characters</span>
                </div>
                {errors.summary && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.summary}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Experience */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Work Experience</h3>
                <p className="text-xs text-slate-500">Add your recent full-time or contract tech engagements.</p>
              </div>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 transition">
                <input
                  type="checkbox"
                  checked={isFresher}
                  onChange={(e) => {
                    setIsFresher(e.target.checked);
                    if (e.target.checked) setErrors({});
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>I am a Fresher / No prior experience</span>
              </label>
            </div>

            {errors.experience && (
              <p className="text-xs text-red-600 font-bold p-3 rounded-xl bg-red-50 border border-red-200">
                {errors.experience}
              </p>
            )}

            {!isFresher && (
              <div className="space-y-4">
                {asArray(profile.experiences).map((exp: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => {
                        const next = asArray(profile.experiences).filter((_, idx) => idx !== i);
                        updateProfile({ experiences: next });
                      }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition"
                      title="Remove Role"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Company / Organization *</label>
                        <input
                          type="text"
                          placeholder="e.g. Swiggy, Infosys, Stripe"
                          value={exp.employer || ''}
                          onChange={(e) => {
                            const next = [...asArray(profile.experiences)];
                            next[i] = { ...next[i], employer: e.target.value };
                            updateProfile({ experiences: next });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Job Title / Designation *</label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Software Engineer"
                          value={exp.designation || ''}
                          onChange={(e) => {
                            const next = [...asArray(profile.experiences)];
                            next[i] = { ...next[i], designation: e.target.value };
                            updateProfile({ experiences: next });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date</label>
                        <ModernDatePicker
                          value={exp.startDate || ''}
                          placeholder="Select start date"
                          mode="month-year"
                          onChange={(val) => {
                            const next = [...asArray(profile.experiences)];
                            next[i] = { ...next[i], startDate: val };
                            updateProfile({ experiences: next });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date</label>
                        <ModernDatePicker
                          value={exp.current ? 'Present' : exp.endDate || ''}
                          placeholder={exp.current ? 'Present' : 'Select end date'}
                          mode="month-year"
                          disabled={exp.current}
                          allowPresent={true}
                          onChange={(val) => {
                            const next = [...asArray(profile.experiences)];
                            next[i] = { ...next[i], endDate: val, current: val.toLowerCase() === 'present' };
                            updateProfile({ experiences: next });
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`curr-${i}`}
                        checked={exp.current || false}
                        onChange={(e) => {
                          const next = [...asArray(profile.experiences)];
                          next[i] = { ...next[i], current: e.target.checked, endDate: e.target.checked ? 'Present' : '' };
                          updateProfile({ experiences: next });
                        }}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <label htmlFor={`curr-${i}`} className="text-xs font-bold text-slate-700 cursor-pointer">
                        I am currently working in this role
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const next = [...asArray(profile.experiences), { employer: '', designation: '', startDate: '', endDate: '', current: false }];
                    updateProfile({ experiences: next });
                  }}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Plus size={15} />
                  <span>Add Work Experience</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Education */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Education & Academics</h3>
              <p className="text-xs text-slate-500">Add your highest degree or technical certifications.</p>
            </div>

            {errors.education && (
              <p className="text-xs text-red-600 font-bold p-3 rounded-xl bg-red-50 border border-red-200">
                {errors.education}
              </p>
            )}

            <div className="space-y-4">
              {asArray(profile.educations).map((edu: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const next = asArray(profile.educations).filter((_, idx) => idx !== i);
                      updateProfile({ educations: next });
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition"
                    title="Remove Education"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">University / College *</label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Bombay / VTU"
                        value={edu.institution || ''}
                        onChange={(e) => {
                          const next = [...asArray(profile.educations)];
                          next[i] = { ...next[i], institution: e.target.value };
                          updateProfile({ educations: next });
                        }}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree / Qualification *</label>
                      <select
                        value={edu.qualification || DEGREE_OPTIONS[0]}
                        onChange={(e) => {
                          const next = [...asArray(profile.educations)];
                          next[i] = { ...next[i], qualification: e.target.value };
                          updateProfile({ educations: next });
                        }}
                        className={inputCls}
                      >
                        {DEGREE_OPTIONS.map((deg) => (
                          <option key={deg} value={deg}>{deg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Field of Study / Major</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science & Engineering"
                        value={edu.field || ''}
                        onChange={(e) => {
                          const next = [...asArray(profile.educations)];
                          next[i] = { ...next[i], field: e.target.value };
                          updateProfile({ educations: next });
                        }}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Graduation Year</label>
                      <ModernDatePicker
                        value={edu.gradYear || ''}
                        placeholder="Select graduation year"
                        mode="year"
                        minYear={1975}
                        maxYear={new Date().getFullYear() + 6}
                        onChange={(val) => {
                          const next = [...asArray(profile.educations)];
                          next[i] = { ...next[i], gradYear: val };
                          updateProfile({ educations: next });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const next = [...asArray(profile.educations), { institution: '', qualification: DEGREE_OPTIONS[0], field: '', gradYear: '' }];
                  updateProfile({ educations: next });
                }}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                <span>Add Education Degree</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Skills & Badges */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Technical Skills & Proficiency</h3>
              <p className="text-xs text-slate-500">Select your top engineering skills. Recruiter AI algorithm scores profiles based on these tags.</p>
            </div>

            {errors.skills && (
              <p className="text-xs text-red-600 font-bold p-3 rounded-xl bg-red-50 border border-red-200">
                {errors.skills}
              </p>
            )}

            {/* Custom skill add input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type any skill (e.g. Rust, Next.js, Redis) and press Add..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(customSkillInput);
                    setCustomSkillInput('');
                  }
                }}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => {
                  addSkill(customSkillInput);
                  setCustomSkillInput('');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 hover:bg-slate-800 transition"
              >
                Add Skill
              </button>
            </div>

            {/* Popular skill suggestions */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-2">Popular Skills (Click to Add):</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_SUGGESTIONS.map((s) => {
                  const isAdded = selectedSkills.some((x) => x.skill.toLowerCase() === s.toLowerCase());
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isAdded}
                      onClick={() => addSkill(s)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                        isAdded
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100'
                      }`}
                    >
                      {isAdded ? <Check size={12} /> : <Plus size={12} />}
                      <span>{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Added Skills List with Proficiency Level Selector */}
            {selectedSkills.length > 0 && (
              <div className="pt-3 space-y-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700">Selected Skills & Proficiency Levels:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedSkills.map((sk, idx) => (
                    <div
                      key={sk.skill}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="font-bold text-xs text-slate-800 truncate">{sk.skill}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={sk.level || 'Intermediate'}
                          onChange={(e) => {
                            const next = [...selectedSkills];
                            next[idx] = { ...next[idx], level: e.target.value };
                            updateProfile({ skillLevels: next });
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-700"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSkill(idx)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Portfolio & Links */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Projects & Online Presence</h3>
              <p className="text-xs text-slate-500">Provide proof of work, GitHub repositories, and online profiles.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Linkedin size={14} className="text-blue-600" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profile.linkedin || ''}
                  onChange={(e) => updateProfile({ linkedin: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Github size={14} className="text-slate-800" />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={profile.github || ''}
                  onChange={(e) => updateProfile({ github: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-600" />
                  <span>Personal Portfolio / Blog URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://yourname.dev"
                  value={profile.portfolio || ''}
                  onChange={(e) => updateProfile({ portfolio: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Job Preferences (HIGHLY MODERN & CUSTOM DESIGNED) */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-2">
                <SlidersHorizontal size={12} />
                Global Job Matching Engine
              </div>
              <h3 className="text-lg font-black text-slate-900">Career Preferences & Expectations</h3>
              <p className="text-xs text-slate-500">Configure your target roles, compensation expectations, work setup, and availability.</p>
            </div>

            {/* Target Roles Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Target Job Roles <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-slate-400">Select all titles you are actively interested in:</p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {POPULAR_ROLES.map((r) => {
                  const active = selectedRoles.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRole(r)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
                        active
                          ? 'bg-[#087BFF] text-white border-[#087BFF] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      {active ? <Check size={14} /> : <Plus size={14} className="text-slate-400" />}
                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom role */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Or type a custom role (e.g. Flutter Specialist, Rust Architect)..."
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customRoleInput.trim()) {
                        toggleRole(customRoleInput.trim());
                        setCustomRoleInput('');
                      }
                    }
                  }}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customRoleInput.trim()) {
                      toggleRole(customRoleInput.trim());
                      setCustomRoleInput('');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0"
                >
                  Add
                </button>
              </div>
              {errors.roles && <p className="text-[11px] text-red-600 font-bold">{errors.roles}</p>}
            </div>

            {/* Work Arrangement (Visual Card Selectors) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                2. Preferred Work Arrangement <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'remote', label: '100% Remote', icon: Globe, desc: 'Work from anywhere in India / Worldwide' },
                  { id: 'hybrid', label: 'Hybrid', icon: Building2, desc: 'Flexible 2-3 days office & home' },
                  { id: 'onsite', label: 'Onsite / Office', icon: MapPin, desc: 'Dedicated client or GCC campus' },
                ].map((item) => {
                  const isSelected = (profile.workArrangement || profile.jobPreferences?.workArrangement) === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        updateProfile({ workArrangement: item.id });
                        updateJobPref({ workArrangement: item.id });
                      }}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#087BFF] bg-blue-50/40 ring-2 ring-[#087BFF]/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon size={18} />
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                          {isSelected && <Check size={10} />}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{item.label}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Work Locations */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                3. Preferred Work Locations <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TOP_TECH_HUBS.map((loc) => {
                  const active = selectedLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active ? <Check size={12} className="text-emerald-400" /> : <Plus size={12} />}
                      <span>{loc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Location */}
              <div className="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customLocationInput.trim()) {
                        toggleLocation(customLocationInput.trim());
                        setCustomLocationInput('');
                      }
                    }
                  }}
                  placeholder="+ Add other city / region..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customLocationInput.trim()) {
                      toggleLocation(customLocationInput.trim());
                      setCustomLocationInput('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Add
                </button>
              </div>

              {errors.locations && <p className="text-[11px] text-red-600 font-bold">{errors.locations}</p>}
            </div>

            {/* Compensation & Notice Period (Dual Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Current CTC / Compensation
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="text"
                    placeholder="e.g. 15 LPA (or 15,00,000)"
                    value={profile.currentCtc || ''}
                    onChange={(e) => updateProfile({ currentCtc: e.target.value })}
                    className={inputCls + ' pl-7'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Expected CTC / Target Compensation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="text"
                    placeholder="e.g. 22 LPA (or 22,00,000)"
                    value={profile.expectedCtc || ''}
                    onChange={(e) => {
                      updateProfile({ expectedCtc: e.target.value });
                      setErrors((prev) => {
                        const cp = { ...prev };
                        delete cp.expectedCtc;
                        return cp;
                      });
                    }}
                    className={errors.expectedCtc ? inputErrCls + ' pl-7' : inputCls + ' pl-7'}
                  />
                </div>
                {errors.expectedCtc && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.expectedCtc}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Notice Period / Availability <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  {NOTICE_PERIODS.map((np) => {
                    const isSelected = (profile.noticePeriod || '') === np.label;
                    return (
                      <button
                        key={np.id}
                        type="button"
                        onClick={() => {
                          updateProfile({ noticePeriod: np.label, availability: np.label });
                          updateJobPref({ availability: np.label });
                          setErrors((prev) => {
                            const cp = { ...prev };
                            delete cp.noticePeriod;
                            return cp;
                          });
                        }}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-xs text-slate-900">{np.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{np.sub}</div>
                      </button>
                    );
                  })}
                </div>
                {errors.noticePeriod && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.noticePeriod}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Resume Upload (Integrated Direct Upload to Azure Blob Storage) */}
        {step === 8 && (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-2">
                <UploadCloud size={12} />
                Azure Blob Storage Integration
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Upload Your Resume / CV</h3>
              <p className="text-xs text-slate-500">Your resume is parsed for skills, indexed for matching, and safely archived in cloud storage.</p>
            </div>

            {errors.resume && (
              <p className="text-xs text-red-600 font-bold p-3 rounded-xl bg-red-50 border border-red-200">
                {errors.resume}
              </p>
            )}

            {resumeUploadError && (
              <p className="text-xs text-red-600 font-bold p-3 rounded-xl bg-red-50 border border-red-200">
                {resumeUploadError}
              </p>
            )}

            {/* Drag & Drop File Upload Box */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-blue-300 bg-blue-50/20 hover:bg-blue-50/50 rounded-3xl p-8 text-center cursor-pointer transition space-y-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <UploadCloud size={32} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  {uploadingResume ? 'Uploading to Azure Storage…' : 'Click to upload or drag & drop resume'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supported formats: PDF, DOC, DOCX (Up to 5 MB)</p>
              </div>
              <button
                type="button"
                disabled={uploadingResume}
                className="px-5 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs shadow-sm hover:bg-blue-600 transition"
              >
                {uploadingResume ? 'Processing…' : 'Browse Files'}
              </button>
            </div>

            {/* Currently Active / Linked Resume Card */}
            {profile.resumeRef && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">
                      {profile.resumeName || 'Resume.pdf'}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Uploaded to Azure Storage • Version {profile.resumeVersion || 1}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Replace
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 9: Visibility & Privacy Consent */}
        {step === 9 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Profile Visibility & Data Consent</h3>
              <p className="text-xs text-slate-500">Control how recruiters discover your profile and consent to job matching.</p>
            </div>

            {/* Visibility Mode Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Profile Discovery Setting
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'open',
                    title: 'Open to Offers',
                    sub: 'Recommended. Verified enterprise recruiters can contact you with private jobs.',
                    badge: 'Fastest Hires',
                  },
                  {
                    id: 'standard',
                    title: 'Active Apply Only',
                    sub: 'Your profile is only visible to organizations where you submit an application.',
                    badge: 'Standard',
                  },
                  {
                    id: 'anonymous',
                    title: 'Stealth / Anonymous',
                    sub: 'Identity masked from current employer until you approve mutual contact.',
                    badge: 'Confidential',
                  },
                ].map((vis) => {
                  const active = (profile.visibility || 'open') === vis.id;
                  return (
                    <button
                      key={vis.id}
                      type="button"
                      onClick={() => updateProfile({ visibility: vis.id })}
                      className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                        active
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {vis.badge}
                          </span>
                          {active && <CheckCircle2 size={16} className="text-blue-600" />}
                        </div>
                        <div className="font-extrabold text-xs text-slate-900">{vis.title}</div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{vis.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.termsConsent || false}
                  onChange={(e) => {
                    updateProfile({ termsConsent: e.target.checked });
                    setErrors((prev) => {
                      const cp = { ...prev };
                      delete cp.termsConsent;
                      return cp;
                    });
                  }}
                  className="mt-0.5 rounded border-slate-300 text-blue-600"
                />
                <span className="text-xs text-slate-700 font-medium leading-relaxed">
                  I consent to NexaTalent IT Solutions analyzing my profile & resume to match with enterprise job requisitions under DPDP Act 2023 / GDPR regulations. <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.marketingConsent || false}
                  onChange={(e) => updateProfile({ marketingConsent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-blue-600"
                />
                <span className="text-xs text-slate-600 font-medium leading-relaxed">
                  Send me curated salary benchmarks and weekly direct hiring invites via WhatsApp / Email.
                </span>
              </label>
            </div>
            {errors.termsConsent && <p className="text-[11px] text-red-600 font-bold">{errors.termsConsent}</p>}
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={step === 1 || busy}
            onClick={handleBack}
            className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          {step < 9 ? (
            <button
              type="button"
              disabled={busy}
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <span>{busy ? 'Saving…' : 'Save & Continue'}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={handleFinalSubmit}
              className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-emerald-600/20"
            >
              <CheckCircle2 size={16} />
              <span>{busy ? 'Finishing…' : 'Complete & Launch Profile'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
