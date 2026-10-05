import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const R = ({ children, d = 0 }: { children: ReactNode; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: d }}>{children}</motion.div>
);

const S = ({ children, bg = 'bg-white', id }: { children: ReactNode; bg?: string; id?: string }) => (
  <section id={id} className={`${bg} px-6 py-16 lg:px-16`}><div className="mx-auto max-w-6xl">{children}</div></section>
);

const H2 = ({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) => (
  <div className="mb-10 text-center">
    {kicker && <p className="text-[10px] font-bold tracking-[0.3em] text-[#1A7FE8]">{kicker}</p>}
    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A2540]">{title}</h2>
    {sub && <p className="mx-auto mt-3 max-w-xl text-xs text-neutral-500">{sub}</p>}
  </div>
);

export function P1MetricsHero() {
  return (
    <S bg="bg-[#FDFBF6]">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <R><h1 className="text-4xl font-extrabold leading-tight text-[#0A2540]">Recruitment that<br />moves at the speed<br />of your business.</h1></R>
          <R d={0.1}><p className="mt-5 max-w-md text-sm text-neutral-500">NexaTalent IT Solutions places verified talent across GCC and India with a 98% day-90 retention rate.</p></R>
          <R d={0.2}><button className="mt-8 rounded-full bg-[#1A7FE8] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30">Talk to an Expert</button></R>
        </div>
        <R d={0.2}><div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-neutral-100">
          {['Time-to-hire cut by 60%', '4,200+ successful placements', '38 countries served', '24/7 candidate support'].map((t) => (
            <p key={t} className="mb-3 flex items-center gap-3 text-sm text-[#0A2540]"><span className="rounded-full bg-blue-50 p-1 text-[#1A7FE8]">✓</span>{t}</p>
          ))}
        </div></R>
      </div>
    </S>
  );
}

export function P2EngagementModels() {
  const models = [
    ['Permanent Recruitment', 'Direct tech sourcing & lateral engineering talent across senior levels'],
    ['Contract Staffing', 'Elastic developer squads & agile augmentation for project delivery'],
    ['GCC Turnkey Pods', 'Turnkey India offshore engineering center setup, BOT & scaling'],
    ['Executive Search', 'Confidential CTO, VP Engineering & Board tech leadership search'],
    ['Recruitment Process Support (RPO)', 'Embedded talent acquisition teams managing end-to-end pipelines'],
    ['Volume Hiring Drives', 'Accelerated batch hiring sprints for 50+ engineering roles'],
  ];
  return (
    <S>
      <H2 kicker="ENTERPRISE ENGAGEMENT MODELS" title="Engagement Models" sub="Choose the engagement that matches your growth stage." />
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        {models.map(([t, b], i) => (
          <R key={t} d={i * 0.05}><div className="flex gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1A7FE8]">◆</div>
            <div><h3 className="font-bold text-[#0A2540]">{t}</h3><p className="mt-1 text-xs text-neutral-500">{b}</p></div>
          </div></R>
        ))}
      </div>
    </S>
  );
}

export function P3StatsBand() {
  const stats = [['4,200+', 'Placements'], ['98%', 'Retention Day-90'], ['38', 'Countries'], ['72h', 'Avg. First Shortlist'], ['1,800+', 'Vetted Engineers'], ['$12M+', 'Salaries Negotiated']];
  return (
    <S bg="bg-[#0A2540]">
      <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-6">
        {stats.map(([n, l], i) => (
          <R key={l} d={i * 0.05}><p className="text-2xl font-extrabold text-white">{n}</p><p className="mt-1 text-[10px] tracking-widest text-blue-200/70">{l}</p></R>
        ))}
      </div>
    </S>
  );
}

export function P4ServicesBento() {
  const cards = [['bg-[#EAF2FE]', 'Sourcing', 'Multi-channel talent discovery', 'md:col-span-2 md:row-span-2'], ['bg-white', 'Screening', 'Technical vetting at scale', ''], ['bg-white', 'Interviewing', 'Structured loops & scorecards', ''], ['bg-[#FBF3E4]', 'Offer Management', 'Compensation benchmarking', ''], ['bg-[#EAF2FE]', 'Onboarding', 'Day-zero readiness', '']];
  return (
    <S>
      <H2 kicker="WHAT WE DO" title="Full-Cycle Recruitment Services" />
      <div className="grid auto-rows-[140px] gap-4 md:grid-cols-4">
        {cards.map(([bg, t, b, c]) => (
          <R key={t}><div className={`flex h-full flex-col justify-end rounded-2xl p-6 ${c} ${bg} ring-1 ring-neutral-100`}><h3 className="font-bold text-[#0A2540]">{t}</h3><p className="text-xs text-neutral-500">{b}</p></div></R>
        ))}
      </div>
    </S>
  );
}

export function P5Industries() {
  const ind = ['FinTech', 'HealthTech', 'SaaS', 'E-Commerce', 'Logistics', 'EdTech', 'AI/ML', 'Cybersecurity'];
  return (
    <S bg="bg-[#FDFBF6]">
      <H2 kicker="INDUSTRIES" title="Specialized Vertical Hiring" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {ind.map((t, i) => (
          <R key={t} d={i * 0.03}><div className="rounded-2xl bg-white p-6 text-center text-sm font-semibold text-[#0A2540] ring-1 ring-neutral-100 transition hover:-translate-y-1 hover:shadow-lg">{t}</div></R>
        ))}
      </div>
    </S>
  );
}

export function P6ProcessStrip() {
  const steps = ['Intake Brief', 'Market Mapping', 'Shortlisting', 'Interviews', 'Offer & Close', '90-Day Care'];
  return (
    <S>
      <H2 kicker="OUR PROCESS" title="From Brief to Onboard in 6 Steps" />
      <div className="flex flex-wrap justify-center gap-3">
        {steps.map((s, i) => (
          <R key={s} d={i * 0.05}><div className="flex items-center gap-3 rounded-full border border-neutral-100 bg-neutral-50 px-5 py-3 text-xs font-semibold"><span className="rounded-full bg-[#1A7FE8] px-2 py-0.5 text-white">{i + 1}</span>{s}</div></R>
        ))}
      </div>
    </S>
  );
}

export function P7BigQuote() {
  return (
    <S bg="bg-[#F7F2E7]">
      <R><p className="mx-auto max-w-3xl text-center text-2xl font-semibold leading-relaxed text-[#0A2540]">“NexaTalent IT Solutions cut our hiring cycle from 6 weeks to 11 days. Their shortlists arrive pre-vetted, which means my team only interviews closers.”</p></R>
      <R d={0.1}><p className="mt-6 text-center text-xs text-neutral-500">— VP Engineering, Series-C FinTech, Dubai</p></R>
    </S>
  );
}

export function P8CaseStudies() {
  const cs = [['SaaS Scale-Up', 'Hired 14 engineers in 6 weeks', '3x pipeline velocity'], ['GCC Expansion', 'Stood up a 30-seat center', '0 attrition in year one'], ['FinTech Compliance', 'Filled 9 regulated roles', '100% cleared audit']];
  return (
    <S>
      <H2 kicker="CASE STUDIES" title="Results Our Clients Talk About" />
      <div className="grid gap-5 md:grid-cols-3">
        {cs.map(([t, a, b], i) => (
          <R key={t} d={i * 0.08}><div className="rounded-3xl bg-[#F2F4F8] p-8"><h3 className="font-bold text-[#0A2540]">{t}</h3><p className="mt-4 text-xl font-extrabold text-[#1A7FE8]">{a}</p><p className="mt-2 text-xs text-neutral-500">{b}</p></div></R>
        ))}
      </div>
    </S>
  );
}

export function P9Locations() {
  const locs = [['Dubai', 'HQ — UAE operations'], ['Bangalore', 'Engineering pods'], ['Riyadh', 'KSA expansion desk'], ['London', 'EMEA clients'], ['Singapore', 'APAC hub']];
  return (
    <S bg="bg-[#FDFBF6]">
      <H2 kicker="GLOBAL FOOTPRINT" title="Where We Operate" />
      <div className="grid gap-4 md:grid-cols-5">
        {locs.map(([t, b], i) => (
          <R key={t} d={i * 0.05}><div className="rounded-2xl bg-white p-5 text-center ring-1 ring-neutral-100"><p className="font-bold text-[#0A2540]">{t}</p><p className="mt-1 text-[10px] text-neutral-400">{b}</p></div></R>
        ))}
      </div>
    </S>
  );
}

export function P10LogoMarquee() {
  const logos = ['Webflow', 'Dribbble', 'Treehouse', 'Hopin', 'Stripe', 'Notion', 'Vercel', 'Linear'];
  return (
    <S>
      <p className="text-center text-[10px] tracking-widest text-neutral-400">TRUSTED BY TEAMS AT</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-10 text-lg font-bold text-neutral-300">
        {logos.map((l) => <span key={l}>{l}</span>)}
      </div>
    </S>
  );
}

export function P11WhyChoose() {
  const pts = ['Pre-vetted talent pool of 1,800+ engineers', 'Dedicated recruiter per account', 'Transparent pricing, no lock-in', '90-day replacement guarantee'];
  return (
    <S bg="bg-[#F7F2E7]">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <R><h2 className="text-3xl font-extrabold text-[#0A2540]">Why employers choose NexaTalent IT Solutions</h2></R>
        <div className="space-y-4">
          {pts.map((p, i) => (
            <R key={p} d={i * 0.08}><div className="rounded-2xl bg-white p-5 text-sm font-semibold text-[#0A2540] ring-1 ring-neutral-100">✓ {p}</div></R>
          ))}
        </div>
      </div>
    </S>
  );
}

export function P12Pricing() {
  const tiers = [['Starter', '$0', 'Post jobs & review applicants'], ['Growth', '$499/mo', 'Vetted shortlists every week'], ['Enterprise', 'Custom', 'Dedicated RPO pod & SLAs']];
  return (
    <S>
      <H2 kicker="PRICING" title="Plans for Every Hiring Stage" />
      <div className="grid gap-5 md:grid-cols-3">
        {tiers.map(([t, p, b], i) => (
          <R key={t} d={i * 0.08}><div className={`rounded-3xl p-8 ${i === 1 ? 'bg-[#0A2540] text-white' : 'bg-white ring-1 ring-neutral-100'}`}><h3 className="font-bold">{t}</h3><p className="mt-4 text-3xl font-extrabold">{p}</p><p className="mt-3 text-xs opacity-70">{b}</p><button className="mt-8 w-full rounded-full bg-[#1A7FE8] py-2.5 text-xs font-semibold text-white">Choose Plan</button></div></R>
        ))}
      </div>
    </S>
  );
}

export function P13FAQ() {
  const faqs = [['How fast can you shortlist candidates?', '48–72 hours for most tech roles.'], ['Do you handle compliance?', 'Yes — contracts, payroll, and local labour law.'], ['What is the replacement policy?', 'Free replacement within 90 days.']];
  return (
    <S bg="bg-[#FDFBF6]">
      <H2 kicker="FAQ" title="Questions, Answered" />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <R key={q} d={i * 0.08}><details className="rounded-2xl bg-white p-5 ring-1 ring-neutral-100"><summary className="cursor-pointer text-sm font-bold text-[#0A2540]">{q}</summary><p className="mt-3 text-xs text-neutral-500">{a}</p></details></R>
        ))}
      </div>
    </S>
  );
}

export function P14TalentCloud() {
  const pools = ['Full-Stack Engineers', 'Data Scientists', 'Product Designers', 'DevOps & SRE', 'QA Automation', 'Engineering Managers'];
  return (
    <S>
      <H2 kicker="TALENT CLOUD" title="On-Demand Talent Pools" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {pools.map((p, i) => (
          <R key={p} d={i * 0.05}><div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-sm font-semibold text-[#1A5FB4]">{p}</div></R>
        ))}
      </div>
    </S>
  );
}

export function P15Onboarding() {
  const steps = [['01', 'Discovery', 'We learn your team, stack, and bar.'], ['02', 'Mapping', 'We map the market and shortlist.'], ['03', 'Interviews', 'Structured loops with your team.'], ['04', 'Offer', 'Negotiation, paperwork, onboarding.']];
  return (
    <S bg="bg-[#F7F2E7]">
      <H2 kicker="HOW IT WORKS" title="Your Hiring Journey" />
      <div className="grid gap-5 md:grid-cols-4">
        {steps.map(([n, t, b], i) => (
          <R key={n} d={i * 0.08}><div><p className="text-4xl font-extrabold text-[#1A7FE8]">{n}</p><h3 className="mt-3 font-bold text-[#0A2540]">{t}</h3><p className="mt-1 text-xs text-neutral-500">{b}</p></div></R>
        ))}
      </div>
    </S>
  );
}

export function P16Compliance() {
  const items = ['SOC 2 aligned', 'GDPR compliant', 'Background verified', 'NDA on every mandate', 'Local payroll experts', 'IP protection clauses'];
  return (
    <S>
      <H2 kicker="TRUST & SAFETY" title="Compliance Built In" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((t, i) => (
          <R key={t} d={i * 0.05}><div className="rounded-xl bg-[#F2F4F8] p-4 text-center text-xs font-semibold text-[#0A2540]">{t}</div></R>
        ))}
      </div>
    </S>
  );
}

export function P17Comparison() {
  const rows = [['Speed of shortlist', '48–72h', '2–4 weeks'], ['Vetted candidates', 'Yes', 'Sometimes'], ['Replacement guarantee', '90 days', 'None'], ['Dedicated recruiter', 'Yes', 'Shared pool']];
  return (
    <S bg="bg-[#FDFBF6]">
      <H2 kicker="VS TRADITIONAL" title="NexaTalent IT Solutions vs In-House Hiring" />
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl ring-1 ring-neutral-100">
        <div className="grid grid-cols-3 bg-[#0A2540] p-4 text-xs font-bold text-white"><span></span><span>NexaTalent IT Solutions</span><span>In-House</span></div>
        {rows.map(([a, b, c]) => (
          <div key={a} className="grid grid-cols-3 border-t border-neutral-100 p-4 text-xs"><span className="font-semibold">{a}</span><span className="text-[#1A7FE8]">{b}</span><span className="text-neutral-400">{c}</span></div>
        ))}
      </div>
    </S>
  );
}

export function P18CTA() {
  return (
    <S>
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#0A2540] to-[#1A7FE8] p-16 text-center text-white">
        <h2 className="text-3xl font-extrabold">Ready to build your dream team?</h2>
        <p className="mx-auto mt-3 max-w-md text-xs text-blue-100/80">Tell us the role — get a vetted shortlist in 72 hours.</p>
        <button className="mt-8 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#0A2540]">Start Hiring</button>
      </div>
    </S>
  );
}

export function P19Blog() {
  const posts = [['How AI is reshaping GCC hiring', 'Insights · 5 min'], ['2026 Salary Guide', 'Report · PDF'], ['Building remote-first in India', 'Playbook']];
  return (
    <S bg="bg-[#F7F2E7]">
      <H2 kicker="INSIGHTS" title="From Our Hiring Desk" />
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map(([t, m], i) => (
          <R key={t} d={i * 0.08}><div className="rounded-3xl bg-white p-8"><div className="h-24 rounded-xl bg-blue-50" /><h3 className="mt-5 font-bold text-[#0A2540]">{t}</h3><p className="mt-2 text-[10px] text-neutral-400">{m}</p></div></R>
        ))}
      </div>
    </S>
  );
}

export function P20Partners() {
  const partners = ['AWS Partner', 'Google Cloud', 'Microsoft', 'HubSpot', 'Salesforce', 'Zoho'];
  return (
    <S>
      <H2 kicker="ECOSYSTEM" title="Our Technology Partners" />
      <div className="flex flex-wrap justify-center gap-4">
        {partners.map((p, i) => (
          <R key={p} d={i * 0.05}><span className="rounded-full border border-neutral-200 px-6 py-3 text-xs font-semibold text-neutral-600">{p}</span></R>
        ))}
      </div>
    </S>
  );
}

export function P21Team() {
  const team = [['Aisha K.', 'Head of Talent'], ['Ravi M.', 'GCC Delivery Lead'], ['Sara L.', 'Executive Search'], ['Omar H.', 'Client Success']];
  return (
    <S bg="bg-[#FDFBF6]">
      <H2 kicker="TEAM" title="The People Behind Your Pipeline" />
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {team.map(([n, r], i) => (
          <R key={n} d={i * 0.08}><div className="text-center"><div className="mx-auto h-24 w-24 rounded-full bg-neutral-200" /><p className="mt-4 font-bold text-[#0A2540]">{n}</p><p className="text-[10px] text-neutral-400">{r}</p></div></R>
        ))}
      </div>
    </S>
  );
}

export function P22Awards() {
  const awards = ['Top RPO Partner 2025', 'Best GCC Enabler 2024', 'Clutch Champion', 'HR Tech Innovator'];
  return (
    <S>
      <H2 kicker="RECOGNITION" title="Awards & Accolades" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {awards.map((a, i) => (
          <R key={a} d={i * 0.05}><div className="rounded-2xl bg-[#0A2540] p-6 text-center text-xs font-bold text-white">🏆 {a}</div></R>
        ))}
      </div>
    </S>
  );
}

export function P23Video() {
  return (
    <S bg="bg-[#F7F2E7]">
      <H2 kicker="WATCH" title="Inside NexaTalent IT Solutions" />
      <R><div className="relative mx-auto h-80 max-w-4xl rounded-[2rem] bg-[#0A2540]">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-6 text-white">▶</span>
      </div></R>
    </S>
  );
}

export function P24GlobalMap() {
  return (
    <S>
      <H2 kicker="REACH" title="Hiring Without Borders" sub="Talent networks across 38 countries and 12 languages." />
      <R><div className="grid h-72 place-items-center rounded-[2rem] bg-[radial-gradient(ellipse_at_center,#EAF2FE,transparent)] text-6xl">🌍</div></R>
    </S>
  );
}

export function P25IntakeForm() {
  return (
    <S bg="bg-[#FDFBF6]">
      <H2 kicker="GET STARTED" title="Tell Us About Your Hiring Need" />
      <R><form className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {['Full Name', 'Work Email', 'Company', 'Role to Hire'].map((p) => (
          <input key={p} placeholder={p} className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm outline-none focus:border-[#1A7FE8]" />
        ))}
        <textarea placeholder="Tell us more..." className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm md:col-span-2" rows={4} />
        <button className="rounded-full bg-[#1A7FE8] py-3.5 text-sm font-semibold text-white md:col-span-2">Submit Request</button>
      </form></R>
    </S>
  );
}

export function P26SLA() {
  const slas = [['First shortlist', '≤ 72 hours'], ['Interview loop', '≤ 5 days'], ['Offer turnaround', '≤ 24 hours'], ['Joining coordination', 'Dedicated desk']];
  return (
    <S>
      <H2 kicker="SERVICE LEVELS" title="Our SLAs, In Writing" />
      <div className="grid gap-4 md:grid-cols-4">
        {slas.map(([t, v], i) => (
          <R key={t} d={i * 0.08}><div className="rounded-2xl bg-blue-50/60 p-6 text-center"><p className="text-xl font-extrabold text-[#1A7FE8]">{v}</p><p className="mt-2 text-[10px] tracking-widest text-neutral-500">{t}</p></div></R>
        ))}
      </div>
    </S>
  );
}

export function P27TechStack() {
  const stack = ['React', 'Node.js', 'Python', 'AWS', 'Figma', 'PostgreSQL', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL'];
  return (
    <S bg="bg-[#F7F2E7]">
      <H2 kicker="HARD SKILLS" title="Tech We Recruit For" />
      <div className="flex flex-wrap justify-center gap-3">
        {stack.map((s, i) => (
          <R key={s} d={i * 0.03}><span className="rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#0A2540] shadow-sm">{s}</span></R>
        ))}
      </div>
    </S>
  );
}

export function P28Dashboard() {
  return (
    <S>
      <H2 kicker="PORTAL" title="Your Hiring, Visualized" />
      <R><div className="rounded-[2rem] bg-[#F2F4F8] p-8">
        <div className="grid gap-4 md:grid-cols-4">
          {['Open Roles: 12', 'In Pipeline: 148', 'Interviews: 23', 'Offers: 5'].map((t) => <div key={t} className="rounded-xl bg-white p-5 text-sm font-bold text-[#0A2540]">{t}</div>)}
        </div>
        <div className="mt-4 h-40 rounded-xl bg-white p-5"><div className="flex h-full items-end gap-2">{[40, 65, 50, 80, 55, 90, 70].map((h, i) => <div key={i} style={{ height: `${h}%` }} className="flex-1 rounded-t bg-[#1A7FE8]/70" />)}</div></div>
      </div></R>
    </S>
  );
}

export function P29CompareCTA() {
  return (
    <S bg="bg-[#FDFBF6]">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <R><h2 className="text-3xl font-extrabold text-[#0A2540]">Start hiring with a partner, not a resume pile.</h2><p className="mt-4 text-xs text-neutral-500">Dedicated recruiters, vetted pools, and 90-day guarantees — from day one.</p></R>
        <R d={0.1}><div className="flex gap-4"><button className="flex-1 rounded-full bg-[#0A2540] py-4 text-sm font-semibold text-white">Employer Sign Up</button><button className="flex-1 rounded-full border border-neutral-200 py-4 text-sm font-semibold text-[#0A2540]">Post a Job</button></div></R>
      </div>
    </S>
  );
}
