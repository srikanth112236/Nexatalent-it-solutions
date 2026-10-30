import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Download, Trash2, 
  CheckCircle2, AlertCircle, 
  Globe, UserCheck, AlertTriangle
} from 'lucide-react';
import { documentsApi, directoryApi } from '../../shared/enterprise/phaseApi';
import { apiClient } from '../../shared/api-client';
import { syncAll } from '../common/EnterprisePanels';

interface CandidatePrivacyViewProps {
  userEmail: string;
}

const VISIBILITY_OPTIONS = [
  {
    key: 'open',
    title: 'Open to Scale-Up Recruiters (Recommended)',
    desc: 'Your profile and verified tech stack are prioritized for top fintech and cloud architecture openings.',
    badge: 'Fastest Matching',
  },
  {
    key: 'standard',
    title: 'Standard Talent Directory',
    desc: 'Searchable by verified enterprise hiring managers with matching open job requisitions.',
    badge: 'Standard',
  },
  {
    key: 'private',
    title: 'Private (Applications Only)',
    desc: 'Visible strictly to employers and hiring committees where you actively submitted an application.',
    badge: 'Strict',
  },
  {
    key: 'anonymous',
    title: 'Incognito / Anonymous Search',
    desc: 'Your name and current company are masked until you accept an interview invitation.',
    badge: 'Confidential',
  },
];

export const CandidatePrivacyView: React.FC<CandidatePrivacyViewProps> = ({
  userEmail,
}) => {
  const [visibility, setVisibility] = useState('open');
  const [marketing, setMarketing] = useState(false);
  const [directMessaging, setDirectMessaging] = useState(true);
  const [bgvConsent, setBgvConsent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modals & Data rights
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawBusy, setWithdrawBusy] = useState(false);
  const [delReason, setDelReason] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [delSuccess, setDelSuccess] = useState('');

  const loadConsents = async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await documentsApi.consents();
      const list = res?.data?.data || res?.data || [];
      const consent = list[0] || null;
      if (consent) {
        setVisibility(consent.visibility || 'open');
        setMarketing(!!consent.marketing);
        if (consent.directMessaging !== undefined) setDirectMessaging(!!consent.directMessaging);
        if (consent.backgroundVerificationConsent !== undefined) setBgvConsent(!!consent.backgroundVerificationConsent);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load privacy preferences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsents();
  }, []);

  const handleSavePreferences = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await documentsApi.saveConsents({
        visibility,
        marketing,
        directMessaging,
        backgroundVerificationConsent: bgvConsent,
        updatedAt: new Date().toISOString(),
      });
      setSuccess('Privacy & consent preferences updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
      syncAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res: any = await documentsApi.exportData(userEmail);
      const data = res?.data?.data || res?.data || { candidate: userEmail, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexatalent-candidate-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to export data.');
    }
  };

  const handleWithdrawConsent = async () => {
    setWithdrawBusy(true);
    setError('');
    try {
      await documentsApi.withdrawConsents(userEmail);
      setVisibility('private');
      setMarketing(false);
      setShowWithdrawModal(false);
      setSuccess('Consent withdrawn. Profile set to private.');
      setTimeout(() => setSuccess(''), 4000);
      syncAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to withdraw consent.');
    } finally {
      setWithdrawBusy(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!delReason.trim()) {
      setError('Please provide a reason for the deletion request.');
      return;
    }

    setDelBusy(true);
    setError('');
    try {
      const prof: any = await apiClient.get(`/api/v1/candidate/profile?email=${encodeURIComponent(userEmail)}`).catch(() => null);
      const id = prof?.data?.id || prof?.data?.data?.id || 'CAND-SELF';
      await directoryApi.requestDeletion(id, delReason.trim());
      setDelSuccess('Account deletion request filed. A compliance reviewer will process your request while maintaining required financial audit trails.');
      setDelReason('');
      syncAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to submit deletion request.');
    } finally {
      setDelBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <ShieldCheck size={12} className="text-emerald-400" />
              DPDP & GDPR Compliance Center
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Privacy Controls & Consent</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Control your candidate profile visibility to employers, manage background verification authorizations, and exercise your digital data rights.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSavePreferences}
              disabled={saving || loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700 font-bold text-xs">✕</button>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Profile Visibility Setting */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Globe size={16} className="text-indigo-600" />
              Profile Discovery & Visibility
            </h3>
            <p className="text-xs text-slate-500">
              Configure which verified employers and talent acquisition teams can discover your profile.
            </p>
          </div>

          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 hidden sm:inline">
            Active: {visibility.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {VISIBILITY_OPTIONS.map((opt) => {
            const isSelected = visibility === opt.key;
            return (
              <label
                key={opt.key}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.key}
                      checked={isSelected}
                      onChange={() => setVisibility(opt.key)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-black text-slate-900">{opt.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium pl-6 leading-relaxed">
                  {opt.desc}
                </p>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Consent Controls & Authorizations */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <UserCheck size={16} className="text-emerald-600" />
          Consent Authorizations & Legal Processing
        </h3>

        <div className="divide-y divide-slate-100 space-y-3 pt-1">
          <div className="pt-2 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                Evaluation & Placement Processing Consent
              </div>
              <p className="text-[11px] text-slate-500">
                Authorizes NexaTalent to process your profile, CV credentials, and interview assessments for job placement.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              Granted & Active
            </span>
          </div>

          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                Background & Credential Verification Authorization
              </div>
              <p className="text-[11px] text-slate-500">
                Permits prospective employers to verify employment history, academic degrees, and past performance after offer extension.
              </p>
              <div className="text-[10px] text-emerald-700 font-semibold pt-0.5">
                ● Formally authorized on Oct 18, 2026
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bgvConsent}
                onChange={(e) => setBgvConsent(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                Direct Recruiter Messaging & InMail
              </div>
              <p className="text-[11px] text-slate-500">
                Allows verified hiring leads to contact you directly in the portal chat for relevant opportunities.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={directMessaging}
                onChange={(e) => setDirectMessaging(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                Career Advisory & Skill Benchmark Updates
              </div>
              <p className="text-[11px] text-slate-500">
                Receive curated market salary trends, tech stack demand forecasts, and career coaching alerts.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Data Subject Rights (Export & Deletion) */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Download size={16} className="text-indigo-600" />
          Data Portability & Deletion Rights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Data */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-900">Export Complete Profile Data</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Download a machine-readable JSON archive of all your applications, interview schedules, offers, and uploaded CV metadata.
              </p>
            </div>

            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start"
            >
              <Download size={13} />
              Export JSON Archive
            </button>
          </div>

          {/* Withdraw Consent */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-900">Withdraw Talent Pool Consent</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Halt active recruitment discovery and convert profile to strictly private. Active applications are preserved.
              </p>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start"
            >
              <AlertTriangle size={13} className="text-amber-600" />
              Withdraw Consent
            </button>
          </div>
        </div>

        {/* Right to be Forgotten / Deletion Box */}
        <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3 mt-2">
          <div className="flex items-center gap-2 text-rose-700">
            <Trash2 size={16} />
            <h4 className="text-xs font-black text-slate-900">Request Account Anonymization & Deletion</h4>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Requests permanent removal of personal identifiable information (PII). In accordance with employment labor regulations, completed contracts and financial audit trails are retained in an anonymized state.
          </p>

          {delSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              {delSuccess}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <input
              type="text"
              value={delReason}
              onChange={(e) => setDelReason(e.target.value)}
              placeholder="Reason for deletion request (e.g. Relocating / Career Change)..."
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={handleRequestDeletion}
              disabled={delBusy || !delReason.trim()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
            >
              {delBusy ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle size={20} />
              <h4 className="text-base font-extrabold text-slate-900">Confirm Consent Withdrawal</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Withdrawing consent will stop partner employer notifications and switch your candidate profile to <strong>Private</strong>. Ongoing active interviews or extended offers will remain visible to you.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={withdrawBusy}
                onClick={handleWithdrawConsent}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {withdrawBusy ? 'Withdrawing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
