import { ArrowRight, Briefcase, Search, MapPin } from 'lucide-react';

export function WcHero() {
  return (
    <section className="bg-[#FDFBF6] px-6 py-16 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-[#0A2540] lg:text-5xl">
            Find the perfect<br />job for you
          </h1>
          <p className="mt-4 max-w-md text-sm text-neutral-500">
            Search your career opportunity through 12,812 jobs
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-full bg-white p-1.5 shadow-lg shadow-blue-900/5 ring-1 ring-neutral-100">
            <div className="flex flex-1 items-center gap-2 px-4 text-xs text-neutral-400">
              <Search size={14} /> Job Title or Keyword
            </div>
            <div className="flex items-center gap-1 border-l border-neutral-100 px-4 text-xs text-neutral-400">
              <MapPin size={14} /> All locations
            </div>
            <button className="rounded-full bg-[#1A7FE8] p-2.5 text-white">
              <Search size={16} />
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Designer', 'Team leader', 'Web developer', 'UI/UX', 'Figma', 'Tailor', 'Farmer', 'Financial Analyst', 'Software', 'Web', 'Tesla'].map((t) => (
              <span key={t} className="rounded-full border border-blue-100 bg-blue-50/60 px-3 py-1 text-[11px] text-[#1A5FB4]">{t}</span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-6 top-6 h-full w-24 rounded-[3rem] bg-[#1A7FE8]" />
          <div className="absolute -right-14 bottom-0 h-2/3 w-16 rounded-[3rem] bg-[#0A2540]" />
          <div className="relative h-80 w-64 rounded-[2.5rem] bg-gradient-to-b from-neutral-200 to-neutral-400 shadow-xl" />
          <div className="absolute bottom-6 -left-10 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-100">
            {[
              ['319', 'job offers', 'in marketing & Design'],
              ['265', 'job offers', 'marketing & communication'],
              ['324', 'job offers', 'business development'],
            ].map(([n, l, s]) => (
              <div key={l} className="mb-1">
                <span className="text-lg font-bold text-[#0A2540]">{n}</span>{' '}
                <span className="text-xs font-semibold text-[#1A7FE8]">{l}</span>
                <p className="text-[10px] text-neutral-400">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WcHireButton() {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-[#1A6FE8] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-[#1563cf]">
      Hire Talent <ArrowRight size={16} />
    </button>
  );
}

const jobs = [
  { tag: 'Finance', title: 'Financial Analyst', loc: 'San Diego, CA', type: 'Full Time', date: 'June 8, 2023', company: 'Gramuse', color: 'bg-[#0A2540]' },
  { tag: 'Software Engineering', title: 'Fullstack Web Developer', loc: 'San Francisco, CA', type: 'Internship', date: 'June 8, 2023', company: 'EyeKandy+', color: 'bg-[#4A90D9]' },
  { tag: 'Human Resources', title: 'Human Resources Coordinator', loc: 'San Diego, CA', type: 'Full Time', date: 'June 8, 2023', company: 'Errection', color: 'bg-[#5B9BEE]' },
  { tag: 'Business Development', title: 'Technical Writer', loc: 'Los Angeles, CA', type: 'Remote', date: 'June 8, 2023', company: 'ConfigLLC', color: 'bg-[#F0876A]' },
  { tag: 'Software/Engineering', title: 'Javascript Developer', loc: 'San Francisco, CA', type: 'Full Time', date: 'June 7, 2023', company: 'Haysmsoft', color: 'bg-[#4A90D9]' },
  { tag: 'Customer Service', title: 'Technical Support Engineer', loc: 'San Diego, CA', type: 'Part Time', date: 'June 7, 2023', company: 'Bom дом Radio', color: 'bg-[#F5B26B]' },
  { tag: 'Project Management', title: 'Software engineering Team Leader', loc: 'Los Angeles, CA', type: 'Contract', date: 'June 7, 2023', company: 'Codethinata', color: 'bg-[#5B9BEE]' },
  { tag: 'Marketing & Communication', title: 'Senior Editor', loc: 'San Francisco, CA', type: 'Full Time', date: 'June 7, 2023', company: 'Artistic Studio', color: 'bg-[#2E8B8B]' },
];

export function WcFeaturedJobs() {
  return (
    <section className="bg-[#FBF5E9] px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-extrabold text-[#0A2540]">Featured Job Offers</h2>
        <p className="mt-1 text-xs text-neutral-500">Search your career opportunity through 12,812 jobs</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((j) => (
            <div key={j.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2 py-0.5 text-[10px] text-neutral-500 ring-1 ring-neutral-100">
                <Briefcase size={10} /> {j.tag}
              </span>
              <h3 className="mt-3 text-sm font-bold text-[#0A2540]">{j.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-neutral-500">
                <MapPin size={10} /> {j.loc} · {j.type}
              </p>
              <p className="mt-4 text-[10px] text-neutral-400">June 8, 2023 by</p>
              <p className="text-[11px] font-semibold text-[#0A2540]">{j.company}</p>
              <div className={`mt-3 inline-flex rounded-lg ${j.color} p-2 text-white`}>
                <Briefcase size={16} />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1A6FE8] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30">
          All Job Offers <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
