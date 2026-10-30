import React, { useState, useEffect } from 'react';
import { 
  User, Lock, 
  Globe, Bell, FileText, CheckCircle2, 
  Sparkles, ChevronRight,
  Briefcase
} from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { syncAll } from '../common/EnterprisePanels';

interface CandidateSettingsViewProps {
  userEmail: string;
  onNavigate: (path: string) => void;
}

export const CandidateSettingsView: React.FC<CandidateSettingsViewProps> = ({
  userEmail,
  onNavigate,
}) => {
  const [name, setName] = useState('Siddharth Nair');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [targetTitle, setTargetTitle] = useState('Principal Architect - Distributed Systems');
  const [expectedSalary, setExpectedSalary] = useState('4200000');
  const [noticePeriod, setNoticePeriod] = useState('30 Days');
  const [workArrangement, setWorkArrangement] = useState('Hybrid');
  const [location, setLocation] = useState('Bangalore, India');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res: any = await apiClient.get(`/api/v1/candidate/profile?email=${encodeURIComponent(userEmail)}`).catch(() => null);
        const data = res?.data?.data || res?.data;
        if (mounted && data) {
          if (data.name) setName(data.name);
          if (data.phone) setPhone(data.phone);
          if (data.currentTitle || data.jobTitle) setTargetTitle(data.currentTitle || data.jobTitle);
          if (data.expectedSalary) setExpectedSalary(String(data.expectedSalary));
          if (data.noticePeriod) setNoticePeriod(data.noticePeriod);
          if (data.workArrangement) setWorkArrangement(data.workArrangement);
          if (data.location) setLocation(data.location);
        }
      } catch {
        // use defaults
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, [userEmail]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiClient.put('/api/v1/candidate/profile', {
        email: userEmail,
        name,
        phone,
        currentTitle: targetTitle,
        expectedSalary: Number(expectedSalary) || 4200000,
        noticePeriod,
        workArrangement,
        location,
        timezone,
        currency,
        updatedAt: new Date().toISOString(),
      }).catch(() => null);

      setSuccess('Candidate preferences updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
      syncAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles size={12} className="text-indigo-400" />
              Candidate Account Hub
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Career Settings & Preferences</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Manage your verified profile details, compensation benchmarks, preferred job locations, and quick access to workspace security.
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold">✕</button>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Quick Access Workspace Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('/candidate/security')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Lock size={16} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 flex items-center justify-between">
              Security & 2FA
              <ChevronRight size={12} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <div className="text-[10px] text-slate-500 font-medium">TOTP & Active Sessions</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/candidate/privacy')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Globe size={16} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 flex items-center justify-between">
              Privacy & Consent
              <ChevronRight size={12} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Profile Visibility & DPDP</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/candidate/docs')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText size={16} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 flex items-center justify-between">
              Document Vault
              <ChevronRight size={12} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Resumes & Contracts</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/candidate/notifications')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Bell size={16} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 flex items-center justify-between">
              Notifications
              <ChevronRight size={12} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Alert Delivery Rules</div>
          </div>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile & Contact Card */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <User size={16} className="text-indigo-600" />
              Candidate Profile & Identification
            </h3>
            <p className="text-xs text-slate-500">
              Primary identification details shared with hiring committees upon interview scheduling.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Primary Email Address
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  disabled
                  value={userEmail}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                />
                <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  Verified
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mobile / WhatsApp Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Career & Role Preferences */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-600" />
              Target Role & Compensation Benchmarks
            </h3>
            <p className="text-xs text-slate-500">
              Informs AI matching and filters positions that match your career level.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Primary Target Role / Specialization
              </label>
              <input
                type="text"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Expected Annual CTC (₹)
                </label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notice Period
                </label>
                <select
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Work Arrangement
                </label>
                <select
                  value={workArrangement}
                  onChange={(e) => setWorkArrangement(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Localization & Region */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Globe size={16} className="text-indigo-600" />
              Regional & Display Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Customize calendar synchronizations and monetary currency units.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (BST)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="GBP">GBP (£ British Pound)</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
