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
    client: 'Tier-1 Wall Street Investment Bank',
    location: 'Bangalore GCC Center',
    scope: '45-Engineer Ultra-Low Latency C++ & FPGA Trading Pod',
    outcome: 'Achieved sub-850ns execution parity with Chicago colocation gateway.',
    teamSize: '45 Engineers',
    timeline: '42 Calendar Days',
    savings: '$3.8M Annual Arbitrage',
    accent: '#2563eb'
  },
  {
    id: 'case-2',
    client: 'Silicon Valley AI Research Scale-Up ($15B Cap)',
    location: 'Hyderabad AI Center',
    scope: 'VP of AI Platform + 30 Distributed vLLM Systems Architects',
    outcome: 'Scaled production GPU memory inference throughput by 8.4x.',
    teamSize: '31 Key Hires',
    timeline: '38 Calendar Days',
    savings: '$4.2M Annual Arbitrage',
    accent: '#7c3aed'
  },
  {
    id: 'case-3',
    client: 'London FinTech Unicorn (Series D)',
    location: 'Bangalore Capability Hub',
    scope: 'Founding Engineering Director + 60 Microservices Engineers',
    outcome: 'Eliminated reliance on expensive third-party outsourcing agencies.',
    teamSize: '61 Engineers',
    timeline: '55 Calendar Days',
    savings: '$5.1M Annual Arbitrage',
    accent: '#0891b2'
  },
  {
    id: 'case-4',
    client: 'Autonomous Robotics & CV Platform',
    location: 'Bangalore Core Center',
    scope: 'Turnkey 120-Engineer Center Build-Operate-Transfer (BOT)',
    outcome: 'Delivered 100% intellectual property transfer on Day 75.',
    teamSize: '120 Engineers',
    timeline: '75 Calendar Days',
    savings: '$9.4M Annual Arbitrage',
    accent: '#10b981'
  },
  {
    id: 'case-5',
    client: 'Singapore Digital Banking Consortium',
    location: 'Hyderabad FinTech Pod',
    scope: '25 Cloud-Native SRE & Cryptographic Core Engineers',
    outcome: 'Achieved 99.999% uptime compliance under MAS regulatory standards.',
    teamSize: '25 Engineers',
    timeline: '28 Calendar Days',
    savings: '$2.4M Annual Arbitrage',
    accent: '#ea580c'
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned Horizontal Rail • Global GCC Case Studies</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Horizontal Rail: 5 Turnkey GCC Deployments
          </h2>
        </div>
        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span>Scroll down to slide cards horizontally</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
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
