// Mirror the JSON seed (backend/data/nexatalent.db.json) into MongoDB.
// Same data, same collections: each top-level array -> a collection of the same name.
// NOTE: the API still reads the JSON file (see .env.example) — Mongo is a mirror
// for inspection / analytics / future migration, not yet the live store.
// Usage: node scripts/seed-mongo.mjs [mongodb-uri]  (run from backend/)
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const here = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(here, '..', 'data', 'nexatalent.db.json');
const URI = process.argv[2] || process.env.MONGODB_URI || 'mongodb://localhost:27017/nexatalent';

const BATCH = 2000;
const INDEXES = {
  users: [[{ email: 1 }, { unique: true }], [{ id: 1 }, { unique: true }], [{ tenantId: 1 }], [{ role: 1 }]],
  organizations: [[{ id: 1 }, { unique: true }], [{ accountStatus: 1 }], [{ verificationStatus: 1 }]],
  applications: [[{ jobId: 1 }], [{ candidateEmail: 1 }], [{ stage: 1 }], [{ orgId: 1 }]],
  jobs: [[{ orgId: 1 }], [{ status: 1 }]],
  requisitions: [[{ orgId: 1 }], [{ status: 1 }]],
  interviews: [[{ applicationId: 1 }], [{ status: 1 }]],
  offers: [[{ applicationId: 1 }], [{ status: 1 }]],
  placements: [[{ orgId: 1 }], [{ jobId: 1 }]],
  commissions: [[{ orgId: 1 }], [{ approvalStatus: 1 }], [{ paymentStatus: 1 }]],
  invoices: [[{ orgId: 1 }], [{ status: 1 }], [{ invoiceType: 1 }]],
  payments: [[{ orgId: 1 }], [{ invoiceId: 1 }]],
  payouts: [[{ orgId: 1 }], [{ status: 1 }], [{ type: 1 }]],
  leads: [[{ stage: 1 }], [{ owner: 1 }]],
  candidateProfiles: [[{ email: 1 }, { unique: true }]],
  auditLogs: [[{ tenantId: 1 }], [{ action: 1 }], [{ timestamp: -1 }]],
  supportTickets: [[{ orgId: 1 }], [{ status: 1 }]],
  timesheets: [[{ contractorId: 1 }], [{ status: 1 }]],
  contractors: [[{ clientTenant: 1 }], [{ status: 1 }]],
  credentials: [[{ email: 1 }, { unique: true }]],
};

console.log('Reading', DB_FILE);
const db = JSON.parse(readFileSync(DB_FILE, 'utf8'));
console.log('Connecting to', URI.replace(/:[^:@/]+@/, ':***@'));
const client = new MongoClient(URI);
await client.connect();
const mongoDb = client.db();
console.log('Dropping database', mongoDb.databaseName, 'for a fresh mirror...');
await mongoDb.dropDatabase();

const summary = {};
for (const [key, value] of Object.entries(db)) {
  if (Array.isArray(value)) {
    if (value.length === 0) { summary[key] = 0; continue; }
    const col = mongoDb.collection(key);
    for (let i = 0; i < value.length; i += BATCH) {
      await col.insertMany(value.slice(i, i + BATCH), { ordered: false });
    }
    summary[key] = value.length;
    for (const [spec, opts] of INDEXES[key] || []) {
      try { await col.createIndex(spec, opts || {}); } catch (e) { console.warn(`index skipped ${key} ${JSON.stringify(spec)}:`, e.message); }
    }
  } else if (value && typeof value === 'object') {
    await mongoDb.collection(key).insertOne({ _key: 'settings', ...value });
    summary[key] = 1;
  }
}
console.log('Mirrored collections:', JSON.stringify(summary, null, 2));
// spot checks
console.log('spot:', {
  subInvoices: await mongoDb.collection('invoices').countDocuments({ invoiceType: 'subscription' }),
  placements: await mongoDb.collection('placements').countDocuments(),
  users: await mongoDb.collection('users').countDocuments(),
  superadmin: await mongoDb.collection('users').findOne({ email: 'superadmin@nexatalent.com' }).then((u) => (u ? u.email + '/' + u.role : null)),
});
await client.close();
console.log('DONE — mongo mirror ready at', URI);
