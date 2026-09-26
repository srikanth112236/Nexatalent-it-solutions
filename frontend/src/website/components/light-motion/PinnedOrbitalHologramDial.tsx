import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Globe2, Award, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const PinnedOrbitalHologramDial: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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
          setProgress(Math.round(self.progress * 100));
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const outerOffset = 754 - (754 * progress) / 100;
  const middleOffset = 565 - (565 * progress) / 100;
  const innerOffset = 377 - (377 * progress) / 100;

  return (
    <div
      ref={containerRef}
      className="bg-white border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned Triple-Orbital Gyroscopic Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Triple-Ring Gyroscopic Governance Dial
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Three counter-rotating orbital rings scrub synchronously with vertical scroll, locking Technical Vetting, GCC Timeline, and Placement Escrow into alignment.
          </p>
        </div>

        {/* 2-Column: Gyroscope & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Gyroscopic Radial Rings */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 280 280">
                {/* Outer Ring: Technical Vetting */}
                <circle cx="140" cy="140" r="120" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="140" cy="140" r="120"
                  fill="none" stroke="#2563eb" strokeWidth="10"
                  strokeDasharray="754"
                  strokeDashoffset={outerOffset}
                  strokeLinecap="round"
                />

                {/* Middle Ring: GCC Deployment Timeline */}
                <circle cx="140" cy="140" r="90" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="140" cy="140" r="90"
                  fill="none" stroke="#7c3aed" strokeWidth="10"
                  strokeDasharray="565"
                  strokeDashoffset={middleOffset}
                  strokeLinecap="round"
                />

                {/* Inner Ring: Escrow Warranty */}
                <circle cx="140" cy="140" r="60" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="140" cy="140" r="60"
                  fill="none" stroke="#10b981" strokeWidth="10"
                  strokeDasharray="377"
                  strokeDashoffset={innerOffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Central Core Indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl md:text-5xl font-black text-slate-900 font-mono tracking-tight">
                  {progress}%
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Synchronized
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Synchronized Telemetry Cards */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Outer Ring Telemetry */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 ${
              progress >= 33 ? 'bg-blue-50/50 border-2 border-blue-600 shadow-lg' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                  <Cpu className="w-4 h-4" />
                  <span>Ring 01: 4-Stage Architectural Code Vetting</span>
                </div>
                <span className="text-xs font-mono font-black text-blue-600">{Math.min(100, Math.round(progress * 1.2))}%</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluating candidate concurrency, Byzantine recovery, and low-latency cache lines. Only top 0.5% cleared.
              </p>
            </div>

            {/* Middle Ring Telemetry */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 ${
              progress >= 66 ? 'bg-purple-50/50 border-2 border-purple-600 shadow-lg' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                  <Globe2 className="w-4 h-4" />
                  <span>Ring 02: Turnkey GCC 75-Day Deployment</span>
                </div>
                <span className="text-xs font-mono font-black text-purple-600">{Math.min(100, progress)}%</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incorporation, SEZ Grade-A facility, and full 120-engineer squad operational on Day 75 with 100% IP transfer.
              </p>
            </div>

            {/* Inner Ring Telemetry */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 ${
              progress >= 95 ? 'bg-emerald-50/50 border-2 border-emerald-600 shadow-lg' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <Award className="w-4 h-4" />
                  <span>Ring 03: 180-Day Comprehensive Placement Escrow</span>
                </div>
                <span className="text-xs font-mono font-black text-emerald-600">{progress >= 95 ? '100%' : `${progress}%`}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Escrow-backed replacement protections ensuring full talent continuity across all executive and director hires.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
