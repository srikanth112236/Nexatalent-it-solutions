import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Globe2, Users, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface GCCPhase {
  phase: string;
  days: string;
  title: string;
  badge: string;
  deliverables: string[];
  teamDeployed: string;
  accent: string;
  icon: React.ElementType;
}

const PHASES: GCCPhase[] = [
  {
    phase: 'PHASE 01',
    days: 'Day 01 – 15',
    title: 'Legal Entity & SEZ Facility Siting',
    badge: 'Regulatory Foundation',
    deliverables: [
      'Incorporation of private limited entity or SEZ registration',
      'Turnkey Grade-A real-estate selection in Indiranagar/Outer Ring Rd (Bangalore)',
      'Enterprise hardware & multi-gigabit encrypted networking setup'
    ],
    teamDeployed: 'Managing Director + Legal & SEZ Practice Counsel',
    accent: '#2563eb',
    icon: Building2
  },
  {
    phase: 'PHASE 02',
    days: 'Day 16 – 35',
    title: 'Founding Leadership Cadre Induction',
    badge: 'Executive Anchor',
    deliverables: [
      'Appointment of Site Director / VP of Engineering',
      'Hiring 3x Principal Systems Architects across core verticals',
      'Local compensation benchmarking & retention pool structuring'
    ],
    teamDeployed: 'Executive Search Practice Pod',
    accent: '#7c3aed',
    icon: Globe2
  },
  {
    phase: 'PHASE 03',
    days: 'Day 36 – 55',
    title: 'Squad Scale-Out & Talent Ramp',
    badge: 'Core Squad Scaling',
    deliverables: [
      'Scaling 40 to 80 senior individual contributor engineers',
      'Continuous daily candidate calibration against sprint velocity',
      'Notice-period buyouts and proactive counter-offer shields'
    ],
    teamDeployed: 'Technical Sourcing Pod + Principal Reviewers',
    accent: '#0891b2',
    icon: Users
  },
  {
    phase: 'PHASE 04',
    days: 'Day 56 – 75',
    title: 'Autonomous Center Go-Live & Transfer',
    badge: 'Day-75 Autonomous Center',
    deliverables: [
      '120-engineer Center of Excellence fully operational',
      'Sprint velocity matches Western headquarters benchmarks',
      '100% intellectual property assignment and transfer-ready governance'
    ],
    teamDeployed: 'Governance Committee + Client CTO Office',
    accent: '#10b981',
    icon: Rocket
  }
];

export const CorridorGCCPipeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.corridor-gcc-card');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.8,
        }
      });

      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { z: -150 * (i + 1), opacity: 0.3, y: 30 },
          { z: 0, opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          i * 0.3
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>3D Perspective Depth Corridor • Variation 2: GCC Incubation 75-Day Pipeline</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Turnkey GCC Incubation Depth Pipeline
          </h2>
          <p className="text-lg text-slate-600">
            From legal incorporation to 120 senior engineers operating with full IP autonomy in exactly 75 calendar days.
          </p>
        </div>

        {/* 3D Depth Stepping Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHASES.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <div
                key={idx}
                className="corridor-gcc-card rounded-3xl p-7 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-blue-400 hover:shadow-2xl transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${idx * 15}px)`
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase text-white tracking-wider"
                      style={{ backgroundColor: phase.accent }}
                    >
                      {phase.phase}
                    </span>
                    <span className="text-xs font-black font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {phase.days}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-xs">
                    <Icon className="w-6 h-6" style={{ color: phase.accent }} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug mb-1">
                    {phase.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    {phase.badge}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Core Phase Deliverables:
                    </span>
                    {phase.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-slate-400">{phase.teamDeployed}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
