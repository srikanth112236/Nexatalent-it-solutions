import { CreamSection } from '../components/ui';

const CLIENTS = ['SaaS & Technology', 'BFSI & FinTech', 'Retail & E-commerce', 'Healthcare', 'Manufacturing', 'Logistics', 'Media & Telecom', 'Global GCCs'];

/** 1/4 NEW — trust strip: elevates credibility right under hero. */
export function V2TrustBar() {
  return (
    <CreamSection label="Trusted by hiring teams">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-black">
        Trusted by hiring teams across SaaS, BFSI, retail & GCCs
      </p>
      <ul className="mt-6 grid grid-cols-2 items-center gap-3 sm:grid-cols-4 lg:grid-cols-8" aria-label="Client types">
        {CLIENTS.map((c) => (
          <li
            key={c}
            className="flex min-h-[48px] items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-extrabold text-black"
          >
            {c}
          </li>
        ))}
      </ul>
    </CreamSection>
  );
}
