import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gauge } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const PinnedSpeedometerGauge: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [velocityProgress, setVelocityProgress] = useState(0);

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
          setVelocityProgress(self.progress);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Needle angles from -120 deg to +120 deg
  const needleAngle1 = -120 + velocityProgress * 240;
  const slaHours = Math.max(12, Math.round(72 * (1 - velocityProgress * 0.65))); // decreases to 24-48h
  const conversionRate = (80 + velocityProgress * 14.8).toFixed(1); // 80% to 94.8%

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
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned Dual Precision Tachometer</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            High-Velocity Placement Tachometers
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Scroll down: Watch the dual velocity gauges sweep in real time, clocking turnaround speed and offer-acceptance integrity.
          </p>
        </div>

        {/* Dual Gauges Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Gauge 1: SLA Delivery Speed */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase mb-4">
              TACHOMETER 01 • SLA SPEED
            </span>

            {/* Dial Graphic */}
            <div className="relative w-[260px] h-[150px] flex items-end justify-center overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                {/* Dial Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="14"
                  strokeDasharray="251"
                  strokeDashoffset={251 - 251 * velocityProgress}
                  strokeLinecap="round"
                />
                {/* Needle */}
                <line
                  x1="100" y1="100"
                  x2="100" y2="35"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    transformOrigin: '100px 100px',
                    transform: `rotate(${needleAngle1}deg)`,
                    transition: 'transform 0.05s linear'
                  }}
                />
                <circle cx="100" cy="100" r="10" fill="#0f172a" />
              </svg>
            </div>

            <div className="mt-4">
              <span className="text-4xl font-black font-mono text-slate-900">
                {slaHours}h SLA
              </span>
              <p className="text-xs text-slate-500 mt-1">Average Time to Screened Shortlist</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 w-full flex items-center justify-between text-xs text-slate-600">
              <span>Standard: 65 Days</span>
              <span className="font-bold text-blue-600">NexaTalent IT Solutions: &lt;72 Hours</span>
            </div>
          </div>

          {/* Gauge 2: Offer Acceptance Integrity */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase mb-4">
              TACHOMETER 02 • RETENTION INTEGRITY
            </span>

            {/* Dial Graphic */}
            <div className="relative w-[260px] h-[150px] flex items-end justify-center overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                {/* Dial Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="251"
                  strokeDashoffset={251 - 251 * velocityProgress}
                  strokeLinecap="round"
                />
                {/* Needle */}
                <line
                  x1="100" y1="100"
                  x2="100" y2="35"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    transformOrigin: '100px 100px',
                    transform: `rotate(${needleAngle1}deg)`,
                    transition: 'transform 0.05s linear'
                  }}
                />
                <circle cx="100" cy="100" r="10" fill="#0f172a" />
              </svg>
            </div>

            <div className="mt-4">
              <span className="text-4xl font-black font-mono text-emerald-600">
                {conversionRate}%
              </span>
              <p className="text-xs text-slate-500 mt-1">Offer-to-Join Conversion Ratio</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 w-full flex items-center justify-between text-xs text-slate-600">
              <span>Industry Avg: 52%</span>
              <span className="font-bold text-emerald-600">NexaTalent IT Solutions: 94.8%</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
