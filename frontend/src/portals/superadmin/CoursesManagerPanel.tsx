import { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { coursesApi } from '../../shared/enterprise/phaseApi';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { Field, inputCls, Modal } from '../../shared/ui/EnterpriseKit';
import { CourseItem } from '../../website/v2/data/coursesData';

const ICON_OPTIONS = [
  { value: 'java', label: 'Java / Core Language' },
  { value: 'spring', label: 'Spring Boot / Architecture' },
  { value: 'database', label: 'Database / SQL / MongoDB' },
  { value: 'frontend', label: 'Frontend / HTML / CSS / JS' },
  { value: 'react', label: 'React.js' },
  { value: 'node', label: 'Node.js / APIs' },
  { value: 'angular', label: 'Angular' },
  { value: 'python', label: 'Python' },
  { value: 'bi', label: 'Power BI / Dashboards' },
  { value: 'chart', label: 'Analytics / Excel / Stats' },
  { value: 'tools', label: 'Developer Tools / DevOps' },
];

function emptyDraftCourse(): CourseItem {
  return {
    id: '',
    slug: '',
    shortName: '',
    eyebrow: '',
    title: '',
    category: 'Full Stack Development',
    status: 'Published',
    admissionsBadge: 'Admissions Open – Bengaluru & Online',
    summary: '',
    heroImage:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    fee: 35000,
    feeDisplay: '₹35,000',
    duration: '4 Months',
    trainingMode: 'Online + Offline',
    classSchedule: '5 Days / Week',
    roadmapHeading: '4-month course structure',
    curriculumModules: [
      { icon: 'frontend', title: 'Core Foundations', topics: 'Fundamentals, OOP, Practice Labs' },
    ],
    roadmap: [
      { step: 1, title: 'Month 1 – Fundamentals', summary: 'Core concepts and coding exercises.' },
    ],
    scheduleDetails: [
      { label: 'Duration', value: '4 months' },
      { label: 'Classes', value: 'Monday–Friday' },
      { label: 'Daily class', value: '2 hours' },
      { label: 'Weekly training', value: '10 hours' },
      { label: 'Practical sessions', value: 'Included' },
      { label: 'Projects', value: '2 industry-oriented projects' },
      { label: 'Mode', value: 'Online / Classroom' },
    ],
    studentBenefits: [
      'Live instructor-led training',
      'Hands-on coding practice',
      'Course materials and assignments',
      'Real-time project experience',
      'Resume building',
      'Mock technical interviews',
      'Course completion certificate',
      'Placement assistance and interview guidance (no job guarantee)',
    ],
    instalments: [
      { label: 'Registration', amount: '₹5,000' },
      { label: 'First instalment', amount: '₹15,000' },
      { label: 'Final instalment', amount: '₹15,000' },
    ],
    feeNote:
      'Illustrative instalment plan. Confirm GST treatment and applicable taxes before publishing.',
    sortOrder: 7,
  };
}

export function CoursesManagerPanel() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [tick, setTick] = useState(0);

  const [editing, setEditing] = useState<CourseItem | null>(null);
  const [editorTab, setEditorTab] = useState<'overview' | 'curriculum' | 'schedule'>('overview');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res: any = await coursesApi.listAdmin();
        setCourses(Array.isArray(res?.data) ? res.data : []);
      } catch (e: any) {
        setError(e?.message || 'Could not load courses from API.');
      } finally {
        setLoading(false);
      }
    })();
  }, [tick]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const openCreate = () => {
    setEditorTab('overview');
    setEditing({ ...emptyDraftCourse(), sortOrder: courses.length + 1 });
  };

  const openEdit = (c: CourseItem) => {
    setEditorTab('overview');
    setEditing(JSON.parse(JSON.stringify(c)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title.trim() || !editing.shortName.trim()) {
      setError('Short Name and Program Title are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...editing,
        fee: Number(editing.fee) || 0,
        feeDisplay:
          editing.feeDisplay.trim() ||
          `₹${Number(editing.fee || 0).toLocaleString('en-IN')}`,
        studentBenefits: editing.studentBenefits.filter((b) => b.trim().length > 0),
      };
      if (editing.id) {
        await coursesApi.update(editing.id, payload);
        showToast(`Updated "${editing.shortName}" — live on /courses.`);
      } else {
        await coursesApi.create(payload);
        showToast(`Created "${editing.shortName}" — live on /courses.`);
      }
      setEditing(null);
      setTick((t) => t + 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (c: CourseItem) => {
    const nextStatus = c.status === 'Published' ? 'Draft' : 'Published';
    try {
      await coursesApi.update(c.id, { status: nextStatus });
      setCourses((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: nextStatus } : x)));
      showToast(`${c.shortName} marked as ${nextStatus}.`);
    } catch (err: any) {
      setError(err?.message || 'Status update failed.');
    }
  };

  const deleteCourse = async (c: CourseItem) => {
    if (!window.confirm(`Archive course "${c.shortName}"? It will be hidden from the public catalog.`))
      return;
    try {
      await coursesApi.remove(c.id);
      setCourses((prev) => prev.filter((x) => x.id !== c.id));
      showToast(`${c.shortName} archived.`);
    } catch (err: any) {
      setError(err?.message || 'Archive failed.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header strip */}
      <div className="flex flex-col justify-between gap-3 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
            <BookOpen size={18} className="text-blue-600" /> Nexa Courses Catalog &amp; Editor
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Edit course fees, modules, monthly roadmap, schedules, instalments, and admission status live.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/courses"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-400"
          >
            Preview Live Page <ExternalLink size={13} />
          </a>
          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-400"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Plus size={14} /> Add New Course
          </button>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <InlineLoading message="Loading Nexa Courses catalog…" />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses configured"
          message="Add your first training program to showcase it on /courses."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {c.category} · #{c.sortOrder}
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-slate-900">{c.shortName}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleStatus(c)}
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                      c.status === 'Published'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {c.status}
                  </button>
                </div>

                <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-500">{c.summary}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Fee</span>
                    <span className="font-extrabold text-emerald-700">{c.feeDisplay}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Duration
                    </span>
                    <span className="font-bold text-slate-900">{c.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Mode</span>
                    <span className="font-bold text-slate-800">{c.trainingMode}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Leads
                    </span>
                    <span className="font-extrabold text-blue-700">{c.leadCount ?? 0} enquiries</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <div className="text-[11px] font-semibold text-slate-400">
                  {c.curriculumModules?.length || 0} modules · {c.roadmap?.length || 0} steps
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <Pencil size={12} /> Edit Course
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCourse(c)}
                    aria-label={`Archive ${c.shortName}`}
                    className="rounded-xl border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Course Editor Modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit Course: ${editing.shortName}` : 'Create New Nexa Course'}
        subtitle="Changes publish directly to the public /courses page."
        wide
      >
        {editing && (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(
                [
                  ['overview', '1. Overview & Pricing'],
                  ['curriculum', '2. Modules & Monthly Roadmap'],
                  ['schedule', '3. Schedule, Benefits & Instalments'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEditorTab(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    editorTab === key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {editorTab === 'overview' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Short Name *">
                  <input
                    required
                    value={editing.shortName}
                    onChange={(e) => setEditing({ ...editing, shortName: e.target.value })}
                    placeholder="e.g. Java Full Stack"
                    className={inputCls}
                  />
                </Field>
                <Field label="URL Slug">
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="e.g. java-full-stack"
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Full Headline Title *">
                    <input
                      required
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="e.g. Become a Java Full Stack Developer"
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field label="Uppercase Eyebrow">
                  <input
                    value={editing.eyebrow}
                    onChange={(e) => setEditing({ ...editing, eyebrow: e.target.value })}
                    placeholder="JAVA FULL STACK DEVELOPER PROGRAM"
                    className={inputCls}
                  />
                </Field>
                <Field label="Category">
                  <input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    placeholder="Full Stack Development"
                    className={inputCls}
                  />
                </Field>
                <Field label="Admissions Badge">
                  <input
                    value={editing.admissionsBadge}
                    onChange={(e) => setEditing({ ...editing, admissionsBadge: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        status: e.target.value as 'Published' | 'Draft',
                      })
                    }
                    className={inputCls}
                  >
                    <option value="Published">Published (Visible on site)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </Field>
                <Field label="Fee Amount (INR Number)">
                  <input
                    type="number"
                    value={editing.fee}
                    onChange={(e) => {
                      const num = Number(e.target.value || 0);
                      setEditing({
                        ...editing,
                        fee: num,
                        feeDisplay: `₹${num.toLocaleString('en-IN')}`,
                      });
                    }}
                    className={inputCls}
                  />
                </Field>
                <Field label="Fee Display Text">
                  <input
                    value={editing.feeDisplay}
                    onChange={(e) => setEditing({ ...editing, feeDisplay: e.target.value })}
                    placeholder="₹40,000"
                    className={inputCls}
                  />
                </Field>
                <Field label="Duration">
                  <input
                    value={editing.duration}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    placeholder="4 Months"
                    className={inputCls}
                  />
                </Field>
                <Field label="Training Mode">
                  <input
                    value={editing.trainingMode}
                    onChange={(e) => setEditing({ ...editing, trainingMode: e.target.value })}
                    placeholder="Online + Offline"
                    className={inputCls}
                  />
                </Field>
                <Field label="Class Schedule">
                  <input
                    value={editing.classSchedule}
                    onChange={(e) => setEditing({ ...editing, classSchedule: e.target.value })}
                    placeholder="5 Days / Week"
                    className={inputCls}
                  />
                </Field>
                <Field label="Display Order">
                  <input
                    type="number"
                    value={editing.sortOrder}
                    onChange={(e) =>
                      setEditing({ ...editing, sortOrder: Number(e.target.value || 1) })
                    }
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Banner Image URL">
                    <input
                      value={editing.heroImage}
                      onChange={(e) => setEditing({ ...editing, heroImage: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Program Summary">
                    <textarea
                      rows={3}
                      value={editing.summary}
                      onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            )}

            {editorTab === 'curriculum' && (
              <div className="space-y-5">
                {/* Modules */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      What You Will Learn (Modules)
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          curriculumModules: [
                            ...editing.curriculumModules,
                            { icon: 'tools', title: '', topics: '' },
                          ],
                        })
                      }
                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      + Add Module
                    </button>
                  </div>

                  {editing.curriculumModules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-12"
                    >
                      <div className="sm:col-span-3">
                        <select
                          value={mod.icon}
                          onChange={(e) => {
                            const next = [...editing.curriculumModules];
                            next[idx] = { ...mod, icon: e.target.value };
                            setEditing({ ...editing, curriculumModules: next });
                          }}
                          className={inputCls}
                        >
                          {ICON_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          placeholder="Module Title"
                          value={mod.title}
                          onChange={(e) => {
                            const next = [...editing.curriculumModules];
                            next[idx] = { ...mod, title: e.target.value };
                            setEditing({ ...editing, curriculumModules: next });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          placeholder="Topics (comma separated)"
                          value={mod.topics}
                          onChange={(e) => {
                            const next = [...editing.curriculumModules];
                            next[idx] = { ...mod, topics: e.target.value };
                            setEditing({ ...editing, curriculumModules: next });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div className="flex items-center justify-end sm:col-span-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              curriculumModules: editing.curriculumModules.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Roadmap */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Month-by-Month Course Structure
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          roadmap: [
                            ...editing.roadmap,
                            {
                              step: editing.roadmap.length + 1,
                              title: `Month ${editing.roadmap.length + 1} – `,
                              summary: '',
                            },
                          ],
                        })
                      }
                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      + Add Step
                    </button>
                  </div>
                  <Field label="Roadmap Section Heading">
                    <input
                      value={editing.roadmapHeading}
                      onChange={(e) => setEditing({ ...editing, roadmapHeading: e.target.value })}
                      placeholder="4-month course structure"
                      className={inputCls}
                    />
                  </Field>

                  {editing.roadmap.map((step, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-12"
                    >
                      <div className="sm:col-span-4">
                        <input
                          placeholder="Month 1 – Core Java"
                          value={step.title}
                          onChange={(e) => {
                            const next = [...editing.roadmap];
                            next[idx] = { ...step, step: idx + 1, title: e.target.value };
                            setEditing({ ...editing, roadmap: next });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div className="sm:col-span-7">
                        <input
                          placeholder="Topics & outcomes covered"
                          value={step.summary}
                          onChange={(e) => {
                            const next = [...editing.roadmap];
                            next[idx] = { ...step, step: idx + 1, summary: e.target.value };
                            setEditing({ ...editing, roadmap: next });
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div className="flex items-center justify-end sm:col-span-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              roadmap: editing.roadmap
                                .filter((_, i) => i !== idx)
                                .map((r, i) => ({ ...r, step: i + 1 })),
                            })
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editorTab === 'schedule' && (
              <div className="space-y-5">
                {/* Schedule Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Training Schedule Rows
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          scheduleDetails: [...editing.scheduleDetails, { label: '', value: '' }],
                        })
                      }
                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      + Add Row
                    </button>
                  </div>
                  {editing.scheduleDetails.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-11 gap-2">
                      <input
                        placeholder="Detail (e.g. Daily class)"
                        value={row.label}
                        onChange={(e) => {
                          const next = [...editing.scheduleDetails];
                          next[idx] = { ...row, label: e.target.value };
                          setEditing({ ...editing, scheduleDetails: next });
                        }}
                        className={`col-span-5 ${inputCls}`}
                      />
                      <input
                        placeholder="Schedule (e.g. 2 hours)"
                        value={row.value}
                        onChange={(e) => {
                          const next = [...editing.scheduleDetails];
                          next[idx] = { ...row, value: e.target.value };
                          setEditing({ ...editing, scheduleDetails: next });
                        }}
                        className={`col-span-5 ${inputCls}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            scheduleDetails: editing.scheduleDetails.filter((_, i) => i !== idx),
                          })
                        }
                        className="col-span-1 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Instalments */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Instalment Plan Rows
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          instalments: [...editing.instalments, { label: '', amount: '' }],
                        })
                      }
                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      + Add Instalment
                    </button>
                  </div>
                  {editing.instalments.map((inst, idx) => (
                    <div key={idx} className="grid grid-cols-11 gap-2">
                      <input
                        placeholder="Payment (e.g. Registration)"
                        value={inst.label}
                        onChange={(e) => {
                          const next = [...editing.instalments];
                          next[idx] = { ...inst, label: e.target.value };
                          setEditing({ ...editing, instalments: next });
                        }}
                        className={`col-span-5 ${inputCls}`}
                      />
                      <input
                        placeholder="Amount (e.g. ₹5,000)"
                        value={inst.amount}
                        onChange={(e) => {
                          const next = [...editing.instalments];
                          next[idx] = { ...inst, amount: e.target.value };
                          setEditing({ ...editing, instalments: next });
                        }}
                        className={`col-span-5 ${inputCls}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            instalments: editing.instalments.filter((_, i) => i !== idx),
                          })
                        }
                        className="col-span-1 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <Field label="Fee / Tax Disclaimer Note">
                    <input
                      value={editing.feeNote}
                      onChange={(e) => setEditing({ ...editing, feeNote: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Student Benefits */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <Field label="What Students Receive (One per line)">
                    <textarea
                      rows={5}
                      value={editing.studentBenefits.join('\n')}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          studentBenefits: e.target.value.split('\n'),
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing.id ? 'Save Course Changes' : 'Create Course'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
