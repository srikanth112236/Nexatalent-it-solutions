import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Database,
  FileSpreadsheet,
  GitBranch,
  Globe,
  Layers,
  MapPin,
  MonitorPlay,
  Phone,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  User,
  Wrench,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SafeImage } from '../components/SafeImage';
import { SeoHead } from '../../components/SeoHead';
import { coursesApi, courseLeadsApi } from '../../../shared/enterprise/phaseApi';
import {
  CourseItem,
  EDUCATION_BACKGROUNDS,
  FALLBACK_COURSES,
  TRAINING_MODES,
} from '../data/coursesData';

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

export function NewCoursesPage() {
  const { courseSlug } = useParams<{ courseSlug?: string }>();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseItem[]>(FALLBACK_COURSES);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedSlug, setSelectedSlug] = useState<string>(
    courseSlug || FALLBACK_COURSES[0].slug,
  );

  // Student Enquiry Form state
  const [studentName, setStudentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [educationBackground, setEducationBackground] =
    useState<(typeof EDUCATION_BACKGROUNDS)[number]>('Graduate');
  const [preferredTrainingMode, setPreferredTrainingMode] =
    useState<(typeof TRAINING_MODES)[number]>('Online');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<{
    message: string;
    courseName: string;
    studentName: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingCourses(true);
      try {
        const res: any = await coursesApi.listPublic();
        const rows = Array.isArray(res?.data) ? res.data : [];
        if (active && rows.length > 0) {
          setCourses(rows);
        }
      } catch {
        // Fallback seeded catalog remains active if backend is offline
      } finally {
        if (active) setLoadingCourses(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (courseSlug) {
      const match = courses.find((c) => c.slug === courseSlug || c.id === courseSlug);
      if (match) setSelectedSlug(match.slug);
    }
  }, [courseSlug, courses]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));
    return ['All', ...cats];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (categoryFilter === 'All') return courses;
    return courses.filter((c) => c.category === categoryFilter);
  }, [courses, categoryFilter]);

  const activeCourse = useMemo(() => {
    return (
      courses.find((c) => c.slug === selectedSlug || c.id === selectedSlug) ||
      filteredCourses[0] ||
      courses[0] ||
      FALLBACK_COURSES[0]
    );
  }, [courses, filteredCourses, selectedSlug]);

  const selectCourse = (course: CourseItem, scrollToDetails = false) => {
    setSelectedSlug(course.slug);
    setSubmitSuccess(null);
    setFormError('');
    if (courseSlug) {
      navigate(`/courses/${course.slug}`, { replace: true });
    }
    if (scrollToDetails) {
      document.getElementById('course-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToForm = () => {
    document.getElementById('course-enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const nameTrimmed = studentName.trim();
    const digits = mobileNumber.replace(/\D/g, '');

    if (nameTrimmed.length < 2) {
      setFormError('Please enter the student full name.');
      return;
    }
    if (digits.length < 10 || digits.length > 15) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const res: any = await courseLeadsApi.submitPublic({
        courseId: activeCourse.id,
        courseSlug: activeCourse.slug,
        studentName: nameTrimmed,
        mobileNumber: mobileNumber.trim(),
        educationBackground,
        preferredTrainingMode,
        sourcePage: `/courses/${activeCourse.slug}`,
      });
      setSubmitSuccess({
        message:
          res?.message ||
          `Enquiry submitted for ${activeCourse.shortName}. Our admissions team will contact you shortly.`,
        courseName: activeCourse.shortName,
        studentName: nameTrimmed,
      });
      setStudentName('');
      setMobileNumber('');
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not submit enquiry right now. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title={`Nexa Courses — ${activeCourse.shortName} & Career Training | NexaTalent`}
        description="Industry-aligned Java Full Stack, MERN, MEAN, Python Full Stack, Power BI, and Data Analyst training programs by NexaTalent IT Solutions."
        canonicalPath="/courses"
      />
      <V2Navbar />

      <main id="main-content" className="pb-20">
        {/* Editorial Header + Course Catalog Explorer */}
        <section className="border-b border-neutral-100 bg-white px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-600">
                  NexaTalent IT Solutions · Nexa Courses
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-5xl sm:leading-[1.08]">
                  Practical engineering &amp; analytics programs built for real hiring bars.
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  Instructor-led cohorts in Bengaluru &amp; Live Online. Pick a track to inspect the
                  month-by-month syllabus, training schedule, instalment plan, and apply in under a
                  minute.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  Admissions Open – Bengaluru &amp; Online
                </span>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-black px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
                >
                  Apply for Counselling <ArrowRight size={14} aria-hidden />
                </button>
              </div>
            </div>

            {/* Category filter pills */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-6">
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
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                        active
                          ? 'bg-black text-white shadow-sm'
                          : 'border border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-semibold text-neutral-500">
                {loadingCourses ? 'Syncing live catalog…' : `${filteredCourses.length} career programs available`}
              </p>
            </div>

            {/* Course switcher cards */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
                const isSelected = course.id === activeCourse.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => selectCourse(course, true)}
                    className={`group flex flex-col justify-between rounded-2xl border p-5 text-left transition-all ${
                      isSelected
                        ? 'border-black bg-neutral-50/80 shadow-sm ring-1 ring-black'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                          {course.category}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {course.duration}
                        </span>
                      </div>
                      <h2 className="mt-2.5 text-lg font-extrabold tracking-tight text-black">
                        {course.shortName}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                        {course.summary}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Course Fee
                        </span>
                        <span className="text-base font-extrabold tabular-nums text-emerald-700">
                          {course.feeDisplay}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold ${
                          isSelected ? 'text-black' : 'text-neutral-600 group-hover:text-black'
                        }`}
                      >
                        {isSelected ? 'Viewing Syllabus' : 'View Curriculum'}
                        <ArrowRight size={13} aria-hidden />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Detailed Program + Sticky Student Admission Form */}
        <section id="course-details" className="bg-white px-4 pt-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* LEFT 7 COLS: Full Program Breakdown matching Reference Images 1, 2, 3, 4, 6 */}
            <div className="space-y-8 lg:col-span-7">
              {/* 1. Program Overview Hero Card (Image 2) */}
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

                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                      {activeCourse.title}
                    </h2>
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
                  <h3
                    id="what-you-learn-heading"
                    className="text-xl font-extrabold tracking-tight text-black sm:text-2xl"
                  >
                    What you will learn
                  </h3>
                  <span className="text-xs font-bold text-neutral-500">
                    {activeCourse.curriculumModules.length} Core Modules
                  </span>
                </div>
                <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
                  {activeCourse.curriculumModules.map((mod, idx) => (
                    <div key={`${mod.title}-${idx}`} className="flex items-start gap-4 p-5">
                      {renderModuleIcon(mod.icon)}
                      <div className="min-w-0">
                        <h4 className="text-base font-extrabold text-black">{mod.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{mod.topics}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Month-by-Month Course Structure (Image 1) */}
              <section aria-labelledby="course-structure-heading">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3
                    id="course-structure-heading"
                    className="text-xl font-extrabold tracking-tight text-black sm:text-2xl"
                  >
                    {activeCourse.roadmapHeading || 'Course structure'}
                  </h3>
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
                            <h4 className="text-base font-extrabold text-black">{item.title}</h4>
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
                    <h3 className="text-xl font-extrabold tracking-tight text-black">
                      Training schedule
                    </h3>
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
                    <h3 className="text-xl font-extrabold tracking-tight text-black">
                      What students receive
                    </h3>
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
                <h3
                  id="course-fee-heading"
                  className="mb-4 text-xl font-extrabold tracking-tight text-black sm:text-2xl"
                >
                  Course fee
                </h3>
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

            {/* RIGHT 5 COLS: Sticky Student Enquiry / Admission Form (Image 5) */}
            <aside id="course-enquiry-form" className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-neutral-500">
                      Student admission &amp; counselling
                    </p>
                    <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-black">
                      Apply for {activeCourse.shortName} Training
                    </h2>
                    <p className="mt-1 text-xs font-medium text-neutral-500">
                      NexaTalent IT Solutions – Student Enquiry Form
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                    <BookOpen size={18} aria-hidden />
                  </span>
                </div>

                {/* Bound course selector */}
                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
                  <label
                    htmlFor="enquiry-course-select"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500"
                  >
                    Selected Program
                  </label>
                  <select
                    id="enquiry-course-select"
                    value={activeCourse.slug}
                    onChange={(e) => {
                      const next = courses.find((c) => c.slug === e.target.value);
                      if (next) selectCourse(next, false);
                    }}
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-black outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.shortName} ({c.feeDisplay} · {c.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {submitSuccess ? (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
                    <div className="flex items-center gap-2 text-base font-extrabold text-emerald-900">
                      <CheckCircle2 size={20} className="text-emerald-700" aria-hidden />
                      Application Enquiry Received
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-900">
                      {submitSuccess.message}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-full bg-white px-3 py-1 text-emerald-900 ring-1 ring-emerald-200">
                        Course: {submitSuccess.courseName}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-emerald-900 ring-1 ring-emerald-200">
                        Mode: {preferredTrainingMode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(null)}
                      className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="mt-5 space-y-5" noValidate>
                    {formError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700"
                      >
                        {formError}
                      </div>
                    )}

                    {/* 1. Student Name (mandatory) */}
                    <div>
                      <label
                        htmlFor="student-name-input"
                        className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-black"
                      >
                        <User size={13} aria-hidden /> Student name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="student-name-input"
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter your full name"
                        className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-sm font-medium text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                      />
                    </div>

                    {/* 2. Mobile Number (mandatory) */}
                    <div>
                      <label
                        htmlFor="student-mobile-input"
                        className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-black"
                      >
                        <Phone size={13} aria-hidden /> Mobile number <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="student-mobile-input"
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter mobile number (e.g. 9876543210)"
                        className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-sm font-medium text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                      />
                    </div>

                    {/* 3. Education Background (mandatory) */}
                    <fieldset>
                      <legend className="mb-2 text-xs font-extrabold text-black">
                        Education background <span className="text-red-600">*</span>
                      </legend>
                      <div className="space-y-2">
                        {EDUCATION_BACKGROUNDS.map((opt) => {
                          const checked = educationBackground === opt;
                          return (
                            <label
                              key={opt}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
                                checked
                                  ? 'border-black bg-neutral-50 text-black'
                                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="educationBackground"
                                value={opt}
                                checked={checked}
                                onChange={() => setEducationBackground(opt)}
                                className="h-4 w-4 accent-black"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* 4. Preferred Training Mode (mandatory) */}
                    <fieldset>
                      <legend className="mb-2 text-xs font-extrabold text-black">
                        Preferred training mode <span className="text-red-600">*</span>
                      </legend>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {TRAINING_MODES.map((mode) => {
                          const checked = preferredTrainingMode === mode;
                          return (
                            <label
                              key={mode}
                              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                                checked
                                  ? 'border-black bg-neutral-50 text-black'
                                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="preferredTrainingMode"
                                value={mode}
                                checked={checked}
                                onChange={() => setPreferredTrainingMode(mode)}
                                className="h-4 w-4 accent-black"
                              />
                              <span className="flex items-center gap-1.5">
                                {mode.includes('Offline') ? (
                                  <MapPin size={13} aria-hidden />
                                ) : (
                                  <MonitorPlay size={13} aria-hidden />
                                )}
                                {mode}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60"
                    >
                      {submitting ? 'Submitting Enquiry…' : `Enquire for ${activeCourse.shortName}`}
                      {!submitting && <ArrowRight size={15} aria-hidden />}
                    </button>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-[11px] font-semibold text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} aria-hidden /> Next batch counselling daily
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles size={12} aria-hidden /> Free career roadmap call
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <V2Footer />
    </div>
  );
}
