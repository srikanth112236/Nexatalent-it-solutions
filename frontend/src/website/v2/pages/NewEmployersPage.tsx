import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Check, Clock, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { SectionLabel } from '../components/ui';
import { submitLead } from '../lib/leadCapture';

const MODELS: string[] = ['Permanent', 'Contract', 'Executive Search', 'Bulk hiring', 'RPO'];
const TIMELINES: string[] = ['ASAP (this week)', 'Within 2 weeks', 'This month', 'Next quarter'];
const SECTORS = ['BFSI', 'GCC', 'SaaS', 'Manufacturing', 'Retail', 'Healthcare', 'Logistics'];
const PROCESS = [
  ['01', 'Discovery in 24 hrs', 'Scope, stack, budget and timeline locked with a practice lead.'],
  ['02', 'Shortlist in 72 hrs', 'Pre-vetted profiles with evaluation notes — not raw résumés.'],
  ['03', 'Interviews to joining', 'Scheduling, offers, background checks and onboarding covered.'],
];
const PROOF = [
  ['88%', 'offer acceptance', 'across last 12 months of tech mandates'],
  ['90 days', 'replacement cover', 'on every permanent placement'],
  ['4,800+', 'hires delivered', 'for enterprises, GCCs and product teams'],
];

/** Compact enterprise For Employers — premium banner + mandate capture wired to leads. */
export function NewEmployersPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', roles: '', openings: '', model: MODELS[0], timeline: TIMELINES[0], message: '' });
  const field = 'min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] outline-none placeholder:text-slate-400 focus:border-[#0265FF] focus:ring-2 focus:ring-[#0265FF]/15';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const res = await submitLead({
      contactName: form.email.split('@')[0] || 'Employer',
      companyName: 'Individual',
      email: form.email,
      roleOrScope: `${form.roles}${form.openings ? ` · ${form.openings} openings` : ''} · ${form.model} · ${form.timeline}`,
      message: form.message || `Mandate request: ${form.roles} (${form.model}, ${form.timeline}).`,
      formName: 'Mandate',
      service: form.model,
      sourcePage: '/employers',
      enquiryType: 'employer',
      consent: true,
    });
    setSending(false);
    if (res.ok) setSent(true);
    else setError(res.error || 'Could not submit — please retry.');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <SeoHead title="For Employers — NexaTalent" description="Submit your mandate: shortlist in 72 hrs, 90-day cover, audit-ready compliance." canonicalPath="/employers" />
      <V2Navbar />
      <main id="main-content">
        {/* ===== PREMIUM BANNER (synced with solutions/contact) ===== */}
        <section className="relative overflow-hidden border-b border-slate-100 px-4 pb-14 pt-14 sm:px-6" aria-label="Employers banner">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[420px]"
            style={{ background: 'radial-gradient(55% 100% at 50% 0%, rgba(2,101,255,0.12) 0%, rgba(2,101,255,0.04) 50%, rgba(255,255,255,0) 78%)' }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm hover:border-[#0265FF]/40 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
              >
                <span className="rounded-full bg-[#0265FF] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">For Employers</span>
                Nine delivery models, one accountable team
                <ArrowRight size={12} aria-hidden />
              </Link>
              <h1 className="mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
                Hire the right talent, <span className="text-[#0265FF]">minus the drag</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                Permanent, contract, executive and bulk mandates — shortlist in 72 hours with 90-day replacement cover and audit-ready compliance.
              </p>
              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 sm:text-sm">
                {['No fee to start a mandate', '72-hr first shortlist', '90-day replacement cover'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-[#0265FF]" strokeWidth={3} aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <ul className="mt-7 grid max-w-md grid-cols-3 gap-2">
                {[['72 hrs', 'shortlist'], ['88%', 'acceptance'], ['4,800+', 'hires']].map(([v, l]) => (
                  <li key={l} className="rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center shadow-sm">
                    <div className="text-lg font-black tabular-nums">{v}</div>
                    <div className="text-[11px] text-slate-500">{l}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* mandate form card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8" id="contact">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={24} aria-hidden />
                  </span>
                  <h2 className="mt-4 text-[15px] font-extrabold text-slate-900">Mandate received</h2>
                  <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-slate-600">
                    Our desk replies within 24 hours with a discovery slot. Urgent? Call{' '}
                    <a href="tel:+917019696166" className="font-bold text-[#0265FF] hover:underline">+91 70196 96166</a>.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-5 inline-flex min-h-[40px] items-center rounded-xl border border-slate-300 bg-white px-5 text-[12px] font-bold text-slate-600 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
                  >
                    Submit another mandate
                  </button>
                </div>
              ) : (
                <form aria-label="Submit hiring mandate" className="grid gap-3" onSubmit={handleSubmit}>
                  <SectionLabel>Submit your mandate</SectionLabel>
                  <div>
                    <label htmlFor="v2-emp-email" className="mb-1 block text-xs font-bold text-slate-700">Work email *</label>
                    <input id="v2-emp-email" type="email" required autoComplete="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="v2-emp-roles" className="mb-1 block text-xs font-bold text-slate-700">Roles & count *</label>
                      <input id="v2-emp-roles" required placeholder="e.g. 5 Java devs" value={form.roles} onChange={(e) => setForm({ ...form, roles: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="v2-emp-openings" className="mb-1 block text-xs font-bold text-slate-700">Total openings</label>
                      <input id="v2-emp-openings" type="number" min={1} max={10000} placeholder="e.g. 5" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="v2-emp-mode" className="mb-1 block text-xs font-bold text-slate-700">Model</label>
                      <select id="v2-emp-mode" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={field}>
                        {MODELS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="v2-emp-timeline" className="mb-1 block text-xs font-bold text-slate-700">Timeline</label>
                      <select id="v2-emp-timeline" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className={field}>
                        {TIMELINES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="v2-emp-msg" className="mb-1 block text-xs font-bold text-slate-700">Brief (optional)</label>
                    <textarea id="v2-emp-msg" rows={3} placeholder="Stack, budget band, location, must-haves…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-[13px] leading-relaxed outline-none placeholder:text-slate-400 focus:border-[#0265FF] focus:ring-2 focus:ring-[#0265FF]/15" />
                  </div>
                  {error && (
                    <p className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-[12px] font-bold text-red-700" role="alert">{error}</p>
                  )}
                  <button type="submit" disabled={sending} className="min-h-[48px] rounded-full bg-[#0265FF] text-sm font-bold text-white shadow-md shadow-[#0265FF]/25 hover:bg-[#0055db] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]">
                    {sending ? 'Sending…' : 'Request shortlist'}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
                    <ShieldCheck size={13} className="text-emerald-600" aria-hidden />
                    No fee to start • NDA on request
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* trusted-by strip (synced with solutions page) */}
          <div className="relative mx-auto mt-12 max-w-4xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Trusted by fast-growing teams worldwide</p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {SECTORS.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-slate-400 transition-colors hover:text-slate-700">
                  <span className="h-2 w-2 rounded-sm bg-slate-300" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== HOW WE DELIVER ===== */}
        <section aria-label="How we deliver" className="border-b border-slate-100 bg-slate-50/60 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>How we deliver</SectionLabel>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              What happens after you <span className="text-[#0265FF]">submit</span>
            </h2>
            <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PROCESS.map(([n, t, d]) => (
                <li key={t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0265FF]/10 text-xs font-black text-[#0265FF]">{n}</div>
                  <h3 className="mt-3 text-sm font-extrabold text-slate-900">{t}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== PROOF ===== */}
        <section aria-label="Proof points" className="px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {PROOF.map(([v, l, d]) => (
              <div key={l} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-2xl font-black tabular-nums text-[#0265FF]">{v}</p>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-slate-700">{l}</p>
                <p className="mt-1.5 text-[11.5px] text-slate-500">{d}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center rounded-3xl border border-[#0265FF]/20 bg-[#0265FF]/5 p-8 text-center">
            <Users size={20} className="text-[#0265FF]" aria-hidden />
            <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-slate-700">
              Need something specific — GCC build-out, embedded pods or a confidential CXO search?
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0265FF] px-6 text-xs font-bold text-white shadow-md shadow-[#0265FF]/25 hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]">
                <Clock size={14} aria-hidden /> Book a 30-min strategy call
              </Link>
              <Link to="/solutions" className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 bg-white px-6 text-xs font-bold text-slate-700 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-[#0265FF]">
                See all solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </div>
  );
}
