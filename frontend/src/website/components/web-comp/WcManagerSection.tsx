import { Check, TrendingUp } from 'lucide-react';

export function WcManagerSection() {
  return (
    <section className="bg-[#EAF4FB] px-6 py-16 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold leading-snug text-[#0A2540]">Your Sales Managers are Great, NexaTalent IT Solutions Makes Them Even Better</h2>
          <p className="mt-4 max-w-md text-xs text-neutral-500">Enable managers to have more impact on the pipeline by giving them the right insights, at the right time.</p>
          <p className="mt-4 max-w-md text-xs text-neutral-500">NexaTalent IT Solutions surfaces insights when it matters most, allowing your managers to coach reps in real-time and close a deal faster.</p>
          <button className="mt-8 rounded-full bg-[#28C76F] px-8 py-3 text-xs font-semibold text-white shadow-md shadow-green-500/30">Request early access</button>
        </div>
        <div className="relative">
          <div className="absolute -right-4 top-8 h-64 w-40 rounded-[2.5rem] bg-gradient-to-br from-[#28C76F] to-[#1A7FE8] opacity-80" />
          <div className="absolute -left-6 top-0 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur">
            {['Lucas James — CEO', 'Jane Miller — Chief Operations officer', 'Amy koto — CMO'].map((p, i) => (
              <div key={p} className={`mb-2 flex items-center gap-2 rounded-xl px-3 py-2 ${i === 1 ? 'ring-1 ring-[#1A7FE8]' : ''}`}>
                <div className="h-7 w-7 rounded-full bg-neutral-300" />
                <div>
                  <p className="text-[11px] font-semibold text-[#0A2540]">{p.split(' — ')[0]}</p>
                  <p className="text-[9px] text-neutral-400">{p.split(' — ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ml-auto h-80 w-56 rounded-[2.5rem] bg-gradient-to-b from-neutral-300 to-neutral-500" />
          <div className="absolute bottom-4 right-0 w-56 rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#0A2540]">6,345</p>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#28C76F]"><TrendingUp size={10} /> 1.8%</span>
            </div>
            <p className="text-[9px] text-neutral-400">VS LAST WEEK</p>
            <svg viewBox="0 0 200 60" className="mt-3 h-14 w-full">
              <path d="M0 50 L30 40 L55 48 L80 20 L105 30 L130 10 L160 35 L185 25 L200 30" fill="none" stroke="#7BC96F" strokeWidth="2.5" />
              <path d="M0 50 L30 40 L55 48 L80 20 L105 30 L130 10 L160 35 L185 25 L200 30 V60 H0 Z" fill="#7BC96F" opacity="0.15" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WcCrmInsights() {
  return (
    <section className="bg-[#F0F7FD] px-6 py-16 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#0A2540] shadow-sm">Your CRM</span>
          <div className="h-6 w-px bg-[#28C76F]" />
          <div className="w-64 rounded-2xl bg-white p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-300" />
              <div>
                <p className="text-xs font-bold text-[#0A2540]">Mia Carter</p>
                <p className="text-[10px] text-neutral-400">Chief Operations officer</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-neutral-500">Engagement level</p>
            <div className="mt-1 h-1.5 rounded-full bg-neutral-100"><div className="h-full w-3/4 rounded-full bg-[#1A7FE8]" /></div>
            <p className="mt-1 text-right text-[10px] font-semibold text-[#0A2540]">92%</p>
          </div>
          <div className="rounded-full bg-[#28C76F] px-5 py-2 text-xs font-semibold text-white">New contact</div>
          <div className="h-6 w-px bg-[#28C76F]" />
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#1A7FE8] shadow-sm">
                <Check size={16} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2540]">Deeper Insights Without Endless Digging</h2>
          <p className="mt-4 max-w-md text-xs text-neutral-500">Your sales managers may need sleep, but NexaTalent IT Solutions doesn't. Unlike your (amazing) managers, NexaTalent IT Solutions can read every single sales communication in your pipeline — from emails to call transcripts.</p>
          <p className="mt-4 max-w-md text-xs text-neutral-500">NexaTalent IT Solutions ingests large volumes of data and uses a proprietary GenAI model to analyse data in ways that human brains simply cannot.</p>
          <button className="mt-8 rounded-full bg-[#28C76F] px-8 py-3 text-xs font-semibold text-white shadow-md shadow-green-500/30">Request early access</button>
        </div>
      </div>
    </section>
  );
}

export function WcGenerativeAi() {
  return (
    <section className="bg-white px-6 py-16 text-center lg:px-16">
      <h2 className="mx-auto max-w-xl text-3xl font-extrabold text-[#0A2540]">Drive More Revenue and Hit Forecasts with Generative AI</h2>
      <p className="mx-auto mt-3 max-w-md text-xs text-neutral-500">Get more out of your pipeline by empowering frontline sales managers with GenAI</p>
      <button className="mt-6 rounded-full bg-[#28C76F] px-8 py-3 text-xs font-semibold text-white shadow-md">Request early access</button>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {['Improved win rates across customer accounts', 'Deep, contextual understanding and analysis of over 100 data signals', 'Surfacing of high-value insights when a deal trajectory has changed'].map((t, i) => (
          <div key={i}>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4FB] text-[#1A7FE8]"><Check size={18} /></div>
            <p className="mt-4 text-[11px] text-neutral-500">{t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
