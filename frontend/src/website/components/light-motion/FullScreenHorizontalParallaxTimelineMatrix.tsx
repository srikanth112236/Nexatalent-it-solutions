import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, CheckCircle2, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface RampDay {
  day: string;
  phase: string;
  deliverables: string[];
  headcount: string;
}

const DAYS: RampDay[] = [
  { day: 'Day 01–15', phase: 'Charter & Site MD Appointed', deliverables: ['Founding Managing Director hired', 'Legal entity & bank escrow sealed', 'Bangalore campus space secured'], headcount: '1–5 Execs' },
  { day: 'Day 16–35', phase: 'Core Architecture Guild', deliverables: ['Staff Distributed Storage lead hired', 'AI / ML Principal Architect in place', 'Hardware VPC peering activated'], headcount: '15 Staff Engineers' },
  { day: 'Day 36–55', phase: 'Squad Rapid Scale & CI/CD', deliverables: ['Full CI/CD pipeline integrated', 'Non-compete clearances certified', 'First code commit into master branch'], headcount: '45 Engineers' },
  { day: 'Day 56–75', phase: 'Full Autonomous Velocity', deliverables: ['100% production feature ownership', 'Round-the-clock follow-the-sun handoffs', 'Documented 62% operational savings'], headcount: '80+ Tech Squad' },
];

export const FullScreenHorizontalParallaxTimelineMatrix: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -55,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-white text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Matrix Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 w-full px-8 md:px-16 pt-8 pb-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>ENTERPRISE 75-DAY RAMP TIMELINE · GSAP HORIZONTAL SCRUB</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            From Zero to <span className="text-emerald-600">80+ Engineers</span> in 75 Days
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>GUARANTEED DAY-75 VELOCITY</span>
        </div>
      </div>

      {/* Lateral Milestone Cards */}
      <div className="relative z-20 w-full overflow-visible py-12">
        <div ref={trackRef} className="flex gap-8 px-8 md:px-16 w-max">
          {DAYS.map((ramp, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[460px] p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono font-extrabold text-blue-600">
                    {ramp.day}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                    {ramp.headcount}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{ramp.phase}</h3>

                <div className="space-y-3 mb-6">
                  {ramp.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Phase SLA</span>
                <span className="text-slate-900 font-bold">100% On-Schedule</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
