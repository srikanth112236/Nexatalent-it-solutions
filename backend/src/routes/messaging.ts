import { Router, Request, Response } from 'express';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, ctxOf, tenantOf, isAllTenant } from '../middleware/rbac.js';
import { messageSchema } from '../validate/schemas.js';

/** Interview-only chat (§13). Eligibility enforced on every call. */
export const messagingRouter = Router();

// P1-6: chat is plain-text — strip HTML so stored XSS can't execute in feeds.
function plainText(s: string, max = 4000): string {
  return String(s || '').replace(/<[^>]*>/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').slice(0, max).trim();
}

/** Phase 1.2: agency participant = linked submission (jobId + candidateEmail) for same agency tenant or submitter. */
function agencyLinkedToApp(db: any, ctx: { email: string; tenantId: string }, app: any): boolean {
  if (!app) return false;
  const subs = ((db as any).submissions as any[]) || [];
  const jobId = String(app.jobId || '');
  const cand = String(app.candidateEmail || '').toLowerCase();
  return subs.some((s: any) => {
    const samePair = String(s.jobId || '') === jobId && String(s.candidateEmail || '').toLowerCase() === cand;
    if (!samePair) return false;
    if (s.agencyId && (String(s.agencyId) === String((ctx as any).tenantId))) return true;
    if (String(s.submittedBy || '').toLowerCase() === String(ctx.email).toLowerCase()) return true;
    return false;
  });
}

const AGENCY_ROLES = ['agency_admin', 'agency_recruiter', 'recruiter', 'vendor'];

messagingRouter.get('/conversations', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); const appId = String(req.query.applicationId || '');
  const db = loadDb();
  let rows = db.conversations as any[];
  if (appId) rows = rows.filter((c) => c.applicationId === appId);
  if (ctx.role === 'candidate') rows = rows.filter((c) => String(c.candidateId).toLowerCase() === ctx.email.toLowerCase() || String(c.candidateEmail || '').toLowerCase() === ctx.email.toLowerCase());
  else if (AGENCY_ROLES.includes(ctx.role)) {
    rows = rows.filter((c) => {
      const app: any = db.applications.find((a: any) => a.id === c.applicationId);
      return agencyLinkedToApp(db, ctx, app);
    });
  }
  else if (!isAllTenant(ctx.role)) rows = rows.filter((c) => c.companyId === tenantOf(req));
  res.json({ success: true, data: rows });
});

messagingRouter.get('/conversations/:id/messages', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const conv: any = db.conversations.find((c: any) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  // Authorize by application ownership
  const app: any = db.applications.find((a: any) => a.id === conv.applicationId);
  if (ctx.role === 'candidate' && String(conv.candidateId).toLowerCase() !== ctx.email.toLowerCase() && (!app || String(app.candidateEmail).toLowerCase() !== ctx.email.toLowerCase())) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (['employer','company_admin','hiring_manager','company_recruiter'].includes(ctx.role) && conv.companyId !== ctx.tenantId && (!app || app.orgId !== ctx.tenantId)) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (AGENCY_ROLES.includes(ctx.role) && !agencyLinkedToApp(db, ctx, app)) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  // Must have a Scheduled (or later) interview — otherwise chat stays locked
  const iv = db.interviews.find((i: any) => i.applicationId === conv.applicationId && ['Scheduled','Rescheduled','Completed'].includes(i.status));
  if (!iv && !['superadmin','platform_owner'].includes(ctx.role)) return res.status(403).json({ success: false, message: 'Chat unlocks after an interview is scheduled for this application.', code: 'CHAT_LOCKED' });
  const msgs = db.messages.filter((m: any) => m.conversationId === conv.id).sort((a: any, b: any) => String(a.createdAt).localeCompare(String(b.createdAt)));
  // Delivery receipt: messages from others become 'delivered' once the thread is opened.
  let touched = false;
  for (const m of msgs) {
    if (m.sender !== ctx.email && m.deliveryStatus !== 'delivered' && m.deliveryStatus !== 'read') {
      m.deliveryStatus = 'delivered'; touched = true;
    }
  }
  if (touched) persist();
  res.json({ success: true, data: { conversation: conv, messages: msgs } });
});

messagingRouter.post('/messages', requireAuth(['candidate','employer','superadmin','company_admin','hiring_manager','company_recruiter','agency_admin','agency_recruiter','recruiter','vendor','internal_recruiter','operations_admin','employee']), (req: Request, res: Response) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.' });
  const db = loadDb(); const ctx = ctxOf(req);
  const conv: any = db.conversations.find((c: any) => c.id === parsed.data.conversationId);
  if (!conv || conv.status !== 'active') return res.status(404).json({ success: false, message: 'Conversation not found.' });
  // Participant check (404 masks existence from non-participants)
  const app2: any = db.applications.find((a: any) => a.id === conv.applicationId);
  if (ctx.role === 'candidate' && String(conv.candidateId).toLowerCase() !== ctx.email.toLowerCase() && (!app2 || String(app2.candidateEmail).toLowerCase() !== ctx.email.toLowerCase())) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (['employer','company_admin','hiring_manager','company_recruiter'].includes(ctx.role) && conv.companyId !== ctx.tenantId && (!app2 || app2.orgId !== ctx.tenantId)) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (AGENCY_ROLES.includes(ctx.role) && !agencyLinkedToApp(db, ctx, app2)) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (['internal_recruiter','operations_admin','employee'].includes(ctx.role) && !['superadmin','platform_owner'].includes(ctx.role)) {
    // Internal staff participate only on assigned mandates — enforced via requisition/job assignment presence.
    const assigned = (db.requisitions as any[]).some((r: any) => r.assignee === ctx.email || (r.supporting || []).includes(ctx.email));
    if (!assigned) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  }
  const iv = db.interviews.find((i: any) => i.applicationId === conv.applicationId && ['Scheduled','Rescheduled','Completed'].includes(i.status));
  if (!iv && !['superadmin'].includes(ctx.role)) return res.status(403).json({ success: false, message: 'Chat locked until interview scheduled.', code: 'CHAT_LOCKED' });
  // rate-limit: max 30 msgs / 5 min per conversation per sender
  const window = Date.now() - 5 * 60 * 1000;
  const recent = db.messages.filter((m: any) => m.conversationId === conv.id && m.sender === ctx.email && new Date(m.createdAt).getTime() > window).length;
  if (recent >= 30) return res.status(429).json({ success: false, message: 'Rate limited. Slow down.' });
  // Attachment messages must reference an existing document the sender can access.
  if (parsed.data.attachment) {
    const d: any = db.documents.find((x: any) => x.id === parsed.data.attachment!.docId);
    if (!d) return res.status(400).json({ success: false, message: 'Attachment not found. Upload first.' });
    const canSee = ctx.role === 'superadmin' || String(d.ownerEmail || '').toLowerCase() === ctx.email.toLowerCase() || d.orgId === ctx.tenantId;
    if (!canSee) return res.status(400).json({ success: false, message: 'Attachment not found. Upload first.' });
  }
  if (parsed.data.type === 'attachment' && !parsed.data.attachment) {
    return res.status(400).json({ success: false, message: 'Attachment reference required for attachment messages.' });
  }
  const cleanBody = plainText(parsed.data.body, 4000);
  if (!cleanBody) return res.status(400).json({ success: false, message: 'body (1–4000 chars) required.' });
  const msg = { id: uid('MSG'), sender: ctx.email, senderRole: ctx.role, ...parsed.data, body: cleanBody, deliveryStatus: 'sent', editedAt: null, createdAt: nowIso() };
  db.messages.unshift(msg); conv.lastMessageAt = nowIso();
  db.notifications.unshift({ id: uid('NOTIF'), recipient: ctx.role === 'candidate' ? `company:${conv.companyId}` : conv.candidateId, kind: 'chat', body: `New message in ${conv.id}`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: conv.companyId });
  audit(ctx.email, `CHAT_MESSAGE:${conv.id}`, conv.companyId, 'message', msg.id, req.ip); persist();
  res.status(201).json({ success: true, data: msg });
});

// Edit own message (history preserved — editedAt stamped, no deletes per §13)
messagingRouter.patch('/messages/:id', requireAuth(['candidate','employer','superadmin','company_admin','hiring_manager','company_recruiter','agency_admin','agency_recruiter','recruiter','vendor']), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const m: any = db.messages.find((x: any) => x.id === req.params.id);
  if (!m) return res.status(404).json({ success: false, message: 'Message not found.' });
  if (m.sender !== ctx.email && !['superadmin','platform_owner'].includes(ctx.role)) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }
  const body = plainText(String(req.body?.body || ''));
  if (!body || body.length > 4000) return res.status(400).json({ success: false, message: 'body (1–4000 chars) required.' });
  m.body = body; m.editedAt = nowIso();
  audit(ctx.email, `CHAT_EDITED:${m.id}`, ctx.tenantId, 'message', m.id, req.ip); persist();
  res.json({ success: true, data: m });
});

// Close conversation (withdrawal / closure / suspension) — history preserved (§13)
messagingRouter.patch('/conversations/:id/close', requireAuth(), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const conv: any = db.conversations.find((c: any) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (ctx.role === 'candidate' && String(conv.candidateId).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (['employer','company_admin','hiring_manager','company_recruiter'].includes(ctx.role) && conv.companyId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (AGENCY_ROLES.includes(ctx.role)) {
    const appC: any = db.applications.find((a: any) => a.id === conv.applicationId);
    if (!agencyLinkedToApp(db, ctx, appC)) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  }
  conv.status = 'closed'; conv.closedReason = String(req.body?.reason || 'closed'); conv.lastMessageAt = nowIso();
  audit(ctx.email, `CHAT_CLOSED:${conv.id}`, conv.companyId, 'conversation', conv.id, req.ip); persist();
  res.json({ success: true, data: conv });
});
