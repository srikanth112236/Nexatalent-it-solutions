import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Split, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TwoSectionDualStickyConvergence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerLockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !leftPanelRef.current || !rightPanelRef.current || !centerLockRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1400',
          pin: true,
          scrub: 0.8,
        }
      });

      // Left panel slides towards center
      tl.to(leftPanelRef.current, {
        xPercent: 12,
        ease: 'power1.inOut',
      }, 0);

      // Right panel slides towards center
      tl.to(rightPanelRef.current, {
        xPercent: -12,
        ease: 'power1.inOut',
      }, 0);

      // Center lock badge scales up and reveals full blueprint
      tl.fromTo(centerLockRef.current, {
        scale: 0.8,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
      }, 0.3);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Split className="w-3.5 h-3.5 text-blue-600" />
            <span>Two Sections Dual Sticky Pin • Bilateral Convergence on Scroll</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Dual-Section Sticky Pin & Convergent Blueprint
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Scroll down: Watch the left challenge and right solution panels pin simultaneously and lock together in the center.
          </p>
        </div>

        {/* Bilateral Panels Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative items-center">
          
          {/* Left Panel: The Enterprise Hiring Bottleneck */}
          <div
            ref={leftPanelRef}
            className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xl shadow-rose-500/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase border border-rose-200">
                Left Section: The Bottleneck
              </span>
              <span className="text-xs font-mono font-bold text-rose-500">65-Day Search Lag</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Unvetted Transactional Agency Recruiting
            </h3>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Standard agencies scrape keyword resumes, flooding hiring managers with non-technical candidates who fail basic concurrency and architecture interviews.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-rose-700 font-semibold">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>48% offer drop-off due to aggressive counter-offers</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Zero standardized technical code benchmarking</span>
              </div>
            </div>
          </div>

          {/* Right Panel: The NexaTalent IT Solutions Solution */}
          <div
            ref={rightPanelRef}
            className="p-8 rounded-3xl bg-white border border-blue-300 shadow-xl shadow-blue-500/10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase border border-blue-200">
                Right Section: NexaTalent IT Solutions Pod
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">72-Hour Contractual SLA</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Dedicated Executive Search & GCC Engineering Pod
            </h3>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Ex-Staff Engineers and Managing Directors evaluate candidates on live memory leak and distributed state machines, delivering pre-calibrated shortlists in 72 hours.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-emerald-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>94.8% offer acceptance with proactive counter-shields</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>180-day comprehensive placement warranty</span>
              </div>
            </div>
          </div>

        </div>

        {/* Center Convergence Lock Indicator */}
        <div
          ref={centerLockRef}
          className="mt-8 p-6 rounded-2xl bg-slate-900 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Convergence Locked: Guaranteed Turnkey SLA</h4>
              <p className="text-xs text-slate-400">72h Shortlist Delivery • 180-Day Guarantee • Top 0.5% Staff Bar</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer">
            Lock Mandate SLA
          </button>
        </div>

      </div>
    </div>
  );
};
