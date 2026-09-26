import React, { useState, useRef } from 'react';
import { SlidersHorizontal, CheckCircle2, XCircle, ArrowLeftRight } from 'lucide-react';

export const SignatureTalentComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(95, Math.max(5, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 47 • Interactive Before/After Talent Velocity Slider</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Interactive Recruitment Model Comparison
          </h2>
          <p className="text-lg text-slate-600">
            Drag the central slider to visually compare the traditional transactional recruitment approach against the NexaTalent dedicated GCC search pod.
          </p>
        </div>

        {/* Drag Instruction */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 mb-6">
          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
          <span>Drag the center divider left or right to inspect the differences</span>
        </div>

        {/* Comparison Frame Container */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          className="relative max-w-5xl mx-auto h-[480px] md:h-[420px] rounded-3xl overflow-hidden border-2 border-slate-300 shadow-2xl shadow-slate-200 cursor-ew-resize"
        >
          
          {/* RIGHT SIDE: NexaTalent Engine (Underneath / Base Layer) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-8 md:p-12 flex flex-col justify-between">
            <div className="flex items-center justify-end">
              <span className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-extrabold uppercase shadow-sm">
                NexaTalent Executive Pod (Calibrated)
              </span>
            </div>

            <div className="max-w-md ml-auto text-right space-y-4">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                Top 0.5% Staff-Vetted Candidates
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interviews conducted by ex-FAANG Principal Engineers. Code vetted on live memory leak & concurrency harness.
              </p>

              <div className="space-y-2 text-xs font-bold text-slate-800">
                <div className="flex items-center justify-end gap-2 text-emerald-700">
                  <span>72-Hour Contractual SLA Guarantee</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-2 text-emerald-700">
                  <span>94.8% Offer-to-Join Acceptance Ratio</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-2 text-emerald-700">
                  <span>180-Day Comprehensive Placement Warranty</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-blue-600 font-extrabold">
              Dedicated Managing Director Pod Lead &rarr;
            </div>
          </div>

          {/* LEFT SIDE: Conventional Agency (Clipped by Slider Position) */}
          <div
            style={{ width: `${sliderPos}%` }}
            className="absolute inset-0 bg-slate-100/95 border-r-2 border-blue-600 p-8 md:p-12 flex flex-col justify-between overflow-hidden z-10"
          >
            <div className="flex items-center justify-start min-w-[320px]">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-300 text-slate-800 text-xs font-extrabold uppercase">
                Conventional Staffing Agency
              </span>
            </div>

            <div className="max-w-md text-left space-y-4 min-w-[320px]">
              <h3 className="text-2xl md:text-3xl font-black text-slate-700">
                Uncalibrated Keyword Scraping
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Junior recruiters searching LinkedIn keywords. No technical verification, high candidate attrition and interview fatigue.
              </p>

              <div className="space-y-2 text-xs font-bold text-slate-500">
                <div className="flex items-center justify-start gap-2 text-rose-600">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>35 to 60 Days Notice Period Delays</span>
                </div>
                <div className="flex items-center justify-start gap-2 text-rose-600">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Only 52% Offer Acceptance (Counter-offers lost)</span>
                </div>
                <div className="flex items-center justify-start gap-2 text-rose-600">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>30-Day Limited Warranty with Hidden Exclusions</span>
                </div>
              </div>
            </div>

            <div className="text-left text-xs text-slate-400 font-bold min-w-[320px]">
              &larr; Transactional Contingent Brokers
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-1 bg-blue-600 z-20 -translate-x-1/2 flex items-center justify-center pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-white">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
