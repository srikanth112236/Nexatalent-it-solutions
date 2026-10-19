/**
 * Seed one clean demo login for every role.
 *
 * Idempotent: running it again just ensures the accounts exist with the demo password.
 * Usage:  node scripts/seed-demo-logins.mjs
 *
 * Demo password (all accounts): NexaTalent123
 * Emails: <role>@nexatalent.demo  (company roles sit in the Fintech ScaleOps tenant,
 * agency roles in Apex Tech Search / Global TechSolutions, platform roles in TNT-GLOBAL).
 */
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '..', 'data', 'nexatalent.db.json');
const PASSWORD = 'NexaTalent123';

const uid = (p) => `${p}-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
const now = () => new Date().toISOString();

// role -> tenant (so the portal shows real seed data)
const TENANT = {
  platform_owner: 'TNT-GLOBAL',
  superadmin: 'TNT-GLOBAL',
  operations_admin: 'TNT-GLOBAL',
  finance_admin: 'TNT-GLOBAL',
  finance_staff: 'TNT-GLOBAL',
  sales_admin: 'TNT-GLOBAL',
  sales_manager: 'TNT-GLOBAL',
  support_admin: 'TNT-GLOBAL',
  internal_recruiter: 'TNT-GLOBAL',
  employee: 'TNT-GLOBAL',
  bda: 'TNT-GLOBAL',
  // company roles -> Fintech ScaleOps tenant (has seed jobs + requisitions)
  company_admin: 'TNT-9011',
  hiring_manager: 'TNT-9011',
  company_recruiter: 'TNT-9011',
  employer: 'TNT-9011',
  // agency roles -> Apex Tech Search tenant (assigned to JOB-9901)
  agency_admin: 'TNT-AGENCY-01',
  agency_recruiter: 'TNT-AGENCY-01',
  recruiter: 'TNT-AGENCY-01',
  // vendor -> Global TechSolutions tenant (assigned to JOB-8890)
  vendor: 'TNT-VENDOR-05',
  candidate: 'TNT-CANDIDATE',
};

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const hash = await bcrypt.hash(PASSWORD, 10);
let created = 0;
let ensured = 0;

for (const [role, tenantId] of Object.entries(TENANT)) {
  const email = `${role}@nexatalent.demo`;
  const key = email.toLowerCase();
  let user = (db.users || []).find((u) => String(u.email).toLowerCase() === key);
  if (!user) {
    user = { id: uid('USR'), name: role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), email, role, tenantId, status: 'Active', lastLogin: 'Never', createdAt: now() };
    db.users.unshift(user);
    created += 1;
  } else {
    user.role = role;
    user.tenantId = tenantId;
    user.status = 'Active';
    ensured += 1;
  }
  const cred = (db.credentials || []).find((c) => String(c.email).toLowerCase() === key);
  if (!cred) { db.credentials.push({ userId: user.id, email: key, passwordHash: hash, algo: 'bcrypt' }); }
  else { cred.passwordHash = hash; cred.algo = 'bcrypt'; }
}

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
console.log(`Demo logins ready. created=${created} ensured=${ensured}`);
console.log(`Password: ${PASSWORD}`);
