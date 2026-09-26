import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, ShieldCheck, Lock, Award, FileCheck2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PillarPledge {
  degree: number;
  title: string;
  badge: string;
  summary: string;
  icon: React.ElementType;
}

const PILLARS: PillarPledge[] = [
  { degree: 25, title: 'Bilateral Confidentiality & NDA', badge: 'Day 01', summary: 'Strict non-disclosure agreements protecting strategic expansion plans.', icon: Lock },
  { degree: 50, title: 'Contractual 72h Shortlist SLA', badge: 'Day 03', summary: 'Pre-vetted engineering dossiers delivered within 72 business hours.', icon: ShieldCheck },
  { degree: 75, title: 'Day-1 Intellectual Property Assignment', badge: 'Day 21', summary: '100% IP ownership resides directly with your parent enterprise.', icon: Award },
  { degree: 100, title: '180-Day Comprehensive Warranty', badge: 'Day 75', summary: 'Unconditional replacement coverage backed by dedicated talent advocacy.', icon: FileCheck2 },
];

export const PinnedCircularProgressReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progressPercent, setProgressPercent] = useState<number>(25);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const pct = Math.round(self.progress * 100);
          setProgressPercent(Math.max(10, pct));
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const strokeDashoffset = 565 - (565 * progressPercent) / 100;

  return (
    <div
      ref={containerRef}
      className="bg-white border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned Radial Dial • 360° Governance Progress on Scroll</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            360-Degree Executive Assurance Dial
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Scroll down to watch the radial governance meter fill, unlocking each enterprise covenant tier.
          </p>
        </div>

        {/* 2-Column: Radial Gauge & Active Covenants */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: 360 SVG Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-[280px] h-[280px] flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="12"
                  strokeDasharray="565"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl md:text-5xl font-black text-slate-900 font-mono tracking-tight">
                  {progressPercent}%
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Governance Locked
                </span>
              </div>
            </div>
          </div>

          {/* Right: Unlocked Covenants Grid */}
          <div className="lg:col-span-7 space-y-4">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              const isUnlocked = progressPercent >= p.degree;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    isUnlocked
                      ? 'bg-blue-50/40 border-2 border-blue-600 shadow-md'
                      : 'bg-slate-50/60 border-slate-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isUnlocked ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{p.summary}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-mono font-bold shrink-0 ${
                    isUnlocked ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {isUnlocked ? '● VERIFIED' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
