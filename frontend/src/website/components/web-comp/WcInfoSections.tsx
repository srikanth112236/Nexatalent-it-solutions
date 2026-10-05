import { ReactNode } from 'react';
import { motion } from 'framer-motion';

const R = ({ children, d = 0 }: { children: ReactNode; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay: d }}>{children}</motion.div>
);
const S = ({ children, bg = 'bg-white' }: { children: ReactNode; bg?: string }) => (
  <section className={`${bg} px-6 py-16 lg:px-16`}><div className="mx-auto max-w-6xl">{children}</div></section>
);
const Cap = ({ children }: { children: ReactNode }) => <p className="text-[10px] font-bold tracking-[0.35em] text-[#1A7FE8]">{children}</p>;

/* 1 – numbered journey with connectors */
export function I1CandidateJourney() {
  const s = ['Discover Roles', 'Apply in 2 Min', 'Get Shortlisted', 'Interview', 'Get Hired'];
  return (<S bg="bg-[#FDFBF6]"><Cap>CANDIDATES</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Your Journey With Us</h2>
    <div className="mt-10 flex flex-col gap-0 md:flex-row">
      {s.map((t, i) => (<R key={t} d={i * 0.08}><div className="flex-1 border-l-2 border-blue-100 p-5 md:border-l-0 md:border-t-2"><p className="text-3xl font-extrabold text-[#1A7FE8]">0{i + 1}</p><p className="mt-3 text-sm font-bold text-[#0A2540]">{t}</p></div></R>))}
    </div></S>);
}

/* 2 – checklist rows */
export function I2RecruiterJourney() {
  const s = ['Intake Call', 'Market Map', 'Source', 'Screen', 'Present'];
  return (<S><Cap>RECRUITERS</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Your Day With NexaTalent IT Solutions</h2>
    <div className="mt-8 divide-y divide-neutral-100 rounded-3xl bg-neutral-50">
      {s.map((t, i) => (<R key={t} d={i * 0.06}><div className="flex items-center gap-6 p-5"><span className="rounded-full bg-[#0A2540] px-3 py-1 text-[10px] font-bold text-white">0{i + 1}</span><p className="text-sm font-semibold text-[#0A2540]">{t}</p><span className="ml-auto text-[10px] text-neutral-400">~ 45 min</span></div></R>))}
    </div></S>);
}

/* 3 – job cards table */
export function I3JobBoard() {
  const jobs = [['Frontend Engineer', 'Remote', 'Full-time', '$60–95k'], ['Data Analyst', 'Dubai', 'Full-time', '$40–70k'], ['DevOps Lead', 'Bangalore', 'Contract', '$50–80k'], ['Product Manager', 'Riyadh', 'Full-time', '$70–110k'], ['QA Engineer', 'Hybrid', 'Full-time', '$30–55k'], ['UX Designer', 'Remote', 'Contract', '$35–60k']];
  return (<S bg="bg-[#F7F2E7]"><Cap>JOBS</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Trending Openings</h2>
    <div className="mt-8 space-y-3">
      {jobs.map(([t, l, ty, sal], i) => (<R key={t} d={i * 0.05}><div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-neutral-100"><p className="font-bold text-[#0A2540]">{t}</p><span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] text-[#1A5FB4]">{l}</span><span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] text-neutral-500">{ty}</span><span className="ml-auto text-sm font-bold text-[#1A7FE8]">{sal}</span></div></R>))}
    </div></S>);
}

/* 4 – salary bar chart */
export function I4SalaryGuide() {
  const bars: [string, number][] = [['Engineers', 80], ['Designers', 55], ['Data', 70], ['Product', 90], ['DevOps', 85], ['QA', 45]];
  return (<S><Cap>COMPENSATION</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">2026 Salary Guide</h2>
    <div className="mt-10 flex items-end gap-6">
      {bars.map(([t, h], i) => (<R key={t} d={i * 0.06}><div className="flex-1"><div style={{ height: h * 2 }} className="w-full rounded-t-xl bg-gradient-to-t from-[#1A7FE8] to-blue-200" /><p className="mt-3 text-center text-[10px] font-semibold text-neutral-500">{t}</p></div></R>))}
    </div></S>);
}

/* 5 – icon + text columns */
export function I5Benefits() {
  const items = [['🚀', 'Free profile boost'], ['📄', 'Resume review'], ['🎤', 'Interview prep'], ['💰', 'Salary negotiation'], ['🧭', 'Career coaching'], ['🤝', 'Community access']];
  return (<S bg="bg-[#FDFBF6]"><Cap>CANDIDATES</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Why Candidates Love Us</h2>
    <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
      {items.map(([e, t], i) => (<R key={t} d={i * 0.05}><div className="flex items-start gap-4"><span className="text-2xl">{e}</span><p className="text-sm font-semibold text-[#0A2540]">{t}</p></div></R>))}
    </div></S>);
}

/* 6 – big words */
export function I6AgencyValues() {
  return (<S><Cap>ABOUT</Cap><div className="flex flex-wrap gap-x-8 gap-y-3">
    {['Transparency', 'Speed', 'Quality', 'Care', 'Integrity', 'Growth'].map((w, i) => (<R key={w} d={i * 0.05}><span className="text-3xl font-extrabold text-neutral-200 transition hover:text-[#1A7FE8]">{w}.</span></R>))}
  </div></S>);
}

/* 7 – dark band with big statement */
export function I7HiringTrends() {
  return (<S bg="bg-[#0A2540]"><div className="grid items-center gap-8 md:grid-cols-2"><div><Cap><span className="text-blue-300">TRENDS</span></Cap><h2 className="mt-3 text-3xl font-extrabold text-white">What's Hot in 2026 Hiring</h2></div><ul className="space-y-4 text-sm text-blue-100/80"><li>▲ AI-assisted screening up 3×</li><li>▲ Remote-first roles dominate Gulf hiring</li><li>▲ Contract staffing grew 41% YoY</li></ul></div></S>);
}

/* 8 – numbered tips */
export function I8ApplicationTips() {
  const tips = ['Tailor your resume', 'Quantify impact', 'Show projects', 'Keep it 2 pages', 'Use keywords', 'Proofread twice'];
  return (<S><Cap>RESOURCES</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Application Tips</h2>
    <ol className="mt-8 space-y-3">{tips.map((t, i) => (<R key={t} d={i * 0.05}><li className="flex gap-4 text-sm text-neutral-600"><span className="font-extrabold text-[#1A7FE8]">{i + 1}.</span>{t}</li></R>))}</ol></S>);
}

/* 9 – track cards w/ icons */
export function I9InterviewPrep() {
  const tracks = [['🧠', 'Technical DSA'], ['🏗️', 'System Design'], ['⭐', 'Behavioral STAR'], ['🗣️', 'HR Round'], ['📊', 'Case Study'], ['🎨', 'Portfolio Review']];
  return (<S bg="bg-[#F7F2E7]"><Cap>RESOURCES</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Interview Prep Tracks</h2>
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">{tracks.map(([e, t], i) => (<R key={t} d={i * 0.05}><div className="rounded-2xl bg-white p-6 ring-1 ring-neutral-100"><span className="text-2xl">{e}</span><p className="mt-4 text-sm font-bold text-[#0A2540]">{t}</p></div></R>))}</div></S>);
}

/* 10 – template previews */
export function I10ResumeTemplates() {
  const t = ['Minimal', 'Modern', 'Executive', 'Tech', 'Designer', 'Graduate'];
  return (<S><Cap>RESOURCES</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">ATS-Friendly Templates</h2>
    <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-6">{t.map((x, i) => (<R key={x} d={i * 0.04}><div><div className="h-28 rounded-xl bg-neutral-100" /><p className="mt-2 text-center text-[10px] font-semibold text-neutral-500">{x}</p></div></R>))}</div></S>);
}

/* 11 – split with illustration */
export function I11RemoteWork() {
  return (<S bg="bg-[#FDFBF6]"><div className="grid items-center gap-10 md:grid-cols-2"><R><Cap>REMOTE</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Remote-First Hiring</h2><p className="mt-4 text-xs text-neutral-500">Global teams, local support — we make remote hiring feel local.</p></R>
    <div className="grid grid-cols-2 gap-3">{['Async culture', 'Time-zone overlap', 'Home setup stipend', 'Quarterly onsites', 'Global payroll', 'Visa support'].map((x, i) => (<R key={x} d={i * 0.05}><div className="rounded-xl bg-white p-4 text-xs font-semibold text-[#0A2540] ring-1 ring-neutral-100">{x}</div></R>))}</div></div></S>);
}

/* 12 – two column list */
export function I12VisaSponsorship() {
  return (<S><Cap>GCC</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Relocation Support</h2>
    <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-3">{['Visa processing', 'Flight tickets', 'Temporary housing', 'Medical insurance', 'Family visa aid', 'Airport pickup'].map((x, i) => (<R key={x} d={i * 0.04}><p className="border-b border-neutral-100 pb-3 text-xs font-semibold text-[#0A2540]">— {x}</p></R>))}</div></S>);
}

/* 13 – service list with price */
export function I13EmployerBranding() {
  const rows: [string, string][] = [['Career pages', 'from $2,900'], ['Glassdoor audit', 'from $800'], ['EVP workshops', 'from $1,500'], ['Video testimonials', 'from $3,200'], ['Social kits', 'from $500'], ['Campus presence', 'custom']];
  return (<S bg="bg-[#F7F2E7]"><Cap>EMPLOYERS</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Employer Branding Services</h2>
    <div className="mt-8 divide-y divide-neutral-200 rounded-3xl bg-white px-8">{rows.map(([t, p], i) => (<R key={t} d={i * 0.05}><div className="flex justify-between py-4 text-sm"><span className="font-semibold text-[#0A2540]">{t}</span><span className="text-[#1A7FE8]">{p}</span></div></R>))}</div></S>);
}

/* 14 – insight tiles w/ big numbers */
export function I14TalentMapping() {
  const tiles = [['Market reports', '24'], ['Comp benchmarks', '130+'], ['Skill demand', '310 roles'], ['Competitor hiring', 'Weekly'], ['Location analysis', '38 cities'], ['Attrition data', 'Quarterly']];
  return (<S><Cap>STRATEGY</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Talent Mapping & Insights</h2>
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-6">{tiles.map(([t, n], i) => (<R key={t} d={i * 0.05}><div className="rounded-2xl bg-blue-50/60 p-5 text-center"><p className="text-lg font-extrabold text-[#1A7FE8]">{n}</p><p className="mt-2 text-[9px] tracking-widest text-neutral-500">{t}</p></div></R>))}</div></S>);
}

/* 15 – banner features */
export function I15Diversity() {
  const f = ['Blind screening', 'Diverse slates', 'Inclusive JDs', 'Bias training', 'Accessibility audits', 'Fair pay policy'];
  return (<S bg="bg-[#0A2540]"><div className="text-center"><Cap><span className="text-blue-300">D&I</span></Cap><h2 className="mt-2 text-3xl font-extrabold text-white">Diverse Hiring, By Design</h2><div className="mt-8 flex flex-wrap justify-center gap-3">{f.map((x, i) => (<R key={x} d={i * 0.04}><span className="rounded-full border border-white/15 px-5 py-2.5 text-xs text-white">{x}</span></R>))}</div></div></S>);
}

/* 16 – steps horizontal with dots */
export function I16Onboarding() {
  const s = ['Create account', 'Set hiring needs', 'Invite team', 'Post first role'];
  return (<S><Cap>PLATFORM</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Employer Onboarding</h2><div className="mt-10 flex flex-wrap gap-8">{s.map((t, i) => (<R key={t} d={i * 0.08}><div className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-[#1A7FE8]" /><p className="text-sm font-semibold text-[#0A2540]">{t}</p></div></R>))}</div></S>);
}

/* 17 – checkboxes */
export function I17CandidateOnboarding() {
  const s = ['Sign up', 'Upload resume', 'Set preferences', 'Apply to roles'];
  return (<S bg="bg-[#F7F2E7]"><Cap>PLATFORM</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Candidate Onboarding</h2><div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">{s.map((t, i) => (<R key={t} d={i * 0.06}><label className="flex items-center gap-3 rounded-2xl bg-white p-5 text-xs font-semibold text-[#0A2540] ring-1 ring-neutral-100"><span className="text-[#1A7FE8]">☑</span>{t}</label></R>))}</div></S>);
}

/* 18 – bell feature list */
export function I18Notifications() {
  const items = ['Job alerts', 'Application status', 'Interview nudges', 'New messages', 'Offer updates', 'Profile views'];
  return (<S><Cap>FEATURES</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Stay In The Loop</h2><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">{items.map((t, i) => (<R key={t} d={i * 0.05}><div className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-5 text-sm font-semibold text-[#0A2540]"><span className="text-[#1A7FE8]">🔔</span>{t}</div></R>))}</div></S>);
}

/* 19 – chat mock */
export function I19Messaging() {
  return (<S bg="bg-[#FDFBF6]"><div className="grid items-center gap-10 md:grid-cols-2"><R><Cap>FEATURES</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">In-App Messaging</h2><p className="mt-4 text-xs text-neutral-500">Chat with recruiters, share documents, schedule calls — all in one thread.</p></R>
    <div className="space-y-3 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-neutral-100"><div className="w-2/3 rounded-2xl bg-neutral-100 p-4 text-xs">Hi! Are you open to new roles?</div><div className="ml-auto w-2/3 rounded-2xl bg-[#1A7FE8] p-4 text-xs text-white">Yes — tell me more!</div><div className="w-1/2 rounded-2xl bg-neutral-100 p-4 text-xs">Great, sending details…</div></div></div></S>);
}

/* 20 – metrics rows */
export function I20Analytics() {
  const rows: [string, string, string][] = [['Funnel reports', 'Updated hourly', '📈'], ['Source of hire', 'By channel', '🎯'], ['Time-to-fill', 'Avg 11 days', '⏱️'], ['Offer accept rate', '82%', '✅'], ['Cost per hire', '-34% YoY', '💸'], ['Quality of hire', '4.6/5', '⭐']];
  return (<S><Cap>EMPLOYERS</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Recruitment Analytics</h2><div className="mt-8 space-y-3">{rows.map(([t, b, e], i) => (<R key={t} d={i * 0.05}><div className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-5"><span>{e}</span><p className="font-bold text-[#0A2540]">{t}</p><p className="ml-auto text-xs text-neutral-400">{b}</p></div></R>))}</div></S>);
}

/* 21 – event cards */
export function I21Webinars() {
  const ev: [string, string][] = [['Hiring in GCC 101', 'Oct 12 · 5pm GST'], ['Interviewing Engineers', 'Oct 18 · 4pm IST'], ['Offer Negotiation', 'Oct 21 · 6pm GST'], ['Building D&I Pipelines', 'Oct 27 · 5pm GMT'], ['Remote Onboarding', 'Nov 02 · 5pm IST'], ['Salary Trends 2026', 'Nov 08 · 4pm GST']];
  return (<S bg="bg-[#F7F2E7]"><Cap>LEARN</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Upcoming Webinars</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{ev.map(([t, d], i) => (<R key={t} d={i * 0.05}><div className="rounded-2xl bg-white p-6 ring-1 ring-neutral-100"><p className="text-[10px] font-bold text-[#1A7FE8]">{d}</p><h3 className="mt-3 font-bold text-[#0A2540]">{t}</h3><button className="mt-4 text-[10px] font-bold text-neutral-400">RSVP →</button></div></R>))}</div></S>);
}

/* 22 – navy stat trio */
export function I22CaseStudyBand() {
  return (<S bg="bg-[#0A2540]"><div className="grid gap-8 text-center md:grid-cols-3">{[['2,500+', 'Candidates placed in 2025'], ['140+', 'Employer brands served'], ['96%', 'Client renewal rate']].map(([n, l]) => <div key={l}><p className="text-4xl font-extrabold text-white">{n}</p><p className="mt-2 text-xs text-blue-200/70">{l}</p></div>)}</div></S>);
}

/* 23 – community orbits */
export function I23Community() {
  const c = ['Talent meetups', 'Referral bonuses', 'Discord server', 'Newsletter', 'Local chapters', 'Alumni network'];
  return (<S><Cap>COMMUNITY</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Join the Nexa Community</h2><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">{c.map((t, i) => (<R key={t} d={i * 0.05}><div className="rounded-full border border-blue-100 bg-blue-50/50 px-6 py-4 text-center text-xs font-bold text-[#1A5FB4]">{t}</div></R>))}</div></S>);
}

/* 24 – referral banner */
export function I24Referrals() {
  return (<S bg="bg-[#FDFBF6]"><div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#1A7FE8] to-blue-400 p-12 text-white md:flex-row"><div><h2 className="text-2xl font-extrabold">Refer. Earn. Repeat.</h2><p className="mt-2 text-xs text-blue-100">$500 for every successful referral — no cap.</p></div><button className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1A7FE8]">Refer a Friend</button></div></S>);
}

/* 25 – tags */
export function I25BlogTopics() {
  return (<S><Cap>BLOG</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Popular Topics</h2><div className="mt-8 flex flex-wrap gap-3">{['Career Growth', 'Interview Hacks', 'Market Insights', 'Remote Life', 'GCC Hiring', 'Tech Skills'].map((t, i) => (<R key={t} d={i * 0.04}><span className="rounded-full bg-neutral-100 px-5 py-2 text-xs font-semibold text-neutral-600">#{t.replace(' ', '')}</span></R>))}</div></S>);
}

/* 26 – legal list */
export function I26Legal() {
  const docs = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Processing', 'Refund Policy', 'Accessibility'];
  return (<S bg="bg-[#F7F2E7]"><Cap>COMPLIANCE</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Legal & Policy Hub</h2><div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">        {docs.map((doc, i) => (<R key={doc} d={i * 0.04}><a href="#" className="block rounded-2xl bg-white p-5 text-xs font-semibold text-[#0A2540] ring-1 ring-neutral-100 hover:text-[#1A7FE8]">{doc} →</a></R>))}</div></S>);
}

/* 27 – support channels */
export function I27Support() {
  return (<S><Cap>HELP</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Support Channels</h2><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">{[['💬', 'Live chat', 'Avg 2 min response'], ['📧', 'Email support', 'Replies within 1 hour'], ['📞', 'Call back request', 'Within 30 minutes']].map(([e, t, s], i) => (<R key={t} d={i * 0.08}><div className="rounded-2xl bg-neutral-50 p-6 text-center"><span className="text-2xl">{e}</span><h3 className="mt-4 font-bold text-[#0A2540]">{t}</h3><p className="mt-1 text-[10px] text-neutral-400">{s}</p></div></R>))}</div></S>);
}

/* 28 – integration logos row */
export function I28Integrations() {
  return (<S bg="bg-[#FDFBF6]"><Cap>STACK</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Integrations</h2><div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-neutral-400">{['Google Workspace', 'Microsoft 365', 'Slack', 'Notion', 'Greenhouse', 'Lever'].map((n, i) => (<R key={n} d={i * 0.05}><span className="rounded-2xl bg-white px-6 py-4 ring-1 ring-neutral-100">{n}</span></R>))}</div></S>);
}

/* 29 – security badges */
export function I29Security() {
  return (<S><Cap>TRUST</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Security & Privacy</h2><div className="mt-8 flex flex-wrap gap-6">{['🔒 Encrypted data', '🛡️ 2FA login', '🔑 Role-based access', '📋 Audit logs', '🇪🇺 GDPR ready', '🧪 Annual pentests'].map((x, i) => (<R key={x} d={i * 0.04}><span className="rounded-full border border-neutral-200 px-5 py-2 text-xs font-semibold text-neutral-600">{x}</span></R>))}</div></S>);
}

/* 30 – offices with map pins */
export function I30OfficeLocations() {
  return (<S bg="bg-[#F7F2E7]"><Cap>VISIT</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Our Offices</h2><div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">{['Dubai — DIFC', 'Bangalore — Koramangala', 'Riyadh — Olaya', 'London — Shoreditch', 'Singapore — Marina Bay', 'Remote — Global'].map((x, i) => (<R key={x} d={i * 0.05}><p className="rounded-xl bg-white p-4 text-xs font-semibold text-[#0A2540] ring-1 ring-neutral-100">📍 {x}</p></R>))}</div></S>);
}

/* 31 – contact card */
export function I31ContactCTA() {
  return (<S><div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-blue-50 p-10 md:flex-row"><div><h2 className="text-2xl font-extrabold text-[#0A2540]">Have a question?</h2><p className="mt-2 text-xs text-neutral-500">Our team replies within one business hour.</p></div><button className="rounded-full bg-[#1A7FE8] px-8 py-3 text-xs font-semibold text-white">Contact Us</button></div></S>);
}

/* 32 – newsletter dark */
export function I32Newsletter() {
  return (<S bg="bg-[#0A2540]"><div className="text-center"><h2 className="text-2xl font-extrabold text-white">Get the hiring digest</h2><form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}><input placeholder="you@company.com" className="flex-1 rounded-full px-5 py-3 text-xs text-[#0A2540] outline-none" /><button className="rounded-full bg-[#1A7FE8] px-6 py-3 text-xs font-semibold text-white">Subscribe</button></form></div></S>);
}

/* 33 – social circles */
export function I33Social() {
  return (<S><Cap>FOLLOW</Cap><div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#0A2540]">{['LinkedIn', 'Instagram', 'X / Twitter', 'YouTube', 'Medium', 'GitHub'].map((n, i) => (<R key={n} d={i * 0.05}><span className="grid h-20 w-20 place-items-center rounded-full border border-neutral-100 bg-neutral-50">{n}</span></R>))}</div></S>);
}

/* 34 – app mock */
export function I34App() {
  return (<S bg="bg-[#FDFBF6]"><div className="grid items-center gap-10 md:grid-cols-2"><R><Cap>MOBILE</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">NexaTalent IT Solutions App</h2><p className="mt-4 text-xs text-neutral-500">Apply on the go — alerts, video interviews, saved jobs, offline mode.</p></R><div className="mx-auto h-64 w-32 rounded-[2rem] bg-[#0A2540] shadow-xl" /></div></S>);
}

/* 35 – partner banner */
export function I35PartnerCTA() {
  return (<S><div className="grid items-center gap-6 rounded-3xl border border-amber-200 bg-[#FBF3E4] p-10 md:grid-cols-2"><div><h2 className="text-2xl font-extrabold text-[#0A2540]">Become a partner agency</h2><p className="mt-2 text-xs text-neutral-500">White-label our platform for your clients.</p></div><button className="rounded-full bg-[#0A2540] py-3.5 text-xs font-semibold text-white">Apply as Partner</button></div></S>);
}

/* 36 – pillars */
export function I36ContentPillars() {
  return (<S bg="bg-[#F7F2E7]"><Cap>CONTENT</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Our Content Pillars</h2><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">{['Career stories', 'Hiring playbooks', 'Salary intel', 'Culture takes', 'Product updates', 'Customer wins'].map((t, i) => (<R key={t} d={i * 0.05}><div className="rounded-2xl border-l-4 border-[#1A7FE8] bg-white p-5 text-sm font-bold text-[#0A2540]">{t}</div></R>))}</div></S>);
}

/* 37 – testimonial quotes */
export function I37TestimonialsBand() {
  const q = [['"Best shortlist quality we have seen."', 'CTO, FinTech'], ['"Hired 3 engineers in 2 weeks."', 'Founder, SaaS'], ['"Their recruiters feel like our team."', 'HR Head, GCC Opex']];
  return (<S><div className="grid gap-5 md:grid-cols-3">{q.map(([a, b], i) => (<R key={b} d={i * 0.08}><figure className="rounded-2xl bg-neutral-50 p-6"><blockquote className="text-sm font-semibold text-[#0A2540]">{a}</blockquote><figcaption className="mt-4 text-[10px] text-neutral-400">— {b}</figcaption></figure></R>))}</div></S>);
}

/* 38 – faq */
export function I38FAQBand() {
  return (<S bg="bg-[#FDFBF6]"><Cap>FAQ</Cap><h2 className="mt-2 text-3xl font-extrabold text-[#0A2540]">Quick Answers</h2><div className="mx-auto mt-8 max-w-2xl space-y-2">{['Is posting a job free?', 'How do payouts work?', 'Can I pause my mandate?'].map((x) => (<details key={x} className="rounded-xl bg-white p-4 text-xs font-semibold text-[#0A2540] ring-1 ring-neutral-100"><summary className="cursor-pointer">{x}</summary><p className="mt-2 font-normal text-neutral-500">Yes — see our help center for full details.</p></details>))}</div></S>);
}
