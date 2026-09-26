import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, CheckCircle2, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AccordionTier {
  id: string;
  step: string;
  title: string;
  headline: string;
  deliverables: string[];
  sla: string;
}

const ACCORDION_TIERS: AccordionTier[] = [
  {
    id: 'tier-1',
    step: 'TIER 01',
    title: 'Legal Entity & Non-Disclosure Governance',
    headline: 'Day-1 Intellectual Property Assignment',
    deliverables: ['Bilateral NDAs signed before first candidate presentation', 'SEZ regulatory tax incentive optimization', 'Clean-room IP ownership guarantees'],
    sla: '100% Client Ownership'
  },
  {
    id: 'tier-2',
    step: 'TIER 02',
    title: 'Employer-of-Record (EOR) & Payroll Escrow',
    headline: 'Zero Local Entity Bureaucracy Required',
    deliverables: ['Compliant employment contracts in India', 'Localized statutory benefits & health insurance', 'Transparent milestone-based payroll disbursements'],
    sla: 'Direct Escrow Backed'
  },
  {
    id: 'tier-3',
    step: 'TIER 03',
    title: '4-Stage Architectural & Code Vetting',
    headline: 'Staff Engineers Evaluating Staff Engineers',
    deliverables: ['Live lock-free concurrency & memory leak profiling', 'Distributed state machine & Byzantine fault tests', 'Deep reference verification with former CTOs'],
    sla: '72-Hour Delivery SLA'
  },
  {
    id: 'tier-4',
    step: 'TIER 04',
    title: 'Turnkey Transfer & 180-Day Warranty',
    headline: 'Autonomous 120-Engineer Center on Day 75',
    deliverables: ['Optional legal entity transfer at 12–36 months', 'Zero transfer fee penalty after initial term', '180-day unconditional replacement guarantee'],
    sla: '180-Day Warranty Backed'
  }
];

export const StickyPinAccordionReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTier, setActiveTier] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1600',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(3, Math.floor(self.progress * 4));
          setActiveTier(idx);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned Sticky Section • Progressive Accordion Unfold on Scroll</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Progressive Accordion Unfold on Scroll
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Scroll down to dynamically unfold the 4 tiers of the Build-Operate-Transfer enterprise covenant.
          </p>
        </div>

        {/* 4 Pinned Accordion Tiers */}
        <div className="space-y-4">
          {ACCORDION_TIERS.map((tier, idx) => {
            const isOpen = activeTier === idx;
            return (
              <div
                key={tier.id}
                onClick={() => setActiveTier(idx)}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isOpen
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-6 md:p-7 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center font-mono ${
                      isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                        {tier.step}
                      </span>
                      <h3 className="text-base md:text-lg font-black text-slate-900">
                        {tier.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {tier.sla}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="px-6 pb-6 md:px-7 md:pb-7 pt-0 border-t border-slate-100 animate-fadeIn">
                    <h4 className="text-sm font-bold text-blue-600 mt-4 mb-3">
                      {tier.headline}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {tier.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
