import type { StageInfo } from '../../components/light-motion/LightTwoColumnPinnedStory';
import type { RubricCard } from '../../components/light-motion/OneSideStickyFeatureStack';
import type { FAQItem } from '../../components/light-motion/LightFAQAccordion';
import type { SolutionDetailData } from '../../pages/SolutionDetailPage';

export interface IndustryLike {
  title: string;
  tagline: string;
  description: string;
  challenges: string;
  nexaSolution: string;
  roles: string[];
  metrics: { placed: string; avgSla: string; retention: string };
}

/* ================= SOLUTIONS ================= */

/** Vetting-methodology stages derived from the solution's own delivery workflow. */
export function solutionStages(data: SolutionDetailData): StageInfo[] {
  const steps = data.process.slice(0, 5);
  return steps.map((p, i) => {
    const m = data.metrics[i % data.metrics.length];
    return {
      id: `stage-${i + 1}`,
      step: `PHASE ${String(i + 1).padStart(2, '0')}`,
      title: p.title,
      shortLabel: p.title,
      description: p.desc,
      metric: m.value,
      metricLabel: m.label,
      progress: Math.round(((i + 1) / steps.length) * 100),
      rubricItems: [
        p.desc,
        data.capabilities[i % data.capabilities.length],
        `${m.value} — ${m.label}`,
      ],
    };
  });
}

/** Evaluation-console cards derived from the solution's sourcing profiles. */
export function solutionRubrics(data: SolutionDetailData): RubricCard[] {
  return data.roles.slice(0, 4).map((r, i) => ({
    id: `rubric-${i + 1}`,
    tag: `PROFILE 0${i + 1} • ${r.exp.toUpperCase()} • ${r.turnaround.toUpperCase()}`,
    title: r.title,
    detail: `Actively sourced ${r.title} pipeline — ${r.exp} experience with ${r.turnaround.toLowerCase()} first shortlist.`,
    codeSnippet: r.skills.join('  ·  '),
    score: r.turnaround,
    metrics: r.skills.slice(0, 3),
  }));
}

/** FAQ accordion items: solution FAQs first, then SLA + commercial terms. */
export function solutionFaqs(data: SolutionDetailData): FAQItem[] {
  const items: FAQItem[] = data.faqs.map((f, i) => ({
    id: `sol-faq-${i + 1}`,
    category: 'solution',
    question: f.q,
    answer: f.a,
    tag: 'Solution FAQ',
  }));
  items.push(
    {
      id: 'sol-faq-sla',
      category: 'delivery',
      question: 'What delivery SLA do you commit to?',
      answer: data.sla,
      tag: 'SLA',
    },
    {
      id: 'sol-faq-commercials',
      category: 'delivery',
      question: 'How is this engagement priced?',
      answer: data.pricing,
      tag: 'Commercials',
    },
  );
  return items;
}

/* ================= INDUSTRIES ================= */

/** Vetting-methodology stages derived from the industry practice data. */
export function industryStages(ind: IndustryLike): StageInfo[] {
  return [
    {
      id: 'stage-1',
      step: 'PHASE 01',
      title: `Talent Bottlenecks in ${ind.title}`,
      shortLabel: 'Domain Bottlenecks',
      description: ind.challenges,
      metric: ind.metrics.placed,
      metricLabel: 'Domain Placements',
      progress: 25,
      rubricItems: [ind.challenges, ind.description, `${ind.metrics.retention} 1-year retention`],
    },
    {
      id: 'stage-2',
      step: 'PHASE 02',
      title: 'Nexa Delivery Architecture',
      shortLabel: 'Delivery Architecture',
      description: ind.nexaSolution,
      metric: ind.metrics.avgSla,
      metricLabel: 'Average Shortlist SLA',
      progress: 50,
      rubricItems: [ind.nexaSolution, ind.tagline, 'Practitioner-led screening on every shortlist'],
    },
    {
      id: 'stage-3',
      step: 'PHASE 03',
      title: 'Calibrated Role Coverage',
      shortLabel: 'Role Coverage',
      description: `Pre-evaluated candidate pipelines actively maintained for ${ind.title} mandates.`,
      metric: `${ind.roles.length} Role Tracks`,
      metricLabel: 'Active Sourcing Pipelines',
      progress: 75,
      rubricItems: ind.roles.slice(0, 3),
    },
    {
      id: 'stage-4',
      step: 'PHASE 04',
      title: 'Offer Support & Replacement Warranty',
      shortLabel: 'Offer & Warranty',
      description: `Every ${ind.title} placement is backed by an unconditional 90-day replacement warranty with priority sourcing squads at zero additional fee.`,
      metric: '90 Days',
      metricLabel: 'Replacement Warranty',
      progress: 100,
      rubricItems: [
        '90-day unconditional replacement warranty',
        'Daily pre-joining engagement until day one',
        `Post-placement check-ins at 30, 60 and 90 days`,
      ],
    },
  ];
}

/** Evaluation-console cards derived from the industry's high-demand roles. */
export function industryRubrics(ind: IndustryLike): RubricCard[] {
  return ind.roles.slice(0, 4).map((r, i) => ({
    id: `rubric-${i + 1}`,
    tag: `ROLE 0${i + 1} • SHORTLIST SLA ${ind.metrics.avgSla.toUpperCase()}`,
    title: r,
    detail: `${r} hiring for ${ind.title} — practitioner-assessed pipeline with ${ind.metrics.retention} one-year retention.`,
    codeSnippet: `${r}\n${ind.tagline}`,
    score: ind.metrics.avgSla,
    metrics: ['Practitioner assessed', 'Background verified', '90-day warranty'],
  }));
}
