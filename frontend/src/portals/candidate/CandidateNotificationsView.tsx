import React, { useState, useEffect } from 'react';
import { 
  Bell, Award, Calendar, 
  CheckCheck, Sparkles, ChevronRight,
  Settings2, Mail, Smartphone
} from 'lucide-react';
import { platformApi } from '../../shared/enterprise/phaseApi';
import { syncAll } from '../common/EnterprisePanels';

interface NotificationItem {
  id: string;
  recipient: string;
  kind: string;
  body: string;
  channel?: string;
  status?: string;
  createdAt: string;
  tenantId?: string;
}

interface CandidateNotificationsViewProps {
  onNavigate: (path: string) => void;
}

export const CandidateNotificationsView: React.FC<CandidateNotificationsViewProps> = ({
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Delivery preferences
  const [prefs, setPrefs] = useState({
    inApp: true,
    email: true,
    offers: true,
    interviews: true,
    applications: true,
    messages: true,
  });
  const [prefsSaving, setPrefsSaving] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await platformApi.notifications();
      const list = res?.data?.data || res?.data || [];
      setNotifications(Array.isArray(list) ? list : []);

      const pRes: any = await platformApi.prefs().catch(() => null);
      const pList = pRes?.data?.data || pRes?.data || [];
      if (pList[0]) {
        const raw = pList[0];
        setPrefs((prev) => ({
          ...prev,
          inApp: raw.inApp !== false,
          email: raw.email !== false,
          offers: raw.kinds?.offer !== false,
          interviews: raw.kinds?.interview !== false,
          applications: raw.kinds?.application !== false,
          messages: raw.kinds?.chat !== false,
        }));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await platformApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
      setSuccess('All notifications marked as read.');
      setTimeout(() => setSuccess(''), 3000);
      syncAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to mark all as read.');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await platformApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
      );
      syncAll();
    } catch {
      // optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
      );
    }
  };

  const handleSavePrefs = async () => {
    setPrefsSaving(true);
    setError('');
    try {
      await platformApi.savePrefs({
        inApp: prefs.inApp,
        email: prefs.email,
        kinds: {
          offer: prefs.offers,
          interview: prefs.interviews,
          application: prefs.applications,
          chat: prefs.messages,
        },
      });
      setSuccess('Notification preferences saved.');
      setTimeout(() => setSuccess(''), 3000);
      syncAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save preferences.');
    } finally {
      setPrefsSaving(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.status !== 'read').length;

  const fmtRelative = (d?: string) => {
    if (!d) return '';
    try {
      const now = new Date();
      const dt = new Date(d);
      const diffMs = now.getTime() - dt.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      const diffHours = Math.round(diffMins / 60);
      const diffDays = Math.round(diffHours / 24);

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.status !== 'read';
    if (filter === 'offer') return n.kind === 'offer' || n.kind === 'placement';
    if (filter === 'interview') return n.kind === 'interview';
    if (filter === 'application') return n.kind === 'application' || n.kind === 'stage';
    if (filter === 'chat') return n.kind === 'chat' || n.kind === 'message';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles size={12} className="text-indigo-400" />
              Real-Time Activity & Status Alerts
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Notifications & Alerts</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Stay immediately informed on new formal offers, video interview invitations, recruiter messages, and stage advancements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-amber-400">{unreadCount}</div>
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Unread Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Controls & Actions */}
      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'unread' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('offer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'offer' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Offers
          </button>
          <button
            onClick={() => setFilter('interview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'interview' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Interviews
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCheck size={13} className="text-indigo-600" />
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold">✕</button>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          {success}
        </div>
      )}

      {/* Main Grid: Notifications List + Preferences Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Notifications Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
              <div className="inline-block animate-spin w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full mb-2" />
              <p className="text-xs font-bold text-slate-600">Loading notifications...</p>
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Bell size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">No notifications</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filter === 'unread'
                  ? 'All caught up! You have zero unread alerts.'
                  : 'New activity regarding your applications will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifs.map((n) => {
              const isUnread = n.status !== 'read';
              const isOffer = n.kind === 'offer' || n.kind === 'placement';
              const isInterview = n.kind === 'interview';

              return (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isUnread
                      ? 'bg-white border-indigo-300 shadow-xs ring-1 ring-indigo-100'
                      : 'bg-white/80 border-slate-200/80 opacity-90'
                  }`}
                >
                  {/* Category Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isOffer
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : isInterview
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {isOffer ? <Award size={20} /> : isInterview ? <Calendar size={20} /> : <Bell size={18} />}
                  </div>

                  {/* Body & Actions */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isOffer
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInterview
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {n.kind}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium">
                        {fmtRelative(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-800 leading-relaxed">
                      {n.body}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        {isOffer && (
                          <button
                            onClick={() => onNavigate('/candidate/offers')}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                          >
                            Review Offer <ChevronRight size={12} />
                          </button>
                        )}
                        {isInterview && (
                          <button
                            onClick={() => onNavigate('/candidate/interviews')}
                            className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            Open Interview Schedule <ChevronRight size={12} />
                          </button>
                        )}
                      </div>

                      {isUnread && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Preferences Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Settings2 size={14} className="text-indigo-600" />
                Delivery Channels
              </h3>
              <button
                onClick={handleSavePrefs}
                disabled={prefsSaving}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                {prefsSaving ? 'Saving...' : 'Save'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-slate-400" />
                  <span className="font-semibold text-slate-800">In-App Notification Alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.inApp}
                  onChange={(e) => setPrefs({ ...prefs, inApp: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="font-semibold text-slate-800">Email Updates & Reminders</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.email}
                  onChange={(e) => setPrefs({ ...prefs, email: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Notification Categories
              </div>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-700">Official Offers & Placements</span>
                <input
                  type="checkbox"
                  checked={prefs.offers}
                  onChange={(e) => setPrefs({ ...prefs, offers: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-700">Interview Invites & Changes</span>
                <input
                  type="checkbox"
                  checked={prefs.interviews}
                  onChange={(e) => setPrefs({ ...prefs, interviews: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-700">Application Stage Progress</span>
                <input
                  type="checkbox"
                  checked={prefs.applications}
                  onChange={(e) => setPrefs({ ...prefs, applications: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-700">Recruiter Chat InMail</span>
                <input
                  type="checkbox"
                  checked={prefs.messages}
                  onChange={(e) => setPrefs({ ...prefs, messages: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
