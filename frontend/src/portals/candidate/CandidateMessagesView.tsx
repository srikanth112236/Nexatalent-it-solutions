import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Paperclip, Search, 
  ShieldCheck, CheckCheck,
  Video, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import { chatApi, documentsApi } from '../../shared/enterprise/phaseApi';
import { syncAll } from '../common/EnterprisePanels';

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  senderName?: string;
  body: string;
  createdAt: string;
  type?: string;
  attachment?: {
    docId: string;
    name: string;
    mime: string;
    size: number;
  };
}

interface Conversation {
  id: string;
  applicationId?: string;
  jobId?: string;
  jobTitle?: string;
  companyName?: string;
  candidateId?: string;
  candidateEmail?: string;
  companyId?: string;
  title?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt?: string;
}

interface CandidateMessagesViewProps {
  initialAppId?: string;
  userEmail: string;
  onNavigate: (path: string) => void;
}

const QUICK_TEMPLATES = [
  'Confirmed! Looking forward to the interview session.',
  'Thank you for the update. Reviewing the details now.',
  'I have uploaded my updated executive CV for reference.',
  'Could you please share the meeting agenda and technical expectations?',
];

export const CandidateMessagesView: React.FC<CandidateMessagesViewProps> = ({
  initialAppId = '',
  userEmail,
  onNavigate,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [attBusy, setAttBusy] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Load conversations on mount
  useEffect(() => {
    let mounted = true;
    const fetchConversations = async () => {
      setLoading(true);
      setError('');
      try {
        const res: any = await chatApi.conversations(initialAppId ? initialAppId.trim() : undefined);
        const list = res?.data?.data || res?.data || [];
        if (mounted) {
          const arr = Array.isArray(list) ? list : [];
          setConversations(arr);
          if (arr.length > 0) {
            // Find conversation matching initialAppId or default to first
            const match = initialAppId ? arr.find((c: any) => c.applicationId === initialAppId) : null;
            const chosen = match || arr[0];
            setActiveConvId(chosen.id);
            setActiveConv(chosen);
          }
        }
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.message || err?.message || 'Failed to load conversations.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchConversations();
    return () => { mounted = false; };
  }, [initialAppId]);

  // 2. Load messages whenever activeConvId changes
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    let mounted = true;
    const fetchThread = async () => {
      setThreadLoading(true);
      setError('');
      try {
        const res: any = await chatApi.thread(activeConvId);
        const data = res?.data?.data || res?.data || {};
        if (mounted) {
          const msgsList = Array.isArray(data?.messages) ? data.messages : (Array.isArray(data) ? data : []);
          setMessages(msgsList);
          if (data?.conversation) {
            setActiveConv(data.conversation);
          }
          setTimeout(scrollToBottom, 100);
        }
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.message || err?.message || 'Failed to load message thread.');
      } finally {
        if (mounted) setThreadLoading(false);
      }
    };

    fetchThread();
    return () => { mounted = false; };
  }, [activeConvId]);

  // 3. Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? draft).trim();
    if (!text || !activeConvId || sending) return;

    setSending(true);
    try {
      const res: any = await chatApi.send(activeConvId, text);
      const newMsg = res?.data?.data || res?.data;
      if (newMsg?.id) {
        setMessages((prev) => [...prev, newMsg]);
        // Update lastMessage on conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, lastMessage: text, lastMessageAt: new Date().toISOString() }
              : c
          )
        );
      }
      setDraft('');
      syncAll();
      setTimeout(scrollToBottom, 50);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  // 4. Send attachment
  const handleAttachmentUpload = async (file: File) => {
    if (!file || !activeConvId) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5 MB.');
      return;
    }

    setAttBusy(true);
    setError('');
    try {
      const buf = await file.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      
      const upRes: any = await documentsApi.upload({
        name: file.name,
        mime: file.type || 'application/pdf',
        data: btoa(binary),
        kind: 'chat-attachment',
      });
      const up = upRes?.data?.data || upRes?.data;
      
      const res: any = await chatApi.send(activeConvId, file.name, {
        docId: up.id,
        name: up.name || file.name,
        mime: up.mime || file.type,
        size: up.size || file.size,
      });

      const newMsg = res?.data?.data || res?.data;
      if (newMsg?.id) {
        setMessages((prev) => [...prev, newMsg]);
      }
      syncAll();
      setTimeout(scrollToBottom, 50);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to upload attachment.');
    } finally {
      setAttBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fmtTime = (d?: string) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      return dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

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
      if (diffDays < 7) return `${diffDays}d ago`;
      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const title = (c.title || c.companyName || '').toLowerCase();
    const job = (c.jobTitle || '').toLowerCase();
    const lastMsg = (c.lastMessage || '').toLowerCase();
    return title.includes(q) || job.includes(q) || lastMsg.includes(q);
  });

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles size={12} className="text-indigo-400" />
              Recruiter & Hiring Team Messaging
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Direct Communication Channel</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Connect directly with hiring managers and interview panel leads regarding schedule availability, technical queries, and offer discussions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-indigo-400">{conversations.length}</div>
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Channels</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700 font-bold text-xs">✕</button>
        </div>
      )}

      {/* Main Split Layout: Channels List + Chat Window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Sidebar: Channels List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Search Bar */}
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
                <p className="text-xs text-slate-500 font-medium">Loading channels...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <MessageSquare size={18} />
                </div>
                <h4 className="text-xs font-bold text-slate-900">No conversations</h4>
                <p className="text-[11px] text-slate-500">
                  {search ? 'No conversations match your search.' : 'Direct channels open when applications advance to interview or offer.'}
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeConvId;
                const company = c.companyName || (c.title ? c.title.split('–')[0].trim() : 'Fintech ScaleOps');
                const initials = company.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveConvId(c.id);
                      setActiveConv(c);
                    }}
                    className={`w-full p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 border-l-4 border-indigo-600 shadow-xs'
                        : 'hover:bg-slate-100/70 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${isSelected ? 'font-black text-indigo-950' : 'font-bold text-slate-900'}`}>
                          {company}
                        </span>
                        {c.lastMessageAt && (
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            {fmtRelative(c.lastMessageAt)}
                          </span>
                        )}
                      </div>

                      {c.jobTitle && (
                        <div className="text-[11px] text-indigo-700 font-semibold truncate">
                          {c.jobTitle}
                        </div>
                      )}

                      <p className="text-xs text-slate-500 truncate font-medium">
                        {c.lastMessage || 'Channel active. Start conversation.'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Active Chat Thread (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {activeConvId && activeConv ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {(activeConv.companyName || 'FS').slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-slate-900 truncate">
                        {activeConv.title || activeConv.companyName || 'Fintech ScaleOps Recruiter Channel'}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 text-indigo-700 text-[10px] font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        <ShieldCheck size={11} className="text-indigo-600" /> Verified Employer
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                      <span>Role: <strong className="text-slate-800">{activeConv.jobTitle || 'Distributed Systems Architect'}</strong></span>
                      {activeConv.applicationId && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => onNavigate(`/candidate/applications/${activeConv.applicationId}`)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            View Application <ExternalLink size={10} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onNavigate('/candidate/interviews')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title="View scheduled interview rounds"
                  >
                    <Video size={13} className="text-indigo-600" />
                    <span className="hidden sm:inline">Interviews</span>
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[440px] bg-slate-50/30">
                {threadLoading ? (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Loading message history...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                      <MessageSquare size={20} />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">Start the conversation</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Send a message to introduce yourself or reply to questions regarding your technical evaluation.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = String(m.sender || '').toLowerCase() === userEmail.toLowerCase();

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mb-1 px-1">
                          <span className="font-bold text-slate-600">
                            {isMine ? 'You' : (m.senderName || 'Hiring Team')}
                          </span>
                          <span>•</span>
                          <span>{fmtTime(m.createdAt)}</span>
                        </div>

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-2 shadow-xs ${
                            isMine
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                          }`}
                        >
                          <div className="font-normal whitespace-pre-wrap">{m.body}</div>

                          {/* Attachment Pill */}
                          {m.attachment && (
                            <div
                              className={`p-2 rounded-xl flex items-center justify-between gap-2 text-xs border ${
                                isMine
                                  ? 'bg-indigo-700/60 border-indigo-500 text-white'
                                  : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Paperclip size={12} className={isMine ? 'text-indigo-200' : 'text-slate-400'} />
                                <span className="font-semibold truncate">{m.attachment.name}</span>
                              </div>
                              <span className="text-[10px] opacity-75 shrink-0">
                                {(m.attachment.size / 1024).toFixed(0)} KB
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-0.5 px-1">
                          {isMine && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <CheckCheck size={11} className="text-indigo-600" /> Delivered
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Template Suggestion Chips */}
              <div className="p-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-2">
                  Suggestions:
                </span>
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(tmpl)}
                    disabled={sending}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-[11px] font-medium text-slate-600 truncate shrink-0 transition-colors cursor-pointer"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>

              {/* Message Composer */}
              <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAttachmentUpload(f);
                    }}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={attBusy}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                    title="Attach document or resume (under 5 MB)"
                  >
                    <Paperclip size={18} />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      rows={2}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message to the recruiter... (Press Enter to send)"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <Send size={14} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Select a conversation</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Choose a channel from the left sidebar to communicate directly with hiring leads.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
