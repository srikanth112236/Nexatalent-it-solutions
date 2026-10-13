import { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, CheckCircle2, Upload, FileText, ShieldCheck } from 'lucide-react';
import { EnquirySelect } from './EnquirySelect';
import { submitLead } from '../lib/leadCapture';

interface Props {
  jobTitle: string;
  jobSlug: string;
  sourcePage: string;
  onClose: () => void;
}

const field =
  'min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] outline-none placeholder:text-black/50 focus:border-black focus:ring-2 focus:ring-black/15';

const EXPERIENCE = ['0–1 yrs', '1–3 yrs', '3–5 yrs', '5–8 yrs', '8–12 yrs', '12+ yrs'];
const NOTICE = ['Immediate joiner', '15 days', '30 days', '60 days', '90 days'];
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * No-login job application: candidate details + resume upload.
 * Submits a tracked lead (formName "Careers", enquiryType candidate) to
 * /api/v1/enquiries — visible in Superadmin Website Leads with resume download.
 */
export function CareersApplyModal({ jobTitle, jobSlug, sourcePage, onClose }: Props) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [doneId, setDoneId] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: EXPERIENCE[2],
    currentCtc: '',
    expectedCtc: '',
    notice: NOTICE[2],
    linkedin: '',
    message: '',
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const fields = [
    form.name,
    form.email,
    form.phone,
    form.experience,
    form.message.trim().length >= 10 ? form.message : '',
    resumeFile ? 'resume' : '',
  ];
  const filled = fields.filter((f) => String(f).trim()).length;
  const progress = Math.round((filled / fields.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please tell us your full name.');
    if (!/.+@.+\..+/.test(form.email.trim())) return setError('Please enter a valid email address.');
    if (!form.phone.trim()) return setError('Please add your phone number so recruiters can reach you.');
    if (!resumeFile) return setError('Please attach your resume (PDF, DOC or DOCX, under 5 MB).');
    if (form.message.trim().length < 10) return setError('Please add a short note about your fit (min 10 characters).');
    setSending(true);
    try {
      const resumeBase64 = await fileToBase64(resumeFile);
      const detailLines = [
        `Role: ${jobTitle} (${jobSlug})`,
        `Experience: ${form.experience}`,
        form.location.trim() ? `Location: ${form.location.trim()}` : '',
        form.currentCtc.trim() ? `Current CTC: ${form.currentCtc.trim()}` : '',
        form.expectedCtc.trim() ? `Expected CTC: ${form.expectedCtc.trim()}` : '',
        `Notice period: ${form.notice}`,
        form.linkedin.trim() ? `LinkedIn: ${form.linkedin.trim()}` : '',
      ].filter(Boolean);
      const res = await submitLead({
        contactName: form.name.trim(),
        companyName: `Careers application — ${jobTitle}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        roleOrScope: detailLines.join(' · '),
        message: form.message.trim(),
        formName: 'Careers',
        service: `Careers application — ${jobTitle}`,
        sourcePage,
        enquiryType: 'candidate',
        consent: true,
        resumeName: resumeFile.name,
        resumeBase64,
      });
      if (res.ok) setDoneId(res.id || '');
      else setError(res.error || 'Could not submit — please retry.');
    } catch {
      setError('Could not read your resume — please try another file.');
    } finally {
      setSending(false);
    }
  };

  const onFile = (f: File | undefined) => {
    setError('');
    if (!f) return;
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setError('Resume must be a PDF, DOC or DOCX file.');
      return;
    }
    if (f.size > MAX_RESUME_BYTES) {
      setError('Resume must be under 5 MB.');
      return;
    }
    setResumeFile(f);
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Apply for ${jobTitle}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
              Careers
            </span>
            <span className="text-[11px] font-bold text-black">No login needed</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-black"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {!doneId && (
          <div className="h-1.5 w-full bg-slate-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Form progress">
            <div className="h-full rounded-full bg-black transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}

        {doneId ? (
          <div className="flex flex-col items-center px-5 py-12 text-center sm:px-7">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
              <CheckCircle2 size={28} aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-black">Application received</h2>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-black/70">
              Thanks {form.name.split(' ')[0] || 'there'} — your application for <strong>{jobTitle}</strong> is
              with our recruitment desk. Shortlisted candidates hear back within 5 business days.
              {doneId && (
                <>
                  {' '}Reference: <strong>{doneId}</strong>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-black px-6 text-xs font-bold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-black"
            >
              Done
            </button>
          </div>
        ) : (
          <form className="px-5 py-6 sm:px-7" onSubmit={handleSubmit}>
            <h2 className="text-lg font-extrabold tracking-tight text-black">
              Apply for <span className="text-black">{jobTitle}</span>
            </h2>
            <p className="mt-1 text-[12px] text-black/60">
              {progress}% complete — no account needed. Our recruiters review every application.
            </p>

            {error && (
              <p className="mt-4 rounded-xl border border-black bg-white p-3 text-[12px] font-bold text-black" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="ca-name" className="mb-1.5 block text-[11px] font-bold text-black">Full name *</label>
                <input id="ca-name" required autoComplete="name" placeholder="Priya Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="ca-email" className="mb-1.5 block text-[11px] font-bold text-black">Email *</label>
                <input id="ca-email" type="email" required autoComplete="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="ca-phone" className="mb-1.5 block text-[11px] font-bold text-black">Phone *</label>
                <input id="ca-phone" type="tel" required autoComplete="tel" placeholder="+91 98xxx xxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="ca-location" className="mb-1.5 block text-[11px] font-bold text-black">Current location</label>
                <input id="ca-location" autoComplete="address-level2" placeholder="e.g. Bengaluru" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
              </div>
              <EnquirySelect id="ca-exp" label="Experience *" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} options={EXPERIENCE} />
              <EnquirySelect id="ca-notice" label="Notice period" value={form.notice} onChange={(v) => setForm({ ...form, notice: v })} options={NOTICE} />
              <div>
                <label htmlFor="ca-current" className="mb-1.5 block text-[11px] font-bold text-black">Current CTC</label>
                <input id="ca-current" placeholder="e.g. ₹18 LPA" value={form.currentCtc} onChange={(e) => setForm({ ...form, currentCtc: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="ca-expected" className="mb-1.5 block text-[11px] font-bold text-black">Expected CTC</label>
                <input id="ca-expected" placeholder="e.g. ₹24 LPA" value={form.expectedCtc} onChange={(e) => setForm({ ...form, expectedCtc: e.target.value })} className={field} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ca-linkedin" className="mb-1.5 block text-[11px] font-bold text-black">LinkedIn / portfolio <span className="font-medium text-black/50">Optional</span></label>
                <input id="ca-linkedin" type="url" placeholder="https://linkedin.com/in/you" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className={field} />
              </div>
            </div>

            <div className="mt-3.5">
              <span id="ca-resume-label" className="mb-1.5 block text-[11px] font-bold text-black">Resume (PDF, DOC, DOCX · max 5 MB) *</span>
              <label
                htmlFor="ca-resume"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 transition-colors hover:border-black focus-within:border-black"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                  {resumeFile ? <FileText size={16} aria-hidden /> : <Upload size={16} aria-hidden />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-bold text-black">
                    {resumeFile ? resumeFile.name : 'Choose your resume file'}
                  </span>
                  <span className="block text-[11px] text-black/60">
                    {resumeFile ? `${(resumeFile.size / 1024).toFixed(0)} KB — click to change` : 'No login needed · stored securely for recruiters only'}
                  </span>
                </span>
              </label>
              <input
                id="ca-resume"
                aria-labelledby="ca-resume-label"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>

            <div className="mt-3.5">
              <label htmlFor="ca-msg" className="mb-1.5 block text-[11px] font-bold text-black">
                Why are you a good fit? *
              </label>
              <textarea
                id="ca-msg"
                required
                rows={4}
                placeholder="2–3 lines on your stack, domain and why this role…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-[13px] leading-relaxed outline-none placeholder:text-black/50 focus:border-black focus:ring-2 focus:ring-black/15"
              />
            </div>

            <label className="mt-4 flex items-start gap-2.5 text-[12px] leading-relaxed text-black/70">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-black" />
              I agree to be contacted about this application and consent to my resume being reviewed for this and matching roles.
            </label>

            <button
              type="submit"
              disabled={sending}
              className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-black text-[13px] font-bold text-white shadow-md shadow-black/25 transition-colors hover:bg-neutral-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {sending ? 'Submitting…' : 'Submit Application'}
              <ArrowRight size={15} aria-hidden />
            </button>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-black/60">
              <ShieldCheck size={13} aria-hidden />
              No account needed · Resume visible only to our recruitment desk
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
