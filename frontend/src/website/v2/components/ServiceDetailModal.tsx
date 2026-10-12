import { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, CheckCircle2, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import type { ServiceDetail } from '../data/serviceDetails';
import { submitLead } from '../lib/leadCapture';

interface Props {
  detail: ServiceDetail;
  onClose: () => void;
}

type Step = 'detail' | 'form' | 'done';

const field =
  'min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] outline-none placeholder:text-slate-400 focus:border-[#0265FF] focus:ring-2 focus:ring-[#0265FF]/15';

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
    timeline: 'Within 2 weeks',
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
      roleOrScope: [detail.label, form.openings && `${form.openings} openings`, form.timeline].filter(Boolean).join(' · '),
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
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
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
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl"
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#0265FF]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#0265FF]">
              {detail.kind === 'solution' ? 'Solution' : 'Industry'}
            </span>
            {step !== 'detail' && (
              <span className="text-[11px] font-bold text-slate-400">
                Step {step === 'form' ? 2 : 3} of 3
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* progress bar (form + done steps) */}
        {step !== 'detail' && (
          <div className="h-1.5 w-full bg-slate-100" role="progressbar" aria-valuenow={step === 'done' ? 100 : progress} aria-valuemin={0} aria-valuemax={100} aria-label="Form progress">
            <div
              className="h-full rounded-full bg-[#0265FF] transition-all duration-500"
              style={{ width: `${step === 'done' ? 100 : progress}%` }}
            />
          </div>
        )}

        {/* ===== STEP 1: DETAIL ===== */}
        {step === 'detail' && (
          <div>
            <img src={detail.image} alt={detail.alt} className="h-44 w-full object-cover sm:h-52" loading="lazy" decoding="async" />
            <div className="px-5 py-6 sm:px-7">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">{detail.label}</h2>
              <p className="mt-1 text-[13px] font-bold text-[#0265FF]">{detail.tagline}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{detail.description}</p>

              <dl className="mt-5 grid grid-cols-3 gap-3">
                {detail.stats.map(([v, l]) => (
                  <div key={l} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{l}</dt>
                    <dd className="mt-0.5 text-sm font-black tabular-nums text-slate-900">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">What you get</h3>
                  <ul className="mt-2.5 space-y-2">
                    {detail.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-700">
                        <Check size={13} className="mt-0.5 shrink-0 text-[#0265FF]" strokeWidth={3} aria-hidden />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">How it works</h3>
                  <ol className="mt-2.5 space-y-2">
                    {detail.process.map((p, i) => (
                      <li key={p} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-slate-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0265FF]/10 text-[10px] font-black text-[#0265FF]">
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
                  className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#0265FF] py-1.5 pl-6 pr-1.5 text-sm font-bold text-white shadow-lg shadow-[#0265FF]/25 transition-all hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
                >
                  Get a quote for {detail.kind === 'solution' ? 'this service' : 'this vertical'}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0265FF] transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={15} aria-hidden />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] rounded-full border border-slate-300 bg-white px-5 text-xs font-bold text-slate-600 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
                >
                  Keep browsing
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
              className="mb-4 inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#0265FF] focus-visible:outline-2 focus-visible:outline-[#0265FF]"
            >
              <ArrowLeft size={12} aria-hidden /> Back to {detail.label}
            </button>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-950">
              Tell us what you need in <span className="text-[#0265FF]">{detail.label}</span>
            </h2>
            <p className="mt-1 text-[12px] text-slate-500">
              {progress}% complete — a practice lead replies within one business day.
            </p>

            {error && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] font-bold text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="sd-name" className="mb-1.5 block text-[11px] font-bold text-slate-700">Full name *</label>
                <input id="sd-name" required autoComplete="name" placeholder="Priya Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-email" className="mb-1.5 block text-[11px] font-bold text-slate-700">Work email *</label>
                <input id="sd-email" type="email" required autoComplete="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-phone" className="mb-1.5 block text-[11px] font-bold text-slate-700">Phone *</label>
                <input id="sd-phone" type="tel" required autoComplete="tel" placeholder="+91 98xxx xxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-company" className="mb-1.5 block text-[11px] font-bold text-slate-700">Company *</label>
                <input id="sd-company" required autoComplete="organization" placeholder="Acme Pvt Ltd" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-openings" className="mb-1.5 block text-[11px] font-bold text-slate-700">Approx. openings</label>
                <input id="sd-openings" type="number" min={1} max={10000} placeholder="e.g. 3" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="sd-timeline" className="mb-1.5 block text-[11px] font-bold text-slate-700">Timeline</label>
                <select id="sd-timeline" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className={field}>
                  <option>ASAP (this week)</option>
                  <option>Within 2 weeks</option>
                  <option>This month</option>
                  <option>Next quarter</option>
                </select>
              </div>
            </div>
            <div className="mt-3.5">
              <label htmlFor="sd-msg" className="mb-1.5 block text-[11px] font-bold text-slate-700">
                What are you looking to hire? *
              </label>
              <textarea
                id="sd-msg"
                required
                rows={4}
                placeholder={`Roles, stack, budget band for ${detail.label.toLowerCase()}…`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-[13px] leading-relaxed outline-none placeholder:text-slate-400 focus:border-[#0265FF] focus:ring-2 focus:ring-[#0265FF]/15"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0265FF] text-[13px] font-bold text-white shadow-md shadow-[#0265FF]/25 transition-colors hover:bg-[#0055db] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
            >
              {sending ? 'Sending…' : `Request ${detail.kind === 'solution' ? 'service' : 'hiring'} callback`}
              <ArrowRight size={15} aria-hidden />
            </button>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
              <ShieldCheck size={13} className="text-emerald-600" aria-hidden />
              Confidential • No fee to start • NDA on request
            </p>
          </form>
        )}

        {/* ===== STEP 3: SUCCESS ===== */}
        {step === 'done' && (
          <div className="flex flex-col items-center px-5 py-12 text-center sm:px-7">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={28} aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-slate-950">Request received</h2>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-slate-600">
              Your <strong>{detail.label}</strong> enquiry is logged with our practice desk — you&apos;ll hear back within one business day.
              Urgent? Call <a href="tel:+917019696166" className="font-bold text-[#0265FF] hover:underline">+91 70196 96166</a>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-slate-300 bg-white px-6 text-xs font-bold text-slate-700 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
            >
              Keep browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
