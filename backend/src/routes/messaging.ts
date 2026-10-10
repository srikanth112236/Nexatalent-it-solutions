import { Router, Request, Response } from 'express';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, ctxOf } from '../middleware/rbac.js';
import { messageSchema } from '../validate/schemas.js';

/** Interview-only chat (§13). Eligibility enforced on every call. */
export const messagingRouter = Router();

messagingRouter.get('/conversations', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); const appId = String(req.query.applicationId || '');
  let rows = loadDb().conversations as any[];
  if (appId) rows = rows.filter((c) => c.applicationId === appId);
  if (ctx.role === 'candidate') rows = rows.filter((c) => String(c.candidateId).toLowerCase() === ctx.email.toLowerCase() || String(c.candidateEmail || '').toLowerCase() === ctx.email.toLowerCase());
  else if (!['superadmin','platform_owner','employee','operations_admin'].includes(ctx.role)) rows = rows.filter((c) => c.companyId === ctx.tenantId);
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
  // Must have a Scheduled (or later) interview — otherwise chat stays locked
  const iv = db.interviews.find((i: any) => i.applicationId === conv.applicationId && ['Scheduled','Rescheduled','Completed'].includes(i.status));
  if (!iv && !['superadmin','platform_owner'].includes(ctx.role)) return res.status(403).json({ success: false, message: 'Chat unlocks after an interview is scheduled for this application.', code: 'CHAT_LOCKED' });
  const msgs = db.messages.filter((m: any) => m.conversationId === conv.id).sort((a: any, b: any) => String(a.createdAt).localeCompare(String(b.createdAt)));
  res.json({ success: true, data: { conversation: conv, messages: msgs } });
});

messagingRouter.post('/messages', requireAuth(['candidate','employer','superadmin','company_admin','hiring_manager','company_recruiter']), (req: Request, res: Response) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.' });
  const db = loadDb(); const ctx = ctxOf(req);
  const conv: any = db.conversations.find((c: any) => c.id === parsed.data.conversationId);
  if (!conv || conv.status !== 'active') return res.status(404).json({ success: false, message: 'Conversation not found.' });
  // Participant check (404 masks existence from non-participants)
  const app2: any = db.applications.find((a: any) => a.id === conv.applicationId);
  if (ctx.role === 'candidate' && String(conv.candidateId).toLowerCase() !== ctx.email.toLowerCase() && (!app2 || String(app2.candidateEmail).toLowerCase() !== ctx.email.toLowerCase())) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (['employer','company_admin','hiring_manager','company_recruiter'].includes(ctx.role) && conv.companyId !== ctx.tenantId && (!app2 || app2.orgId !== ctx.tenantId)) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  const iv = db.interviews.find((i: any) => i.applicationId === conv.applicationId && ['Scheduled','Rescheduled','Completed'].includes(i.status));
  if (!iv && !['superadmin'].includes(ctx.role)) return res.status(403).json({ success: false, message: 'Chat locked until interview scheduled.', code: 'CHAT_LOCKED' });
  // rate-limit: max 30 msgs / 5 min per conversation per sender
  const window = Date.now() - 5 * 60 * 1000;
  const recent = db.messages.filter((m: any) => m.conversationId === conv.id && m.sender === ctx.email && new Date(m.createdAt).getTime() > window).length;
  if (recent >= 30) return res.status(429).json({ success: false, message: 'Rate limited. Slow down.' });
  const msg = { id: uid('MSG'), sender: ctx.email, senderRole: ctx.role, ...parsed.data, createdAt: nowIso() };
  db.messages.unshift(msg); conv.lastMessageAt = nowIso();
  db.notifications.unshift({ id: uid('NOTIF'), recipient: ctx.role === 'candidate' ? `company:${conv.companyId}` : conv.candidateId, kind: 'chat', body: `New message in ${conv.id}`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: conv.companyId });
  audit(ctx.email, `CHAT_MESSAGE:${conv.id}`, conv.companyId, 'message', msg.id, req.ip); persist();
  res.status(201).json({ success: true, data: msg });
});

// Close conversation (withdrawal / closure / suspension) — history preserved (§13)
messagingRouter.patch('/conversations/:id/close', requireAuth(), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const conv: any = db.conversations.find((c: any) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (ctx.role === 'candidate' && String(conv.candidateId).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  if (['employer','company_admin','hiring_manager','company_recruiter'].includes(ctx.role) && conv.companyId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Conversation not found.' });
  conv.status = 'closed'; conv.closedReason = String(req.body?.reason || 'closed'); conv.lastMessageAt = nowIso();
  audit(ctx.email, `CHAT_CLOSED:${conv.id}`, conv.companyId, 'conversation', conv.id, req.ip); persist();
  res.json({ success: true, data: conv });
});
