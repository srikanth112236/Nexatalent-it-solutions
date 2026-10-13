import { ClipboardList, Radar, UserCheck, Rocket } from 'lucide-react';
import { CreamSection, SectionHead } from '../components/ui';

const STEPS = [
  { icon: ClipboardList, title: 'Share your mandate', desc: 'Role, stack, budget and timeline — 20-min discovery call. No fee to start.' },
  { icon: Radar, title: 'Get shortlist in 72 hrs', desc: 'Pre-screened profiles with code scores and culture notes.' },
  { icon: UserCheck, title: 'Interview & select', desc: 'We schedule, collect feedback and manage counter-offers.' },
  { icon: Rocket, title: 'Onboard & scale', desc: 'Offer, background check and joining support with 90-day cover.' },
];

/** 2/4 NEW — 4-step methodology: answers "how it works" and lifts conversion. */
export function V2Process() {
  return (
    <CreamSection label="How hiring works">
      <SectionHead eyebrow="How it works" title="From mandate to joining in 4 steps" sub="A transparent workflow — you always know what happens next." />
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="absolute right-5 top-5 text-4xl font-black text-black/10" aria-hidden>
              {i + 1}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <s.icon size={20} aria-hidden />
            </span>
            <h3 className="mt-4 text-sm font-extrabold text-black">
              <span className="mr-2 text-black">Step {i + 1}</span>
              {s.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-black">{s.desc}</p>
          </li>
        ))}
      </ol>
    </CreamSection>
  );
}
