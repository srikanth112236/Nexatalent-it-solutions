import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  Filter,
  GraduationCap,
  MapPin,
  MonitorPlay,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { courseLeadsApi, coursesApi } from '../../shared/enterprise/phaseApi';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { Field, inputCls, Modal } from '../../shared/ui/EnterpriseKit';
import {
  COURSE_LEAD_STAGES,
  CourseItem,
  CourseLeadItem,
  EDUCATION_BACKGROUNDS,
  TRAINING_MODES,
} from '../../website/v2/data/coursesData';

const STAGE_BADGE: Record<string, string> = {
  New: 'border-blue-200 bg-blue-50 text-blue-700',
  Counselled: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  'Demo Scheduled': 'border-amber-200 bg-amber-50 text-amber-800',
  Enrolled: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Follow-up': 'border-purple-200 bg-purple-50 text-purple-700',
  Dropped: 'border-red-200 bg-red-50 text-red-700',
};

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CourseLeadsPanel() {
  const [leads, setLeads] = useState<CourseLeadItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  // Filters
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [stageF, setStageF] = useState<string>('');
  const [modeF, setModeF] = useState<string>('');
  const [eduF, setEduF] = useState<string>('');
  const [q, setQ] = useState<string>('');

  // Detail modal
  const [activeLead, setActiveLead] = useState<CourseLeadItem | null>(null);
  const [counsellorInput, setCounsellorInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [newActivityNote, setNewActivityNote] = useState('');
  const [savingLead, setSavingLead] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [leadsRes, coursesRes]: any[] = await Promise.all([
          courseLeadsApi.list(),
          coursesApi.listAdmin().catch(() => ({ data: [] })),
        ]);
        setLeads(Array.isArray(leadsRes?.data) ? leadsRes.data : []);
        setCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      } catch (e: any) {
        setError(e?.message || 'Could not load course leads.');
        setLeads([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [tick]);

  const courseTabs = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const c of courses) {
      map.set(c.id, { id: c.id, name: c.shortName || c.title, count: 0 });
    }
    for (const l of leads) {
      const existing = map.get(l.courseId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(l.courseId, {
          id: l.courseId,
          name: l.courseShortName || l.courseTitle || 'Other Course',
          count: 1,
        });
      }
    }
    return Array.from(map.values());
  }, [courses, leads]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (selectedCourseId && l.courseId !== selectedCourseId) return false;
      if (stageF && l.stage !== stageF) return false;
      if (modeF && l.preferredTrainingMode !== modeF) return false;
      if (eduF && l.educationBackground !== eduF) return false;
      if (!term) return true;
      return [
        l.studentName,
        l.mobileNumber,
        l.courseShortName,
        l.courseTitle,
        l.educationBackground,
        l.preferredTrainingMode,
        l.counsellorOwner,
        l.notes,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [leads, selectedCourseId, stageF, modeF, eduF, q]);

  const kpis = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.stage === 'New').length;
    const enrolledCount = leads.filter((l) => l.stage === 'Enrolled').length;
    const onlineCount = leads.filter((l) => l.preferredTrainingMode === 'Online').length;
    const offlineCount = leads.filter((l) => l.preferredTrainingMode !== 'Online').length;
    const topCourse = [...courseTabs].sort((a, b) => b.count - a.count)[0];
    return {
      total,
      newCount,
      enrolledCount,
      onlineCount,
      offlineCount,
      topCourseLabel: topCourse && topCourse.count > 0 ? `${topCourse.name} (${topCourse.count})` : '—',
    };
  }, [leads, courseTabs]);

  const changeStage = async (leadId: string, nextStage: string) => {
    try {
      const res: any = await courseLeadsApi.update(leadId, { stage: nextStage });
      const updated = res?.data;
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated || { ...l, stage: nextStage as any } : l)));
      if (activeLead?.id === leadId && updated) setActiveLead(updated);
    } catch (e: any) {
      setError(e?.message || 'Could not update stage.');
    }
  };

  const openModal = (l: CourseLeadItem) => {
    setActiveLead(l);
    setCounsellorInput(l.counsellorOwner || '');
    setNotesInput(l.notes || '');
    setNewActivityNote('');
  };

  const saveLeadDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    setSavingLead(true);
    try {
      const res: any = await courseLeadsApi.update(activeLead.id, {
        counsellorOwner: counsellorInput,
        notes: notesInput,
        addNote: newActivityNote.trim() || undefined,
      });
      const updated = res?.data;
      if (updated) {
        setLeads((prev) => prev.map((l) => (l.id === activeLead.id ? updated : l)));
        setActiveLead(updated);
        setNewActivityNote('');
      }
    } catch (e: any) {
      setError(e?.message || 'Could not save counselling update.');
    } finally {
      setSavingLead(false);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!window.confirm('Archive this course enquiry lead?')) return;
    try {
      await courseLeadsApi.remove(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (activeLead?.id === leadId) setActiveLead(null);
    } catch (e: any) {
      setError(e?.message || 'Delete failed.');
    }
  };

  const exportCsv = () => {
    const header = [
      'Lead ID',
      'Student Name',
      'Mobile Number',
      'Course',
      'Education Background',
      'Preferred Mode',
      'Stage',
      'Counsellor',
      'Submitted At',
      'Notes',
    ];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map((l) =>
      [
        l.id,
        l.studentName,
        l.mobileNumber,
        l.courseShortName || l.courseTitle,
        l.educationBackground,
        l.preferredTrainingMode,
        l.stage,
        l.counsellorOwner || '',
        l.createdAt,
        l.notes || '',
      ]
        .map(esc)
        .join(','),
    );
    const csv = [header.map(esc).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-course-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selCls =
    'min-h-[36px] rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-black';

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ['Total Course Leads', String(kpis.total)],
          ['New (Unworked)', String(kpis.newCount)],
          ['Enrolled Students', String(kpis.enrolledCount)],
          ['Top Enrolled Track', kpis.topCourseLabel],
          ['Online / Offline', `${kpis.onlineCount} Online · ${kpis.offlineCount} BLR`],
        ].map(([label, val]) => (
          <div key={label} className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p className="mt-1 truncate text-lg font-black tabular-nums text-slate-900">{val}</p>
          </div>
        ))}
      </div>

      {/* Course-wise breakdown pills */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
            <GraduationCap size={14} className="text-blue-600" /> Leads Grouped by Course
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Click a course to inspect its student pipeline
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCourseId('')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              selectedCourseId === ''
                ? 'bg-slate-900 text-white shadow-sm'
                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'
            }`}
          >
            All Courses ({leads.length})
          </button>
          {courseTabs.map((ct) => {
            const active = selectedCourseId === ct.id;
            return (
              <button
                key={ct.id}
                type="button"
                onClick={() => setSelectedCourseId(active ? '' : ct.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {ct.name} ({ct.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter toolbar + Table */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3.5">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-600">
            <Filter size={13} /> Filters
          </span>
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student name, mobile, course…"
              className="min-h-[36px] w-full rounded-xl border border-slate-200 pl-8 pr-3 text-xs font-semibold outline-none focus:border-black"
            />
          </div>

          <select
            value={stageF}
            onChange={(e) => setStageF(e.target.value)}
            aria-label="Filter by stage"
            className={selCls}
          >
            <option value="">All stages</option>
            {COURSE_LEAD_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={modeF}
            onChange={(e) => setModeF(e.target.value)}
            aria-label="Filter by training mode"
            className={selCls}
          >
            <option value="">All modes</option>
            {TRAINING_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={eduF}
            onChange={(e) => setEduF(e.target.value)}
            aria-label="Filter by education background"
            className={selCls}
          >
            <option value="">All backgrounds</option>
            {EDUCATION_BACKGROUNDS.map((eb) => (
              <option key={eb} value={eb}>
                {eb}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="flex min-h-[36px] items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:border-slate-400 disabled:opacity-50"
          >
            <Download size={13} /> Export CSV
          </button>

          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            className="flex min-h-[36px] items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:border-slate-400"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {error && (
          <p className="border-b border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <InlineLoading message="Loading course leads…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No course leads found"
            message="Enquiries submitted from the Nexa Courses admission form appear here grouped by course."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Enrolling Course</th>
                  <th className="px-4 py-3">Education Background</th>
                  <th className="px-4 py-3">Preferred Mode</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((l) => (
                  <tr key={l.id} className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-900">{l.studentName}</div>
                      <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px] font-bold text-slate-500">
                        <Phone size={11} /> {l.mobileNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-900">
                        {l.courseShortName || l.courseTitle}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {l.educationBackground}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                        {l.preferredTrainingMode?.includes('Offline') ? (
                          <MapPin size={12} className="text-emerald-600" />
                        ) : (
                          <MonitorPlay size={12} className="text-blue-600" />
                        )}
                        {l.preferredTrainingMode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={l.stage}
                        onChange={(e) => changeStage(l.id, e.target.value)}
                        aria-label={`Stage for ${l.studentName}`}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold outline-none ${
                          STAGE_BADGE[l.stage] || 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {COURSE_LEAD_STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-semibold text-slate-500">
                      {formatDate(l.createdAt)}
                      {l.counsellorOwner && (
                        <div className="text-[10px] font-bold text-blue-700">
                          Owner: {l.counsellorOwner}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openModal(l)}
                          className="rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800"
                        >
                          Counsel / View
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteLead(l.id)}
                          aria-label={`Archive ${l.studentName}`}
                          className="rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Counselling Detail Modal */}
      <Modal
        open={Boolean(activeLead)}
        onClose={() => setActiveLead(null)}
        title={activeLead ? `${activeLead.studentName} — ${activeLead.courseShortName}` : ''}
        subtitle={activeLead ? `Mobile: ${activeLead.mobileNumber} · ${activeLead.id}` : ''}
        wide
      >
        {activeLead && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-4">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Course</span>
                <span className="font-extrabold text-slate-900">{activeLead.courseShortName}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Education
                </span>
                <span className="font-bold text-slate-800">{activeLead.educationBackground}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Mode</span>
                <span className="font-bold text-slate-800">{activeLead.preferredTrainingMode}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Stage</span>
                <select
                  value={activeLead.stage}
                  onChange={(e) => changeStage(activeLead.id, e.target.value)}
                  className="mt-0.5 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-900"
                >
                  {COURSE_LEAD_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={saveLeadDetails} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Assigned Counsellor">
                  <input
                    value={counsellorInput}
                    onChange={(e) => setCounsellorInput(e.target.value)}
                    placeholder="e.g. admissions@nexatalent.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Log Counselling / Call Note">
                  <input
                    value={newActivityNote}
                    onChange={(e) => setNewActivityNote(e.target.value)}
                    placeholder="e.g. Spoke with student, demo booked for Saturday"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="General Remarks / Batch Preference">
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Optional summary notes"
                  className={inputCls}
                />
              </Field>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingLead}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <UserCheck size={14} /> {savingLead ? 'Saving…' : 'Save Counselling Update'}
                </button>
              </div>
            </form>

            {/* Activity timeline */}
            <div className="border-t border-slate-100 pt-3">
              <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Counselling Activity Log
              </h4>
              <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                {(activeLead.activities || []).length === 0 ? (
                  <p className="text-xs text-slate-400">No activity recorded yet.</p>
                ) : (
                  (activeLead.activities || []).map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span className="uppercase">{a.type} · {a.actor}</span>
                        <span>{formatDate(a.createdAt)}</span>
                      </div>
                      <p className="mt-1 font-semibold text-slate-800">{a.notes}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
