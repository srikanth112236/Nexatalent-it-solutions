import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutGrid, Building2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface RailCard {
  id: string;
  client: string;
  location: string;
  scope: string;
  outcome: string;
  teamSize: string;
  timeline: string;
  savings: string;
  accent: string;
}

const RAIL_CARDS: RailCard[] = [
  {
    id: 'case-1',
    client: 'Global Investment Banking Practice',
    location: 'India GCC Hiring',
    scope: 'Low-Latency Trading Systems Hiring Pod',
    outcome: 'Systems-focused screening with architecture depth reviews.',
    teamSize: 'Practice Pod',
    timeline: 'Milestone Tracking',
    savings: 'Transparent Commercials',
    accent: '#0265FF'
  },
  {
    id: 'case-2',
    client: 'AI Platform Engineering Practice',
    location: 'Distributed AI Hiring',
    scope: 'AI Platform Leadership & Systems Architects',
    outcome: 'Production-grade AI systems screening and structured evaluation.',
    teamSize: 'Leadership & IC Mix',
    timeline: 'Milestone Tracking',
    savings: 'Transparent Commercials',
    accent: '#0265FF'
  },
  {
    id: 'case-3',
    client: 'FinTech Platform Practice',
    location: 'India Capability Hiring',
    scope: 'Engineering Leadership & Microservices Teams',
    outcome: 'Direct hiring model replacing third-party dependency.',
    teamSize: 'Team Pod',
    timeline: 'Milestone Tracking',
    savings: 'Transparent Commercials',
    accent: '#0265FF'
  },
  {
    id: 'case-4',
    client: 'Robotics & Vision Practice',
    location: 'India Core Center Hiring',
    scope: 'Center Build-Operate-Transfer Hiring Motion',
    outcome: 'Documented IP and handover discipline at every stage.',
    teamSize: 'Center Pod',
    timeline: 'Milestone Tracking',
    savings: 'Transparent Commercials',
    accent: '#0265FF'
  },
  {
    id: 'case-5',
    client: 'Digital Banking Practice',
    location: 'FinTech Pod Hiring',
    scope: 'Cloud-Native & Platform Security Engineers',
    outcome: 'Compliance-aware screening for regulated environments.',
    teamSize: 'Platform Pod',
    timeline: 'Milestone Tracking',
    savings: 'Transparent Commercials',
    accent: '#0265FF'
  }
];

export const HorizontalCardsRail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const scrollWidth = trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 3000;

      gsap.to(trackRef.current, {
        x: () => -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth + 800}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh' }}
    >
      <div className="pt-12 px-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider mb-2">
            <LayoutGrid className="w-3.5 h-3.5 text-[#0265FF]" />
            <span>FEATURED CLIENT MANDATES & CASE STUDIES</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Proven Track Record Across Key Engineering Sectors
          </h2>
        </div>
        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span>Scroll down to slide case studies horizontally</span>
          <ArrowRight className="w-4 h-4 text-[#0265FF]" />
        </div>
      </div>

      {/* Horizontal Sliding Track */}
      <div
        ref={trackRef}
        className="flex items-center gap-8 px-12 h-[calc(100vh-140px)] w-max"
      >
        {RAIL_CARDS.map((card, idx) => (
          <div
            key={card.id}
            className="w-[420px] md:w-[480px] shrink-0 rounded-3xl p-8 bg-white border border-slate-200 shadow-2xl shadow-slate-200/60 flex flex-col justify-between"
            style={{ height: '72%' }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-slate-400">
                  DECK 0{idx + 1} / 05
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: card.accent }}
                >
                  {card.location}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
                <Building2 className="w-4 h-4" />
                <span>{card.client}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-3">
                {card.scope}
              </h3>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
                {card.outcome}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Team Size</span>
                <span className="text-xs font-black text-slate-900 font-mono mt-0.5 block">{card.teamSize}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Timeline</span>
                <span className="text-xs font-black text-blue-600 font-mono mt-0.5 block">{card.timeline}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Arbitrage</span>
                <span className="text-xs font-black text-emerald-700 font-mono mt-0.5 block">{card.savings}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
