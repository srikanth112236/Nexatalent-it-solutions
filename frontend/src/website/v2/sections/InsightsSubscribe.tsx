import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { V2_INSIGHTS } from '../data/content';
import { CreamSection, SectionHead } from '../components/ui';
import { submitLead } from '../lib/leadCapture';

export function V2InsightsSubscribe() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <CreamSection>
      <SectionHead eyebrow={V2_INSIGHTS.eyebrow} title={V2_INSIGHTS.title} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {V2_INSIGHTS.items.map((a) => (
          <Link key={a.slug} to={`/insights/${a.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
            <div className="text-[11px] font-bold uppercase tracking-widest text-black">{a.meta}</div>
            <h3 className="mt-2 text-sm font-extrabold leading-snug text-black group-hover:underline">{a.title}</h3>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-black">
              Read article <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-lg font-extrabold text-black">Subscribe for updates</h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-black">Salary benchmarks, GCC playbooks and hiring signals — once a month, no spam.</p>
        {done ? (
          <div className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 text-sm font-bold text-black">
            <CheckCircle2 size={18} /> You’re on the list.
          </div>
        ) : (
          <form
            className="mx-auto mt-4 flex max-w-md gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.trim() || busy) return;
              setBusy(true);
              const res = await submitLead({
                contactName: email.split('@')[0] || 'Subscriber',
                companyName: 'Newsletter subscriber',
                email,
                message: 'Subscribed to NexaTalent insights newsletter.',
                formName: 'Newsletter',
                service: 'Newsletter subscription',
                sourcePage: '/insights',
                consent: true,
              });
              setBusy(false);
              if (res.ok) setDone(true);
            }}
          >
            <label htmlFor="v2-newsletter-email" className="sr-only">Work email</label>
            <input
              id="v2-newsletter-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
              className="min-h-[44px] flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
            <button type="submit" disabled={busy} className="min-h-[44px] rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
              {busy ? '…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </CreamSection>
  );
}
