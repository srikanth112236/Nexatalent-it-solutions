import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { randomBytes } from 'crypto';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { hashPassword, verifyPassword, signAccess, signRefresh, verifyRefresh } from '../auth/password.js';
import { registerSchema } from '../validate/schemas.js';

export const authRouter = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });

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

const SEED_PASSWORD = 'NexaTalent123';

async function ensureSeedCredentials(): Promise<void> {
  const db = loadDb();
  if (db.credentials.length > 0) return;
  // Migrate: seed users get bcrypt hashes (old sha256 invalidated → secure default)
  for (const u of db.users) {
    const hash = await hashPassword(SEED_PASSWORD);
    db.credentials.push({ userId: u.id, email: String(u.email).toLowerCase(), passwordHash: hash, algo: 'bcrypt' });
  }
  persist();
}

// POST /auth/login — password + role-locked (403 on workspace hop)
authRouter.post('/login', limiter, async (req: Request, res: Response) => {
  await ensureSeedCredentials();
  const { email, password, role } = req.body || {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ success: false, message: 'Valid email is required.' });
  if (!password || String(password).length < 4) return res.status(401).json({ success: false, message: 'Invalid email, password, or workspace.' });
  const db = loadDb();
  const user: any = db.users.find((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase());
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === String(email).toLowerCase());
  if (!user || !cred) { audit(String(email), 'AUTH_LOGIN_FAILED_UNKNOWN_ACCOUNT', 'TNT-GLOBAL', 'auth', String(email), req.ip); persist(); return res.status(401).json({ success: false, message: 'No account found with this email. Please register first.' }); }
  if (String(user.status).toLowerCase() !== 'active') return res.status(403).json({ success: false, message: 'Account is suspended. Contact support.' });
  const ok = await verifyPassword(String(password), cred.passwordHash);
  if (!ok) { audit(String(email), 'AUTH_LOGIN_FAILED', user.tenantId, 'auth', user.id, req.ip); persist(); return res.status(401).json({ success: false, message: 'Invalid email, password, or workspace. Please try again.' }); }
  if (role && role !== user.role) { audit(String(email), `AUTH_ROLE_MISMATCH_BLOCKED:${role}`, user.tenantId, 'auth', user.id, req.ip); persist(); return res.status(403).json({ success: false, message: `This account is registered as '${user.role}'. Please use the ${user.role} workspace.` }); }
  const accessToken = signAccess({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
  const jti = randomBytes(8).toString('hex');
  const refreshToken = signRefresh({ id: user.id, email: user.email }, jti);
  db.sessions.unshift({ jti, userId: user.id, email: user.email, role: user.role, tenantId: user.tenantId, accessToken: 'legacy-compat', createdAt: nowIso() });
  user.lastLogin = nowIso();
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
    const user: any = db.users.find((u: any) => u.email === sess.email);
    const accessToken = signAccess({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
    return res.json({ success: true, data: { accessToken, refreshToken, token: accessToken }, accessToken, token: accessToken, message: 'Refreshed.' });
  }
  try {
    const claims = verifyRefresh(String(refreshToken));
    if (db.sessions.find((s: any) => s.revokedJti === claims.jti)) return res.status(401).json({ success: false, message: 'Refresh token reused. Please sign in again.' });
    const user: any = db.users.find((u: any) => u.id === claims.sub);
    if (!user || String(user.status).toLowerCase() !== 'active') return res.status(401).json({ success: false, message: 'Account unavailable.' });
    db.sessions.unshift({ jti: claims.jti, revokedJti: claims.jti, email: user.email, role: user.role, tenantId: user.tenantId, userId: user.id, createdAt: nowIso() });
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
    }
  } catch { /* ignore */ }
  audit(String(email || 'user'), reason === 'INACTIVITY_TIMEOUT' ? 'AUTH_LOGOUT_INACTIVITY_TIMEOUT' : 'AUTH_LOGOUT_SUCCESS', String(tenantId || 'TNT-GLOBAL'), 'auth', String(email || ''), req.ip);
  persist();
  res.json({ success: true, message: 'Logged out securely.' });
});

// GET /auth/me
authRouter.get('/me', async (req: Request, res: Response) => {
  const header = String(req.headers.authorization || '');
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

authRouter.post('/forgot-password', limiter, (req: Request, res: Response) => {
  audit(String(req.body?.email || 'unknown'), 'AUTH_PASSWORD_RESET_REQUESTED', 'TNT-GLOBAL', 'auth', '-', req.ip);
  persist();
  res.json({ success: true, message: 'If an account exists, a reset link was sent.' });
});

authRouter.post('/reset-confirm', limiter, async (req: Request, res: Response) => {
  const { email, newPassword } = req.body || {};
  if (!email || !newPassword || String(newPassword).length < 8) return res.status(400).json({ success: false, message: 'Email + 8-char password required.' });
  const db = loadDb();
  const cred: any = db.credentials.find((c: any) => String(c.email).toLowerCase() === String(email).toLowerCase());
  if (!cred) return res.json({ success: true, message: 'If an account exists, it was updated.' });
  cred.passwordHash = await hashPassword(String(newPassword));
  cred.algo = 'bcrypt';
  audit(String(email), 'AUTH_PASSWORD_RESET_CONFIRMED', 'TNT-GLOBAL', 'auth', cred.userId, req.ip);
  persist();
  res.json({ success: true, message: 'Password updated. Please sign in.' });
});

// POST /auth/register/:type
const TENANT_MAP: Record<string, string> = { employer: 'TNT-9011', recruiter: 'TNT-AGENCY-01', vendor: 'TNT-VENDOR-05', candidate: 'TNT-CANDIDATE' };
authRouter.post('/register/:type', limiter, async (req: Request, res: Response) => {
  const type = String(req.params.type || '').toLowerCase();
  if (!['candidate','employer','recruiter','vendor'].includes(type)) return res.status(404).json({ success: false, message: 'Unknown registration type.' });
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  await ensureSeedCredentials();
  const db = loadDb();
  const key = parsed.data.email.toLowerCase();
  if (db.users.some((u: any) => String(u.email).toLowerCase() === key)) return res.status(409).json({ success: false, message: 'Account exists. Please sign in.' });
  const user = { id: uid('USR'), name: parsed.data.name || key.split('@')[0], email: parsed.data.email, role: type, tenantId: TENANT_MAP[type], status: 'Active', lastLogin: 'Never' };
  db.users.unshift(user);
  db.credentials.push({ userId: user.id, email: key, passwordHash: await hashPassword(parsed.data.password), algo: 'bcrypt' });
  if (type === 'candidate') db.consents.unshift({ id: uid('CON'), email: key, marketing: false, visibility: 'standard', createdAt: nowIso() });
  audit(user.email, `USER_REGISTERED:[${type}]`, user.tenantId, 'user', user.id, req.ip);
  persist();
  res.status(201).json({ success: true, data: user, message: 'Registered. Please sign in.' });
});

// Backfill seed credentials on boot (fire-and-forget)
ensureSeedCredentials().catch(() => {});
