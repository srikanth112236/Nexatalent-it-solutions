import request from 'supertest';
import { createApp } from './src/app/index.js';
const app = createApp();
const login = async (e, p) => request(app).post('/api/v1/auth/login').send({ email: e, password: p });
const s = await login('superadmin@nexatalent.com', 'NexaTalent123');
const t = s.body.data.accessToken;
const auth = (tok) => ({ Authorization: `Bearer ${tok}` });

const r = await request(app).post('/api/v1/requisitions').set(auth(t)).send({ title: 'Cross-tenant req', orgId: 'TNT-9011', openings: 2 });
console.log('req create:', r.status, r.body.data?.id, r.body.data?.orgId);

const a = await login('aditi@fintechscaleops.io', 'NexaTalent123');
const aditi = a.body.data.accessToken;
const list = await request(app).get('/api/v1/requisitions').set(auth(aditi));
console.log('aditi reqs:', list.status, 'found cross-tenant?', (list.body.data?.data || list.body.data || []).some((x) => x.id === r.body.data?.id));

const j = await request(app).post('/api/v1/jobs').set(auth(t)).send({ title: 'Cross-tenant job', orgId: 'TNT-9011', expiryDate: '2027-06-01' });
console.log('job create:', j.status, j.body.data?.id, j.body.data?.orgId);

const jlist = await request(app).get('/api/v1/jobs').set(auth(aditi));
console.log('aditi jobs:', jlist.status, 'found cross-tenant?', (jlist.body.data?.data || jlist.body.data || []).some((x) => x.id === j.body.data?.id));

const notifs = await request(app).get('/api/v1/notifications').set(auth(aditi));
console.log('aditi notifs count:', (notifs.body.data?.data || notifs.body.data || []).length, 'has cross-tenant notif?', (notifs.body.data?.data || notifs.body.data || []).some((n) => String(n.body).includes('Cross-tenant')));
