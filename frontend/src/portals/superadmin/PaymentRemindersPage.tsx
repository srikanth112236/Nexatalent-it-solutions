/* ============================================================================
   NexaTalent — Payment Reminders (Superadmin)
   Complete standalone page: overdue / due-soon invoice reminders,
   billing schedule run, and one-click reminder dispatch.
   ============================================================================ */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, AlertTriangle, CheckCircle2, Send,
  RefreshCw, ChevronRight
} from 'lucide-react';
import { billingApi } from '../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../shared/ui/DataState';
import { useCan } from '../../shared/auth/AuthContext';

const cardCls = 'bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm';

export function PaymentRemindersPage() {
  const navigate = useNavigate();
  const canBill = useCan('manage_billing');

  /* ---------- state ---------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schedResult, setSchedResult] = useState('');
  const [remResult, setRemResult] = useState('');

  const [overdue, setOverdue] = useState({ n: 0, amt: 0 });
  const [dueSoon, setDueSoon] = useState({ n: 0, amt: 0 });
  const [reminders, setReminders] = useState<any[]>([]);
  const [remBusy, setRemBusy] = useState(false);
  const [schedBusy, setSchedBusy] = useState(false);
  const [remKind, setRemKind] = useState<'all' | 'overdue' | 'due-soon'>('all');

  /* ---------- load ---------- */
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [invRes, remRes] = await Promise.all([
        billingApi.invoices('?page=1&pageSize=100&view=open'),
        billingApi.invoiceReminders('?page=1&pageSize=50'),
      ]);

      const invList = unwrapList(invRes);
      const now = Date.now();
      const open = invList.filter((i: any) => Number(i.balance || 0) > 0 && ['Issued', 'Partially Paid'].includes(i.status));

      const od = open.filter((i: any) => {
        const ms = new Date(i.dueDate).getTime();
        return Number.isFinite(ms) && ms < now;
      });
      const w7 = open.filter((i: any) => {
        const ms = new Date(i.dueDate).getTime();
        return Number.isFinite(ms) && ms >= now && ms <= now + 7 * 864e5;
      });

      setOverdue({ n: od.length, amt: od.reduce((a, i) => a + Number(i.balance || 0), 0) });
      setDueSoon({ n: w7.length, amt: w7.reduce((a, i) => a + Number(i.balance || 0), 0) });

      const remList = unwrapList(remRes);
      setReminders(remList);
    } catch (e: any) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ---------- actions ---------- */
  const runSchedule = async () => {
    setSchedBusy(true); setSchedResult(''); setError('');
    try {
      const r = await billingApi.scheduleRun();
      const d = unwrapObj(r) as any;
      setSchedResult(
        `Schedule run: ${d?.generated?.length ?? 0} monthly invoice(s) generated, ` +
        `${d?.issued?.length ?? 0} series draft(s) issued.`
      );
      load();
    } catch (e: any) { setError(errMsg(e)); } finally { setSchedBusy(false); }
  };

  const sendReminders = async () => {
    setRemBusy(true); setRemResult(''); setError('');
    try {
      const r = await billingApi.runInvoiceReminders();
      const d = unwrapObj(r) as any;
      setRemResult(
        `Reminders queued: ${d?.sent ?? 0} notice(s) (overdue + due within 7 days → superadmin).`
      );
      load();
    } catch (e: any) { setError(errMsg(e)); } finally { setRemBusy(false); }
  };

  const inr = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const attentionCount = overdue.n + dueSoon.n;

  if (loading) return <InlineLoading message="Loading reminders…" />;
  if (error) return (
    <div className={cardCls}>
      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
        <AlertTriangle size={15} /> {error}
      </div>
    </div>
  );

  return (
    <div className={cardCls}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Payment Reminders</h2>
            <p className="text-xs text-slate-500 font-medium">Overdue & due-within-7-days invoice notices — superadmin queue.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
          <MailIcon size={12} className="text-amber-600" /> Email delivery via SMTP
        </div>
      </div>

      {/* Attention banner */}
      <div className={`p-4 rounded-2xl border ${attentionCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'} mb-6 flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className={attentionCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <div>
            <div className="text-xs font-extrabold">{attentionCount} needing attention</div>
            <div className="text-[10px] text-slate-500">
              {overdue.n} overdue · {dueSoon.n} due within 7 days
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-extrabold text-slate-500">Logged</div>
            <div className="text-sm font-bold text-slate-900">{reminders.length}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          onClick={runSchedule}
          disabled={schedBusy || !canBill}
          className={`w-full py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all disabled:opacity-50 ${
            schedBusy || !canBill
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-[#0B5FD9] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          <RefreshCw size={16} className={schedBusy ? 'animate-spin' : ''} />
          <span>{schedBusy ? 'Running…' : 'Run billing schedule'}</span>
        </button>
        <button
          onClick={sendReminders}
          disabled={remBusy || !canBill}
          className={`w-full py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all disabled:opacity-50 ${
            remBusy || !canBill
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20'
          }`}
        >
          <Send size={16} />
          <span>{remBusy ? 'Sending…' : 'Send reminders now'}</span>
        </button>
      </div>

      {/* Results */}
      {schedResult && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600" /> {schedResult}
        </div>
      )}
      {remResult && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600" /> {remResult}
        </div>
      )}

      {/* Empty state */}
      {reminders.length === 0 && (
        <div className="p-8 text-center">
          <Bell size={32} className="text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No reminders logged yet</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            "Send reminders now" queues overdue and due-within-7-days notices. Reminders appear here once dispatched.
          </p>
        </div>
      )}

      {/* Reminders list */}
      {reminders.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Reminder log</div>
            <div className="flex gap-1">
              <button
                onClick={() => setRemKind('all')}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${remKind === 'all' ? 'bg-white shadow text-slate-900 border border-slate-200' : 'text-slate-500'}`}
              >All</button>
              <button
                onClick={() => setRemKind('overdue')}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${remKind === 'overdue' ? 'bg-white shadow text-slate-900 border border-slate-200' : 'text-slate-500'}`}
              >Overdue</button>
              <button
                onClick={() => setRemKind('due-soon')}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${remKind === 'due-soon' ? 'bg-white shadow text-slate-900 border border-slate-200' : 'text-slate-500'}`}
              >Due ≤7d</button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="px-3 py-2.5">Reminder</th>
                  <th className="px-3 py-2.5">Invoice</th>
                  <th className="px-3 py-2.5">Company</th>
                  <th className="px-3 py-2 text-right">Balance</th>
                  <th className="px-3 py-2">Age</th>
                  <th className="px-3 py-2">Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reminders
                  .filter((r) => {
                    if (remKind === 'all') return true;
                    if (remKind === 'overdue') return r.kind === 'overdue';
                    return r.kind === 'due-soon';
                  })
                  .map((r) => (
                    <tr key={String(r.id || r.invoiceId || '')} className="hover:bg-slate-50/70">
                      <td className="px-3 py-2.5 font-mono font-bold">{String(r.id || '').slice(0, 12)}…</td>
                      <td className="px-3 py-2.5 font-mono font-bold text-slate-700">{r.number || r.invoiceId || '—'}</td>
                      <td className="px-3 py-2.5 font-slate-700 truncate max-w-[140px]">{r.companyName || r.orgId || '—'}</td>
                      <td className="px-3 py-2 text-right font-slate-900">{inr(r.balance || r.amount || 0)}</td>
                      <td className="px-3 py-2.5 text-slate-500 font-medium">{r.kind === 'overdue' ? `${r.daysOverdue || 0}d overdue` : `due in ${r.daysToDue || 0}d`}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${r.settled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {r.settled ? 'Logged' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Quick open invoice */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Open an invoice</div>
          <input
            type="text"
            placeholder="Invoice ID or company…"
            className="w-64 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-[#0B5FD9]"
          />
          <button
            type="button"
            onClick={() => navigate('/superadmin/invoices')}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Browse all invoices <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function unwrapList(res: any): any[] {
  if (!res) return [];
  const d = res?.data ?? res;
  return Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []);
}
function unwrapObj(res: any): any {
  if (!res) return {};
  return res?.data ?? res;
}
function errMsg(err: unknown): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (err as Error)?.message || 'Request failed. Try again.';
}

// Mail icon (inline, since lucide Mail not imported as separate)
const MailIcon = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" className="w-5 h-5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
