import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitBranch, CheckCircle2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitDivergenceCandidateJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftVectorRef = useRef<HTMLDivElement>(null);
  const rightVectorRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftVectorRef.current,
        { xPercent: 50, opacity: 0.2 },
        { xPercent: 0, opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightVectorRef.current,
          { xPercent: -50, opacity: 0.2 },
          { xPercent: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          bannerRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col justify-center items-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Header Banner */}
      <div ref={bannerRef} className="relative z-30 mb-8 text-center px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-3">
          <GitBranch className="w-3.5 h-3.5 text-blue-600" />
          <span>PATTERN 20 · 4-DIMENSIONAL RUBRIC DIVERGENCE</span>
        </div>
        <h2 className="text-section-title font-black text-slate-900 tracking-tight">
          Single Candidate Profile <span className="text-blue-600">Diverges Into 4 Axes</span>
        </h2>
      </div>

      {/* Diverged Evaluation Vectors */}
      <div className="relative z-20 w-full px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Side: Technical & Scalability Vectors */}
        <div
          ref={leftVectorRef}
          className="p-8 lg:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">
              VECTOR AXIS 01 & 02 · HARD ENGINEERING
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Systems Architecture & Concurrency</h3>
          <p className="text-slate-600 text-xs mb-6 leading-relaxed">
            Live evaluation of lock-free memory structures, thread safety, and cache-line alignment under heavy contention.
          </p>
          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>AST Code Complexity Score</span>
              <span className="text-emerald-600 font-bold">98.2 / 100</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Failure Recovery Design</span>
              <span className="text-blue-600 font-bold">Top 0.5% Tier</span>
            </div>
          </div>
        </div>

        {/* Right Side: Ownership & Governance Vectors */}
        <div
          ref={rightVectorRef}
          className="p-8 lg:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
              VECTOR AXIS 03 & 04 · EXECUTIVE LEADERSHIP
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Autonomous Ownership & Culture</h3>
          <p className="text-slate-600 text-xs mb-6 leading-relaxed">
            Testing for extreme ownership mindset, cross-border executive presence, and multi-year organizational loyalty.
          </p>
          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Executive Presence Rating</span>
              <span className="text-emerald-600 font-bold">Director-Ready</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Retention Stability Index</span>
              <span className="text-blue-600 font-bold">99.1% Over 3Y</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-8 flex items-center gap-2 text-xs font-mono text-slate-500">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>All 4 Diverged Dimensions Must Score &gt; 95% For Final Presentation</span>
        <ArrowRight className="w-4 h-4 text-blue-600 ml-2" />
      </div>
    </section>
  );
};
