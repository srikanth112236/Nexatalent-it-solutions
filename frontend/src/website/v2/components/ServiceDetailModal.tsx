import { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, CheckCircle2, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import type { ServiceDetail } from '../data/serviceDetails';
import { submitLead } from '../lib/leadCapture';
import { ENQUIRY_TOPICS, ENQUIRY_OFFICES, ENQUIRY_BUDGETS, ENQUIRY_TIMELINES } from '../lib/enquiryOptions';
import { SafeImage } from './SafeImage';
import { EnquirySelect } from './EnquirySelect';

interface Props {
  detail: ServiceDetail;
  onClose: () => void;
}

type Step = 'detail' | 'form' | 'done';

const field =
  'min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-[13px] outline-none placeholder:text-black focus:border-black focus:ring-2 focus:ring-black/15';

/**
 * Interactive service/industry detail modal:
 * Step 1 — rich detail for the clicked item → Step 2 — lead form with % progress → Step 3 — success.
 * Submits a tracked lead (formName / service / industry / sourcePage) to /api/v1/enquiries.
 */
export function ServiceDetailModal({ detail, onClose }: Props) {
  const [step, setStep] = useState<Step>('detail');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    openings: '',
    topic: ENQUIRY_TOPICS[0],
    office: ENQUIRY_OFFICES[0],
    budget: ENQUIRY_BUDGETS[0],
    timeline: ENQUIRY_TIMELINES[1],
    message: '',
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC to close + body scroll lock
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

  // Form completion % for the progress bar (6 fields → steps of 16.6%)
  const fields = [form.name, form.email, form.phone, form.company, form.openings, form.message.trim().length >= 10 ? form.message : ''];
  const filled = fields.filter((f) => String(f).trim()).length;
  const progress = Math.round((filled / fields.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const res = await submitLead({
      contactName: form.name,
      companyName: form.company,
      email: form.email,
      phone: form.phone,
      roleOrScope: [detail.label, form.openings && `${form.openings} openings`].filter(Boolean).join(' · '),
      topic: form.topic,
      preferredOffice: form.office,
      budget: form.budget,
      timeline: form.timeline,
      message: form.message,
      formName: detail.kind === 'solution' ? 'Solution modal' : 'Industry modal',
      service: detail.service,
      industry: detail.industry,
      sourcePage: detail.kind === 'solution' ? `/solutions#${detail.slug}` : `/industries#${detail.slug}`,
      enquiryType: 'employer',
      consent: true,
    });
    setSending(false);
    if (res.ok) setStep('done');
    else setError(res.error || 'Could not submit — please retry.');
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${detail.label} details`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl"
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/95 px-5 py-3.5 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-black/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
              {detail.kind === 'solution' ? 'Solution' : 'Industry'}
            </span>
            {step !== 'detail' && (
              <span className="text-[11px] font-bold text-black">
                Step {step === 'form' ? 2 : 3} of 3
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline-2 focus-visible:outline-black"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* progress bar (form + done steps) */}
        {step !== 'detail' && (
          <div className="h-1.5 w-full bg-neutral-100" role="progressbar" aria-valuenow={step === 'done' ? 100 : progress} aria-valuemin={0} aria-valuemax={100} aria-label="Form progress">
            <div
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${step === 'done' ? 100 : progress}%` }}
            />
          </div>
        )}

        {/* ===== STEP 1: DETAIL ===== */}
        {step === 'detail' && (
          <div>
            <SafeImage src={detail.image} alt={detail.alt} fallbackLabel={detail.label} className="aspect-[16/9] w-full object-cover object-top" />
            <div className="px-5 py-6 sm:px-7">
              <h2 className="text-xl font-extrabold tracking-tight text-black sm:text-2xl">{detail.label}</h2>
              <p className="mt-1 text-[13px] font-bold text-black">{detail.tagline}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-black">{detail.description}</p>

              <dl className="mt-5 grid grid-cols-3 gap-3">
                {detail.stats.map(([v, l]) => (
                  <div key={l} className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
                    <dt className="text-[9px] font-bold uppercase tracking-wider text-black">{l}</dt>
                    <dd className="mt-0.5 text-sm font-black tabular-nums text-black">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-black">What you get</h3>
                  <ul className="mt-2.5 space-y-2">
                    {detail.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-[12.5px] leading-snug text-black">
                        <Check size={13} className="mt-0.5 shrink-0 text-black" strokeWidth={3} aria-hidden />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-black">How it works</h3>
                  <ol className="mt-2.5 space-y-2">
                    {detail.process.map((p, i) => (
                      <li key={p} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-black">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10 text-[10px] font-black text-black">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-black py-1.5 pl-6 pr-1.5 text-sm font-bold text-white shadow-lg shadow-black/25 transition-all hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Get My Talent Shortlist
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:tranneutral-x-0.5">
                    <ArrowRight size={15} aria-hidden />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] rounded-full border border-neutral-300 bg-white px-5 text-xs font-bold text-black hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-black"
                >
                  Talk to a Hiring Expert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 2: LEAD FORM ===== */}
        {step === 'form' && (
          <form className="px-5 py-6 sm:px-7" onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => setStep('detail')}
              className="mb-4 inline-flex items-center gap-1 text-[11px] font-bold text-black hover:text-black focus-visible:outline-2 focus-visible:outline-black"
            >
              <ArrowLeft size={12} aria-hidden /> Back to {detail.label}
            </button>
            <h2 className="text-lg font-extrabold tracking-tight text-black">
              Tell us what you need in <span className="text-black">{detail.label}</span>
            </h2>
            <p className="mt-1 text-[12px] text-black">
              {progress}% complete — a practice lead replies within one business day.
            </p>

            {error && (
              <p className="mt-4 rounded-xl border border-black bg-white p-3 text-[12px] font-bold text-black" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="sd-name" className="mb-1.5 block text-[11px] font-bold text-black">Full name *</label>
                <input id="sd-name" required autoComplete="name" placeholder="Priya Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-email" className="mb-1.5 block text-[11px] font-bold text-black">Work email *</label>
                <input id="sd-email" type="email" required autoComplete="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-phone" className="mb-1.5 block text-[11px] font-bold text-black">Phone *</label>
                <input id="sd-phone" type="tel" required autoComplete="tel" placeholder="+91 98xxx xxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-company" className="mb-1.5 block text-[11px] font-bold text-black">Company *</label>
                <input id="sd-company" required autoComplete="organization" placeholder="Acme Pvt Ltd" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-openings" className="mb-1.5 block text-[11px] font-bold text-black">Approx. openings</label>
                <input id="sd-openings" type="number" min={1} max={10000} placeholder="e.g. 3" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} className={field} />
              </div>
              <EnquirySelect id="sd-timeline" label="Timeline" value={form.timeline} onChange={(v) => setForm({ ...form, timeline: v })} options={ENQUIRY_TIMELINES} />
            </div>
            {/* Shared enquiry fields — same in every form, synced to Website Leads */}
            <div className="mt-3.5 grid gap-3.5 sm:grid-cols-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-3.5">
              <EnquirySelect id="sd-topic" label="What is this about?" value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} options={ENQUIRY_TOPICS} />
              <EnquirySelect id="sd-office" label="Preferred office" value={form.office} onChange={(v) => setForm({ ...form, office: v })} options={ENQUIRY_OFFICES} />
              <EnquirySelect id="sd-budget" label="Project budget" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} options={ENQUIRY_BUDGETS} />
            </div>
            <div className="mt-3.5">
              <label htmlFor="sd-msg" className="mb-1.5 block text-[11px] font-bold text-black">
                What are you looking to hire? *
              </label>
              <textarea
                id="sd-msg"
                required
                rows={4}
                placeholder={`Roles, stack, budget band for ${detail.label.toLowerCase()}…`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3.5 text-[13px] leading-relaxed outline-none placeholder:text-black focus:border-black focus:ring-2 focus:ring-black/15"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-black text-[13px] font-bold text-white shadow-md shadow-black/25 transition-colors hover:bg-neutral-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {sending ? 'Sending…' : 'Send Message — Get a Callback'}
              <ArrowRight size={15} aria-hidden />
            </button>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-black">
              <ShieldCheck size={13} className="text-black" aria-hidden />
              Confidential • No fee to start • NDA on request
            </p>
          </form>
        )}

        {/* ===== STEP 3: SUCCESS ===== */}
        {step === 'done' && (
          <div className="flex flex-col items-center px-5 py-12 text-center sm:px-7">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
              <CheckCircle2 size={28} aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-black">Request received</h2>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-black">
              Your <strong>{detail.label}</strong> enquiry is logged with our practice desk — you&apos;ll hear back within one business day.
              Urgent? Call <a href="tel:+917019696166" className="font-bold text-black hover:underline">+91 70196 96166</a>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-neutral-300 bg-white px-6 text-xs font-bold text-black hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-black"
            >
              Keep browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
