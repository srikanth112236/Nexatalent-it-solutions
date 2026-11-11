import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Briefcase,
  Check,
  Clock,
  Code2,
  FileCheck2,
  GitBranch,
  GraduationCap,
  Layers,
  MapPin,
  Mic,
  MonitorPlay,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SafeImage } from '../components/SafeImage';
import { CourseEnquiryForm } from '../components/CourseEnquiryForm';
import { SeoHead } from '../../components/SeoHead';
import { coursesApi } from '../../../shared/enterprise/phaseApi';
import { CourseItem, FALLBACK_COURSES } from '../data/coursesData';

const TRUST_PILLARS = [
  {
    icon: Briefcase,
    title: '100% Placement Support',
    desc: 'Dedicated placement cell connecting trained graduates directly with NexaTalent’s IT, SaaS & GCC hiring partner network until job placement.',
    tag: 'Career Outcomes',
  },
  {
    icon: Layers,
    title: 'Industry-Led Live Projects',
    desc: 'Build production-grade applications & BI dashboards modeled on real enterprise sprints—hosted on GitHub with senior engineer code reviews.',
    tag: 'Hands-On Portfolio',
  },
  {
    icon: Code2,
    title: 'Industry-Level Practitioner Training',
    desc: 'Learn directly from working architects and analysts through live daily coding labs—not recorded slides or textbook theory.',
    tag: 'Live Mentorship',
  },
  {
    icon: Mic,
    title: 'Mock Interviews & Resume Clinics',
    desc: 'Weekly 1-on-1 mock technical rounds, system & SQL evaluations, ATS-ready resume crafting, and HR negotiation coaching.',
    tag: 'Interview Ready',
  },
];

const JOURNEY_STEPS = [
  {
    num: '01',
    title: 'Industry-Level Daily Training',
    desc: '2 hours/day (Mon–Fri) live classroom in Bengaluru or interactive online batches with hands-on coding exercises.',
  },
  {
    num: '02',
    title: 'Industry-Led Real Projects',
    desc: 'Deliver 2–3 end-to-end capstones with REST APIs, databases, Git workflows, or live BI executive dashboards.',
  },
  {
    num: '03',
    title: 'Mock Interviews & Portfolio Audit',
    desc: 'Pass realistic technical mock panels, sharpen DSA/SQL problem solving, and finalize your GitHub + ATS resume.',
  },
  {
    num: '04',
    title: '100% Placement Support & Hiring Drives',
    desc: 'Exclusive interview referrals through NexaTalent’s active recruitment desk across product, consulting, and enterprise teams.',
  },
];

const STUDENT_ASSURANCES = [
  '100% placement support with continuous interview scheduling',
  'Small batch sizes with direct mentor doubt-clearing every day',
  'Offline Bengaluru classroom + Live interactive Online options',
  'Flexible instalment fee plans with zero hidden charges',
  'Verified NexaTalent course completion & project certification',
  'Dedicated support for fresh graduates, final-year students & working pros',
];

export function NewCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(FALLBACK_COURSES);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedForForm, setSelectedForForm] = useState<CourseItem>(FALLBACK_COURSES[0]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res: any = await coursesApi.listPublic();
        const rows = Array.isArray(res?.data) ? res.data : [];
        if (active && rows.length > 0) {
          setCourses(rows);
          setSelectedForForm(rows[0]);
        }
      } catch {
        // Fallback seeded catalog remains active
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));
    return ['All', ...cats];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (categoryFilter === 'All') return courses;
    return courses.filter((c) => c.category === categoryFilter);
  }, [courses, categoryFilter]);

  const applyForCourse = (course: CourseItem) => {
    setSelectedForForm(course);
    document.getElementById('courses-enquiry-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title="Nexa Courses — Java Full Stack, MERN, Python, Power BI & Data Analyst | NexaTalent"
        description="Job-oriented IT & Analytics training by NexaTalent IT Solutions with 100% placement support, industry-led live projects, and mock technical interviews."
        canonicalPath="/courses"
      />
      <V2Navbar />

      <main id="main-content" className="pb-20">
        {/* 1. Hero Section — Clear Trust + Outcomes */}
        <section className="border-b border-neutral-100 bg-white px-4 pb-14 pt-12 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-extrabold text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  100% Placement Support · Bengaluru Classroom &amp; Live Online
                </div>

                <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-black sm:text-5xl sm:leading-[1.08]">
                  Industry-level tech training engineered to get you hired.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
                  Master Java Full Stack, MERN, MEAN, Python Full Stack, Power BI, or Data Analytics
                  through practitioner-led daily coding, industry-led real-time projects, 1-on-1 mock
                  interviews, and dedicated placement referrals from NexaTalent’s hiring network.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#courses-catalog"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
                  >
                    Explore All Courses <ArrowRight size={15} aria-hidden />
                  </a>
                  <a
                    href="#courses-enquiry-section"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-black transition hover:border-black"
                  >
                    Book Free Career Counselling
                  </a>
                </div>
              </div>

              {/* Right editorial trust card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-7">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral-500">
                    Why Learners Choose NexaTalent
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {[
                      ['100%', 'Placement Support'],
                      ['2–3+', 'Industry-Led Projects'],
                      ['10 hrs/wk', 'Live Mentor Training'],
                      ['1-on-1', 'Mock Interviews'],
                    ].map(([val, lbl]) => (
                      <div
                        key={lbl}
                        className="rounded-2xl border border-neutral-200 bg-white p-4"
                      >
                        <p className="text-2xl font-black tracking-tight text-black">{val}</p>
                        <p className="mt-1 text-xs font-bold text-neutral-600">{lbl}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-700" />
                      Backed by NexaTalent’s live IT recruitment network
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Student Trust Pillars */}
        <section className="border-b border-neutral-100 bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral-500">
                Built For Career Outcomes
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                Everything you need to go from learner to industry-ready engineer.
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-black"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-black">
                          <Icon size={20} aria-hidden />
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-700">
                          {pillar.tag}
                        </span>
                      </div>
                      <h3 className="mt-5 text-base font-extrabold text-black">{pillar.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-600">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Courses Catalog Grid (Links to Separate Course Details Page) */}
        <section id="courses-catalog" className="border-b border-neutral-100 bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral-500">
                  Nexa Courses Catalog
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-black sm:text-4xl">
                  Choose your specialization track
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Click any course to open its full syllabus, month-by-month structure, schedule, and
                  instalment plan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Course categories">
                {categories.map((cat) => {
                  const active = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategoryFilter(cat)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                        active
                          ? 'bg-black text-white'
                          : 'border border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {loading && (
              <p className="mt-4 text-xs font-semibold text-neutral-400">
                Loading live course catalog…
              </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-white transition hover:border-black hover:shadow-md"
                >
                  <div>
                    <Link to={`/courses/${course.slug}`} className="block overflow-hidden bg-neutral-100">
                      <SafeImage
                        src={course.heroImage}
                        alt={`${course.shortName} training program`}
                        fallbackLabel={course.shortName}
                        className="aspect-[16/9] w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                      />
                    </Link>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                          {course.category}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          {course.duration}
                        </span>
                      </div>

                      <Link to={`/courses/${course.slug}`} className="mt-2.5 block">
                        <h3 className="text-xl font-extrabold tracking-tight text-black group-hover:underline">
                          {course.shortName}
                        </h3>
                      </Link>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                        {course.summary}
                      </p>

                      {/* Key modules preview */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(course.curriculumModules || []).slice(0, 3).map((m, i) => (
                          <span
                            key={i}
                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral-700"
                          >
                            {m.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 px-6 pb-6 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Course Fee
                        </span>
                        <span className="text-xl font-black tabular-nums text-emerald-700">
                          {course.feeDisplay}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Mode
                        </span>
                        <span className="text-xs font-extrabold text-black">
                          {course.trainingMode}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-neutral-800"
                      >
                        View Details <ArrowRight size={13} aria-hidden />
                      </Link>
                      <button
                        type="button"
                        onClick={() => applyForCourse(course)}
                        className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-black transition hover:border-black"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Training-to-Placement Pipeline + Student Assurances */}
        <section className="border-b border-neutral-100 bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral-500">
                  How Nexa Courses Work
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                  From Day-1 fundamentals to your offer letter.
                </h2>

                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {JOURNEY_STEPS.map((step) => (
                    <div
                      key={step.num}
                      className="rounded-2xl border border-neutral-200 bg-white p-5"
                    >
                      <span className="text-xs font-black tracking-widest text-neutral-400">
                        {step.num}
                      </span>
                      <h3 className="mt-2 text-base font-extrabold text-black">{step.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="h-full rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-black">
                    <GraduationCap size={16} aria-hidden /> Student Career Guarantee &amp; Support
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold tracking-tight text-black">
                    Built for freshers, final-year students &amp; career switchers
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {STUDENT_ASSURANCES.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-800">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                          <Check size={12} strokeWidth={3} aria-hidden />
                        </span>
                        <span className="font-medium leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-neutral-200 pt-4 text-xs font-bold text-neutral-600">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} className="text-black" /> Bengaluru Classroom
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MonitorPlay size={13} className="text-black" /> Live Interactive Online
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-black" /> Mon–Fri · 2 hrs/day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Student Admission & Free Counselling Form */}
        <section id="courses-enquiry-section" className="bg-white px-4 pt-14 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral-500">
                Admissions &amp; Career Counselling
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-black sm:text-4xl">
                Not sure which track fits your background? Talk to our mentor team.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
                Submit your enquiry and an academic counsellor will walk you through batch timings,
                live project portfolios, fee instalments, and placement support for your chosen
                program.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  {
                    icon: Users,
                    title: 'Personalized Track Recommendation',
                    desc: 'Guidance tailored to graduates, final-year students, and working professionals.',
                  },
                  {
                    icon: FileCheck2,
                    title: 'Free Demo Session & Syllabus Walkthrough',
                    desc: 'Experience our live coding classroom before committing to a batch.',
                  },
                  {
                    icon: GitBranch,
                    title: 'Transparent Instalment & Batch Options',
                    desc: 'Join Offline in Bengaluru or Live Online with zero difference in mentor access.',
                  },
                  {
                    icon: Award,
                    title: '100% Placement Cell Access',
                    desc: 'Mock interviews, resume reviews, and direct referrals to hiring partners.',
                  },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.title}
                      className="flex items-start gap-3.5 rounded-2xl border border-neutral-200 bg-white p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-black">
                        <Icon size={17} aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-black">{row.title}</h3>
                        <p className="mt-0.5 text-xs text-neutral-600">{row.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6">
              <CourseEnquiryForm
                courses={courses}
                selectedCourse={selectedForForm}
                onSelectCourse={setSelectedForForm}
                sourcePage="/courses"
              />
            </div>
          </div>
        </section>
      </main>

      <V2Footer />
    </div>
  );
}
