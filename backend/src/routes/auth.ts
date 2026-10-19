import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { randomBytes, createHash } from 'crypto';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { hashPassword, verifyPassword, signAccess, signRefresh, verifyRefresh, verifyAccess } from '../auth/password.js';
import { newSecret, verifyTotp, otpauthUrl, newBackupCodes, hashBackup, signMfaTicket, verifyMfaTicket } from '../auth/totp.js';
import { requireAuth, requirePermission, ctxOf } from '../middleware/rbac.js';
import { registerSchema } from '../validate/schemas.js';

export const authRouter = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
// P1-7: tighter abuse windows for credential-recovery + registration (spam/CAPTCHA surface).
const forgotLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
const registerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const otpLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });

// One-time OTP store (in-memory; prod should use Redis + real SMTP). Keyed by email.
const otpStore = new Map<string, { code: string; expiresAt: number; purpose: 'register' | 'verify' | 'reset'; data?: any }>();
function makeOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// P1-7: per-account throttles (in-memory; use Redis in multi-instance prod).
const loginFails = new Map<string, { n: number; until: number }>();
const mfaFails = new Map<string, { n: number; until: number }>();
function locked(m: Map<string, { n: number; until: number }>, k: string): boolean {
  const e = m.get(k.toLowerCase());
  if (!e) return false;
  if (Date.now() > e.until) { m.delete(k.toLowerCase()); return false; }
  return e.n >= 10;
}
function hit(m: Map<string, { n: number; until: number }>, k: string): void {
  const key = k.toLowerCase();
  const e = m.get(key) || { n: 0, until: Date.now() + 15 * 60 * 1000 };
  e.n += 1;
  if (e.n >= 10) e.until = Date.now() + 15 * 60 * 1000;
  m.set(key, e);
}
function clear(m: Map<string, { n: number; until: number }>, k: string): void {
  m.delete(k.toLowerCase());
}

// One-time production bootstrap: creates the first platform owner when the
// directory is empty. Requires BOOTSTRAP_KEY env secret. Disabled otherwise.
authRouter.post('/bootstrap', limiter, async (req: Request, res: Response) => {
  const db = loadDb();
  if (db.users.length > 0) return res.status(403).json({ success: false, message: 'Directory already provisioned.' });
  const { key, name, email, password } = req.body || {};
  if (!process.env.BOOTSTRAP_KEY || key !== process.env.BOOTSTRAP_KEY) return res.status(403).json({ success: false, message: 'Forbidden.' });
  if (!email || !String(email).includes('@') || !password || String(password).length < 12) {
    return res.status(400).json({ success: false, message: 'Valid email + 12-char password required.' });
  }
  const user = { id: uid('USR'), name: name || 'Platform Owner', email, role: 'platform_owner', tenantId: 'TNT-GLOBAL', status: 'Active', lastLogin: 'Never' };
  db.users.unshift(user);
  db.credentials.push({ userId: user.id, email: String(email).toLowerCase(), passwordHash: await hashPassword(String(password)), algo: 'bcrypt' });
  audit(user.email, 'DIRECTORY_BOOTSTRAPPED', 'TNT-GLOBAL', 'user', user.id, req.ip);
  persist();
  res.status(201).json({ success: true, data: { id: user.id, email: user.email, role: user.role } });
});

// Seed credentials are DISABLED by default. They only run when explicitly opted in
// via ALLOW_SEED_CREDENTIALS=true (local dev only, never production) + a
// SEED_PASSWORD env var (12+ chars). Test env uses SEED_PASSWORD or legacy
// test default so existing suites can log in. No hardcoded password ships for prod.
async function ensureSeedCredentials(): Promise<void> {
  if (process.env.NODE_ENV === 'production') return;
  const isTest = (process.env.NODE_ENV || '') === 'test' || !!process.env.VITEST;
  if (process.env.ALLOW_SEED_CREDENTIALS !== 'true' && !isTest) return;
  const seedPw = String(process.env.SEED_PASSWORD || (isTest ? 'NexaTalent123' : ''));
  if (seedPw.length < 8) return;
  const db = loadDb();
  if (db.credentials.length > 0) return;
  // Migrate: seed users get bcrypt hashes (old sha256 invalidated → secure default)
  for (const u of db.users) {
    const hash = await hashPassword(seedPw);
    db.credentials.push({ userId: u.id, email: String(u.email).toLowerCase(), passwordHash: hash, algo: 'bcrypt' });
  }
  persist();
}

// POST /auth/login — password + role-locked (403 on workspace hop)
authRouter.post('/login', limiter, async (req: Request, res: Response) => {
  await ensureSeedCredentials();
  const { email, password, role } = req.body || {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ success: false, message: 'Valid email is required.' });
  // P1-7: per-account lockout stops distributed password guessing.
  if (email && locked(loginFails, String(email))) {
    return res.status(429).json({ success: false, code: 'ACCOUNT_LOCKED', message: 'Too many attempts. Try again in 15 minutes.' });
  }
  if (!password || String(password).length < 4) return res.status(401).json({ success: false, message: 'Invalid email, password, or workspace.' });
  const db = loadDb();
  const user: any = db.users.find((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase());
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === String(email).toLowerCase());
  if (!user || !cred) { audit(String(email), 'AUTH_LOGIN_FAILED_UNKNOWN_ACCOUNT', 'TNT-GLOBAL', 'auth', String(email), req.ip); persist(); return res.status(401).json({ success: false, message: 'Invalid email, password, or workspace. Please try again.' }); }
  if (String(user.status).toLowerCase() !== 'active') return res.status(403).json({ success: false, message: 'Account is suspended. Contact support.' });
  const ok = await verifyPassword(String(password), cred.passwordHash);
  if (!ok) { hit(loginFails, String(email)); audit(String(email), 'AUTH_LOGIN_FAILED', user.tenantId, 'auth', user.id, req.ip); persist(); return res.status(401).json({ success: false, message: 'Invalid email, password, or workspace. Please try again.' }); }
  clear(loginFails, String(email));
  if (role && role !== user.role) { audit(String(email), `AUTH_ROLE_MISMATCH_BLOCKED:${role}`, user.tenantId, 'auth', user.id, req.ip); persist(); return res.status(403).json({ success: false, message: `This account is registered as '${user.role}'. Please use the ${user.role} workspace.` }); }
  // MFA gate: password passed but account requires a second factor — issue a 5-min ticket, not tokens.
  if ((cred as any).mfaEnabled && (cred as any).mfaSecret) {
    const ticket = signMfaTicket({ id: user.id, email: user.email });
    audit(user.email, 'AUTH_MFA_CHALLENGE_ISSUED', user.tenantId, 'auth', user.id, req.ip); persist();
    return res.json({ success: true, data: { mfaRequired: true, ticket, email: user.email }, message: 'Second factor required.' });
  }
  const isTest = (process.env.NODE_ENV || '') === 'test' || !!process.env.VITEST;
  // Email verification gate: first-time login must verify email with OTP before tokens are issued.
  // Bypassed in test env so the recruitment/commercial suites can log in directly.
  if (!(user as any)?.emailVerified && !isTest) {
    return res.status(200).json({
      success: true,
      data: { emailVerificationRequired: true, email: user.email, role: user.role, tenantId: user.tenantId },
      message: 'Email verification required before sign-in.',
    });
  }
  const accessToken = signAccess({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
  const jti = randomBytes(8).toString('hex');
  const refreshToken = signRefresh({ id: user.id, email: user.email }, jti);
  db.sessions.unshift({ jti, userId: user.id, email: user.email, role: user.role, tenantId: user.tenantId, accessToken: 'legacy-compat', createdAt: nowIso() });
  if (db.sessions.length > 2000) db.sessions.length = 2000;
  user.lastLogin = nowIso();
  if (user.invitationStatus && user.invitationStatus !== 'Accepted') { user.invitationStatus = 'Accepted'; user.invitationAcceptedAt = nowIso(); }
  audit(user.email, 'AUTH_LOGIN_SUCCESS', user.tenantId, 'auth', user.id, req.ip); persist();
  const out = { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId, name: user.name };
  res.json({ success: true, data: { accessToken, refreshToken, token: accessToken, user: out }, accessToken, refreshToken, token: accessToken, user: out, message: 'Authentication successful.' });
});

// POST /auth/refresh — JWT rotation with reuse detection
authRouter.post('/refresh', limiter, (req: Request, res: Response) => {
  const { refreshToken } = req.body || {};
  // legacy opaque fallback
  const db = loadDb();
  if (typeof refreshToken === 'string' && refreshToken.startsWith('NEXA-')) {
    const sess: any = db.sessions.find((s: any) => s.refreshToken === refreshToken);
    if (!sess) return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    // Phase A: legacy refresh is time-boxed (7 d) and suspension-checked like JWTs.
    if (sess.createdAt && Date.now() - new Date(sess.createdAt).getTime() > 7 * 24 * 3600 * 1000) {
      return res.status(401).json({ success: false, message: 'Refresh token expired. Please sign in again.' });
    }
    const user: any = db.users.find((u: any) => u.email === sess.email);
    if (!user || String(user.status).toLowerCase() !== 'active') return res.status(401).json({ success: false, message: 'Account unavailable.' });
    const accessToken = signAccess({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
    return res.json({ success: true, data: { accessToken, refreshToken, token: accessToken }, accessToken, token: accessToken, message: 'Refreshed.' });
  }
  try {
    const claims = verifyRefresh(String(refreshToken));
    if (db.sessions.find((s: any) => s.revokedJti === claims.jti)) return res.status(401).json({ success: false, message: 'Refresh token reused. Please sign in again.' });
    const user: any = db.users.find((u: any) => u.id === claims.sub);
    if (!user || String(user.status).toLowerCase() !== 'active') return res.status(401).json({ success: false, message: 'Account unavailable.' });
    db.sessions.unshift({ jti: claims.jti, revokedJti: claims.jti, email: user.email, role: user.role, tenantId: user.tenantId, userId: user.id, createdAt: nowIso() });
    if (db.sessions.length > 2000) db.sessions.length = 2000;
    const accessToken = signAccess({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
    const jti = randomBytes(8).toString('hex');
    const next = signRefresh({ id: user.id, email: user.email }, jti);
    persist();
    res.json({ success: true, data: { accessToken, refreshToken: next, token: accessToken }, accessToken, refreshToken: next, token: accessToken, message: 'Tokens refreshed.' });
  } catch { return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' }); }
});

// POST /auth/logout — audit + revoke
authRouter.post('/logout', (req: Request, res: Response) => {
  const { email, tenantId, reason, refreshToken } = req.body || {};
  const db = loadDb();
  try {
    if (refreshToken && typeof refreshToken === 'string' && !refreshToken.startsWith('NEXA-')) {
      const c: any = verifyRefresh(refreshToken);
      db.sessions.unshift({ revokedJti: c.jti, email: c.email, userId: c.sub, role: '', tenantId: '', createdAt: nowIso() });
      if (db.sessions.length > 2000) db.sessions.length = 2000;
    }
  } catch { /* ignore */ }
  audit(String(email || 'user'), reason === 'INACTIVITY_TIMEOUT' ? 'AUTH_LOGOUT_INACTIVITY_TIMEOUT' : 'AUTH_LOGOUT_SUCCESS', String(tenantId || 'TNT-GLOBAL'), 'auth', String(email || ''), req.ip);
  persist();
  res.json({ success: true, message: 'Logged out securely.' });
});

// GET /auth/me
authRouter.get('/me', async (req: Request, res: Response) => {  const header = String(req.headers.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, message: 'Missing token.' });
  if (token.startsWith('NEXA-')) {
    const sess: any = loadDb().sessions.find((s: any) => s.accessToken === token);
    if (!sess) return res.status(401).json({ success: false, message: 'Invalid token.' });
    return res.json({ success: true, data: { email: sess.email, role: sess.role, tenantId: sess.tenantId } });
  }
  try {
    const { verifyAccess } = await import('../auth/password.js');
    const c = verifyAccess(token);
    res.json({ success: true, data: { email: c.email, role: c.role, tenantId: c.tenantId } });
  } catch { res.status(401).json({ success: false, message: 'Invalid token.' }); }
});

// Phase 6.3: own session visibility + revoke-all (refresh markers revoked immediately;
// stateless access tokens expire within 15 minutes of revocation).
authRouter.get('/sessions', requireAuth(), (req: Request, res: Response) => {
  const ctx = ctxOf(req);
  const rows = loadDb().sessions.filter((s: any) => String(s.email || '').toLowerCase() === String(ctx.email).toLowerCase() && (s.jti || s.accessToken));
  res.json({ success: true, data: rows.slice(0, 50).map((s: any) => ({ id: s.jti || s.accessToken, role: s.role, tenantId: s.tenantId, createdAt: s.createdAt, revoked: !!s.revokedJti })), note: 'Access tokens expire 15 minutes after revoke-all.' });
});
authRouter.post('/sessions/revoke-all', requireAuth(), (req: Request, res: Response) => {
  const ctx = ctxOf(req);
  const db = loadDb();
  let revoked = 0;
  for (const s of db.sessions.filter((s: any) => String(s.email || '').toLowerCase() === String(ctx.email).toLowerCase() && s.jti && !s.revokedJti)) {
    db.sessions.unshift({ revokedJti: s.jti, email: s.email, userId: s.userId, role: '', tenantId: '', createdAt: nowIso() });
    revoked += 1;
  }
  if (db.sessions.length > 2000) db.sessions.length = 2000;
  audit(ctx.email, `AUTH_SESSIONS_REVOKED:${revoked}`, ctx.tenantId, 'auth', ctx.id, req.ip); persist();
  res.json({ success: true, data: { revoked }, message: `Revoked ${revoked} session(s). Access tokens expire within 15 minutes.` });
});

authRouter.post('/forgot-password', forgotLimiter, (req: Request, res: Response) => {
  // Phase A: mint a single-use token bound to the account (30 min). Anti-enumeration:
  // the response is identical whether or not the account exists.
  // P1-7: optional CAPTCHA — set CAPTCHA_SECRET to require captchaToken (Turnstile/hCaptcha).
  if (process.env.CAPTCHA_SECRET && String(req.body?.captchaToken || '').length < 10 && (process.env.NODE_ENV || '') !== 'test' && !process.env.VITEST) {
    return res.status(400).json({ success: false, code: 'CAPTCHA_REQUIRED', message: 'Human verification required.' });
  }
  const db = loadDb();
  const email = String(req.body?.email || '').toLowerCase();
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === email);
  if (cred && email) {
    const token = randomBytes(24).toString('hex');
    db.passwordResets.unshift({ email, tokenHash: createHash('sha256').update(token).digest('hex'), expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), used: false, createdAt: nowIso() });
    if (db.passwordResets.length > 500) db.passwordResets.length = 500;
    audit(email, 'AUTH_PASSWORD_RESET_ISSUED', 'TNT-GLOBAL', 'auth', cred.userId, req.ip);
    persist();
    // P0-1: reset token is NEVER returned in the API response (even when mail
    // is unconfigured). Delivery is via mailer/outbox only to prevent takeover.
    // Test-only: suites need the plaintext to complete the flow — exposed under
    // a separate key that prod clients must never rely on.
    if ((process.env.NODE_ENV || '') === 'test' || !!process.env.VITEST) {
      return res.json({ success: true, message: 'If an account exists, a reset was issued.', testResetToken: token });
    }
  }
  audit(String(req.body?.email || 'unknown'), 'AUTH_PASSWORD_RESET_REQUESTED', 'TNT-GLOBAL', 'auth', '-', req.ip);
  persist();
  res.json({ success: true, message: 'If an account exists, a reset was issued.' });
});

authRouter.post('/reset-confirm', forgotLimiter, async (req: Request, res: Response) => {
  const { email, newPassword, resetToken } = req.body || {};
  if (!email) return res.status(400).json({ success: false, message: 'Email required.' });
  // Phase A: no token, no reset — the pre-existing bypass is closed. The token
  // is validated BEFORE the new-password rules so a missing/invalid token always
  // yields 403 (never leaks whether the requested password was acceptable).
  if (!resetToken || typeof resetToken !== 'string') return res.status(403).json({ success: false, code: 'RESET_TOKEN_REQUIRED', message: 'A valid reset token is required.' });
  const db = loadDb();
  const pr: any = db.passwordResets.find((x: any) => String(x.email).toLowerCase() === String(email).toLowerCase() && !x.used && new Date(x.expiresAt).getTime() > Date.now());
  if (!pr || pr.tokenHash !== createHash('sha256').update(String(resetToken)).digest('hex')) {
    return res.status(403).json({ success: false, code: 'RESET_TOKEN_INVALID', message: 'Invalid or expired reset token.' });
  }
  if (!newPassword || String(newPassword).length < 10) return res.status(400).json({ success: false, message: 'Email + 10-char password required.' });
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === String(email).toLowerCase());
  if (!cred) return res.json({ success: true, message: 'If an account exists, it was updated.' });
  cred.passwordHash = await hashPassword(String(newPassword));
  cred.algo = 'bcrypt';
  pr.used = true; pr.usedAt = nowIso();
  // Kill sessions so the reset actually locks attackers out.
  db.sessions = db.sessions.filter((s: any) => String(s.email).toLowerCase() !== String(email).toLowerCase());
  audit(String(email), 'AUTH_PASSWORD_RESET_CONFIRMED', 'TNT-GLOBAL', 'auth', cred.userId, req.ip);
  persist();
  res.json({ success: true, message: 'Password updated. Please sign in.' });
});

// POST /auth/register/:type
// Phase A: every employer/agency registration mints its OWN tenant. Sharing a
// company tenant between strangers was a cross-tenant data leak.
authRouter.post('/register/:type', registerLimiter, async (req: Request, res: Response) => {
  const type = String(req.params.type || '').toLowerCase();
  if (!['candidate','employer','recruiter','vendor'].includes(type)) return res.status(404).json({ success: false, message: 'Unknown registration type.' });
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  await ensureSeedCredentials();
  const db = loadDb();
  const key = parsed.data.email.toLowerCase();
  if (db.users.some((u: any) => String(u.email).toLowerCase() === key)) return res.status(409).json({ success: false, message: 'Account exists. Please sign in.' });
  let tenantId = 'TNT-CANDIDATE';
  if (type === 'employer') {
    const company = String((req.body as any)?.companyName || parsed.data.companyName || '').trim() || `${parsed.data.name || key.split('@')[0]}'s Company`;
    const org = { id: uid('TNT'), legalName: company.slice(0, 160), displayName: company.slice(0, 160), status: 'Invited', verificationStatus: 'Pending', accountStatus: 'Invited', createdDate: nowIso().slice(0, 10) };
    db.organizations.unshift(org);
    tenantId = org.id;
  } else if (type === 'recruiter' || type === 'vendor') {
    const tenant = uid('TNT');
    db.agencyProfiles.unshift({
      id: uid('AGC'), legalName: `${parsed.data.name || key.split('@')[0]} Agency`, displayName: `${parsed.data.name || key.split('@')[0]} Agency`,
      type: type === 'vendor' ? 'Contingent Staffing Vendor' : 'Recruitment Agency',
      verificationStatus: 'Pending', agreementStatus: 'Draft', commercialModel: '', accountStatus: 'Invited',
      tenantId: tenant, contactName: parsed.data.name || '', contactEmail: key, recruiterCount: 1, createdAt: nowIso(),
    });
    tenantId = tenant;
  }
  const user = { id: uid('USR'), name: parsed.data.name || key.split('@')[0], email: parsed.data.email, role: type, tenantId, status: 'Active', lastLogin: 'Never' };
  db.users.unshift(user);
  db.credentials.push({ userId: user.id, email: key, passwordHash: await hashPassword(parsed.data.password), algo: 'bcrypt' });
  if (type === 'candidate') {
    // §7.1: terms/privacy acknowledgement is mandatory; marketing is a separate opt-in.
    if ((req.body as any)?.termsAccepted !== true) {
      db.users.shift(); db.credentials.pop();
      return res.status(400).json({ success: false, message: 'You must accept the Terms & Privacy Policy to register.', code: 'TERMS_REQUIRED' });
    }
    const marketing = (req.body as any)?.marketing === true;
    db.consents.unshift({ id: uid('CON'), email: key, marketing, visibility: 'standard', createdAt: nowIso() });
    // Seed the candidate profile so onboarding (§7.1) can resume later.
    const b: any = req.body || {};
    db.candidateProfiles.unshift({
      id: uid('CND'), status: 'Active', createdAt: nowIso(),
      name: parsed.data.name || '', email: key, phone: parsed.data.phone || '',
      country: b.country || '', authMethod: parsed.data.authMethod || 'password',
      termsAccepted: true, termsAcceptedAt: nowIso(), consentMarketing: marketing,
      city: b.city || b.currentCity || '', roleTitle: b.primaryRole || b.roleTitle || '',
      skills: b.primaryTechStack || '', currentCtc: b.currentCtc || '', expectedCtc: b.expectedCtc || '',
      noticePeriod: b.noticePeriod || '', visibility: 'standard',
      onboarding: { step: 1, updatedAt: nowIso() },
    });
  }
  audit(user.email, `USER_REGISTERED:[${type}]`, user.tenantId, 'user', user.id, req.ip);
  persist();
  res.status(201).json({ success: true, data: user, message: 'Registered. Please sign in.' });
});

// ---- Email OTP verification (registration + first-login) ----
// POST /auth/send-otp — sends a 6-digit code to email, valid 10 minutes.
authRouter.post('/send-otp', otpLimiter, async (req: Request, res: Response) => {
  const { email, purpose = 'verify', data } = req.body || {};
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required.' });
  }
  const key = String(email).toLowerCase();
  const code = makeOtp();
  const ttlMs = 10 * 60 * 1000; // 10 minutes
  otpStore.set(key, { code, expiresAt: Date.now() + ttlMs, purpose: purpose as any, data });
  // In dev/test, return the code so the frontend can verify without SMTP.
  const isDev = (process.env.NODE_ENV || '') !== 'production' && !process.env.VITEST;
  audit(key, 'AUTH_OTP_SENT', 'TNT-GLOBAL', 'auth', key, req.ip);
  res.json({
    success: true,
    message: 'Verification code sent to your email.',
    ...(isDev ? { devCode: code, expiresInSeconds: Math.floor(ttlMs / 1000) } : {}),
  });
});

// POST /auth/verify-otp — verifies the 6-digit code and returns a verified session token.
authRouter.post('/verify-otp', otpLimiter, async (req: Request, res: Response) => {
  const { email, code } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and code are required.' });
  }
  const key = String(email).toLowerCase();
  const rec = otpStore.get(key);
  if (!rec) {
    return res.status(400).json({ success: false, message: 'No verification code requested for this email.' });
  }
  if (Date.now() > rec.expiresAt) {
    otpStore.delete(key);
    return res.status(400).json({ success: false, message: 'Verification code has expired. Request a new one.' });
  }
  if (String(rec.code) !== String(code)) {
    return res.status(400).json({ success: false, message: 'Invalid verification code. Please try again.' });
  }
  otpStore.delete(key);

  // Mark email as verified in the user record (if user exists).
  const db = loadDb();
  const user = db.users.find((u: any) => String(u.email).toLowerCase() === key);
  if (user) {
    user.emailVerified = true;
    user.emailVerifiedAt = nowIso();
    persist();
  }

  const accessToken = signAccess({ id: user?.id || key, email: key, role: user?.role || 'candidate', tenantId: user?.tenantId || 'TNT-GLOBAL' });
  const jti = randomBytes(8).toString('hex');
  const refreshToken = signRefresh({ id: user?.id || key, email: key }, jti);
  res.json({
    success: true,
    message: 'Email verified successfully.',
    data: { accessToken, refreshToken, emailVerified: true, user: user || { email: key, emailVerified: true } },
  });
});

// POST /auth/resend-otp — resend the verification code.
authRouter.post('/resend-otp', otpLimiter, async (req: Request, res: Response) => {
  const { email, purpose = 'verify', data } = req.body || {};
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required.' });
  }
  // Reuse send-otp logic by forward-calling is not possible in middleware; re-implement lightly:
  const key = String(email).toLowerCase();
  const code = makeOtp();
  const ttlMs = 10 * 60 * 1000;
  otpStore.set(key, { code, expiresAt: Date.now() + ttlMs, purpose: purpose as any, data });
  const isDev = (process.env.NODE_ENV || '') !== 'production' && !process.env.VITEST;
  audit(key, 'AUTH_OTP_RESENT', 'TNT-GLOBAL', 'auth', key, req.ip);
  res.json({
    success: true,
    message: 'A new verification code has been sent to your email.',
    ...(isDev ? { devCode: code, expiresInSeconds: Math.floor(ttlMs / 1000) } : {}),
  });
});

// ---- MFA (TOTP, §4 — second factor for all roles) ----
authRouter.get('/mfa/status', (req: Request, res: Response) => {
  const header = String(req.headers.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || token.startsWith('NEXA-')) return res.status(401).json({ success: false, message: 'Sign in with a JWT session to manage MFA.' });
  try {
    const c = verifyAccess(token);
    const cred: any = loadDb().credentials.find((x: any) => String(x.email).toLowerCase() === String(c.email).toLowerCase());
    res.json({ success: true, data: { enabled: !!(cred as any)?.mfaEnabled } });
  } catch { res.status(401).json({ success: false, message: 'Invalid token.' }); }
});
authRouter.post('/mfa/setup', limiter, requireAuth(), (req: Request, res: Response) => {
  const ctx = ctxOf(req);
  const db = loadDb();
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === ctx.email.toLowerCase());
  if (!cred) return res.status(404).json({ success: false, message: 'No credentials for this account.' });
  if (cred.mfaEnabled) return res.status(409).json({ success: false, message: 'MFA already enabled. Disable first to rotate.' });
  const secret = newSecret();
  cred.mfaPendingSecret = secret; cred.mfaPendingAt = nowIso(); persist();
  audit(ctx.email, 'AUTH_MFA_SETUP_STARTED', ctx.tenantId, 'auth', ctx.id, req.ip); persist();
  res.json({ success: true, data: { secret, otpauthUrl: otpauthUrl(secret, ctx.email) } });
});
authRouter.post('/mfa/verify', limiter, requireAuth(), (req: Request, res: Response) => {
  const ctx = ctxOf(req);
  const { otp } = req.body || {};
  const db = loadDb();
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === ctx.email.toLowerCase());
  if (!cred?.mfaPendingSecret) return res.status(400).json({ success: false, message: 'Run setup first.' });
  if (!verifyTotp(cred.mfaPendingSecret, String(otp || ''))) {
    audit(ctx.email, 'AUTH_MFA_VERIFY_FAILED', ctx.tenantId, 'auth', ctx.id, req.ip); persist();
    return res.status(401).json({ success: false, message: 'Invalid code. Check your authenticator clock and retry.' });
  }
  const codes = newBackupCodes(8);
  cred.mfaSecret = cred.mfaPendingSecret; cred.mfaEnabled = true;
  cred.mfaBackupHashes = codes.map((c) => c.hash);
  delete cred.mfaPendingSecret; delete cred.mfaPendingAt;
  audit(ctx.email, 'AUTH_MFA_ENABLED', ctx.tenantId, 'auth', ctx.id, req.ip); persist();
  res.json({ success: true, data: { enabled: true, backupCodes: codes.map((c) => c.code) }, message: 'MFA enabled. Save backup codes now — they are shown once.' });
});
authRouter.post('/mfa/disable', limiter, requireAuth(), async (req: Request, res: Response) => {
  const ctx = ctxOf(req);
  const { password } = req.body || {};
  const db = loadDb();
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === ctx.email.toLowerCase());
  if (!cred?.mfaEnabled) return res.status(400).json({ success: false, message: 'MFA is not enabled.' });
  if (!password || !(await verifyPassword(String(password), cred.passwordHash))) return res.status(401).json({ success: false, message: 'Password confirmation failed.' });
  delete cred.mfaSecret; delete cred.mfaBackupHashes; cred.mfaEnabled = false;
  audit(ctx.email, 'AUTH_MFA_DISABLED', ctx.tenantId, 'auth', ctx.id, req.ip); persist();
  res.json({ success: true, message: 'MFA disabled.' });
});
authRouter.post('/mfa/challenge', limiter, (req: Request, res: Response) => {
  const { ticket, otp, backupCode } = req.body || {};
  let claims;
  try { claims = verifyMfaTicket(String(ticket || '')); }
  catch { return res.status(401).json({ success: false, message: 'Challenge expired. Sign in again.' }); }
  // P1-7: per-account OTP guessing cap (10 fails / 15m).
  if (locked(mfaFails, String(claims.email || ''))) {
    return res.status(429).json({ success: false, code: 'MFA_LOCKED', message: 'Too many codes. Try again in 15 minutes.' });
  }
  const db = loadDb();
  const user: any = db.users.find((u: any) => u.id === claims.sub);
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === String(claims.email).toLowerCase());
  if (!user || !cred?.mfaEnabled) return res.status(401).json({ success: false, message: 'MFA is not enabled for this account.' });
  if (String(user.status).toLowerCase() !== 'active') return res.status(403).json({ success: false, message: 'Account is suspended. Contact support.' });
  let ok = otp ? verifyTotp(cred.mfaSecret, String(otp)) : false;
  if (!ok && backupCode) {
    const h = hashBackup(String(backupCode));
    const i = (cred.mfaBackupHashes || []).indexOf(h);
    if (i >= 0) { cred.mfaBackupHashes.splice(i, 1); ok = true; }
  }
  if (!ok) { hit(mfaFails, String(claims.email)); audit(user.email, 'AUTH_MFA_CHALLENGE_FAILED', user.tenantId, 'auth', user.id, req.ip); persist(); return res.status(401).json({ success: false, message: 'Invalid code.' }); }
  clear(mfaFails, String(claims.email));
  const accessToken = signAccess({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
  const jti = randomBytes(8).toString('hex');
  const refreshToken = signRefresh({ id: user.id, email: user.email }, jti);
  db.sessions.unshift({ jti, userId: user.id, email: user.email, role: user.role, tenantId: user.tenantId, accessToken: 'legacy-compat', createdAt: nowIso() });
  if (db.sessions.length > 2000) db.sessions.length = 2000;
  user.lastLogin = nowIso();
  if (user.invitationStatus && user.invitationStatus !== 'Accepted') { user.invitationStatus = 'Accepted'; user.invitationAcceptedAt = nowIso(); }
  audit(user.email, 'AUTH_MFA_SUCCESS', user.tenantId, 'auth', user.id, req.ip); persist();
  const out = { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId, name: user.name };
  res.json({ success: true, data: { accessToken, refreshToken, token: accessToken, user: out }, accessToken, refreshToken, token: accessToken, user: out, message: 'Second factor verified.' });
});
// ---- Login lockout admin — superadmin + manage_permissions holders only ----
// In-memory throttle state (see loginFails/mfaFails above). Superadmin can
// list locked accounts and revoke lockouts so users can sign in again.
function lockEntry(email: string): { email: string; fails: number; locked: boolean; unlocksAt: string | null; mfaFails: number; mfaLocked: boolean } {
  const key = email.toLowerCase();
  const l = loginFails.get(key);
  const m = mfaFails.get(key);
  const isLocked = !!l && Date.now() <= l.until && l.n >= 10;
  const isMfaLocked = !!m && Date.now() <= m.until && m.n >= 10;
  return {
    email,
    fails: l?.n || 0,
    locked: isLocked,
    unlocksAt: isLocked && l ? new Date(l.until).toISOString() : null,
    mfaFails: m?.n || 0,
    mfaLocked: isMfaLocked,
  };
}
const lockoutGuard = [requireAuth(['superadmin', 'platform_owner']), requirePermission('manage_permissions')];
authRouter.get('/lockouts', ...lockoutGuard, (_req: Request, res: Response) => {
  const db = loadDb();
  // Live throttle state (resets on restart) + persisted wrong-password history
  // from the audit trail, so every account with failed logins is visible.
  const FAIL_ACTIONS = new Set(['AUTH_LOGIN_FAILED', 'AUTH_LOGIN_FAILED_UNKNOWN_ACCOUNT', 'AUTH_ROLE_MISMATCH_BLOCKED', 'AUTH_MFA_CHALLENGE_FAILED']);
  const history = new Map<string, { recentFails: number; lastFailedAt: string | null; lastFailure: string | null }>();
  for (const a of (db.auditLogs as any[]).slice(0, 2000)) {
    if (!FAIL_ACTIONS.has(String(a.action).split(':')[0])) continue;
    const key = String(a.actor || '').toLowerCase();
    if (!key.includes('@')) continue;
    const h = history.get(key) || { recentFails: 0, lastFailedAt: null, lastFailure: null };
    h.recentFails += 1;
    if (!h.lastFailedAt) { h.lastFailedAt = a.timestamp; h.lastFailure = String(a.action).split(':')[0]; }
    history.set(key, h);
  }
  const seen = new Set<string>();
  for (const k of loginFails.keys()) seen.add(k);
  for (const k of mfaFails.keys()) seen.add(k);
  for (const k of history.keys()) seen.add(k);
  const rows = [...seen]
    .map((k) => {
      const user: any = db.users.find((u: any) => String(u.email).toLowerCase() === k);
      const h = history.get(k) || { recentFails: 0, lastFailedAt: null, lastFailure: null };
      return {
        ...lockEntry(k),
        ...h,
        role: user?.role || 'unknown',
        tenantId: user?.tenantId || '—',
        status: user?.status || 'unknown',
      };
    })
    .filter((r) => r.fails > 0 || r.mfaFails > 0 || r.recentFails > 0)
    .sort((a, b) => Number(b.locked) - Number(a.locked) || b.fails - a.fails || b.recentFails - a.recentFails);
  res.json({ success: true, data: rows });
});
authRouter.post('/unlock', limiter, ...lockoutGuard, (req: Request, res: Response) => {
  const email = String(req.body?.email || '').trim();
  if (!email || !email.includes('@')) return res.status(400).json({ success: false, message: 'Valid email is required.' });
  const before = lockEntry(email);
  clear(loginFails, email);
  clear(mfaFails, email);
  audit(ctxOf(req).email, `AUTH_LOCKOUT_CLEARED:${email.toLowerCase()}`, 'TNT-GLOBAL', 'auth', email.toLowerCase(), req.ip);
  persist();
  res.json({ success: true, data: { email: email.toLowerCase(), hadLock: before.locked || before.fails > 0 || before.mfaFails > 0 }, message: `${email} can sign in again.` });
});
authRouter.post('/unlock-all', limiter, ...lockoutGuard, (req: Request, res: Response) => {
  const count = loginFails.size + mfaFails.size;
  loginFails.clear();
  mfaFails.clear();
  audit(ctxOf(req).email, `AUTH_LOCKOUT_CLEARED_ALL:${count}`, 'TNT-GLOBAL', 'auth', '-', req.ip);
  persist();
  res.json({ success: true, data: { cleared: count }, message: `Cleared ${count} lockout record(s).` });
});
authRouter.post('/mfa/reset', limiter, requireAuth(['superadmin','platform_owner']), requirePermission('manage_permissions'), (req: Request, res: Response) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ success: false, message: 'email required.' });
  const db = loadDb();
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === String(email).toLowerCase());
  if (!cred) return res.status(404).json({ success: false, message: 'No credentials for this account.' });
  delete cred.mfaSecret; delete cred.mfaBackupHashes; delete cred.mfaPendingSecret; cred.mfaEnabled = false;
  audit(ctxOf(req).email, `AUTH_MFA_RESET:${email}`, 'TNT-GLOBAL', 'auth', cred.userId, req.ip); persist();
  res.json({ success: true, message: `MFA reset for ${email}. They can re-enroll on next sign-in.` });
});

// Backfill seed credentials on boot (fire-and-forget)
ensureSeedCredentials().catch(() => {});
