import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  MapPin,
  MonitorPlay,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import { courseLeadsApi } from '../../../shared/enterprise/phaseApi';
import {
  CourseItem,
  EDUCATION_BACKGROUNDS,
  TRAINING_MODES,
} from '../data/coursesData';

interface CourseEnquiryFormProps {
  courses: CourseItem[];
  selectedCourse: CourseItem;
  onSelectCourse?: (course: CourseItem) => void;
  sourcePage?: string;
  lockCourse?: boolean;
}

export function CourseEnquiryForm({
  courses,
  selectedCourse,
  onSelectCourse,
  sourcePage,
  lockCourse = false,
}: CourseEnquiryFormProps) {
  const [courseSlug, setCourseSlug] = useState(selectedCourse.slug);
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
    mode: string;
  } | null>(null);

  useEffect(() => {
    setCourseSlug(selectedCourse.slug);
    setSubmitSuccess(null);
    setFormError('');
  }, [selectedCourse.slug]);

  const boundCourse =
    courses.find((c) => c.slug === courseSlug || c.id === courseSlug) || selectedCourse;

  const handleSubmit = async (e: React.FormEvent) => {
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
        courseId: boundCourse.id,
        courseSlug: boundCourse.slug,
        studentName: nameTrimmed,
        mobileNumber: mobileNumber.trim(),
        educationBackground,
        preferredTrainingMode,
        sourcePage: sourcePage || `/courses/${boundCourse.slug}`,
      });
      setSubmitSuccess({
        message:
          res?.message ||
          `Enquiry submitted for ${boundCourse.shortName}. Our admissions team will contact you shortly.`,
        courseName: boundCourse.shortName,
        mode: preferredTrainingMode,
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
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-neutral-500">
            Student admission &amp; counselling
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-black">
            Apply for {boundCourse.shortName} Training
          </h2>
          <p className="mt-1 text-xs font-medium text-neutral-500">
            NexaTalent IT Solutions – Student Enquiry Form
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
          <BookOpen size={18} aria-hidden />
        </span>
      </div>

      {/* Course Selector */}
      <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
        <label
          htmlFor={`enquiry-course-select-${boundCourse.id}`}
          className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500"
        >
          Enrolling Program
        </label>
        {lockCourse ? (
          <p className="mt-1 text-sm font-extrabold text-black">
            {boundCourse.shortName} ({boundCourse.feeDisplay} · {boundCourse.duration})
          </p>
        ) : (
          <select
            id={`enquiry-course-select-${boundCourse.id}`}
            value={boundCourse.slug}
            onChange={(e) => {
              const next = courses.find((c) => c.slug === e.target.value);
              if (next) {
                setCourseSlug(next.slug);
                onSelectCourse?.(next);
              }
            }}
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-black outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.shortName} ({c.feeDisplay} · {c.duration})
              </option>
            ))}
          </select>
        )}
      </div>

      {submitSuccess ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
          <div className="flex items-center gap-2 text-base font-extrabold text-emerald-900">
            <CheckCircle2 size={20} className="text-emerald-700" aria-hidden />
            Application Enquiry Received
          </div>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900">{submitSuccess.message}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white px-3 py-1 text-emerald-900 ring-1 ring-emerald-200">
              Course: {submitSuccess.courseName}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-emerald-900 ring-1 ring-emerald-200">
              Mode: {submitSuccess.mode}
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
        <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
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
              htmlFor={`student-name-${boundCourse.id}`}
              className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-black"
            >
              <User size={13} aria-hidden /> Student name <span className="text-red-600">*</span>
            </label>
            <input
              id={`student-name-${boundCourse.id}`}
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
              htmlFor={`student-mobile-${boundCourse.id}`}
              className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-black"
            >
              <Phone size={13} aria-hidden /> Mobile number <span className="text-red-600">*</span>
            </label>
            <input
              id={`student-mobile-${boundCourse.id}`}
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
                      name={`educationBackground-${boundCourse.id}`}
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
                      name={`preferredTrainingMode-${boundCourse.id}`}
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
            {submitting ? 'Submitting Enquiry…' : `Enquire for ${boundCourse.shortName}`}
            {!submitting && <ArrowRight size={15} aria-hidden />}
          </button>

          <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-[11px] font-semibold text-neutral-500">
            <span className="flex items-center gap-1">
              <Clock size={12} aria-hidden /> Next batch counselling daily
            </span>
            <span className="flex items-center gap-1">
              <Sparkles size={12} aria-hidden /> 100% placement support
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
