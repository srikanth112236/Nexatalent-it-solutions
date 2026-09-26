import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitCommit } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PathMilestone {
  step: string;
  title: string;
  metric: string;
  description: string;
}

const MILESTONES: PathMilestone[] = [
  { step: '01', title: 'Scope Calibration & Off-Limits Locking', metric: 'Day 01', description: 'Signing bilateral NDAs, defining target competitor talent pools, and fixing salary ceilings.' },
  { step: '02', title: 'Algorithmic Profiling & Live Benchmark', metric: 'Day 03', description: 'Delivering first cohort of 3–5 pre-screened Staff/Principal engineers within 72 business hours.' },
  { step: '03', title: 'Client Technical Defense Syncs', metric: 'Day 10', description: 'Direct interviews with your engineering leadership with zero candidate ghosting or late drops.' },
  { step: '04', title: 'Offer Acceptance & Counter-Shield', metric: 'Day 14', description: '94.8% offer acceptance rate backed by proactive resignation coaching and buyout funds.' },
  { step: '05', title: 'Full Squad Autonomous Center Go-Live', metric: 'Day 75', description: '120-engineer Center of Excellence operational with 180-day placement warranty.' },
];

export const SignatureStickyCurvedPath: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !pathRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
            <GitCommit className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Reveal 05 • Bezier Curved Path Scrubber</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Curved Bezier Trajectory Highway
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Scroll down: A dynamic vector beam glides along the curved path, unlocking execution checkpoints with spring physics.
          </p>
        </div>

        {/* 5 Milestones along curved horizontal track */}
        <div className="relative py-8">
          {/* Background Track SVG */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-24 pointer-events-none z-0">
            <svg viewBox="0 0 1000 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path
                d="M 0 50 Q 250 10 500 50 T 1000 50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="6"
              />
              <path
                ref={pathRef}
                d="M 0 50 Q 250 10 500 50 T 1000 50"
                fill="none"
                stroke="#2563eb"
                strokeWidth="6"
                strokeDasharray="1000"
                strokeDashoffset={1000 - 1000 * scrollProgress}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Milestone Cards Node Array */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {MILESTONES.map((m, idx) => {
              const nodeThreshold = (idx + 1) / 5;
              const isPassed = scrollProgress >= nodeThreshold - 0.15;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                    isPassed
                      ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 scale-105'
                      : 'bg-slate-50/80 border-slate-200 opacity-60'
                  }`}
                  style={{ minHeight: '220px' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center ${
                        isPassed ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {m.step}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-blue-600">
                        {m.metric}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-snug mb-2">
                      {m.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className={isPassed ? 'text-emerald-600' : 'text-slate-400'}>
                      {isPassed ? '● UNLOCKED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
