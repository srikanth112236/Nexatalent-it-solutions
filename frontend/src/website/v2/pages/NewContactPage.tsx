import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  Briefcase,
  Handshake,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { SectionLabel } from '../components/ui';
import { submitLead } from '../lib/leadCapture';

const OFFICES = [
  {
    city: 'Mumbai',
    role: 'Corporate HQ — Andheri East',
    lines: ['4th & 7th Floor, Skyline Icon', 'Andheri–Kurla Rd, Marol', 'Mumbai 400059'],
  },
  {
    city: 'Bengaluru',
    role: 'Technology hub',
    lines: ['SaaS, AI & GCC pod delivery', 'Product-company mandates', 'Engineering practice leads'],
  },
  {
    city: 'Dubai',
    role: 'Enterprise delivery — GCC',
    lines: ['Middle East enterprise desks', 'Global capability mandates', 'Offshore pod advisory'],
  },
];

const CHANNELS: { icon: typeof Mail; label: string; value: string; href: string; note: string }[] = [
  { icon: Mail, label: 'Email', value: 'info@nexatalentitsolutions.com', href: 'mailto:info@nexatalentitsolutions.com', note: 'Mandates, partnerships & media' },
  { icon: PhoneCall, label: 'Phone', value: '+91 70196 96166', href: 'tel:+917019696166', note: 'Mon–Fri, 9:30 AM – 6:30 PM IST' },
];

const INTENTS = [
  { value: 'employer', label: 'Hiring mandate', service: 'Hiring mandate', scopeLabel: 'Roles & headcount needed', scopePlaceholder: 'e.g. 4 Senior React/Node engineers in Bengaluru' },
  { value: 'candidate', label: 'Senior talent', service: 'Candidate support', scopeLabel: 'Current tech stack & years of experience', scopePlaceholder: 'e.g. 8 yrs Java/Spring, payments domain' },
  { value: 'partner', label: 'Partner empanelment', service: 'Vendor empanelment', scopeLabel: 'Partnership scope', scopePlaceholder: 'e.g. Staffing firm, 60 recruiters, PAN-India' },
] as const;

const USE_CASES = [
  { icon: Briefcase, title: 'Submit a hiring mandate', desc: 'Role brief, comp band and timeline — practice lead responds same day.' },
  { icon: Users, title: 'Candidate support', desc: 'Application status, interview prep or profile updates.' },
  { icon: Handshake, title: 'Vendor empanelment', desc: 'Staffing partners and sub-vendors can apply to our network.' },
];

export function NewContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [intent, setIntent] = useState<(typeof INTENTS)[number]['value']>('employer');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [form, setForm] = useState({ name: '', workEmail: '', phone: '', company: '', roleOrScope: '', message: '' });
  const activeIntent = INTENTS.find((i) => i.value === intent) || INTENTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');
    if (form.message.trim().length < 10) {
      setSendError('Please add a few more details (at least 10 characters) so we can route your inquiry.');
      return;
    }
    setSending(true);
    const res = await submitLead({
      contactName: form.name,
      companyName: form.company,
      email: form.workEmail,
      phone: form.phone,
      roleOrScope: form.roleOrScope,
      message: form.message,
      formName: 'Contact',
      service: activeIntent.service,
      sourcePage: '/contact',
      enquiryType: intent,
      consent: true,
    });
    setSending(false);
    if (res.ok) setSubmitted(true);
    else setSendError(res.error || 'Could not send your inquiry. Please try again.');
  };

  const field = 'min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] outline-none placeholder:text-slate-400 focus:border-[#0265FF] focus:ring-2 focus:ring-[#0265FF]/15';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <SeoHead
        title="Contact Us — NexaTalent IT Solutions"
        description="Talk to NexaTalent about hiring mandates, candidate support or vendor partnerships. Mumbai HQ, Bengaluru and Dubai desks."
        canonicalPath="/contact"
      />
      <V2Navbar />
      <main id="main-content">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6" aria-label="Contact banner">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[380px]"
            style={{
              background:
                'radial-gradient(55% 100% at 50% 0%, rgba(2,101,255,0.12) 0%, rgba(2,101,255,0.04) 50%, rgba(255,255,255,0) 78%)',
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Link to="/" className="hover:text-[#0265FF]">Home</Link>
              <ChevronRight size={10} aria-hidden />
              <span className="font-semibold text-[#0265FF]">Contact</span>
            </nav>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#0265FF]">Contact us</p>
            <h1 className="mt-2.5 text-[26px] font-extrabold leading-tight tracking-tight text-slate-950 sm:text-[38px]">
              Let’s build your <span className="text-[#0265FF]">next team</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-slate-600">
              Mandates, candidate support or partnerships — a practice lead responds within one business day.
            </p>

            {/* quick channels */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {CHANNELS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-left shadow-sm transition-all hover:border-[#0265FF]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0265FF]/10 text-[#0265FF]">
                    <c.icon size={15} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{c.label}</span>
                    <span className="block text-[12.5px] font-extrabold text-slate-800 group-hover:text-[#0265FF]">{c.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FORM + INFO ===== */}
        <section aria-label="Contact form" className="border-t border-slate-100 px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            {/* form card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionLabel>Send a message</SectionLabel>
              <p className="mt-1.5 text-[13px] text-slate-500">All fields marked required. No spam — ever.</p>

              {submitted ? (
                <div className="mt-8 flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={24} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[15px] font-extrabold text-slate-900">Message received</h3>
                  <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-slate-600">
                    Thanks — a practice lead will reply within one business day. For urgent hiring, call{' '}
                    <a href="tel:+917019696166" className="font-bold text-[#0265FF] hover:underline">+91 70196 96166</a>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-5 inline-flex min-h-[40px] items-center rounded-xl border border-slate-300 bg-white px-5 text-[12px] font-bold text-slate-600 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {/* inquiry type tabs */}
                  <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5" role="tablist" aria-label="Inquiry type">
                    {INTENTS.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        role="tab"
                        aria-selected={intent === t.value}
                        onClick={() => setIntent(t.value)}
                        className={`min-h-[38px] flex-1 rounded-lg px-2 text-[11.5px] font-bold transition-all ${
                          intent === t.value ? 'bg-[#0265FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {sendError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] font-bold text-red-700" role="alert">
                      {sendError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="mb-1.5 block text-[11px] font-bold text-slate-700">
                        Full name <span className="text-[#0265FF]">*</span>
                      </label>
                      <input
                        id="c-name"
                        required
                        autoComplete="name"
                        placeholder="Priya Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={field}
                      />
                    </div>
                    <div>
                      <label htmlFor="c-email" className="mb-1.5 block text-[11px] font-bold text-slate-700">
                        Corporate email <span className="text-[#0265FF]">*</span>
                      </label>
                      <input
                        id="c-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={form.workEmail}
                        onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
                        className={field}
                      />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className="mb-1.5 block text-[11px] font-bold text-slate-700">
                        Phone / WhatsApp <span className="text-[#0265FF]">*</span>
                      </label>
                      <input
                        id="c-phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="+91 98xxx xxxxx"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={field}
                      />
                    </div>
                    <div>
                      <label htmlFor="c-company" className="mb-1.5 block text-[11px] font-bold text-slate-700">
                        Company / organization {intent !== 'candidate' && <span className="text-[#0265FF]">*</span>}
                      </label>
                      <input
                        id="c-company"
                        required={intent !== 'candidate'}
                        autoComplete="organization"
                        placeholder={intent === 'candidate' ? 'Optional (individual)' : 'Acme Pvt Ltd'}
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className={field}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-scope" className="mb-1.5 block text-[11px] font-bold text-slate-700">
                      {activeIntent.scopeLabel}
                    </label>
                    <input
                      id="c-scope"
                      placeholder={activeIntent.scopePlaceholder}
                      value={form.roleOrScope}
                      onChange={(e) => setForm({ ...form, roleOrScope: e.target.value })}
                      className={field}
                    />
                  </div>

                  <div>
                    <label htmlFor="c-msg" className="mb-1.5 block text-[11px] font-bold text-slate-700">
                      Message / mandate specs <span className="text-[#0265FF]">*</span>
                    </label>
                    <textarea
                      id="c-msg"
                      required
                      rows={5}
                      placeholder={
                        intent === 'employer'
                          ? 'Tech stack, budget band, timeline and any must-haves…'
                          : intent === 'candidate'
                            ? 'Your query, role target or application context…'
                            : 'Your firm, specialties and coverage cities…'
                      }
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-[13px] leading-relaxed outline-none placeholder:text-slate-400 focus:border-[#0265FF] focus:ring-2 focus:ring-[#0265FF]/15"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-[12px] leading-relaxed text-slate-500">
                    <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#0265FF]" />
                    I agree to be contacted about this enquiry. Read our{' '}
                    <Link to="/privacy-policy" className="font-bold text-[#0265FF] hover:underline">privacy policy</Link>.
                  </label>

                  <button
                    type="submit"
                    disabled={sending}
                    className="group flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#0265FF] text-[13px] font-bold text-white shadow-md shadow-[#0265FF]/25 transition-colors hover:bg-[#0055db] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF] sm:w-auto sm:px-8"
                  >
                    {sending ? 'Sending…' : 'Submit message to director'}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
                    <ShieldCheck size={13} className="text-emerald-600" aria-hidden />
                    Strictly confidential under enterprise NDA &amp; DPDP privacy rules.
                  </p>
                </form>
              )}
            </div>

            {/* sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit lg:self-start" aria-label="Contact information">
              {/* SLA */}
              <div className="rounded-2xl border border-[#0265FF]/20 bg-[#0265FF]/5 p-5">
                <SectionLabel className="text-[11px] text-[#0265FF]">Response SLA</SectionLabel>
                <p className="mt-2 flex items-center gap-2 text-[13px] font-extrabold text-slate-900">
                  <Clock size={14} className="text-[#0265FF]" aria-hidden /> Within 1 business day
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600">
                  Urgent mandates? Call the Mumbai HQ desk directly — practice leads are reachable during IST business hours.
                </p>
              </div>

              {/* use cases */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionLabel className="text-[11px]">Best for</SectionLabel>
                <ul className="mt-3 space-y-3.5">
                  {USE_CASES.map((u) => (
                    <li key={u.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0265FF]/10 text-[#0265FF]">
                        <u.icon size={14} aria-hidden />
                      </span>
                      <div>
                        <p className="text-[12.5px] font-extrabold text-slate-800">{u.title}</p>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">{u.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* offices mini */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionLabel className="text-[11px]">Offices</SectionLabel>
                <ul className="mt-3 space-y-3">
                  {OFFICES.map((o) => (
                    <li key={o.city} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-slate-800">
                        <MapPin size={12} className="text-[#0265FF]" aria-hidden /> {o.city}
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#0265FF]">{o.role}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{o.lines.join(' · ')}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <MessageSquare size={11} className="text-[#0265FF]" aria-hidden />
                  Prefer self-serve? <Link to="/employers" className="font-bold text-[#0265FF] hover:underline">Submit a mandate →</Link>
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <V2Footer />
    </div>
  );
}
