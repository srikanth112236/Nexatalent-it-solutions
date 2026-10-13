import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { V2_CONTACT } from '../data/content';
import { CreamSection } from '../components/ui';
import { EnquirySelect } from '../components/EnquirySelect';
import { submitLead } from '../lib/leadCapture';

const inputCls =
  'min-h-[52px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-black outline-none placeholder:text-black focus:border-black focus:ring-2 focus:ring-black/15';

function FieldLabel({ children, optional = false }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className="mb-2 flex items-center justify-between text-sm font-bold text-black">
      <span>{children}</span>
      {optional && <span className="text-xs font-medium text-black">Optional</span>}
    </span>
  );
}

/**
 * Shared modern dropdown lives in components/EnquirySelect — one design
 * used by every website lead form (home, contact, mandate, modals, careers).
 */
const newMath = () => ({ a: 1 + Math.floor(Math.random() * 9), b: 1 + Math.floor(Math.random() * 9) });

/** Homepage "Send us a message" — reference replica: info cards + ABOUT YOU / ABOUT YOUR ENQUIRY / VERIFY & SEND. */
export function V2OfficesContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(V2_CONTACT.topics[0]);
  const [office, setOffice] = useState(V2_CONTACT.offices[0]);
  const [budget, setBudget] = useState(V2_CONTACT.budgets[0]);
  const [timeline, setTimeline] = useState(V2_CONTACT.timelines[0]);
  const [message, setMessage] = useState('');
  const [math, setMath] = useState(newMath);
  const [answer, setAnswer] = useState('');
  const [terms, setTerms] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [sent, setSent] = useState(false);
  const [sentId, setSentId] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const mountedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Honeypot: bots fill it — pretend success, store nothing.
    if (honeypot.trim()) {
      setSent(true);
      return;
    }
    // Timing check: submitted too fast to be human.
    if (Date.now() - mountedAt.current < 3000) {
      setError('Please take a moment to complete the form before sending.');
      return;
    }
    if (!name.trim()) return setError('Please tell us your name.');
    if (!/.+@.+\..+/.test(email.trim())) return setError('Please enter a valid email address.');
    if (topic === V2_CONTACT.topics[0]) return setError('Please choose what your enquiry is about.');
    if (message.trim().length < 10) return setError('Please add a few more details to your message (min 10 characters).');
    if (Number(answer.trim()) !== math.a + math.b) return setError('The math answer is incorrect — please try again.');
    if (!terms) return setError('Please agree to the Terms before sending.');
    setSending(true);
    const res = await submitLead({
      contactName: name.trim(),
      companyName: company.trim() || 'Individual',
      email: email.trim(),
      phone: phone.trim() || undefined,
      topic,
      preferredOffice: office,
      budget,
      timeline,
      message: message.trim(),
      formName: 'Home Contact',
      service: topic,
      enquiryType: 'employer',
      sourcePage: '/',
      consent: true,
    });
    setSending(false);
    if (res.ok) {
      setSent(true);
      setSentId(res.id || '');
    } else {
      setError(res.error || 'Could not send — please retry.');
    }
  };

  return (
    <CreamSection id="contact" label="Send us a message">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl">{V2_CONTACT.title}</h2>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-black">
          <span className="h-2 w-2 rounded-full bg-black" aria-hidden /> {V2_CONTACT.slaNote}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.5fr]">
        {/* Left: contact cards */}
        <div className="space-y-4">
          {V2_CONTACT.cards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-black">{c.title}</h3>
              {c.href.startsWith('/') ? (
                <Link to={c.href} className="mt-1 inline-block text-[15px] font-semibold text-black hover:underline">
                  {c.contact}
                </Link>
              ) : (
                <a href={c.href} className="mt-1 inline-block text-[15px] font-semibold text-black hover:underline">
                  {c.contact} <span aria-hidden>→</span>
                </a>
              )}
              <p className="mt-3 text-sm leading-relaxed text-black">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Right: form */}
        {/* Right column: sticky + form-only internal scroll on desktop */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-110px)] lg:self-start lg:overflow-y-auto lg:overscroll-contain sidebar-scroll">           
          {sent ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                <CheckCircle2 size={28} aria-hidden />
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-black">Message sent</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-black">
                Thanks {name.split(' ')[0] || 'there'} — our desk replies within 1 business day.
                {sentId && (
                  <>
                    {' '}Reference: <strong>{sentId}</strong>
                  </>
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-label="Send us a message">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black">About you</p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hm-name"><FieldLabel>Your name</FieldLabel></label>
                  <input id="hm-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="hm-email"><FieldLabel>Email address</FieldLabel></label>
                  <input id="hm-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="hm-company"><FieldLabel optional>Company</FieldLabel></label>
                  <input id="hm-company" type="text" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="hm-phone"><FieldLabel optional>Phone</FieldLabel></label>
                  <input id="hm-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
              </div>

              <hr className="my-6 border-slate-200" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black">About your enquiry</p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <EnquirySelect id="hm-topic" label="What is this about?" value={topic} onChange={setTopic} options={V2_CONTACT.topics} labelClassName="mb-2 block text-sm font-bold text-black" />
                <EnquirySelect id="hm-office" label="Preferred office" optional value={office} onChange={setOffice} options={V2_CONTACT.offices} labelClassName="mb-2 block text-sm font-bold text-black" />
                <EnquirySelect id="hm-budget" label="Project budget" optional value={budget} onChange={setBudget} options={V2_CONTACT.budgets} openUp labelClassName="mb-2 block text-sm font-bold text-black" />
                <EnquirySelect id="hm-timeline" label="Timeline" optional value={timeline} onChange={setTimeline} options={V2_CONTACT.timelines} openUp labelClassName="mb-2 block text-sm font-bold text-black" />
              </div>

              <div className="mt-4">
                <label htmlFor="hm-message"><FieldLabel>Message</FieldLabel></label>
                <textarea
                  id="hm-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us a bit about what you're working on — what you've tried, what's blocking you, what success looks like."
                  className={`${inputCls} resize-y`}
                />
              </div>

              <hr className="my-6 border-slate-200" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black">Verify & send</p>

              <div className="mt-4">
                <label htmlFor="hm-math"><FieldLabel>What is {math.a} + {math.b}?</FieldLabel></label>
                <div className="flex gap-2">
                  <input
                    id="hm-math"
                    type="text"
                    inputMode="numeric"
                    placeholder="Your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    aria-label="New math question"
                    onClick={() => {
                      setMath(newMath());
                      setAnswer('');
                    }}
                    className="flex w-[52px] shrink-0 items-center justify-center rounded-xl border border-slate-300 text-black hover:border-black"
                  >
                    <RefreshCw size={16} aria-hidden />
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-black">Quick math check to keep bots out.</p>
              </div>

              {/* Honeypot — invisible to humans */}
              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
              />

              <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-black">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-black"
                />
                <span>
                  I have read and agree to the <Link to="/terms" className="font-bold underline">Terms</Link>.
                </span>
              </label>

              {error && (
                <p className="mt-4 rounded-xl border border-black bg-white p-3 text-xs font-bold text-black" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-black text-[15px] font-bold text-white hover:bg-neutral-800 disabled:opacity-60"
              >
                {sending ? 'Sending…' : (
                  <>Send Message — Get a Callback <ArrowRight size={16} aria-hidden /></>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-black">
                Protected by a honeypot, a timing check and a small math question. We never share your info.
              </p>
            </form>
          )}
        </div>
      </div>
    </CreamSection>
  );
}
