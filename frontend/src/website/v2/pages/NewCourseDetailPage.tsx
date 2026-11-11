import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  Check,
  Code2,
  Cpu,
  Database,
  FileSpreadsheet,
  GitBranch,
  Globe,
  Layers,
  Server,
  ShieldCheck,
  Terminal,
  Wrench,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SafeImage } from '../components/SafeImage';
import { CourseEnquiryForm } from '../components/CourseEnquiryForm';
import { SeoHead } from '../../components/SeoHead';
import { coursesApi } from '../../../shared/enterprise/phaseApi';
import { CourseItem, FALLBACK_COURSES } from '../data/coursesData';

function renderModuleIcon(iconKey: string) {
  const key = String(iconKey || '').toLowerCase();
  const base = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border';
  switch (key) {
    case 'java':
      return (
        <div className={`${base} border-orange-200 bg-orange-50 text-orange-700`}>
          <Cpu size={22} aria-hidden />
        </div>
      );
    case 'spring':
      return (
        <div className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>
          <Layers size={22} aria-hidden />
        </div>
      );
    case 'database':
      return (
        <div className={`${base} border-sky-200 bg-sky-50 text-sky-700`}>
          <Database size={22} aria-hidden />
        </div>
      );
    case 'frontend':
      return (
        <div className={`${base} border-blue-200 bg-blue-50 text-blue-700`}>
          <Code2 size={22} aria-hidden />
        </div>
      );
    case 'react':
      return (
        <div className={`${base} border-cyan-200 bg-cyan-50 text-cyan-700`}>
          <Globe size={22} aria-hidden />
        </div>
      );
    case 'node':
    case 'api':
      return (
        <div className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>
          <Server size={22} aria-hidden />
        </div>
      );
    case 'angular':
      return (
        <div className={`${base} border-rose-200 bg-rose-50 text-rose-700`}>
          <ShieldCheck size={22} aria-hidden />
        </div>
      );
    case 'python':
      return (
        <div className={`${base} border-amber-200 bg-amber-50 text-amber-700`}>
          <Terminal size={22} aria-hidden />
        </div>
      );
    case 'bi':
    case 'chart':
      return (
        <div className={`${base} border-yellow-200 bg-yellow-50 text-yellow-800`}>
          <FileSpreadsheet size={22} aria-hidden />
        </div>
      );
    case 'tools':
    default:
      return (
        <div className={`${base} border-neutral-200 bg-neutral-100 text-neutral-800`}>
          <Wrench size={20} aria-hidden />
        </div>
      );
  }
}

export function NewCourseDetailPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>(FALLBACK_COURSES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res: any = await coursesApi.listPublic();
        const rows = Array.isArray(res?.data) ? res.data : [];
        if (active && rows.length > 0) setCourses(rows);
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

  const activeCourse = useMemo(() => {
    return (
      courses.find((c) => c.slug === courseSlug || c.id === courseSlug) ||
      courses[0] ||
      FALLBACK_COURSES[0]
    );
  }, [courses, courseSlug]);

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title={`${activeCourse.shortName} Training Program — Syllabus, Fees & Admissions | NexaTalent`}
        description={`${activeCourse.summary} Includes 100% placement support, industry-led live projects, and mock interviews.`}
        canonicalPath={`/courses/${activeCourse.slug}`}
      />
      <V2Navbar />

      <main id="main-content" className="pb-20">
        {/* Top Breadcrumb + Sibling Course Switcher */}
        <section className="border-b border-neutral-100 bg-white px-4 py-6 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-black transition hover:border-black"
              >
                <ArrowLeft size={13} aria-hidden /> All Nexa Courses
              </Link>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-500">{activeCourse.category}</span>
              <span className="text-neutral-300">/</span>
              <span className="text-black">{activeCourse.shortName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {courses.map((c) => {
                const current = c.id === activeCourse.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/courses/${c.slug}`)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                      current
                        ? 'bg-black text-white'
                        : 'border border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black'
                    }`}
                  >
                    {c.shortName}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main 2-Col Program Details + Sticky Application Form */}
        <section className="bg-white px-4 pt-10 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* LEFT 7 COLS */}
            <div className="space-y-8 lg:col-span-7">
              {loading && (
                <p className="text-xs font-semibold text-neutral-400">Syncing latest syllabus…</p>
              )}

              {/* 1. Program Overview Card (Image 2) */}
              <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-100 px-6 py-4">
                  <p className="text-sm font-extrabold text-black">NexaTalent IT Solutions</p>
                  <p className="mt-0.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-700">
                    {activeCourse.eyebrow}
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                    <SafeImage
                      src={activeCourse.heroImage}
                      alt={`${activeCourse.shortName} classroom and mentoring session`}
                      fallbackLabel={activeCourse.title}
                      className="aspect-[16/9] w-full object-cover object-center"
                    />
                  </div>

                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {activeCourse.admissionsBadge}
                    </span>

                    <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                      {activeCourse.title}
                    </h1>
                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 sm:text-base">
                      {activeCourse.summary}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-5 border-t border-neutral-100 pt-5">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          Course Fee
                        </p>
                        <p className="mt-1 text-2xl font-black tabular-nums text-emerald-700 sm:text-3xl">
                          {activeCourse.feeDisplay}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          Duration
                        </p>
                        <p className="mt-1 text-xl font-extrabold text-black sm:text-2xl">
                          {activeCourse.duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          Training Mode
                        </p>
                        <p className="mt-1 text-base font-extrabold text-black sm:text-lg">
                          {activeCourse.trainingMode}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          Class Schedule
                        </p>
                        <p className="mt-1 text-base font-extrabold text-black sm:text-lg">
                          {activeCourse.classSchedule}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* 2. What You Will Learn (Image 3) */}
              <section aria-labelledby="what-you-learn-heading">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2
                    id="what-you-learn-heading"
                    className="text-xl font-extrabold tracking-tight text-black sm:text-2xl"
                  >
                    What you will learn
                  </h2>
                  <span className="text-xs font-bold text-neutral-500">
                    {activeCourse.curriculumModules.length} Core Modules
                  </span>
                </div>
                <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
                  {activeCourse.curriculumModules.map((mod, idx) => (
                    <div key={`${mod.title}-${idx}`} className="flex items-start gap-4 p-5">
                      {renderModuleIcon(mod.icon)}
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-black">{mod.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{mod.topics}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Month-by-Month Course Structure (Image 1) */}
              <section aria-labelledby="course-structure-heading">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2
                    id="course-structure-heading"
                    className="text-xl font-extrabold tracking-tight text-black sm:text-2xl"
                  >
                    {activeCourse.roadmapHeading || 'Course structure'}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500">
                    <GitBranch size={13} aria-hidden /> Step-by-step track
                  </span>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <ol className="space-y-6">
                    {activeCourse.roadmap.map((item, index) => {
                      const isLast = index === activeCourse.roadmap.length - 1;
                      return (
                        <li key={`${item.title}-${index}`} className="relative flex gap-4">
                          <div className="flex flex-col items-center">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-50 text-xs font-extrabold text-black">
                              {item.step || index + 1}
                            </span>
                            {!isLast && <span className="mt-2 h-full w-px bg-neutral-200" aria-hidden />}
                          </div>
                          <div className={isLast ? '' : 'pb-1'}>
                            <h3 className="text-base font-extrabold text-black">{item.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                              {item.summary}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </section>

              {/* 4. Training Schedule & What Students Receive (Image 4) */}
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-black" aria-hidden />
                    <h2 className="text-xl font-extrabold tracking-tight text-black">
                      Training schedule
                    </h2>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-neutral-100">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-50 text-xs font-extrabold uppercase tracking-wider text-neutral-700">
                        <tr>
                          <th className="px-3.5 py-2.5">Details</th>
                          <th className="px-3.5 py-2.5">Proposed schedule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {activeCourse.scheduleDetails.map((row, idx) => (
                          <tr key={`${row.label}-${idx}`}>
                            <td className="px-3.5 py-2.5 font-semibold text-neutral-600">
                              {row.label}
                            </td>
                            <td className="px-3.5 py-2.5 font-bold text-black">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Award size={18} className="text-black" aria-hidden />
                    <h2 className="text-xl font-extrabold tracking-tight text-black">
                      What students receive
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {activeCourse.studentBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-800">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          <Check size={12} strokeWidth={3} aria-hidden />
                        </span>
                        <span className="font-medium leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 5. Course Fee & Instalment Plan (Image 6) */}
              <section aria-labelledby="course-fee-heading">
                <h2
                  id="course-fee-heading"
                  className="mb-4 text-xl font-extrabold tracking-tight text-black sm:text-2xl"
                >
                  Course fee
                </h2>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                    {activeCourse.shortName.toUpperCase()}
                  </p>
                  <p className="mt-2 text-4xl font-black tabular-nums text-emerald-700">
                    {activeCourse.feeDisplay}
                  </p>
                  <p className="mt-1 text-sm font-medium text-neutral-500">Total course fee</p>

                  <div className="mt-6 border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between pb-2.5 text-xs font-extrabold uppercase tracking-wider text-black">
                      <span>Payment</span>
                      <span>Amount</span>
                    </div>
                    <div className="divide-y divide-neutral-100 border-t border-neutral-100">
                      {activeCourse.instalments.map((inst, idx) => (
                        <div
                          key={`${inst.label}-${idx}`}
                          className="flex items-center justify-between py-3 text-sm"
                        >
                          <span className="font-medium text-neutral-700">{inst.label}</span>
                          <span className="font-extrabold tabular-nums text-black">
                            {inst.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeCourse.feeNote && (
                    <p className="mt-4 border-t border-neutral-100 pt-3 text-xs leading-relaxed text-neutral-500">
                      {activeCourse.feeNote}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT 5 COLS: Sticky Student Enquiry Form + Trust Box */}
            <aside className="space-y-4 lg:col-span-5 lg:sticky lg:top-24">
              <CourseEnquiryForm
                courses={courses}
                selectedCourse={activeCourse}
                onSelectCourse={(next) => navigate(`/courses/${next.slug}`)}
                sourcePage={`/courses/${activeCourse.slug}`}
              />

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-black">
                  <Briefcase size={14} aria-hidden /> NexaTalent Placement &amp; Project Promise
                </div>
                <ul className="mt-3 space-y-2 text-xs font-semibold text-neutral-700">
                  <li className="flex items-center gap-2">
                    <Check size={13} className="shrink-0 text-emerald-700" /> 100% Placement Support
                    with direct hiring referrals
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={13} className="shrink-0 text-emerald-700" /> Industry-led live
                    projects &amp; GitHub code reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={13} className="shrink-0 text-emerald-700" /> Weekly 1-on-1 mock
                    interviews &amp; ATS resume clinics
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <V2Footer />
    </div>
  );
}
