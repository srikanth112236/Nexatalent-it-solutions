import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { V2_OFFICES } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';
import { submitLead } from '../lib/leadCapture';

export function V2OfficesContact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  return (
    <CreamSection id="contact">
      <SectionHead title={V2_OFFICES.title} sub={V2_OFFICES.sub} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {V2_OFFICES.offices.map((o) => (
          <article key={o.city} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img src={o.image} alt={`${o.city} office`} loading="lazy" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                {o.city} <span className="font-semibold text-slate-500">• {o.country}</span>
              </h3>
              <p className="mt-1 text-xs text-slate-600">{o.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-2 text-xs leading-relaxed text-slate-600">
          <h3 className="text-sm font-extrabold text-slate-900">Send us a message</h3>
          <p>Share your role, stack and timeline — our desk replies within 24 hours.</p>
          <p>
            <a className="font-bold text-blue-700 hover:underline" href="mailto:info@nexatalentitsolutions.com">info@nexatalentitsolutions.com</a>
            {' • '}
            <a className="font-bold text-blue-700 hover:underline" href="tel:+917019696166">+91 70196 96166</a>
          </p>
        </div>
        {sent ? (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
            <CheckCircle2 size={20} /> Requirement received — we’ll reach out shortly.
          </div>
        ) : (
          <form
            className="grid grid-cols-1 gap-3"
            aria-label="Contact our expert team"
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setSending(true);
              const res = await submitLead({
                contactName: email.split('@')[0] || 'Website visitor',
                companyName: company || 'Individual',
                email,
                message,
                roleOrScope: company,
                formName: 'Home CTA',
                service: 'Hiring enquiry',
                sourcePage: '/',
                consent: true,
              });
              setSending(false);
              if (res.ok) setSent(true);
              else setError(res.error || 'Could not send — please retry.');
            }}
          >
            <div>
              <label htmlFor="v2-contact-email" className="mb-1 block text-xs font-bold text-slate-700">Work email *</label>
              <input id="v2-contact-email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]" />
            </div>
            <div>
              <label htmlFor="v2-contact-company" className="mb-1 block text-xs font-bold text-slate-700">Company / hiring need</label>
              <input id="v2-contact-company" name="company" type="text" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. 5 backend engineers, Bengaluru" className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]" />
            </div>
            <div>
              <label htmlFor="v2-contact-msg" className="mb-1 block text-xs font-bold text-slate-700">Roles, count, location, timeline *</label>
              <textarea id="v2-contact-msg" name="message" required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you need to hire" rows={3} className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0265FF]" />
            </div>
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-bold text-red-700" role="alert">{error}</p>
            )}
            <button type="submit" disabled={sending} className="min-h-[48px] rounded-full bg-slate-950 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]">
              {sending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </CreamSection>
  );
}
