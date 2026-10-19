/* ============================================================================
   NexaTalent — Onboarding Animation Screen
   60-second interactive setup experience: 5 steps × 12 seconds each.
   Modern AI-themed animations, then redirects to the role dashboard.
   ============================================================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Building2, ShieldCheck, CheckCircle2,
  Rocket, Brain, Cpu, Network, Activity, Sparkles,
  ArrowRight, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    key: 'identity',
    title: 'Verifying your identity',
    subtitle: 'Securing your account with email OTP',
    icon: ShieldCheck,
    color: 'text-black',
    bg: 'bg-white',
  },
  {
    key: 'profile',
    title: 'Calibrating your profile',
    subtitle: 'Matching your skills to enterprise demand',
    icon: Users,
    color: 'text-black',
    bg: 'bg-white',
  },
  {
    key: 'platform',
    title: 'Provisioning your workspace',
    subtitle: 'Setting up your hiring command center',
    icon: Building2,
    color: 'text-black',
    bg: 'bg-white',
  },
  {
    key: 'matching',
    title: 'Running AI talent matching',
    subtitle: 'Scanning 45,000+ verified practitioners',
    icon: Brain,
    color: 'text-black',
    bg: 'bg-white',
  },
  {
    key: 'ready',
    title: 'Dashboard ready',
    subtitle: 'Your NexaTalent workspace is live',
    icon: Rocket,
    color: 'text-black',
    bg: 'bg-white',
  },
] as const;

const STEP_DURATION_MS = 12000;
const TOTAL_STEPS = STEPS.length;
const TOTAL_DURATION_MS = STEP_DURATION_MS * TOTAL_STEPS;

export function OnboardingAnimation({ role = 'candidate' }: { role?: string }) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const e = Date.now() - start;
      setElapsed(e);

      if (e >= TOTAL_DURATION_MS) {
        setCompleted(true);
        clearInterval(t);
        return;
      }

      const currentStep = Math.floor(e / STEP_DURATION_MS);
      const stepStart = currentStep * STEP_DURATION_MS;
      const stepElapsed = e - stepStart;
      const p = Math.min(100, Math.round((stepElapsed / STEP_DURATION_MS) * 100));

      setStepIndex(Math.min(currentStep, TOTAL_STEPS - 1));
      setStepProgress(p);
    }, 100);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (completed) {
      const t = setTimeout(() => {
        const rolePath =
          role === 'candidate' ? '/candidate/dashboard'
          : role === 'employer' ? '/employer/dashboard'
          : role === 'recruiter' ? '/recruiter/dashboard'
          : '/vendor/dashboard';
        navigate(rolePath);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [completed, role, navigate]);

  const currentStep = STEPS[Math.min(stepIndex, TOTAL_STEPS - 1)];
  const overallProgress = Math.min(100, Math.round((elapsed / TOTAL_DURATION_MS) * 100));

  const renderStepContent = () => (
    <motion.div
      key={`step-${stepIndex}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl text-left space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-12 h-12 rounded-2xl ${currentStep.bg} flex items-center justify-center shadow-lg`}>
          <currentStep.icon size={24} className={currentStep.color} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
            Step {stepIndex + 1} of {TOTAL_STEPS}
          </span>
          <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
        </div>
      </div>
      <p className="text-sm text-slate-300">{currentStep.subtitle}</p>
      <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${stepProgress}%` }}
          transition={{ duration: 0.2 }}
        ></motion.div>
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
        <span>Starting</span>
        <span>Almost done</span>
      </div>
    </motion.div>
  );

  const renderCompleted = () => (
    <motion.div
      key="completed"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
        <CheckCircle2 size={40} className="text-white" />
      </div>
      <h3 className="text-2xl font-extrabold text-white">Workspace Ready</h3>
      <p className="text-slate-300 text-sm">
        Your NexaTalent platform is fully configured. Redirecting to your dashboard…
      </p>
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
        <Loader2 size={14} className="animate-spin" />
        Redirecting…
      </div>
      <div className="mt-6">
        <Link
          to={
            role === 'candidate' ? '/candidate/dashboard'
            : role === 'employer' ? '/employer/dashboard'
            : role === 'recruiter' ? '/recruiter/dashboard'
            : '/vendor/dashboard'
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs border border-white/20 shadow-lg shadow-black/20 transition-all cursor-pointer"
        >
          <span>Go to Dashboard</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full bg-[#0A192F] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-white/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[20%] w-48 h-48 bg-white/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          {!completed ? (
            <>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur text-[10px] font-extrabold text-white uppercase tracking-wider">
                  <Sparkles size={12} className="text-white animate-pulse" />
                  Setting up your platform
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  Your NexaTalent Workspace
                </h2>
                <p className="text-slate-300 text-sm">
                  Preparing everything for your{' '}
                  <span className="font-bold text-white">{role.charAt(0).toUpperCase() + role.slice(1)}</span>{' '}
                  dashboard…
                </p>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  style={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {overallProgress}% complete
              </div>
              {renderStepContent()}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                {[
                  { label: 'AI Matching', icon: Network, color: 'text-white' },
                  { label: 'Compliance', icon: Cpu, color: 'text-white' },
                  { label: 'Analytics', icon: Activity, color: 'text-white' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2"
                  >
                    <f.icon size={16} className={f.color} />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            renderCompleted()
          )}
        </motion.div>
      </div>
    </div>
  );
}
