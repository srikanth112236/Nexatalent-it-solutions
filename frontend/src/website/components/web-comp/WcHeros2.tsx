import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const R = ({ children, d = 0 }: { children: ReactNode; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: d }}>
    {children}
  </motion.div>
);

const H = ({ children, bg = 'bg-white' }: { children: ReactNode; bg?: string }) => (
  <section className={`min-h-screen flex flex-col justify-center ${bg} px-6 py-20 lg:px-16 border-b border-neutral-200/80 relative overflow-hidden`}>
    <div className="mx-auto max-w-6xl w-full">{children}</div>
  </section>
);

const P = ({ children, c = 'text-neutral-600' }: { children: ReactNode; c?: string }) => (
  <p className={`mt-4 max-w-xl text-sm leading-relaxed ${c}`}>{children}</p>
);

/* H12 — Organic Light Blob Full Screen */
export function H12Blob() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#FDFBF6] px-6 lg:px-16 border-b border-neutral-200/80">
      <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl pointer-events-none" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <R>
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm border border-blue-100">
              NEXATALENT IT SOLUTIONS GCC REIMAGINED
            </span>
          </R>
          <R d={0.1}>
            <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.1] text-neutral-950">
              Hire global.<br />Think local.<br />Move fast.
            </h1>
          </R>
          <R d={0.2}>
            <P>Vetted engineering talent across 38 countries matched by AI, delivered by veteran technical recruiters in under 72 hours.</P>
          </R>
          <R d={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-neutral-950 px-8 py-4 text-xs font-bold text-white shadow-xl hover:bg-neutral-800 transition-all">
                Start Hiring Pods
              </button>
              <button className="rounded-full border border-neutral-300 bg-white px-8 py-4 text-xs font-bold text-neutral-900 shadow-sm hover:bg-neutral-50 transition-all">
                Explore Talent Bench
              </button>
            </div>
          </R>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['Dubai, UAE', 'Riyadh, KSA', 'Bangalore, IN', 'London, UK'].map((c, i) => (
            <R key={c} d={i * 0.08}>
              <div className="rounded-3xl bg-white p-8 text-center text-sm font-bold text-neutral-900 shadow-md ring-1 ring-neutral-200/80">
                <p className="text-xs text-blue-600 font-mono">GCC HUB</p>
                <p className="mt-2 text-lg font-bold">{c}</p>
                <p className="mt-1 text-[11px] text-neutral-400">100+ Engineers Ready</p>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* H13 — Image Collage Deck Full Screen */
export function H13Collage() {
  return (
    <H bg="bg-white">
      <div className="grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <R>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-neutral-950">
              Your engineering squad,<br />hand-picked by tech leads.
            </h1>
          </R>
          <R d={0.1}>
            <P>Real technical screeners. Live system design interviews. Vetted candidates delivered in days, not months.</P>
          </R>
          <R d={0.2}>
            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all">
              Book Strategy Call <ArrowRight size={14} />
            </button>
          </R>
        </div>
        <div className="columns-2 gap-4">
          {[
            { title: 'Senior Go Squad', exp: 'Ex-Stripe Lead' },
            { title: 'AI / LLM Team', exp: 'Ex-Google Research' },
            { title: 'DevOps / K8s Pod', exp: 'AWS Certified' },
            { title: 'React Native Team', exp: 'Fintech Specialists' },
          ].map((item, i) => (
            <div key={i} className={`mb-4 rounded-3xl p-6 ${i % 2 ? 'bg-blue-50 border border-blue-100' : 'bg-neutral-100 border border-neutral-200'}`}>
              <p className="text-xs font-bold text-neutral-900">{item.title}</p>
              <p className="text-[11px] text-neutral-500 mt-1">{item.exp} &bull; Pre-vetted</p>
            </div>
          ))}
        </div>
      </div>
    </H>
  );
}

/* H14 — Giant Modernist Typography Light Mode */
export function H14GiantType() {
  return (
    <H bg="bg-[#FAF8F5]">
      <div className="text-center space-y-6">
        <R>
          <p className="text-xs font-mono font-bold tracking-[0.4em] text-blue-600 uppercase">NEXATALENT IT SOLUTIONS // GLOBAL RECRUITMENT SYSTEM</p>
        </R>
        <R d={0.1}>
          <h1 className="text-6xl sm:text-8xl font-black leading-none tracking-tight text-neutral-950 uppercase">
            HIRE BETTER.
          </h1>
        </R>
        <R d={0.2}>
          <P c="mx-auto max-w-lg text-base text-neutral-600">The hiring platform engineering directors, CTOs and candidates actually love.</P>
        </R>
        <R d={0.3}>
          <div className="pt-4 flex justify-center gap-4">
            <button className="rounded-full bg-neutral-950 px-8 py-4 text-xs font-bold text-white shadow-xl hover:bg-neutral-800 transition-all">
              Get Started Today &rarr;
            </button>
          </div>
        </R>
      </div>
    </H>
  );
}

/* H15 — Light SaaS Browser Pipeline Mock */
export function H15Browser() {
  return (
    <H bg="bg-[#F7F2E7]">
      <div className="text-center space-y-4">
        <R>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">PIPELINE DASHBOARD</span>
          <h1 className="mt-4 text-4xl font-extrabold text-neutral-950">One tab. Your entire GCC hiring pipeline.</h1>
        </R>
      </div>
      <R d={0.1}>
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-200">
          <div className="flex gap-2 bg-neutral-100 px-4 py-3 border-b border-neutral-200">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="grid grid-cols-4 gap-4 p-8 text-center text-xs font-bold">
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 text-blue-900"><p className="text-2xl font-extrabold">148</p><p className="mt-1 text-neutral-500">Sourced</p></div>
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6 text-indigo-900"><p className="text-2xl font-extrabold">38</p><p className="mt-1 text-neutral-500">Screened</p></div>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6 text-amber-900"><p className="text-2xl font-extrabold">12</p><p className="mt-1 text-neutral-500">Interviews</p></div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 text-emerald-900"><p className="text-2xl font-extrabold">6</p><p className="mt-1 text-emerald-700">Hired</p></div>
          </div>
        </div>
      </R>
    </H>
  );
}

/* H16 — Floating Badges Light Full Screen */
export function H16Badges() {
  return (
    <H bg="bg-white">
      <div className="text-center space-y-8">
        <span className="rounded-full bg-purple-50 border border-purple-100 px-4 py-1.5 text-xs font-bold text-purple-800">
          INSTANT ACCESS REPOSITORY
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-950">
          Vetted Engineering Candidates Ready Now.
        </h1>
        <p className="text-base text-neutral-600 max-w-xl mx-auto">
          Skip months of sourcing. Browse pre-screened technical talent available for immediate interviews.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Staff Backend Lead', 'AI / LLM Architect', 'DevOps & K8s Specialist', 'Full Stack Engineer', 'Mobile Lead (iOS/Android)', 'Data Platform Lead'].map((b) => (
            <span key={b} className="rounded-full bg-neutral-100 px-6 py-3.5 text-xs font-bold text-neutral-800 border border-neutral-200 shadow-sm">
              {b}
            </span>
          ))}
        </div>
      </div>
    </H>
  );
}
