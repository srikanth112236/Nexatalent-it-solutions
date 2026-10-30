import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Briefcase } from 'lucide-react';
import { CreamSection, SectionHead, PillButton } from '../components/ui';

const ROLES = [
  { title: 'Full Stack Developer | Golang + React.js + GCP', meta: 'Pune • Hybrid • 6–7 yrs • Immediate', type: 'Permanent' },
  { title: 'Senior Backend Engineer (Java)', meta: 'Bengaluru • Hybrid • 5–8 yrs', type: 'Permanent' },
  { title: 'React + Node Pod (4 engineers)', meta: 'Remote India • Contract', type: 'Contract' },
  { title: 'Low-Latency C++ Developer', meta: 'Mumbai • Onsite • HFT', type: 'Permanent' },
  { title: 'VP Engineering', meta: 'Bengaluru • Confidential', type: 'Executive' },
  { title: 'DevOps / SRE Lead', meta: 'Hyderabad • Hybrid', type: 'Permanent' },
  { title: 'Data Scientist (Pricing)', meta: 'Remote • Retail', type: 'Contract' },
];

const FAQS = [
  { q: 'How fast will I get profiles?', a: 'First calibrated shortlist within 72 hours for most tech roles; bulk mandates get batch deliveries weekly.' },
  { q: 'Do you cover replacement if a hire leaves?', a: 'Yes — 90-day replacement cover on permanent hires and instant backfills on contracts.' },
  { q: 'Can you handle payroll and compliance?', a: 'Yes — contracts include payroll, PF/ESI, background verification and single-window invoicing.' },
  { q: 'I’m a candidate — is registration free?', a: 'Always free. Register once and get matched to verified mandates with interview support.' },
];

/** 4/4 NEW — live roles + FAQ: conversion + SEO + fewer support queries. Native details = accessible. */
export function V2JobsFaq() {
  return (
    <CreamSection label="Live openings and FAQs">
      <SectionHead eyebrow="Live demand" title="Open roles this week" sub="A snapshot — explore the full board or submit your mandate." />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => (
          <li key={r.title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
              <Briefcase size={11} aria-hidden /> {r.type}
            </span>
            <h3 className="mt-2.5 text-sm font-extrabold leading-snug text-black">{r.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-black">
              <MapPin size={12} aria-hidden /> {r.meta}
            </p>
            <Link to="/jobs" className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-black focus-visible:outline-2 focus-visible:outline-black">
              View & apply <ArrowRight size={14} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <PillButton to="/jobs" label="View all jobs" variant="dark" />
        <PillButton to="/employers" label="Hire for my team" variant="outline" />
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <h3 className="text-center text-lg font-extrabold text-black">Questions, answered</h3>
        <div className="mt-4 space-y-2.5">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
              <summary className="cursor-pointer list-none text-sm font-bold text-black focus-visible:outline-2 focus-visible:outline-black [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {f.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-black transition-transform group-open:rotate-45" aria-hidden>+</span>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-black">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </CreamSection>
  );
}
