import { CreamSection } from '../components/ui';

const CLIENTS = ['SaaS & Technology', 'BFSI & FinTech', 'Retail & E-commerce', 'Healthcare', 'Manufacturing', 'Logistics', 'Media & Telecom', 'Global GCCs'];

/** 1/4 NEW — trust strip: elevates credibility right under hero. */
export function V2TrustBar() {
  return (
    <CreamSection label="Trusted by hiring teams">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
        Trusted by hiring teams across SaaS, BFSI, retail & GCCs
      </p>
      <ul className="mt-6 grid grid-cols-2 items-center gap-3 sm:grid-cols-4 lg:grid-cols-8" aria-label="Client types">
        {CLIENTS.map((c) => (
          <li
            key={c}
            className="flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-extrabold text-slate-500"
          >
            {c}
          </li>
        ))}
      </ul>
      <dl className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 text-center sm:grid-cols-3">
        {[
          ['4,800+', 'verified hires'],
          ['72 hrs', 'first shortlist'],
          ['24 hrs', 'response SLA'],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
            <dt className="order-2 mt-1 block text-[11px] font-semibold text-slate-500">{l}</dt>
            <dd className="order-1 text-2xl font-black tabular-nums text-slate-950">{v}</dd>
          </div>
        ))}
      </dl>
    </CreamSection>
  );
}
