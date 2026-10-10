import { createHmac, randomBytes, createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function newSecret(bytes = 20): string {
  const buf = randomBytes(bytes);
  let out = '';
  let bits = 0;
  let value = 0;
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += B32[(value >> bits) & 31];
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

function b32decode(s: string): Buffer {
  const clean = s.toUpperCase().replace(/=+$/, '').replace(/[^A-Z2-7]/g, '');
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of clean) {
    value = (value << 5) | B32.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((value >> bits) & 255);
    }
  }
  return Buffer.from(out);
}

function hotp(secret: Buffer, counter: bigint): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(counter);
  const h = createHmac('sha1', secret).update(msg).digest();
  const offset = h[h.length - 1] & 0x0f;
  const code = ((h[offset] & 0x7f) << 24) | (h[offset + 1] << 16) | (h[offset + 2] << 8) | h[offset + 3];
  return String(code % 1000000).padStart(6, '0');
}

/** Verifies a 6-digit TOTP (30s step, ±1 window for clock skew). Constant-shape, no secret leakage. */
export function verifyTotp(secret: string, otp: string, atMs = Date.now()): boolean {
  if (!/^\d{6}$/.test(otp)) return false;
  const key = b32decode(secret);
  if (key.length === 0) return false;
  const step = Math.floor(atMs / 30000);
  for (const c of [step - 1, step, step + 1]) {
    if (hotp(key, BigInt(c)) === otp) return true;
  }
  return false;
}

export function otpauthUrl(secret: string, email: string, issuer = 'NexaTalent'): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30`;
}

export interface BackupCode { code: string; hash: string }
export function newBackupCodes(n = 8): BackupCode[] {
  return Array.from({ length: n }, () => {
    const code = `${randomBytes(2).toString('hex').toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
    return { code, hash: createHash('sha256').update(code).digest('hex') };
  });
}
export function hashBackup(code: string): string {
  return createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
}

export interface MfaTicketClaims { sub: string; email: string; type: 'mfa' }
/** Short-lived (5 min) login-completion ticket issued after password success for MFA accounts. */
export function signMfaTicket(user: { id: string; email: string }): string {
  return (jwt as any).sign(
    { sub: user.id, email: user.email, type: 'mfa' },
    config.jwt.secret + ':mfa',
    { expiresIn: '5m' },
  );
}
export function verifyMfaTicket(token: string): MfaTicketClaims {
  const c = jwt.verify(token, config.jwt.secret + ':mfa') as unknown as MfaTicketClaims;
  if (!c || c.type !== 'mfa') throw new Error('bad ticket');
  return c;
}
