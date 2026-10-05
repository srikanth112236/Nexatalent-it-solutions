import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const R = ({ children, d = 0 }: { children: ReactNode; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay: d }}>{children}</motion.div>
);
const S = ({ children, bg = 'bg-white' }: { children: ReactNode; bg?: string }) => (
  <section className={`${bg} px-6 py-20 lg:px-16`}><div className="mx-auto max-w-6xl">{children}</div></section>
);
const Cap = ({ children }: { children: ReactNode }) => <p className="text-[10px] font-bold tracking-[0.35em] text-[#1A7FE8]">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A2540]">{children}</h2>;

/* 1 */
export function M1SplitHero() {
  return (<S bg="bg-[#FDFBF6]"><div className="grid items-center gap-10 lg:grid-cols-2">
    <div><Cap>WELCOME TO NEXATALENT IT SOLUTIONS</Cap><H>The modern way to connect talent with opportunity.</H><p className="mt-4 text-xs text-neutral-500">Whether you're a recruiter, employer, or candidate — we have the tools and reach to move you forward.</p><div className="mt-8 flex gap-3"><button className="rounded-full bg-[#1A7FE8] px-7 py-3 text-xs font-bold text-white">Post a Job</button><button className="rounded-full border border-neutral-200 px-7 py-3 text-xs font-bold text-[#0A2540]">Find Jobs</button></div></div>
    <div className="grid grid-cols-2 gap-4">{['10k+ Jobs', '1.8k Recruiters', '38 Countries', '98% Match Rate'].map((t, i) => (<R key={t} d={i * 0.06}><div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-100"><p className="text-2xl font-extrabold text-[#1A7FE8]">{t.split(' ')[0]}</p><p className="mt-2 text-[10px] text-neutral-500">{t.split(' ').slice(1).join(' ')}</p></div></R>))}</div>
  </div></S>);
}

/* 2 */
export function M2KanbanRoles() {
  const cols = [['Sourced', ['Frontend Dev', 'Data Analyst', 'QA Eng']], ['Screening', ['Product Mgr', 'DevOps Lead']], ['Interviewing', ['UX Designer', 'Backend Dev']], ['Offered', ['SR Engineer']]];
  return (<S><Cap>PIPELINE</Cap><H>Live Candidate Flow</H><div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">{cols.map(([c, items], i) => (<R key={c as string} d={i * 0.06}><div className="rounded-2xl bg-neutral-50 p-5"><p className="text-[10px] font-bold tracking-widest text-neutral-400">{c}</p><div className="mt-4 space-y-2">{(items as string[]).map((t) => <div key={t} className="rounded-xl bg-white p-4 text-xs font-semibold text-[#0A2540] shadow-sm">{t}</div>)}</div></div></R>))}</div></S>);
}

/* 3 */
export function M3OrgChart() {
  return (<S bg="bg-[#F7F2E7]"><Cap>WHO WE ARE</Cap><H>Our Hiring Pod Structure</H>
    <div className="mt-12 flex flex-col items-center gap-6">
      <div className="rounded-2xl bg-[#0A2540] px-10 py-4 text-sm font-bold text-white">Head of Talent</div>
      <div className="grid w-full max-w-3xl grid-cols-3 gap-6">{['Recruiter Lead', 'Client Success', 'Market Research'].map((t, i) => (<R key={t} d={i * 0.08}><div className="rounded-2xl bg-white p-6 text-center text-xs font-bold text-[#0A2540] ring-1 ring-neutral-100">{t}</div></R>))}</div>
    </div></S>);
}

/* 4 */
export function M4Terminal() {
  return (<S bg="bg-[#0A2540]"><Cap><span className="text-blue-300">CLI</span></Cap><H><span className="text-white">NexaTalent IT Solutions in your terminal</span></H>
    <div className="mt-10 rounded-2xl bg-black/60 p-6 font-mono text-xs text-green-300">
      <p>$ nexa apply --role frontend --location remote</p>
      <p className="text-blue-200">✓ Profile matched 3 open roles — 2 interviews scheduled.</p>
      <p className="text-white/50">$ _</p>
    </div></S>);
}

/* 5 */
export function M5Calendar() {
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  return (<S><Cap>SCHEDULING</Cap><H>Interview Calendar</H><div className="mt-12 grid grid-cols-7 gap-2">{days.map((d) => (<div key={d} className={`rounded-xl p-4 text-center text-sm font-bold ${[3, 7, 11].includes(d) ? 'bg-[#1A7FE8] text-white' : 'bg-neutral-50 text-neutral-400'}`}>{d}</div>))}</div></S>);
}

/* 6 */
export function M6SearchAutocomplete() {
  return (<S bg="bg-[#FDFBF6]"><Cap>SEARCH</Cap><H>Find roles like Google</H><div className="mt-12 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-neutral-100"><input placeholder="Search roles, skills, locations…" className="w-full rounded-2xl bg-neutral-50 p-5 text-sm outline-none" /><div className="mt-4 space-y-2 text-xs">{['React Developer — Remote', 'React Native Engineer — Bangalore', 'React Architect — Dubai'].map((r) => <p key={r} className="rounded-xl px-4 py-3 hover:bg-neutral-50">🔍 {r}</p>)}</div></div></S>);
}

/* 7 */
export function M7LineChart() {
  return (<S><Cap>GROWTH</Cap><H>Placed Candidates, Monthly</H><div className="mt-12 rounded-3xl bg-neutral-50 p-8"><svg viewBox="0 0 600 200" className="h-48 w-full"><path d="M0 160 L80 140 L160 150 L240 100 L320 110 L400 60 L480 70 L600 20" fill="none" stroke="#1A7FE8" strokeWidth="4" /></svg></div></S>);
}

/* 8 */
export function M8Donut() {
  return (<S bg="bg-[#F7F2E7]"><Cap>MIX</Cap><H>Hires by Role Family</H><div className="mt-12 grid items-center gap-10 md:grid-cols-2"><div className="mx-auto h-48 w-48 rounded-full border-[18px] border-[#1A7FE8] border-r-amber-200 border-b-blue-200" /><ul className="space-y-3 text-sm">{['Engineering — 45%', 'Design — 20%', 'Data — 15%', 'Product — 12%', 'Ops — 8%'].map((t, i) => <li key={t} className="flex justify-between border-b border-neutral-200 pb-2"><span>{t}</span><span className="text-neutral-400">{i}</span></li>)}</ul></div></S>);
}

/* 9 */
export function M9Poll() {
  return (<S><Cap>COMMUNITY POLL</Cap><H>Which skill do you want to learn next?</H><div className="mt-10 space-y-3">{[['AI/ML', 64], ['Cloud', 48], ['DevOps', 37], ['Product', 22]].map(([t, p]) => (<div key={t as string}><div className="flex justify-between text-xs font-semibold"><span>{t}</span><span>{p}%</span></div><div className="mt-1 h-3 rounded-full bg-neutral-100"><div style={{ width: `${p}%` }} className="h-full rounded-full bg-[#1A7FE8]" /></div></div>))}</div></S>);
}

/* 10 */
export function M10ActivityFeed() {
  const feed = [['Aisha applied for Frontend Engineer', '2 min ago'], ['Omar shortlisted 5 candidates', '15 min ago'], ['Sara sent an offer to Mark', '1 hr ago'], ['New role posted: Backend Dev', '2 hr ago']];
  return (<S bg="bg-[#FDFBF6]"><Cap>LIVE</Cap><H>Activity Feed</H><div className="mt-10 space-y-4">{feed.map(([t, ts], i) => (<R key={t} d={i * 0.06}><div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-neutral-100"><span className="h-2.5 w-2.5 rounded-full bg-green-400" /><p className="text-sm text-[#0A2540]">{t}</p><span className="ml-auto text-[10px] text-neutral-400">{ts}</span></div></R>))}</div></S>);
}

/* 11 */
export function M11ProgressRings() {
  const rings = [['90%', 'Pipeline health'], ['82%', 'Offer accept'], ['76%', 'Candidate NPS']];
  return (<S><Cap>HEALTH</Cap><H>Your Hiring Health</H><div className="mt-12 flex justify-center gap-12">{rings.map(([v, l], i) => (<R key={l} d={i * 0.08}><div className="text-center"><div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-8 border-blue-100 text-xl font-extrabold text-[#1A7FE8]">{v}</div><p className="mt-4 text-[10px] tracking-widest text-neutral-500">{l}</p></div></R>))}</div></S>);
}

/* 12 */
export function M12Invoice() {
  return (<S bg="bg-[#F7F2E7]"><Cap>BILLING</Cap><H>Simple, Transparent Invoices</H><div className="mt-12 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-neutral-100"><div className="flex justify-between border-b border-neutral-100 pb-4 text-sm font-bold"><span>Placement — Frontend Engineer</span><span>$4,800</span></div><div className="mt-4 flex justify-between text-sm text-neutral-500"><span>Platform fee</span><span>$0</span></div><div className="mt-6 flex justify-between text-lg font-extrabold text-[#0A2540]"><span>Total</span><span>$4,800</span></div></div></S>);
}

/* 13 */
export function M13FeatureChecklist() {
  return (<S><Cap>VS</Cap><H>Legacy ATS vs NexaTalent IT Solutions</H><div className="mt-12 overflow-hidden rounded-3xl ring-1 ring-neutral-100"><div className="grid grid-cols-3 bg-neutral-50 p-4 text-xs font-bold"><span></span><span>Legacy ATS</span><span className="text-[#1A7FE8]">NexaTalent IT Solutions</span></div>{[['AI matching', '✗', '✓'], ['Live shortlists', '✗', '✓'], ['Candidate chat', '✗', '✓'], ['Analytics', 'Basic', 'Advanced']].map(([f, a, b]) => (<div key={f} className="grid grid-cols-3 border-t border-neutral-100 p-4 text-xs"><span className="font-semibold">{f}</span><span className="text-neutral-400">{a}</span><span className="font-bold text-[#1A7FE8]">{b}</span></div>))}</div></S>);
}

/* 14 */
export function M14Badges() {
  return (<S bg="bg-[#FDFBF6]"><Cap>CERTIFIED</Cap><H>Trusted & Verified</H><div className="mt-12 flex flex-wrap justify-center gap-4">{['SOC2', 'GDPR', 'ISO 27001', 'Clutch Top Rated', 'Forbes 30U30', 'G2 Leader'].map((b, i) => (<R key={b} d={i * 0.05}><span className="rounded-2xl bg-white px-8 py-5 text-sm font-bold text-[#0A2540] shadow-sm ring-1 ring-neutral-100">🏅 {b}</span></R>))}</div></S>);
}

/* 15 */
export function M15MasonryGallery() {
  return (<S><Cap>MOMENTS</Cap><H>Life at NexaTalent IT Solutions</H><div className="mt-12 columns-2 gap-4 md:columns-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className={`mb-4 break-inside-avoid rounded-2xl ${['bg-blue-100', 'bg-amber-100', 'bg-neutral-200', 'bg-blue-50'][i % 4]} ${i % 2 ? 'h-40' : 'h-28'}`} />)}</div></S>);
}

/* 16 */
export function M16Countdown() {
  return (<S bg="bg-[#0A2540]"><div className="text-center"><Cap><span className="text-blue-300">HIRING SPRINT</span></Cap><h2 className="mt-4 text-3xl font-extrabold text-white">Next batch hiring sprint starts in</h2><div className="mt-10 flex justify-center gap-4">{[['06', 'Days'], ['14', 'Hours'], ['32', 'Min'], ['18', 'Sec']].map(([n, l]) => (<div key={l} className="rounded-2xl bg-white/5 px-6 py-5 ring-1 ring-white/10"><p className="text-3xl font-extrabold text-white">{n}</p><p className="mt-1 text-[10px] tracking-widest text-blue-200/70">{l}</p></div>))}</div></div></S>);
}

/* 17 */
export function M17Wizard() {
  const steps = ['Brief', 'Details', 'Budget', 'Timeline', 'Review'];
  return (<S><Cap>INTAKE</Cap><H>Post a Role in 5 Steps</H><div className="mt-12 flex items-center justify-between">{steps.map((s, i) => (<div key={s} className="flex flex-1 items-center"><div className="flex flex-col items-center"><span className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold ${i === 0 ? 'bg-[#1A7FE8] text-white' : 'bg-neutral-100 text-neutral-400'}`}>{i + 1}</span><p className="mt-2 text-[10px] font-semibold text-neutral-500">{s}</p></div>{i < steps.length - 1 && <div className="mb-6 h-px flex-1 bg-neutral-200" />}</div>))}</div></S>);
}

/* 18 */
export function M18TiltCards() {
  return (<S bg="bg-[#FDFBF6]"><Cap>SERVICES</Cap><H>Pick Your Path</H><div className="mt-12 grid gap-6 md:grid-cols-3">{['Permanent', 'Contract', 'RPO'].map((t, i) => (<R key={t} d={i * 0.08}><div className="rounded-3xl bg-white p-10 text-center shadow-md ring-1 ring-neutral-100 transition hover:rotate-1 hover:scale-105"><h3 className="text-lg font-extrabold text-[#0A2540]">{t}</h3><p className="mt-3 text-xs text-neutral-500">Flexible engagement models tailored to your growth.</p></div></R>))}</div></S>);
}

/* 19 */
export function M19FloatingStack() {
  return (<S><Cap>TEAM</Cap><H>Your Account Pod</H><div className="relative mx-auto mt-12 h-56 max-w-xl">{['Aisha — Recruiter', 'Ravi — Researcher', 'Sara — CSM'].map((t, i) => (<div key={t} style={{ top: i * 40, left: i * 40 }} className="absolute rounded-2xl bg-white px-8 py-5 shadow-lg ring-1 ring-neutral-100"><p className="text-sm font-bold text-[#0A2540]">{t}</p></div>))}</div></S>);
}

/* 20 */
export function M20QuotesWall() {
  return (<S bg="bg-[#0A2540]"><Cap><span className="text-blue-300">WALL OF TRUST</span></Cap><H><span className="text-white">Candidates Speak</span></H><div className="mt-12 grid gap-4 md:grid-cols-3">{['"Got hired in 9 days!"', '"Recruiters actually cared."', '"Best offer negotiation ever."', '"Smooth onboarding."', '"Great salary advice."', '"Felt supported throughout."'].map((q, i) => (<div key={i} className="rounded-2xl bg-white/5 p-6 text-xs text-blue-100/80 ring-1 ring-white/10">“{q}”</div>))}</div></S>);
}

/* 21 */
export function M21PricingTable() {
  const rows = [['Platform fee', '$0', '$499/mo', 'Custom'], ['AI matching', 'Basic', 'Pro', 'Enterprise'], ['Support', 'Email', 'Priority', 'Dedicated pod'], ['SLAs', '—', 'Yes', 'Yes + QA']];
  return (<S><Cap>PRICING</Cap><H>Compare Plans</H><div className="mt-12 overflow-hidden rounded-3xl ring-1 ring-neutral-100"><div className="grid grid-cols-4 bg-neutral-50 p-4 text-xs font-bold"><span></span><span>Starter</span><span className="text-[#1A7FE8]">Growth</span><span>Enterprise</span></div>{rows.map(([f, a, b, c]) => (<div key={f} className="grid grid-cols-4 border-t border-neutral-100 p-4 text-xs"><span className="font-semibold">{f}</span><span>{a}</span><span>{b}</span><span>{c}</span></div>))}</div></S>);
}

/* 22 */
export function M22Timeline() {
  const events = [['2019', 'Founded in Dubai'], ['2021', 'Expanded to India'], ['2023', '1,000th placement'], ['2025', 'Launched AI Match'], ['2026', '38 countries served']];
  return (<S bg="bg-[#F7F2E7]"><Cap>STORY</Cap><H>Our Timeline</H><div className="mt-12 flex flex-wrap gap-8">{events.map(([y, t], i) => (<R key={y} d={i * 0.08}><div><p className="text-3xl font-extrabold text-[#1A7FE8]">{y}</p><p className="mt-2 text-xs font-semibold text-[#0A2540]">{t}</p></div></R>))}</div></S>);
}

/* 23 */
export function M23RadialMenu() {
  const items = ['Jobs', 'Talent', 'Clients', 'Insights', 'Pricing', 'Contact'];
  return (<S><Cap>NAV</Cap><H>Explore Everything</H><div className="relative mx-auto mt-12 grid h-64 w-64 place-items-center rounded-full border border-blue-100"><div className="grid h-32 w-32 place-items-center rounded-full bg-[#0A2540] text-xs font-bold text-white">Menu</div>{items.map((t, i) => { const a = (i / items.length) * 2 * Math.PI; return <span key={t} style={{ transform: `translate(${Math.cos(a) * 110}px, ${Math.sin(a) * 110}px)` }} className="absolute rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-[#1A5FB4]">{t}</span>; })}</div></S>);
}

/* 24 */
export function M24BeforeAfter() {
  return (<S bg="bg-[#FDFBF6]"><Cap>TRANSFORMATION</Cap><H>From chaos to clarity</H><div className="mt-12 grid gap-4 md:grid-cols-2"><div className="rounded-3xl bg-neutral-100 p-10"><h3 className="font-bold text-neutral-500">Before</h3><p className="mt-4 text-xs text-neutral-400">Scattered resumes, missed follow-ups, slow decisions.</p></div><div className="rounded-3xl bg-[#1A7FE8] p-10 text-white"><h3 className="font-bold">After</h3><p className="mt-4 text-xs text-blue-100">One pipeline, one team, one source of truth.</p></div></div></S>);
}

/* 25 */
export function M25StackedCards() {
  return (<S><Cap>PLANS</Cap><H>Choose Your Engine</H><div className="mt-12 space-y-4">{['Starter — Post & match', 'Growth — AI shortlists weekly', 'Enterprise — Dedicated pods & SLAs'].map((t, i) => (<R key={t} d={i * 0.08}><div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 text-center text-sm font-bold text-[#0A2540] shadow-md ring-1 ring-neutral-100" style={{ transform: `scale(${1 - i * 0.04})` }}>{t}</div></R>))}</div></S>);
}

/* 26 */
export function M26GridFeatures() {
  const f = [['⚡', 'Speed', '72h shortlists'], ['🧠', 'AI', 'Smart matching'], ['🔒', 'Secure', 'GDPR ready'], ['📱', 'Mobile', 'Apply anywhere'], ['💬', 'Chat', 'Live with recruiters'], ['📊', 'Insights', 'Live analytics']];
  return (<S bg="bg-[#F7F2E7]"><Cap>TOOLKIT</Cap><H>Built for Modern Hiring</H><div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">{f.map(([e, t, b], i) => (<R key={t} d={i * 0.05}><div className="rounded-2xl bg-white p-6"><span className="text-2xl">{e}</span><h3 className="mt-4 font-bold text-[#0A2540]">{t}</h3><p className="mt-1 text-[11px] text-neutral-500">{b}</p></div></R>))}</div></S>);
}

/* 27 */
export function M27Numbers() {
  return (<S><Cap>IMPACT</Cap><H>Proof, Not Promises</H><div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">{[['2,500+', 'Placements'], ['72h', 'First shortlist'], ['96%', 'Renewal rate'], ['38', 'Countries']].map(([n, l], i) => (<R key={l} d={i * 0.06}><div className="text-center"><p className="text-4xl font-extrabold text-[#1A7FE8]">{n}</p><p className="mt-2 text-[10px] tracking-widest text-neutral-500">{l}</p></div></R>))}</div></S>);
}

/* 28 */
export function M28DualCTA() {
  return (<S bg="bg-[#0A2540]"><div className="grid items-center gap-8 md:grid-cols-2"><div><Cap><span className="text-blue-300">EMPLOYERS</span></Cap><h2 className="mt-3 text-3xl font-extrabold text-white">Hire better, faster.</h2></div><div className="flex gap-4"><button className="flex-1 rounded-full bg-white py-4 text-sm font-bold text-[#0A2540]">Post a Job</button><button className="flex-1 rounded-full border border-white/20 py-4 text-sm font-bold text-white">Talk to Sales</button></div></div></S>);
}

/* 29 */
export function M29MasonryBlog() {
  const posts = [['How AI is reshaping hiring', '5 min read'], ['GCC salary trends 2026', 'Report'], ['Remote-first playbooks', 'Guide'], ['Recruiter workflows', 'Tips']];
  return (<S><Cap>INSIGHTS</Cap><H>From the Hiring Desk</H><div className="mt-12 columns-2 gap-4 md:columns-4">{posts.map(([t, m], i) => (<div key={t} className={`mb-4 break-inside-avoid rounded-2xl ${i % 2 ? 'bg-blue-50' : 'bg-neutral-50'} p-6`}><h3 className="text-sm font-bold text-[#0A2540]">{t}</h3><p className="mt-3 text-[10px] text-neutral-400">{m}</p></div>))}</div></S>);
}

/* 30 */
export function M30FinalCTA() {
  return (<S bg="bg-gradient-to-r from-[#1A7FE8] to-blue-400"><div className="text-center text-white"><h2 className="text-4xl font-extrabold">Your next great hire is waiting.</h2><p className="mx-auto mt-4 max-w-md text-xs text-blue-100">Join thousands of employers building better teams with NexaTalent IT Solutions.</p><button className="mt-10 rounded-full bg-white px-10 py-4 text-sm font-bold text-[#1A7FE8] shadow-xl">Get Started Free</button></div></S>);
}
