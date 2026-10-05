import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current.querySelectorAll('[data-reveal]'), { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, [ref]);
}

export function RecHiringMadeEasy() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="bg-white px-6 py-20 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <h1 data-reveal className="text-6xl font-extrabold leading-[1.05] tracking-tight text-[#0A2540]">Hiring<br /><span className="text-neutral-400">Made<br />Easy</span></h1>
          <p data-reveal className="mt-6 max-w-sm text-sm text-neutral-600">Automatically find and assess top talent — cutting hiring time by up to 4 weeks per role.</p>
          <button data-reveal className="mt-8 rounded-full bg-[#1A7FE8] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30">Get Early Access</button>
          <p data-reveal className="mt-16 text-4xl font-extrabold text-[#0A2540]">300+ <span className="text-xs font-medium text-neutral-400">Partner<br />With Us</span></p>
        </div>
        <div data-reveal className="rounded-3xl bg-[#F2F4F8] p-10 text-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-neutral-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <div key={i} className="m-0.5 h-8 w-8 rounded-full bg-blue-200" />)}
          </div>
          <p className="mx-auto -mt-4 w-fit rounded-xl bg-white px-4 py-2 text-xs font-bold shadow">Job Requisition</p>
          <div className="mx-auto mt-4 w-fit rounded-full bg-[#0A2540] px-6 py-2 text-xs font-semibold text-white">AI Automation</div>
          <div className="mx-auto mt-4 flex max-w-sm flex-wrap justify-center gap-2">
            {[['Job Posting', '#2E9E6B'], ['Resume Parsing', '#5B7FE8'], ['Scheduling', '#F2572C'], ['Screening', '#1E4FA3'], ['Assessment', '#E58BF5'], ['AI Interview', '#0E6B4F']].map(([t, c]) => (
              <span key={t} style={{ background: c as string }} className="rounded-full px-4 py-1.5 text-[10px] font-semibold text-white">{t}</span>
            ))}
          </div>
          <p className="mx-auto mt-4 w-fit rounded-xl bg-white px-6 py-2 text-xs font-semibold shadow">Human Interview</p>
          <p className="mx-auto mt-4 w-fit rounded-full bg-white px-6 py-2 text-xs font-semibold shadow">Onboarding</p>
        </div>
      </div>
    </section>
  );
}

export function RecShapingLandscape() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="bg-white px-6 py-24 text-center">
      <span data-reveal className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1 text-[10px] text-neutral-500">● Available for new projects</span>
      <h2 data-reveal className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight text-[#0A2540]"><span className="text-neutral-300">Shaping the</span> Digital Landscape <span className="text-neutral-300">for</span> Next-Gen Talent Brands</h2>
      <p data-reveal className="mx-auto mt-4 max-w-sm text-[11px] text-neutral-400">Cedric Stephem designs premium brands and websites across 10+ industries.</p>
      <button data-reveal className="mt-8 rounded-full bg-[#0A2540] px-8 py-3 text-xs font-semibold text-white">Get in touch ↗</button>
    </section>
  );
}

export function RecSmartPersonalization() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="bg-white px-6 py-20 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <span data-reveal className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-semibold text-yellow-700">✦ AI-Powered</span>
          <h2 data-reveal className="mt-4 text-3xl font-extrabold text-[#0A2540]">Smart Candidate<br />Personalization</h2>
          <p data-reveal className="mt-4 max-w-md text-xs text-neutral-500">AI analyzes each candidate profile in real time, crafting shortlists tailored to your role requirements, culture fit, and team style.</p>
          <div data-reveal className="mt-8 space-y-5">
            <div><p className="flex items-center gap-2 text-sm font-bold text-[#0A2540]">▣ Adaptive Matching</p><p className="ml-6 text-xs text-neutral-500">Recommendations adjust based on your progress and needs.</p></div>
            <div><p className="flex items-center gap-2 text-sm font-bold text-[#0A2540]">⏱ Real-Time Analysis</p><p className="ml-6 text-xs text-neutral-500">Instantly processes profiles to create personalized talent feeds.</p></div>
          </div>
        </div>
        <div data-reveal className="rounded-3xl bg-[#F2F4F8] p-10">
          <div className="space-y-3">
            {['Your daily shortlist is ready! — 20min · 3 Tasks', 'Guten Tag! Daily objective pick is here! — Guten · 3 Tasks'].map((t, i) => (
              <div key={i} className={`w-60 rounded-xl bg-white p-4 text-xs shadow ${i ? 'ml-10' : ''}`}>{t}</div>
            ))}
            <div className="ml-14 h-16 w-64 rounded-xl bg-white p-3 shadow">
              <div className="flex gap-1">{Array.from({ length: 12 }).map((_, i) => <div key={i} className={`h-8 w-2 rounded ${i < 6 ? 'bg-[#0E6B4F]' : 'bg-neutral-200'}`} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RecExpertDesigned() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const bullets = (ok: boolean) => [
    ok ? 'No boring drills or ineffective memorization.' : 'No irrelevant shortlists or ineffective screening.',
    ok ? 'Backed by research, designed for real results.' : 'Backed by recruiters, designed for real hires.',
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
        <div data-reveal className="order-2 rounded-3xl bg-[#F2F4F8] p-12 lg:order-1">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-xs font-bold">Context meaning</p>
            <p className="mt-2 text-[11px] text-neutral-500">"Cada palabra que memorizas" — It means learning and remembering words.</p>
          </div>
        </div>
        <div className="order-1">
          <h2 data-reveal className="text-3xl font-extrabold text-[#0A2540]">Expert-Designed,<br />Flexible & Fun</h2>
          <div data-reveal className="mt-5 space-y-2 text-xs">
            {bullets(true).map((b, i) => <p key={i} className={i ? 'text-[#0E9F7A]' : 'text-red-400'}>{i ? '✔' : '✖'} {b}</p>)}
          </div>
          <p data-reveal className="mt-5 max-w-sm text-xs text-neutral-500">Developed by language specialists, NexaTalent IT Solutions offers a scientifically backed approach to hiring that is both effective and enjoyable.</p>
        </div>
        <div>
          <h2 data-reveal className="text-3xl font-extrabold text-[#0A2540]">Real Conversation<br />Practice 24/7</h2>
          <div data-reveal className="mt-5 max-w-sm space-y-4 text-xs">
            <div><p className="font-bold">Interactive Practice</p><p className="text-neutral-500">Engage in natural dialogues anytime, anywhere.</p></div>
            <div><p className="font-bold">Instant Feedback</p><p className="text-neutral-500">Get corrections on communication in real time.</p></div>
          </div>
        </div>
        <div data-reveal className="rounded-3xl bg-[#F2F4F8] p-12">
          <div className="space-y-3">
            <div className="w-56 rounded-2xl bg-white p-4 text-xs shadow"><b>Emily Ford</b><br />Hey! I want to order coffee in French, but I'm not sure how.</div>
            <div className="ml-10 w-56 rounded-2xl bg-white p-4 text-xs shadow"><b>ChatBot</b><br />No problem! Try saying: "Je voudrais un café, s'il vous plaît."</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RecCuriosityCreativity() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="bg-white px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-[9px] tracking-widest text-neutral-400">OUR VALUES</p>
          <h2 data-reveal className="mt-2 text-3xl font-extrabold text-[#0A2540]">Curiosity<br />& Creativity</h2>
          <p className="mt-20 text-[9px] tracking-widest text-neutral-400">OUR MISSION</p>
          <h2 data-reveal className="mt-2 text-3xl font-extrabold text-[#0A2540]">Leading the Way<br />in Recruitment</h2>
        </div>
        <div className="space-y-16 text-[11px] leading-relaxed text-neutral-500">
          <p data-reveal>We believe that by nurturing these qualities, we unlock the potential for groundbreaking innovations in web design. Our relentless curiosity propels us to explore new technologies, while our boundless creativity allows us to envision and actualize unique solutions. We encourage a culture of constant learning, pushing boundaries, and thinking outside the box.<br /><br />Our dedication to curiosity and creativity enables us to stay at the forefront of the industry, delivering cutting-edge features and empowering our users to bring their boldest ideas to life.</p>
          <p data-reveal>At NexaTalent IT Solutions, we are driven by a set of core values that guide our every endeavor. Innovation is at the heart of everything we do, as we constantly seek new and better ways to empower our users.<br /><br />We foster a culture of collaboration, encouraging diverse perspectives and ideas to flourish. Transparency and integrity are paramount, ensuring trust and reliability in all our interactions. We prioritize user-centric design, aiming to create intuitive and delightful experiences. Lastly, we embrace sustainability, striving to minimize our environmental impact. These values shape our products and services, enabling us to make a positive impact on the talent industry and beyond.</p>
        </div>
      </div>
    </section>
  );
}

export function RecPersadoCards() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const cards = [
    ['Motivate candidates', 'Experience the only talent generation platform informed by what motivates people to act.', 'bg-[#23233B] text-white'],
    ['Achieve uplift from day one', 'Generate the best-performing messages to drive action.', 'bg-[#E8E6E1] text-[#0A2540]'],
    ['Test, learn, refine', 'Leverage machine learning and a decisioning engine to refine language based on response data.', 'bg-[#F2C14E] text-[#0A2540]'],
    ['Hyper-personalize', 'Communicate and reach your candidates with personalization to a segment of one.', 'bg-[#8E8CF0] text-white'],
    ['Mathematical accuracy', 'Our company includes Olympiads in mathematics, pioneers in the field of natural language processing.', 'bg-[#6E6E73] text-white'],
    ['Built for growth', 'Our growth and success depend on the company’s diverse.', 'bg-[#1E4636] text-white'],
  ];
  return (
    <section ref={ref} className="bg-[#F4F4F7] px-6 py-20 lg:px-16">
      <h2 data-reveal className="max-w-xl text-3xl font-extrabold tracking-tight text-[#0A2540]">The NexaTalent IT Solutions AI<br />Platform personalizes digital<br />communications at scale</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {cards.map(([t, b, c]) => (
          <div key={t} data-reveal className={`rounded-2xl p-7 ${c} ${t === 'Achieve uplift from day one' ? 'md:col-span-1' : ''}`}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-bold">{t}</h3><span>◎</span></div>
            <p className="mt-3 max-w-[220px] text-[11px] opacity-80">{b}</p>
            <button className="mt-14 rounded-full border border-white/40 bg-white/10 px-5 py-1.5 text-[10px] font-semibold">Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecCurrentOpenings() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const jobs = [
    'Product Designer', 'Frontend Developer', 'Product Manager', 'Backend Developer',
    'Accountant', 'Human Resource Manager', 'General Manager', 'Administrative Assistant', 'DevOps',
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 data-reveal className="text-2xl font-extrabold text-[#0A2540]">Current Openings</h2>
        <p data-reveal className="mt-2 text-[11px] text-neutral-500">We're always looking for creative builders — from product designers to engineers and marketers.</p>
        <div className="mt-12 grid gap-4 text-left md:grid-cols-2">
          {jobs.map((j) => (
            <div key={j} data-reveal className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
              <p className="text-xs font-bold text-[#0A2540]">{j} <span className="font-normal text-neutral-400">(Remote / Hybrid - Lagos)</span></p>
              <span className="mt-2 inline-block rounded-full border border-neutral-200 px-3 py-0.5 text-[9px] text-neutral-500">● Full-time</span>
              <p className="mt-3 text-[10px] text-neutral-400">We're looking for a mid-level {j} engineer to join our team.</p>
              <button className="mt-4 rounded-full bg-[#16213A] px-5 py-1.5 text-[10px] font-semibold text-white">Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecBuildSkills() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="bg-[#FBFBFD] px-6 py-20 text-center">
      <div data-reveal className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[10px] text-neutral-500 shadow-sm"><span className="flex -space-x-1">{[1, 2, 3, 4].map((i) => <div key={i} className="h-4 w-4 rounded-full bg-neutral-300" />)}</span> 125k+ student reviews</div>
      <h2 data-reveal className="mt-5 text-4xl font-extrabold text-[#0A2540]">Build skills<br />New opportunities.</h2>
      <p data-reveal className="mx-auto mt-4 max-w-lg text-xs text-neutral-500">NexaTalent IT Solutions gives you a complete learning experience that helps you gain real, job-ready skills and take the next step in your career.</p>
      <button data-reveal className="mt-8 rounded-full bg-[#0A2540] py-1 pl-6 pr-1.5 text-xs font-semibold text-white">EXPLORE OUR COURSES <span className="rounded-full bg-white px-2 py-1 text-[#0A2540]">→</span></button>
      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-3 gap-4">
        {[['bg-[#3B2D5B]', '92% Career Outcome Success'], ['bg-[#2E2A26]', 'Mark Jhongson — CEO at Tutorly'], ['bg-[#4A3B30]', '100+ Experienced tutor']].map(([c, t], i) => (
          <div key={t} data-reveal className={`relative h-64 rounded-2xl ${c} text-white`}>
            <p className="absolute bottom-4 left-4 right-4 text-left text-sm font-semibold">{t}</p>
            {i === 1 && <span className="absolute bottom-4 right-4 rounded-full bg-white/20 p-2">▶</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecCraftingGrowth() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const rows = [
    ['Growth', '80% Improved results', '56% Success rate', 'Success as a service — We best fit agencies, SaaS, digital creators, businesses, e-commerce.'],
    ['Conversion focused', '200% Conversion boost', '', 'Conversion-focused design — conversion rates 120%, decrease the bounce rate and improve user engagement.'],
    ['Market analytics', '80% Optimal results', '+80% Leads', 'Stay ahead of the market — Get expert care tailored to your needs of similar looking websites.'],
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20 text-center">
      <p data-reveal className="text-[9px] tracking-widest text-neutral-400">Benefits</p>
      <h2 data-reveal className="mt-3 text-3xl font-extrabold text-[#0A2540]">Crafting designs<br />that drive growth</h2>
      <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-3">
        {rows.map(([t, a, b, d]) => (
          <div key={t} data-reveal className="rounded-2xl border border-neutral-100 p-6 text-left shadow-sm">
            <p className="text-xs font-bold text-[#0A2540]">{t}</p>
            <div className="mt-4 flex gap-6 text-lg font-extrabold">{a} {b && <span>{b}</span>}</div>
            <div className="mt-4 space-y-1"><div className="h-1 rounded bg-[#A8E063]" style={{ width: '80%' }} /><div className="h-1 rounded bg-neutral-100" style={{ width: '50%' }} /></div>
            <h3 className="mt-6 text-sm font-bold text-[#0A2540]">{(d as string).split(' — ')[0]}</h3>
            <p className="mt-2 text-[10px] text-neutral-400">{(d as string).split(' — ')[1]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecSeamlessIntegration() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const feats = [
    ['Seamless Integration', 'Customize and automate the manual technical analysis with our AI-driven tools we built — your way, your rules.'],
    ['It’s easy and fast.', 'Custom code and automate the manual technical analysis you would otherwise do by hand — your way, your rules.'],
    ['No programming skills required.', 'Custom code and automate the manual technical analysis you would otherwise do by hand — your way, your rules.'],
    ['No specific technical expertise required.', 'Custom code and automate the manual technical analysis you would otherwise do by hand — your way, your rules.'],
    ['Designed for traders, by traders.', 'Customize and automate the manual technical analysis you would otherwise do by hand — your way, your rules.'],
    ['Works with any signal provider and broker.', 'Customize and automate the manual technical analysis you would otherwise do by hand — your way, your rules.'],
  ];
  return (
    <section ref={ref} className="bg-white px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-14 md:grid-cols-3">
        {feats.map(([t, b]) => (
          <div key={t} data-reveal>
            <p className="text-[#1A7FE8]">⇢</p>
            <h3 className="mt-3 text-sm font-bold text-[#0A2540]">{t}</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
