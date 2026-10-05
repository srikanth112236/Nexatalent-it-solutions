import { Monitor, Code2, Briefcase, Users, Megaphone, ArrowRight, Landmark, GraduationCap } from 'lucide-react';

const cats = [
  { icon: Megaphone, title: 'Marketing', count: '140 jobs available', dark: true },
  { icon: Landmark, title: 'Finance', count: '325 jobs available' },
  { icon: Monitor, title: 'Technology', count: '436 jobs available' },
  { icon: Code2, title: 'Engineering', count: '542 jobs available' },
  { icon: Briefcase, title: 'Business', count: '211 jobs available' },
  { icon: Users, title: 'Human Resource', count: '346 jobs available' },
];

export function WcCareerPaths() {
  return (
    <section className="bg-white px-6 py-16 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-3">
        <div>
          <h2 className="text-2xl font-extrabold leading-snug text-[#0A2540]">Explore Your Career Path And Discover Opportunities</h2>
          <p className="mt-3 text-xs text-neutral-500">Whether You're Looking To Break Into A New Industry Or Advance In Your Current Field, Discover The Perfect Match For Your Professional Journey.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {cats.map(({ icon: Icon, title, count, dark }) => (
            <div key={title} className={`rounded-2xl p-5 ${dark ? 'bg-[#12263A] text-white' : 'bg-white text-[#0A2540] ring-1 ring-neutral-100 shadow-sm'}`}>
              <Icon size={20} className={dark ? 'text-white' : 'text-[#0A2540]'} />
              <h3 className="mt-6 text-sm font-bold">{title}</h3>
              <div className="mt-1 flex items-center justify-between">
                <p className={`text-[11px] ${dark ? 'text-blue-200' : 'text-neutral-400'}`}>{count}</p>
                <ArrowRight size={14} className={dark ? 'text-blue-300' : 'text-neutral-500'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WcCategoryCards() {
  const services = [
    { title: 'Digital Strategy', dark: false },
    { title: 'Data Analytics', dark: true },
    { title: 'Cloud Consulting', dark: false },
    { title: 'Business Consulting', dark: false },
    { title: 'Design & UX', dark: false },
    { title: 'Workflow Systems', dark: false },
    { title: 'Security & Compliance', dark: true },
    { title: 'Hiring Ops', dark: false },
  ];
  return (
    <section className="bg-[#FDFBF6] px-6 py-16 lg:px-16">
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <div key={s.title} className={`rounded-2xl p-5 ${s.dark ? 'bg-[#0A2540] text-white' : 'bg-white text-[#0A2540] ring-1 ring-neutral-100 shadow-sm'}`}>
            <div className={`inline-flex rounded-lg p-2 ${s.dark ? 'bg-white/10 text-white' : 'bg-blue-50 text-[#1A6FE8]'}`}>
              <GraduationCap size={18} />
            </div>
            <h3 className="mt-8 text-sm font-bold">{s.title}</h3>
            <p className={`mt-2 text-[11px] leading-relaxed ${s.dark ? 'text-blue-100/70' : 'text-neutral-400'}`}>
              Recruitment-grade delivery with measurable outcomes for every hiring mandate.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const steps = [
  { n: '1', title: 'Compartimos información', body: 'A consultoría explora tu pipeline para definir el alcance.' },
  { n: '2', title: 'Design the solution', body: 'Our team maps the right talent channels and vetting flow.' },
  { n: '3', title: 'Stage of execution', body: 'We source, screen, and deliver shortlisted talent in days.' },
];

export function WcHowItWorks() {
  return (
    <section className="bg-white px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xl font-extrabold text-[#0A2540]">¿Cómo funciona?</h2>
        <p className="mt-2 text-xs text-neutral-500">Follow the 3 steps of hiring through our platform to hire the talent with the ideal profile</p>
        <div className="relative mt-12 grid grid-cols-3 gap-6">
          <div className="absolute left-0 right-0 top-4 border-t-2 border-dashed border-neutral-200" />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#7B5CF0] text-xs font-bold text-white ring-4 ring-white">{s.n}</div>
              <h3 className="mt-6 text-sm font-bold text-[#0A2540]">{s.title}</h3>
              <p className="mt-2 text-[11px] text-neutral-400">{s.body}</p>
            </div>
          ))}
        </div>
        <button className="mt-10 rounded-full bg-[#7B5CF0] px-8 py-2.5 text-xs font-semibold text-white shadow-md">Comenzar →</button>
      </div>
    </section>
  );
}
