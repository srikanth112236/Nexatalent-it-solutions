import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const ACCESS_TTL = process.env.JWT_ACCESS_TTL || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Backward compat: legacy sha256 hashes start with 'sha256:' — force reset
  if (hash.startsWith('sha256:')) return false;
  // Legacy raw hex (64 chars, no prefix) from old demo store
  if (/^[a-f0-9]{64}$/i.test(hash)) return false;
  return bcrypt.compare(password, hash);
}

export interface AccessClaims { sub: string; email: string; role: string; tenantId: string; type: 'access' }
export interface RefreshClaims { sub: string; email: string; type: 'refresh'; jti: string }

export function signAccess(user: { id: string; email: string; role: string; tenantId: string }): string {
  return (jwt as any).sign(
    { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId, type: 'access' },
    config.jwt.secret,
    { expiresIn: ACCESS_TTL },
  );
}

export function signRefresh(user: { id: string; email: string }, jti: string): string {
  return (jwt as any).sign(
    { sub: user.id, email: user.email, type: 'refresh', jti },
    process.env.REFRESH_TOKEN_SECRET || config.jwt.secret + ':refresh',
    { expiresIn: REFRESH_TTL },
  );
}

export function verifyAccess(token: string): AccessClaims {
  return jwt.verify(token, config.jwt.secret) as unknown as AccessClaims;
}

export function verifyRefresh(token: string): RefreshClaims {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || config.jwt.secret + ':refresh') as unknown as RefreshClaims;
}
