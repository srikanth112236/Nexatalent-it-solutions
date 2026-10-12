import dotenv from 'dotenv';
dotenv.config();

// Phase G: production refuses to boot on dev secrets — fail closed, never fail open.
function ttlOk(v: string | undefined, maxMinutes: number): boolean {
  if (!v) return false;
  const m = /^(\d+)(m|h|d)$/.exec(v.trim());
  if (!m) return false;
  const n = Number(m[1]);
  const mins = m[2] === 'm' ? n : m[2] === 'h' ? n * 60 : n * 1440;
  return mins > 0 && mins <= maxMinutes;
}
if ((process.env.NODE_ENV || 'development') === 'production') {
  const weak = !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32;
  const weakRefresh = !process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET.length < 32;
  const weakWebhook = !process.env.PAYMENT_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET.length < 16;
  const badAccessTtl = !ttlOk(process.env.JWT_ACCESS_TTL || '15m', 60);
  const badRefreshTtl = !ttlOk(process.env.JWT_REFRESH_TTL || '7d', 30 * 1440);
  if (weak || weakRefresh) {
    throw new Error('Refusing to boot: set 32+ char JWT_SECRET and REFRESH_TOKEN_SECRET in production.');
  }
  if (weakWebhook) {
    throw new Error('Refusing to boot: set 16+ char PAYMENT_WEBHOOK_SECRET in production.');
  }
  if (badAccessTtl || badRefreshTtl) {
    throw new Error('Refusing to boot: JWT_ACCESS_TTL must be <=60m and JWT_REFRESH_TTL <=30d (e.g. 15m / 7d).');
  }
  if (!process.env.BOOTSTRAP_KEY || process.env.BOOTSTRAP_KEY.length < 16) {
    // Bootstrap is optional, but if the directory is empty it must not be guessable.
    // Operators should set a 16+ char key or disable /bootstrap via firewall.
    console.warn('[config] BOOTSTRAP_KEY missing/weak — /bootstrap will reject all requests.');
  }
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  corsOrigins: [...new Set(
    (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:4200,http://localhost:5173')
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean),
  )],
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nexatalent',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};
