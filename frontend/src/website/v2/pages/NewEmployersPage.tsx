import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Check, Clock, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { SectionLabel } from '../components/ui';
import { EnquirySelect } from '../components/EnquirySelect';
import { submitLead } from '../lib/leadCapture';
import { ENQUIRY_TOPICS, ENQUIRY_OFFICES, ENQUIRY_BUDGETS, ENQUIRY_TIMELINES } from '../lib/enquiryOptions';

const MODELS: string[] = ['Permanent', 'Contract', 'Executive Search', 'Bulk hiring', 'RPO'];
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', roles: '', openings: '', model: MODELS[0], topic: ENQUIRY_TOPICS[0], office: ENQUIRY_OFFICES[0], budget: ENQUIRY_BUDGETS[0], timeline: ENQUIRY_TIMELINES[1], message: '' });
  const field = 'min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-[13px] outline-none placeholder:text-black/50 focus:border-black focus:ring-2 focus:ring-black/15';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Please tell us your full name.'); return; }
    setSending(true);
    const res = await submitLead({
      contactName: form.name.trim() || form.email.split('@')[0] || 'Employer',
      companyName: form.company.trim() || 'Individual',
      email: form.email,
      phone: form.phone.trim() || undefined,
      roleOrScope: `${form.roles}${form.openings ? ` · ${form.openings} openings` : ''} · ${form.model}`,
      topic: form.topic,
      preferredOffice: form.office,
      budget: form.budget,
      timeline: form.timeline,
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
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead title="For Employers — NexaTalent" description="Submit your mandate: shortlist in 72 hrs, 90-day cover, audit-ready compliance." canonicalPath="/employers" />
      <V2Navbar />
      <main id="main-content">
        {/* ===== PREMIUM BANNER — compact, everything visible in one view ===== */}
        <section className="relative overflow-hidden border-b border-neutral-200 bg-white px-4 pb-10 pt-6 sm:px-6 sm:pt-8" aria-label="Employers banner">
          <div className="relative mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="pt-1">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-black/60">
                <Link to="/" className="hover:text-black">Home</Link>
                <span aria-hidden>›</span>
                <span className="font-bold text-black">For Employers</span>
              </nav>
              <Link
                to="/solutions"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-bold text-black shadow-sm hover:border-black focus-visible:outline-2 focus-visible:outline-black"
              >
                <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">For Employers</span>
                Nine delivery models, one accountable team
                <ArrowRight size={12} aria-hidden />
              </Link>
              <h1 className="mt-4 text-[26px] font-extrabold leading-[1.1] tracking-tight text-black sm:text-4xl">
                Hire the right talent, minus the drag
              </h1>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-black/70">
                Permanent, contract, executive and bulk mandates — shortlist in 72 hours with 90-day replacement cover and audit-ready compliance.
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-black">
                {['No fee to start a mandate', '72-hr first shortlist', '90-day replacement cover'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={13} className="text-black" strokeWidth={3} aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <ul className="mt-5 grid max-w-sm grid-cols-3 gap-2">
                {[['72 hrs', 'shortlist'], ['88%', 'acceptance'], ['4,800+', 'hires']].map(([v, l]) => (
                  <li key={l} className="rounded-2xl border border-neutral-200 bg-white px-2 py-2.5 text-center shadow-sm">
                    <div className="text-base font-black tabular-nums">{v}</div>
                    <div className="text-[10px] text-black/60">{l}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* mandate form card */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl shadow-black/5 sm:p-6" id="contact">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                    <CheckCircle2 size={24} aria-hidden />
                  </span>
                  <h2 className="mt-4 text-[15px] font-extrabold text-black">Mandate received</h2>
                  <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-black">
                    Our desk replies within 24 hours with a discovery slot. Urgent? Call{' '}
                    <a href="tel:+917019696166" className="font-bold text-black hover:underline">+91 70196 96166</a>.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-5 inline-flex min-h-[40px] items-center rounded-xl border border-neutral-300 bg-white px-5 text-[12px] font-bold text-black hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-black"
                  >
                    Submit another mandate
                  </button>
                </div>
              ) : (
                <form aria-label="Submit hiring mandate" className="grid gap-2.5" onSubmit={handleSubmit}>
                  <SectionLabel>Submit your mandate</SectionLabel>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    <div>
                      <label htmlFor="v2-emp-name" className="mb-1 block text-xs font-bold text-black">Full name *</label>
                      <input id="v2-emp-name" required autoComplete="name" placeholder="Priya Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="v2-emp-company" className="mb-1 block text-xs font-bold text-black">Company *</label>
                      <input id="v2-emp-company" required autoComplete="organization" placeholder="Acme Pvt Ltd" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="v2-emp-email" className="mb-1 block text-xs font-bold text-black">Work email *</label>
                      <input id="v2-emp-email" type="email" required autoComplete="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
                    </div>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    <div>
                      <label htmlFor="v2-emp-phone" className="mb-1 block text-xs font-bold text-black">Phone / WhatsApp *</label>
                      <input id="v2-emp-phone" type="tel" required autoComplete="tel" placeholder="+91 98xxx xxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="v2-emp-roles" className="mb-1 block text-xs font-bold text-black">Roles & count *</label>
                      <input id="v2-emp-roles" required placeholder="e.g. 5 Java devs" value={form.roles} onChange={(e) => setForm({ ...form, roles: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="v2-emp-openings" className="mb-1 block text-xs font-bold text-black">Total openings</label>
                      <input id="v2-emp-openings" type="number" min={1} max={10000} placeholder="e.g. 5" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} className={field} />
                    </div>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <EnquirySelect id="v2-emp-mode" label="Model" value={form.model} onChange={(v) => setForm({ ...form, model: v })} options={MODELS} />
                    <EnquirySelect id="v2-emp-timeline" label="Timeline" value={form.timeline} onChange={(v) => setForm({ ...form, timeline: v })} options={ENQUIRY_TIMELINES} />
                  </div>
                  {/* Shared enquiry fields — same in every form, synced to Website Leads */}
                  <div className="grid gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 p-3 sm:grid-cols-3">
                    <EnquirySelect id="v2-emp-topic" label="What is this about?" value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} options={ENQUIRY_TOPICS} />
                    <EnquirySelect id="v2-emp-office" label="Preferred office" value={form.office} onChange={(v) => setForm({ ...form, office: v })} options={ENQUIRY_OFFICES} openUp />
                    <EnquirySelect id="v2-emp-budget" label="Project budget" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} options={ENQUIRY_BUDGETS} openUp />
                  </div>
                  <div>
                    <label htmlFor="v2-emp-msg" className="mb-1 block text-xs font-bold text-black">Brief (optional)</label>
                    <textarea id="v2-emp-msg" rows={2} placeholder="Stack, budget band, location, must-haves…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-[13px] leading-relaxed outline-none placeholder:text-black/50 focus:border-black focus:ring-2 focus:ring-black/15" />
                  </div>
                  {error && (
                    <p className="rounded-xl border border-black bg-white p-2.5 text-[12px] font-bold text-black" role="alert">{error}</p>
                  )}
                  <button type="submit" disabled={sending} className="min-h-[48px] rounded-full bg-black text-sm font-bold text-white shadow-md shadow-black/10 hover:bg-neutral-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                    {sending ? 'Sending…' : 'Get My Talent Shortlist'}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-black">
                    <ShieldCheck size={13} className="text-black" aria-hidden />
                    No fee to start • NDA on request
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* trusted-by strip (synced with solutions page) */}
          <div className="relative mx-auto mt-8 max-w-4xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Trusted by fast-growing teams worldwide</p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {SECTORS.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-black transition-colors hover:text-black">
                  <span className="h-2 w-2 rounded-sm bg-black" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== HOW WE DELIVER ===== */}
        <section aria-label="How we deliver" className="border-b border-neutral-200 bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>How we deliver</SectionLabel>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
              What happens after you <span className="text-black">submit</span>
            </h2>
            <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PROCESS.map(([n, t, d]) => (
                <li key={t} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-xs font-black text-white">{n}</div>
                  <h3 className="mt-3 text-sm font-extrabold text-black">{t}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-black">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== PROOF ===== */}
        <section aria-label="Proof points" className="px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {PROOF.map(([v, l, d]) => (
              <div key={l} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
                <p className="text-2xl font-black tabular-nums text-black">{v}</p>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-black">{l}</p>
                <p className="mt-1.5 text-[11.5px] text-black">{d}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center rounded-3xl border border-black/20 bg-white p-8 text-center">
            <Users size={20} className="text-black" aria-hidden />
            <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-black">
              Need something specific — GCC build-out, embedded pods or a confidential CXO search?
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-black px-6 text-xs font-bold text-white shadow-md shadow-black/10 hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                <Clock size={14} aria-hidden /> Book a Free Strategy Call
              </Link>
              <Link to="/solutions" className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-300 bg-white px-6 text-xs font-bold text-black hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-black">
                Explore Hiring Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </div>
  );
}
