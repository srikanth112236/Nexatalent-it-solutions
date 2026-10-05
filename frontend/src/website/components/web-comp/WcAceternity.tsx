import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

const R = ({ children, d = 0 }: { children: ReactNode; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay: d }}>{children}</motion.div>
);
const S = ({ children, bg = 'bg-white', id }: { children: ReactNode; bg?: string; id?: string }) => (
  <section id={id} className={`${bg} relative overflow-hidden px-6 py-20 lg:px-16`}><div className="relative mx-auto max-w-6xl">{children}</div></section>
);
const Cap = ({ children, dark }: { children: ReactNode; dark?: boolean }) => <p className={`text-[10px] font-bold tracking-[0.35em] ${dark ? 'text-blue-300' : 'text-[#1A7FE8]'}`}>{children}</p>;
const T = ({ children, dark }: { children: ReactNode; dark?: boolean }) => <h2 className={`mt-3 text-3xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-[#0A2540]'}`}>{children}</h2>;
const P = ({ children, dark }: { children: ReactNode; dark?: boolean }) => <p className={`mt-4 max-w-xl text-xs leading-relaxed ${dark ? 'text-blue-100/70' : 'text-neutral-500'}`}>{children}</p>;

export function A1Spotlight() {
  return (<S bg="bg-[#0A2540]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1A7FE8_0%,transparent_55%)] opacity-40" /><div className="text-center"><Cap dark>NEXATALENT IT SOLUTIONS</Cap><T dark>Hire Top 1% Talent, On Demand</T><P dark>A curated platform for recruiters, candidates and agencies — built for speed, clarity and results.</P><button className="mt-10 rounded-full bg-white px-8 py-3.5 text-xs font-bold text-[#0A2540]">Get Started</button></div></S>);
}

export function A2GridBg() {
  return (<S bg="bg-[#FDFBF6]"><div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" /><div className="text-center"><Cap>PLATFORM</Cap><T>Everything Your Pipeline Needs</T><P >Sourcing, screening, scheduling and offers — in one clean workspace.</P></div></S>);
}

export function A3Bento() {
  return (<S><Cap>BENTO</Cap><T>Designed for Every Hiring Role</T>
    <div className="mt-12 grid auto-rows-[150px] grid-cols-3 gap-4">
      {['Recruiters — live candidate radar', 'Employers — role intelligence', 'Candidates — match score', 'Agencies — client dashboards', 'Analytics — hiring funnel', 'AI — smart shortlists'].map((t, i) => (
        <R key={t} d={i * 0.04}><div className={`flex h-full items-end rounded-3xl p-6 ${i % 3 === 0 ? 'col-span-2 bg-[#0A2540] text-white' : 'bg-neutral-50 text-[#0A2540] ring-1 ring-neutral-100'}`}><p className="text-sm font-bold">{t}</p></div></R>
      ))}
    </div></S>);
}

export function A4TracingBeam() {
  const steps = [['Brief', 'Capture role requirements in 5 minutes.'], ['Match', 'AI surfaces the best-fit profiles.'], ['Vet', 'Structured interviews & checks.'], ['Place', 'Offer, onboard, and track success.']];
  return (<S bg="bg-[#F7F2E7]"><Cap>PROCESS</Cap><T>A Beam of Clarity</T>
    <div className="relative mt-12 ml-4 space-y-10 border-l-2 border-blue-200 pl-10">
      {steps.map(([t, b], i) => (<R key={t} d={i * 0.08}><span className="absolute -left-[9px] h-4 w-4 rounded-full bg-[#1A7FE8]" /><h3 className="font-bold text-[#0A2540]">{t}</h3><p className="mt-1 text-xs text-neutral-500">{b}</p></R>))}
    </div></S>);
}

export function A5InfiniteCards() {
  const cards = ['Great candidates', 'Fast shortlists', 'Strong retention', 'Fair pricing', 'Clean UI', 'Real support'];
  return (<S><Cap>MARQUEE</Cap><T>What Clients Say, On Repeat</T>
    <div className="mt-12 flex gap-4 overflow-hidden">{cards.concat(cards).map((c, i) => <span key={i} className="shrink-0 rounded-2xl bg-neutral-50 px-8 py-5 text-sm font-semibold text-[#0A2540] ring-1 ring-neutral-100">{c}</span>)}</div></S>);
}

export function A6AnimatedCounters() {
  const stats = [['4,200+', 'Placements'], ['98%', 'Retention'], ['38', 'Countries'], ['72h', 'Shortlist']];
  return (<S bg="bg-[#0A2540]"><div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">{stats.map(([n, l], i) => (<R key={l} d={i * 0.08}><p className="text-4xl font-extrabold text-white">{n}</p><p className="mt-2 text-[10px] tracking-widest text-blue-200/70">{l}</p></R>))}</div></S>);
}

export function A7Tabs() {
  const [tab, setTab] = useState(0);
  const tabs = ['Recruiters', 'Employers', 'Candidates'];
  const body = ['Source, screen, and manage your full pipeline in one view.', 'Post roles, review AI shortlists, and hire with confidence.', 'Get matched, apply in minutes, and grow your career.'];
  return (<S><Cap>ROLES</Cap><T>Built for Everyone</T>
    <div className="mt-10 flex gap-2">{tabs.map((t, i) => <button key={t} onClick={() => setTab(i)} className={`rounded-full px-6 py-2.5 text-xs font-semibold ${tab === i ? 'bg-[#0A2540] text-white' : 'bg-neutral-100 text-neutral-500'}`}>{t}</button>)}</div>
    <R key={tab}><p className="mt-8 max-w-xl text-sm text-neutral-600">{body[tab]}</p></R></S>);
}

export function A8Lamp() {
  return (<S bg="bg-[#0A2540]"><div className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-blue-400 to-transparent" /><div className="mt-10 text-center"><T dark>Illuminate Your Hiring</T><P dark>See the whole pipeline, lit up — from first touch to signed offer.</P></div></S>);
}

export function A9Aurora() {
  return (<S bg="bg-[#FDFBF6]"><div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" /><div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" /><div className="text-center"><Cap>AURORA</Cap><T>A Softer Way to Hire</T><P >Calm, modern, and focused — a pipeline experience that feels effortless.</P></div></S>);
}

export function A10Compare() {
  return (<S><Cap>COMPARE</Cap><T>Before vs After NexaTalent IT Solutions</T>
    <div className="mt-12 grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl bg-neutral-100 p-10"><h3 className="font-bold text-neutral-500">Before NexaTalent IT Solutions</h3><ul className="mt-4 space-y-2 text-xs text-neutral-400"><li>✗ Weeks of manual sourcing</li><li>✗ Unvetted resumes pile up</li><li>✗ No visibility into pipeline</li></ul></div>
      <div className="rounded-3xl bg-[#0A2540] p-10 text-white"><h3 className="font-bold">After NexaTalent IT Solutions</h3><ul className="mt-4 space-y-2 text-xs text-blue-100/80"><li>✓ Vetted shortlist in 72h</li><li>✓ One clean candidate flow</li><li>✓ Live funnel analytics</li></ul></div>
    </div></S>);
}

export function A11FloatingDock() {
  const items = ['Home', 'Jobs', 'Talent', 'Insights', 'Pricing', 'Contact'];
  return (<S bg="bg-[#F7F2E7]"><div className="flex justify-center"><div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1.5 shadow-lg">{items.map((t) => <span key={t} className="rounded-full px-4 py-2 text-[11px] font-semibold text-neutral-600 hover:bg-neutral-100">{t}</span>)}</div></div></S>);
}

export function A12Typewriter() {
  return (<S><Cap>SIGNAL</Cap><h2 className="mt-4 text-4xl font-extrabold text-[#0A2540]">Hire <span className="text-[#1A7FE8]">faster_</span></h2><p className="mt-4 text-xs text-neutral-500">One pipeline. Every role. Zero chaos.</p></S>);
}

export function A13TextGenerate() {
  return (<S bg="bg-[#0A2540]"><div className="max-w-3xl text-2xl font-extrabold text-white">NexaTalent IT Solutions turns hiring into a repeatable, measurable process — so every role closes faster, with better people, every time.</div></S>);
}

export function A14BorderBeam() {
  return (<S><R><div className="relative rounded-3xl border border-blue-100 bg-white p-10 shadow-xl"><span className="text-[10px] font-bold tracking-widest text-[#1A7FE8]">FEATURED</span><h3 className="mt-3 text-xl font-extrabold text-[#0A2540]">AI Match Engine</h3><p className="mt-3 text-xs text-neutral-500">Profiles ranked by skills, culture fit and availability — updated live.</p></div></R></S>);
}

export function A15Meteors() {
  return (<S bg="bg-[#0A2540]"><div className="text-center"><T dark>Shoot for the best hires</T><P dark>Fresh, vetted profiles land in your pipeline every day.</P></div></S>);
}

export function A16CardHover() {
  const cards = [['⚡', 'Fast Shortlists'], ['🎯', 'Accurate Matching'], ['🔒', 'Secure Data'], ['📊', 'Clear Analytics']];
  return (<S><Cap>STRENGTHS</Cap><T>Why Teams Trust Us</T><div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">{cards.map(([e, t], i) => (<R key={t} d={i * 0.06}><div className="group rounded-3xl bg-neutral-50 p-8 transition hover:-translate-y-2 hover:bg-[#0A2540]"><span className="text-3xl">{e}</span><h3 className="mt-12 font-bold text-[#0A2540] group-hover:text-white">{t}</h3></div></R>))}</div></S>);
}

export function A17Expandable() {
  const items = ['Source', 'Screen', 'Interview', 'Offer', 'Onboard'];
  return (<S bg="bg-[#F7F2E7]"><Cap>STAGES</Cap><T>Hover to Expand</T><div className="mt-12 flex gap-3">{items.map((t, i) => (<R key={t} d={i * 0.05}><div className="w-16 rounded-2xl bg-white p-4 text-xs font-bold text-[#0A2540] ring-1 ring-neutral-100 transition-all hover:w-40">{t}</div></R>))}</div></S>);
}

export function A18StepsGlow() {
  return (<S><Cap>HOW IT WORKS</Cap><T>Three Steps to Hire</T><div className="mt-12 grid gap-4 md:grid-cols-3">{['Share Brief', 'Review Shortlist', 'Hire & Onboard'].map((t, i) => (<R key={t} d={i * 0.08}><div className="rounded-3xl border border-neutral-100 p-8"><p className="text-4xl font-extrabold text-blue-100">0{i + 1}</p><h3 className="mt-4 font-bold text-[#0A2540]">{t}</h3></div></R>))}</div></S>);
}

export function A19PricingGlow() {
  return (<S bg="bg-[#0A2540]"><div className="text-center"><T dark>Simple Pricing</T><P dark>Start free, scale as you hire. No hidden fees.</P></div><div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">{['Free', 'Pro', 'Enterprise'].map((t, i) => (<R key={t} d={i * 0.08}><div className={`rounded-3xl p-8 text-white ${i === 1 ? 'bg-[#1A7FE8]' : 'bg-white/5 ring-1 ring-white/10'}`}><h3 className="font-bold">{t}</h3><p className="mt-3 text-xs opacity-70">{i === 0 ? 'Post roles, review applicants' : i === 1 ? 'Vetted weekly shortlists' : 'Dedicated RPO pod'}</p></div></R>))}</div></S>);
}

export function A20LogoGrid() {
  return (<S><Cap>CLIENTS</Cap><T>Trusted Across Industries</T><div className="mt-12 grid grid-cols-3 gap-4 text-center text-sm font-bold text-neutral-300 md:grid-cols-6">{['Finova', 'Cloudly', 'Mediq', 'EduSpark', 'LogiX', 'CyberPeak'].map((l) => <div key={l} className="rounded-2xl bg-neutral-50 py-6">{l}</div>)}</div></S>);
}

export function A21FeatureGrid() {
  const f = [['⚡', 'Real-time pipeline'], ['🧠', 'AI shortlisting'], ['📅', 'Smart scheduling'], ['📝', 'Offer builder'], ['📊', 'Funnel reports'], ['🤝', 'Agency tools']];
  return (<S bg="bg-[#FDFBF6]"><Cap>FEATURES</Cap><T>Everything in One Place</T><div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">{f.map(([e, t], i) => (<R key={t} d={i * 0.05}><div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100/60 text-xl">{e}</span><p className="text-sm font-bold text-[#0A2540]">{t}</p></div></R>))}</div></S>);
}

export function A22FAQModern() {
  return (<S><Cap>FAQ</Cap><T>Frequently Asked</T><div className="mt-10 space-y-3">{['How fast is the first shortlist?', 'Can I cancel anytime?', 'Do you offer bulk hiring?'].map((q) => (<details key={q} className="rounded-2xl border border-neutral-100 p-5"><summary className="cursor-pointer text-sm font-bold text-[#0A2540]">{q}</summary><p className="mt-3 text-xs text-neutral-500">Great question — reach out and we'll walk you through it.</p></details>))}</div></S>);
}

export function A23Testimonial() {
  return (<S bg="bg-[#F7F2E7]"><figure className="mx-auto max-w-3xl text-center"><blockquote className="text-2xl font-semibold text-[#0A2540]">"The most modern hiring experience our team has ever used."</blockquote><figcaption className="mt-6 text-xs text-neutral-500">— Head of People, ScaleUp Co.</figcaption></figure></S>);
}

export function A24Globe() {
  return (<S><Cap>GLOBAL</Cap><T>Talent Without Borders</T><div className="mt-10 grid h-56 place-items-center rounded-full border border-blue-100 bg-[radial-gradient(circle,#EAF2FE,transparent)] text-6xl">🌐</div></S>);
}

export function A25CTAShimmer() {
  return (<S bg="bg-[#0A2540]"><div className="text-center"><T dark>Ready to hire smarter?</T><P dark>Join 140+ employers hiring through NexaTalent IT Solutions.</P><button className="mt-10 rounded-full bg-[#1A7FE8] px-10 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/30">Create Free Account</button></div></S>);
}

export function A26FooterTeaser() {
  return (<S bg="bg-[#FDFBF6]"><div className="text-center"><Cap>NEXT STEP</Cap><T>Let's build your hiring engine</T><div className="mt-8 flex justify-center gap-3"><button className="rounded-full bg-[#0A2540] px-8 py-3 text-xs font-bold text-white">Book a Demo</button><button className="rounded-full border border-neutral-200 px-8 py-3 text-xs font-bold text-[#0A2540]">Contact Sales</button></div></div></S>);
}

export function A27GradientText() {
  return (<S><Cap>WHY NEXATALENT IT SOLUTIONS</Cap><h2 className="mt-4 text-4xl font-extrabold"><span className="bg-gradient-to-r from-[#0A2540] via-[#1A7FE8] to-blue-300 bg-clip-text text-transparent">Smarter hiring, every single day.</span></h2></S>);
}

export function A28TwoCol() {
  return (<S bg="bg-[#FDFBF6]"><div className="grid items-center gap-10 md:grid-cols-2"><R><Cap>FOR AGENCIES</Cap><h2 className="mt-3 text-3xl font-extrabold text-[#0A2540]">White-Label Ready</h2><p className="mt-4 text-xs text-neutral-500">Run your clients on our platform with your branding, your SLAs, your rates.</p></R><div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-neutral-100"><ul className="space-y-3 text-xs text-neutral-600"><li>✓ Custom domain</li><li>✓ Client-branded portals</li><li>✓ Margin control</li><li>✓ API access</li></ul></div></div></S>);
}

export function A29SplitStats() {
  return (<S><div className="grid items-center gap-10 md:grid-cols-2"><R><Cap>IMPACT</Cap><h2 className="mt-3 text-3xl font-extrabold text-[#0A2540]">Numbers That Speak</h2></R><div className="grid grid-cols-2 gap-4">{[['11 days', 'Avg. time to hire'], ['82%', 'Offer acceptance'], ['4.8/5', 'Candidate NPS'], ['60%', 'Faster than in-house']].map(([n, l], i) => (<R key={l} d={i * 0.06}><div className="rounded-2xl bg-neutral-50 p-6"><p className="text-2xl font-extrabold text-[#1A7FE8]">{n}</p><p className="mt-1 text-[10px] tracking-widest text-neutral-500">{l}</p></div></R>))}</div></div></S>);
}

export function A30DarkList() {
  return (<S bg="bg-[#0A2540]"><div className="grid items-center gap-10 md:grid-cols-2"><h2 className="text-3xl font-extrabold text-white">Everything you need, nothing you don't.</h2><ul className="divide-y divide-white/10 text-sm text-blue-100/80">{['No-bloat dashboards', 'Transparent pricing', 'Human support', 'Fast onboarding', 'Scalable SLAs'].map((t) => <li key={t} className="py-4">✓ {t}</li>)}</ul></div></S>);
}
