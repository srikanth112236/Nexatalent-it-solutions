import nodemailer from 'nodemailer';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';

/**
 * Email delivery (§11.4). SMTP via env (SMTP_HOST/PORT/USER/PASS/FROM).
 * Not configured → messages are queued in mailOutbox (visible in-app) instead
 * of failing. Every attempt is logged either way — nothing vanishes silently.
 */
function transporter(): any | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' } : undefined,
  });
}

export async function sendMail(to: string, subject: string, html: string, meta: { kind?: string; orgId?: string; refId?: string } = {}): Promise<any> {
  const db = loadDb();
  const row: any = {
    id: uid('MAIL'), to, subject, html, kind: meta.kind || 'general',
    orgId: meta.orgId || 'TNT-GLOBAL', refId: meta.refId || null,
    status: 'queued', createdAt: nowIso(),
  };
  const t = transporter();
  if (!t) {
    db.mailOutbox.unshift(row); trimMail(db);
    audit('system', `MAIL_QUEUED:${row.id} (no SMTP configured)`, row.orgId, 'mail', row.id, '127.0.0.1'); persist();
    return row;
  }
  try {
    const info = await t.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html });
    row.status = 'sent'; row.providerId = info?.messageId || null; row.sentAt = nowIso();
  } catch (e: any) {
    row.status = 'failed'; row.error = String(e?.message || e);
  }
  db.mailOutbox.unshift(row); trimMail(db);
  audit('system', `MAIL_${row.status.toUpperCase()}:${row.id}:${to}`, row.orgId, 'mail', row.id, '127.0.0.1'); persist();
  return row;
}

function trimMail(db: any): void {
  if ((db.mailOutbox as any[]).length > 500) (db.mailOutbox as any[]).length = 500;
}

export function mailConfigured(): boolean {
  return !!process.env.SMTP_HOST;
}
