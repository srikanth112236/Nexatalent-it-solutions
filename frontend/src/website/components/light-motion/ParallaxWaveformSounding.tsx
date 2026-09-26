import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ParallaxWaveformSounding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (card1Ref.current) {
        gsap.to(card1Ref.current, {
          y: -70,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          y: -130,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      if (card3Ref.current) {
        gsap.to(card3Ref.current, {
          y: -190,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Vertical Parallax • Market Pulse & Waveform Sounding</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            High-Frequency Waveform Telemetry
          </h2>
          <p className="text-lg text-slate-600">
            Real-time execution waveform metrics measuring order gateway speed, sub-microsecond FPGA packet parsing, and tick-to-trade latency.
          </p>
        </div>

        {/* 3 Differential Waveform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div
            ref={card1Ref}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4"
          >
            <span className="text-xs font-mono font-bold text-slate-400">PULSE 01 • L1 TICK</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900 font-mono">420 ns</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">P99.9</span>
            </div>
            <h4 className="text-base font-bold text-slate-800">Direct Market Feed Handler</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Solarflare OpenOnload kernel bypass with zero-copy ring buffers processing 12M market ticks per second.
            </p>
          </div>

          <div
            ref={card2Ref}
            className="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-2xl space-y-4 md:mt-8"
          >
            <span className="text-xs font-mono font-bold text-blue-600">PULSE 02 • FPGA CORE</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-blue-600 font-mono">82 ns</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Hardware Pinned</span>
            </div>
            <h4 className="text-base font-bold text-slate-800">Order Matching Gateway Logic</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Synthesized Verilog pipelines evaluating algorithmic triggers directly in silicon before network egress.
            </p>
          </div>

          <div
            ref={card3Ref}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 md:mt-16"
          >
            <span className="text-xs font-mono font-bold text-purple-600">PULSE 03 • ZERO JITTER</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-purple-600 font-mono">± 4 ns</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Deterministic</span>
            </div>
            <h4 className="text-base font-bold text-slate-800">Deterministic Clock Coherence</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sub-nanosecond PTP grandmaster clock synchronization locking global trading pods into unified latency parity.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
