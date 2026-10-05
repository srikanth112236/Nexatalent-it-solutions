import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useSpring } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, [ref]);
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  return <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-[#1A7FE8]" />;
}

export function WsHowWeWork() {
  const ref = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  useReveal(ref);
  useEffect(() => {
    if (!ref.current || !lineRef.current) return;
    gsap.fromTo(lineRef.current, { height: '0%' }, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top 60%', end: 'bottom 60%', scrub: 1 },
    });
  }, []);
  const steps = [
    { t: 'Discovery & Audit', b: 'We analyze your hiring workflows, bottlenecks, and role requirements.', d: 'right' },
    { t: 'Talent Blueprint', b: 'We design a sourcing architecture aligned with your KPIs.', d: 'left' },
    { t: 'Sourcing & Screening', b: 'Our recruiters source, vet, and assess candidates end to end.', d: 'right' },
    { t: 'Testing & Optimization', b: 'Interview loops, scorecards, and pipeline refinement.', d: 'left' },
    { t: 'Onboarding & Scaling', b: 'Offer rollout, onboarding, and continuous optimization.', d: 'right' },
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p data-reveal className="text-[10px] tracking-widest text-neutral-400">004 • PROCESS</p>
        <h2 className="mt-3 text-4xl font-extrabold text-[#0A2540]">How We Work</h2>
        <p className="mt-3 text-xs text-neutral-500">A proven process designed to transform complex hiring into scalable, AI-powered systems — efficiently and strategically.</p>
      </div>
      <div className="relative mx-auto mt-16 max-w-3xl">
        <div className="absolute bottom-0 left-1/2 top-0 w-px bg-neutral-100" />
        <div ref={lineRef} className="absolute left-1/2 top-0 w-px bg-[#1A7FE8]" style={{ height: 0 }} />
        {steps.map((s, i) => (
          <div key={i} data-reveal className={`relative mb-12 flex items-center ${s.d === 'right' ? '' : 'flex-row-reverse'}`}>
            <div className={`w-1/2 ${s.d === 'right' ? 'pr-12 text-right' : 'pl-12'}`}>
              <p className="text-[9px] tracking-widest text-neutral-400">{`0${i + 1}`}</p>
              <h3 className="mt-1 text-sm font-bold text-[#0A2540]">{s.t}</h3>
              <p className="mt-1 text-[11px] text-neutral-400">{s.b}</p>
            </div>
            <div className="z-10 h-10 w-10 -translate-x-1/2 rounded-xl bg-neutral-50 ring-1 ring-neutral-100 absolute left-1/2" />
            <div className="w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function WsBrandingConcepts() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const chips = ['Employer Branding', 'Recruitment', 'Sourcing AI', 'Candidate Experience', 'Talent Analytics', 'Onboarding'];
  return (
    <section ref={ref} className="bg-[#FBF7F0] px-6 py-20">
      <h2 data-reveal className="mx-auto max-w-4xl text-center text-4xl font-extrabold tracking-tight text-[#0A2540]">
        We create striking<br />concepts and branding<br /><span className="text-neutral-300">that help your business<br />grow fast</span>
      </h2>
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-8 text-[10px] text-neutral-400">
        <p>We combine strategy, design, and data to create hiring brands that attract — great processes to put people first with integrity and precision.</p>
        <p>Our creative process blends innovation with research, breaking the mould with carefully considered ideas, and built on measurable results, not empty aesthetics.</p>
      </div>
      <div className="mt-14 flex gap-4 overflow-x-auto pb-4">
        {chips.map((c, i) => (
          <motion.div key={c} whileHover={{ y: -6 }} className={`min-w-[160px] rounded-2xl p-4 ${i === 1 ? 'bg-[#0A2540] text-white' : 'bg-white text-[#0A2540] ring-1 ring-neutral-100'}`}>
            <span className="rounded-full bg-neutral-100/60 px-3 py-1 text-[10px]">{c.split(' ')[0]}</span>
            <p className="mt-16 text-sm font-semibold">{c}</p>
            {i === 1 && <p className="text-[10px] text-blue-200">Featured</p>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function WsWorkflow() {
  const ref = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  useReveal(ref);
  useEffect(() => {
    if (!ref.current || !lineRef.current) return;
    gsap.fromTo(lineRef.current, { height: '0%' }, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top 55%', end: 'bottom 70%', scrub: 1 },
    });
  }, []);
  const stages = [
    ['JOB BRIEF', 'The role, request or situation that triggers the search.'],
    ['CONTEXT', 'Business context, team structure and constraints.'],
    ['RULES', 'Step-by-step logic, scorecards, priorities and guidelines.'],
    ['EXAMPLES', 'High-quality references that define what good looks like.'],
    ['TOOLS / SCRIPTS', 'Sourcing channels, assessments and automations.'],
    ['OUTPUT STANDARD', 'The expected format, quality bar and definition of done.'],
  ];
  return (
    <section ref={ref} className="bg-[#F7F8FC] px-6 py-20 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10px] tracking-widest text-neutral-400">✦ SKILL AS WORKFLOW</p>
          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-[#0A2540]">A mandate is<br />a packaged<br />way of <span className="text-neutral-400">doing work.</span></h2>
          <p className="mt-6 max-w-xs text-sm text-neutral-500">Mandates turn repeated expertise into a structured workflow that AI and recruiters can apply consistently.</p>
          <p className="mt-24 text-sm font-semibold text-[#0A2540]">Not a prompt.<br /><span className="text-neutral-400">A process.</span></p>
        </div>
        <div className="relative">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-neutral-200" />
          <div ref={lineRef} className="absolute left-6 top-0 w-px bg-[#1A7FE8]" style={{ height: 0 }} />
          {stages.map(([t, b]) => (
            <div key={t} data-reveal className="relative mb-8 ml-16 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
              <h3 className="text-sm font-extrabold tracking-wide text-[#0A2540]">{t}</h3>
              <p className="mt-2 text-xs text-neutral-500">{b}</p>
            </div>
          ))}
          <div data-reveal className="ml-16 rounded-2xl bg-[#0A2540] p-6 text-white">
            <h3 className="text-sm font-extrabold tracking-wide">CONSISTENT EXECUTION</h3>
            <p className="mt-2 text-xs text-blue-100/80">Every search delivers reliable, on-brand results every time the mandate appears.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WsWorkWithUs() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const items = [
    ['Creative Expertise', 'Talent brands tailored to attract, captivate candidates with innovative pipelines.'],
    ['Responsive Delivery', 'Ensuring seamless experiences across all channels, maximizing engagement.'],
    ['SEO Optimization', 'Elevating your employer brand presence with strategies that boost rankings.'],
    ['Custom Solutions', 'Crafting bespoke recruitment journeys that meet your specific needs.'],
    ['Quick Turnaround', 'Meeting hiring deadlines consistently, without compromising quality.'],
    ['Exceptional Support', 'Dedicated assistance during and after project completion, ensuring success.'],
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#0A2540]">When people<br /><span className="text-[#1A7FE8]">do</span> work with us.</h2>
          <button className="rounded-full bg-[#0A2540] px-6 py-3 text-xs font-semibold text-white">✧ Let’s build something</button>
        </div>
        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {items.map(([t, b], i) => (
            <motion.div key={t} whileHover={{ y: -6 }} className={`rounded-2xl p-6 ${i === 0 ? 'bg-white shadow-xl ring-1 ring-neutral-100' : ''}`}>
              <p className="text-lg">{i % 2 ? '⛶' : '✎'}</p>
              <h3 className="mt-4 text-sm font-bold text-[#0A2540]">{t}</h3>
              <p className="mt-2 text-xs text-neutral-500">{b}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WsSeamlessHiring() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const items = [
    ['Real-Time Pipeline', 'Track every candidate with live dashboards, scorecards and status alerts.', false],
    ['Secure & Safe Payments', 'Offer letters, contracts and payroll handoffs handled in a secure flow.', true],
    ['Candidate Support 24/7', 'Dedicated coordinators keep candidates informed at every step.', false],
    ['Quick & Easy Onboarding', 'Document collection, verification and joining formalities in one place.', false],
    ['Worldwide Certified', 'Compliance-ready hiring across regions with local expertise.', false],
    ['Lower Cost', 'Transparent pricing with no hidden fees — pay for results, not seats.', false],
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20 text-center">
      <h2 data-reveal className="text-3xl font-extrabold text-[#0A2540]">Hire Talent Anytime, Anywhere</h2>
      <p data-reveal className="mx-auto mt-3 max-w-lg text-xs text-neutral-500">A user friendly recruitment experience — productized quickly to solve real hiring problems.</p>
      <div className="mx-auto mt-14 grid max-w-5xl gap-8 text-left md:grid-cols-3">
        {items.map(([t, b, hot]) => (
          <div key={t as string} data-reveal className={`rounded-2xl p-7 ${hot ? 'bg-[#5B54F0] text-white shadow-xl shadow-indigo-500/20' : ''}`}>
            <div className={`inline-flex rounded-lg p-2.5 ${hot ? 'bg-white/15 text-white' : 'bg-indigo-50 text-[#5B54F0]'}`}>✦</div>
            <h3 className="mt-5 text-sm font-bold">{t}</h3>
            <p className={`mt-2 text-xs leading-relaxed ${hot ? 'text-white/80' : 'text-neutral-500'}`}>{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WsComprehensiveCare() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const cards = [
    ['Personalized talent mapping for your needs', 'Your first step towards a stronger workforce starts here.', 'bg-[#F4F5F7] text-[#0A2540]'],
    ['Urgent attention for your open roles', 'Quick access to talent when you need it most.', 'bg-[#0A2540] text-white'],
    ['Advanced search for niche expertise', 'Get expert-matched candidates tailored to your needs.', 'bg-[#F4F5F7] text-[#0A2540]'],
  ];
  return (
    <section ref={ref} className="bg-[#BCC9D9] px-6 py-20">
      <div className="mx-auto max-w-5xl bg-white p-10 text-center">
        <span data-reveal className="rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-semibold text-[#1A7FE8]">Hire Health Support</span>
        <h2 data-reveal className="mt-5 text-3xl font-extrabold tracking-tight text-[#0A2540]">Comprehensive<br />hire for every stage of <span className="text-[#1A7FE8]">growth</span></h2>
        <p data-reveal className="mx-auto mt-4 max-w-xl text-xs text-neutral-500">We prioritize your pipeline with services from routine sourcing to specialized executive search. Experience the convenience of comprehensive care in one place.</p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map(([t, b, c]) => (
            <div key={t} data-reveal className={`rounded-2xl p-6 text-left ${c}`}>
              <div className="flex justify-end"><span className="rounded-full bg-[#1A7FE8] p-1.5 text-white">→</span></div>
              <h3 className="mt-16 text-sm font-bold">{t}</h3>
              <p className={`mt-2 text-[11px] ${c.includes('0A2540') ? 'text-blue-100/70' : 'text-neutral-500'}`}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WsWhatWeDo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrapRef.current || !trackRef.current) return;
    const w = trackRef.current.scrollWidth - window.innerWidth;
    gsap.to(trackRef.current, {
      x: () => -w, ease: 'none',
      scrollTrigger: { trigger: wrapRef.current, start: 'top top', end: () => `+=${w}`, scrub: 1, pin: true },
    });
  }, []);
  const cards = [
    ['Building Your Business Your Way', 'A comprehensive suite of tools that helps businesses optimize and grow through a user behavior, and tracking marketing campaigns.'],
    ['Optimize Marketing Efforts', 'Better understand customers, optimize efforts, and manage projects to improved results and growth.'],
    ['Turn Your Ideas Into Apps Visually', 'Install and customize solutions from our extensive collection of templates to meet your requirements.'],
    ['Improve Ops Coherence', 'Design tools to improve output, meet deadlines and delight users.'],
  ];
  return (
    <div ref={wrapRef} className="bg-[#F4F4F4]">
      <div className="overflow-hidden py-16">
        <div className="mb-10 flex items-end justify-between px-10">
          <h2 className="text-3xl font-extrabold text-[#0A2540]">What We Do ⤵</h2>
          <span className="rounded-full border border-neutral-300 px-5 py-2 text-xs">About Us ↗</span>
        </div>
        <div ref={trackRef} className="flex gap-6 pl-10">
          {cards.map(([t, b], i) => (
            <div key={t} className="min-w-[340px] rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-neutral-100">
              {i === 0 ? <div className="mb-6 h-40 rounded-2xl bg-gradient-to-br from-[#1A7FE8] to-[#0A2540]" /> : <div className="mb-6 h-40" />}
              <h3 className="text-sm font-bold text-[#0A2540]">{t}</h3>
              <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WsBenefits() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const rows = [
    ['01', 'Hit hiring targets', 'This is a complete, comprehensive service. We manage the whole process end-to-end � to deliver a future-focused recruitment solution from sourcing to onboarding.'],
    ['02', 'Generate pipeline value', 'We understand hiring is a significant investment. Our expert team goes the extra mile to successfully monetize your talent pipeline and show ROI on every role.'],
    ['03', 'Entice more candidates', 'Our guidance around channels ensures you reach the right people. We use our experience to help you minimize upfront costs and bring you closer to sustainable staffing.'],
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between">
          <h2 data-reveal className="text-3xl font-extrabold tracking-tight text-[#0A2540]">Enjoy all these benefits<br />when you partner with us.</h2>
          <p data-reveal className="text-xs text-neutral-500 underline">Ready to get started? Contact us</p>
        </div>
        <div className="mt-12 divide-y divide-neutral-100">
          {rows.map(([n, t, b]) => (
            <div key={n} data-reveal className="grid items-center gap-6 py-8 md:grid-cols-[120px_1fr_1fr]">
              <div className="flex items-center gap-6"><div className="h-14 w-20 rounded-xl bg-neutral-100" /><span className="text-lg font-semibold text-neutral-400">{n}</span></div>
              <h3 className="text-lg font-bold text-[#0A2540]">{t}</h3>
              <p className="text-xs leading-relaxed text-neutral-400">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WsCoreFeatures() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const feats: [string, string][] = [
    ['Real-time analytics', 'Gain actionable insights with our live recruitment dashboards'],
    ['Mobile accessibility', 'Manage your hiring pipeline on the go with our mobile-friendly platform'],
    ['Customizable reports', 'Streamline your recruitment processes with automated workflows'],
    ['Enhanced security', 'Protect your sensitive candidate data with state-of-the-art security'],
  ];
  return (
    <section ref={ref} className="bg-[#C7CFDE] px-6 py-20">
      <div className="mx-auto max-w-5xl bg-white p-10 text-center">
        <h2 data-reveal className="text-2xl font-extrabold text-[#0A2540]">Core features that set us<br />apart from the competition</h2>
        <p data-reveal className="mx-auto mt-3 max-w-md text-xs text-neutral-500">Explore our standout features designed to deliver exceptional performance and value.</p>
        <div className="mt-10 grid items-center gap-4 md:grid-cols-3">
          <div className="space-y-4">
            {feats.slice(0, 2).map(([t, b]) => (
              <div key={t} data-reveal className="rounded-2xl bg-[#F4F5F6] p-5 text-left">
                <span className="inline-flex rounded-lg bg-[#0A2540] p-2 text-white">?</span>
                <p className="mt-4 text-xs"><b>{t}</b> <span className="text-neutral-500">{b}</span></p>
              </div>
            ))}
          </div>
          <div data-reveal className="h-72 rounded-2xl bg-neutral-200" />
          <div className="space-y-4">
            {feats.slice(2).map(([t, b]) => (
              <div key={t} data-reveal className="rounded-2xl bg-[#F4F5F6] p-5 text-left">
                <span className="inline-flex rounded-lg bg-[#0A2540] p-2 text-white">?</span>
                <p className="mt-4 text-xs"><b>{t}</b> <span className="text-neutral-500">{b}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WsExpertServices() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const services: [string, string][] = [
    ['AI Sourcing', 'Custom automation pipelines to find and engage talent across platforms.'],
    ['RPO Solutions', 'Embedded recruitment teams to scale hiring without scaling overhead.'],
    ['Executive Search', 'Leadership hiring powered by research-driven headhunting.'],
    ['Staff Augmentation', 'Feature-ready resources onboarded in days, not months.'],
    ['Vetting & Assessment', 'Technical scorecards and assessments to raise the bar.'],
    ['Onboarding Ops', 'Secure, compliant joining flows that scale across regions.'],
  ];
  return (
    <section ref={ref} className="bg-[#E3E6EA] px-6 py-20">
      <div className="mx-auto max-w-5xl bg-white p-10 text-center">
        <h2 data-reveal className="text-2xl font-extrabold text-[#0A2540]">Our Expert Services: <span className="bg-gradient-to-r from-[#1A7FE8] to-[#7B5CF0] bg-clip-text text-transparent">Tailored for Your Success</span></h2>
        <p data-reveal className="mx-auto mt-3 max-w-lg text-xs text-neutral-500">We provide a wide range of recruitment services designed to elevate your hiring. Every solution is customized to your needs.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map(([t, b], i) => (
            <div key={t} data-reveal className={`relative rounded-2xl border p-6 text-left ${i === 0 ? 'border-[#1A7FE8]/40 bg-blue-50/40' : 'border-neutral-100'}`}>
              <div className="inline-flex rounded-lg bg-blue-50 p-2 text-[#1A7FE8]">?</div>
              {i === 0 && <span className="absolute right-4 top-4 rounded-full bg-[#1A7FE8] p-1.5 text-white">?</span>}
              <h3 className="mt-8 text-sm font-bold text-[#0A2540]">{t}</h3>
              <p className="mt-2 text-[11px] text-neutral-500">{b}</p>
            </div>
          ))}
        </div>
        <button data-reveal className="mt-10 rounded-xl bg-[#1A7FE8] px-8 py-3 text-xs font-semibold text-white">Get a Quote</button>
      </div>
    </section>
  );
}

export function WsApartAcademy() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const rows = [
    ['Expert Recruiter Guidance', ['1-on-1 sourcing sessions', 'Feedback on candidates', 'Mentor-led vetting workshops'], '29+', 'Active Recruiters', '4.9', 'Average Rating'],
    ['Real-World Lessons', ['Project-based briefs', 'Downloadable resources', 'Skill-driven tasks'], '92%', 'Uptime Rate', '300+', 'Platform Access'],
    ['Career-Focused Curriculum', ['Job-ready learning paths', 'Portfolio templates', 'Resume prep tools'], '78%', 'Career Growth', '120+', 'Mentor Rating'],
    ['Flexible Learning Access', ['Mobile & desktop ready', 'Offline downloads', 'Lifetime access'], '99%', 'Uptime Rate', '24/7', 'Platform Access'],
  ];
  return (
    <section ref={ref} className="bg-[#D8DAE0] px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8">
        <h2 data-reveal className="text-center text-2xl font-extrabold text-[#0A2540]">What Sets Us <span className="text-[#1A7FE8]">Apart</span> in NexaTalent IT Solutions Academy</h2>
        <p data-reveal className="mx-auto mt-2 max-w-md text-center text-[10px] text-neutral-500">We're an online learning platform dedicated to helping people upskill and grow, with expert instructors and flexible courses.</p>
        <div className="mt-8 space-y-4">
          {rows.map(([t, bullets, m1, l1, m2, l2]) => (
            <div key={t as string} data-reveal className="grid items-center gap-6 rounded-xl border border-neutral-100 p-5 md:grid-cols-[1fr_180px_1fr]">
              <div>
                <h3 className="font-bold text-[#0A2540]">{t}</h3>
                <ul className="mt-3 space-y-1 text-[10px] text-neutral-500">
                  {(bullets as string[]).map((b) => <li key={b}>? {b}</li>)}
                </ul>
              </div>
              <div className="h-24 rounded-xl bg-neutral-200" />
              <div>
                <p className="text-[10px] text-neutral-500">Get expert feedback and support directly from experienced industry mentors.</p>
                <div className="mt-4 flex gap-8">
                  <div><p className="text-xl font-extrabold text-[#0A2540]">{m1}</p><p className="text-[9px] text-neutral-400">{l1}</p></div>
                  <div><p className="text-xl font-extrabold text-[#0A2540]">{m2}</p><p className="text-[9px] text-neutral-400">{l2}</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WsTestimonials() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const quotes = [
    ['David Lee', 'Founder, Akaila Studio', 'We were spending hours on repetitive tasks. Their automation system saved us 30+ hours per week and dramatically improved our sales performance.'],
    ['Sarah Mitchell', 'COO, BrightPath SaaS', 'We struggled with inconsistent lead follow-ups and slow response times. Their AI automation blueprint gave us clarity first, then execution.'],
    ['Michael Tran', 'Founder & CEO, Skyline Realty Group', 'We reduced admin work by nearly 50% and doubled our qualified appointment bookings. The ROI was faster than we expected � and the system continues to scale.'],
    ['Daniel Kim', 'Founder, ScaleLabe Education', 'Our enrollment process used to require manual follow-ups and spreadsheet tracking. Now AI handles lead qualification, scheduling, reminders, and CRM updates automatically.'],
    ['Jonathan Reed', 'Managing Director, Nexora Digital Agency', 'We were scaling fast but drowning in manual workflows. Their automation system connected our CRM, email marketing, and reporting into one intelligent flow.'],
    ['Alex Johnson', 'Head of Operations, Finovate Consulting', 'Security and compliance were major concerns for us. They designed an automation architecture that was not only efficient but enterprise-grade secure.'],
    ['Laura Martinez', 'CMO, Elevate Commerce Co.', 'Marketing automation always felts fragmented � too many tools, not enough cohesion. They unified everything into one intelligent ecosystem.'],
  ];
  return (
    <section ref={ref} className="bg-neutral-950 px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10">
        <p className="text-center text-[10px] tracking-widest text-neutral-400">005 � TESTIMONIAL</p>
        <h2 data-reveal className="mt-3 text-center text-3xl font-extrabold text-[#0A2540]">What They're Saying</h2>
        <div className="mt-12 columns-1 gap-4 md:columns-3">
          {quotes.map(([n, r, q]) => (
            <div key={n} data-reveal className="mb-4 break-inside-avoid rounded-2xl bg-[#F5F5F4] p-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-neutral-300" />
                <div><p className="text-xs font-bold">{n}</p><p className="text-[9px] text-neutral-400">{r}</p></div>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-neutral-600">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WsExploreTalent() {
  const ref = useRef<HTMLElement>(null);
  const cards: [string, string, string, boolean][] = [
    ['Brand Identity', 'Visually and emotionally communicate a brand�s values, personality.', 'text-[#0A2540]', false],
    ['UIUX Design', 'Crafting Visually Stunning and User-Centric Websites.', 'text-white', true],
    ['Social Media', 'Strategize, create, and manage engaging content across platforms.', 'text-[#0A2540]', false],
    ['Animation', 'Visually engaging and dynamic motion graphics or characters.', 'text-[#0A2540]', false],
  ];
  return (
    <section ref={ref} className="bg-[#E4E4E6] px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10">
        <h2 data-reveal className="text-2xl font-extrabold text-[#0A2540]">Explore Our<br />Expert ? Talent</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map(([t, b, c, dark]) => (
            <div key={t} data-reveal className={`rounded-3xl border border-neutral-100 p-8 ${dark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
              <div className={`inline-flex rounded-full p-3 ${dark ? 'bg-white/10 text-white' : 'bg-neutral-100 text-[#0A2540]'}`}>?</div>
              <h3 className={`mt-8 text-xl font-bold ${c}`}>{t}</h3>
              <p className={`mt-6 max-w-xs text-[11px] ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>{b}</p>
              <div className="mt-6 flex -space-x-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-8 w-8 rounded-full bg-neutral-300 ring-2 ring-white/20" />)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WsStatsBento() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const stats = [
    ['8+', 'years', 'Experience designing end-to-end systems.'],
    ['120+', 'projects', 'Successfully shipped from idea to deployment.'],
    ['35+', 'happy clients', 'Many return for new collaborations.'],
    ['99%', 'satisfaction', 'Excellent feedback collected over the last year.'],
  ];
  return (
    <section ref={ref} className="bg-[#F4F4F4] px-6 py-20">
      <div className="mx-auto grid max-w-4xl items-stretch gap-4 md:grid-cols-[280px_1fr]">
        <div data-reveal className="rounded-2xl bg-[#0A2540] p-8 text-white">
          <h3 className="text-sm font-bold">I'm Daniel Hart</h3>
          <p className="mt-3 text-[10px] leading-relaxed text-neutral-300">A web designer with a passion for crafting digital experiences that feel intuitive, relevant, and real � with a background in Dubai and the Middle East region.</p>
          <button className="mt-28 w-full rounded-xl bg-white py-2.5 text-xs font-bold text-[#0A2540]">R�sum�</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(([n, l, b]) => (
            <div key={n} data-reveal className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl font-extrabold text-[#0A2540]">{n} <span className="text-[10px] font-normal text-neutral-400">{l}</span></p>
              <p className="mt-2 text-[10px] text-neutral-400">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
