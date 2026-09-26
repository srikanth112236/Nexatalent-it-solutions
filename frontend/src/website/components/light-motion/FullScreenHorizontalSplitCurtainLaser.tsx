import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Zap, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenHorizontalSplitCurtainLaser: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 1,
        },
      });

      // 1. Laser pulses along the center seam
      tl.fromTo(
        laserLineRef.current,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, ease: 'power2.out' },
        0
      )
        // 2. Both side curtains slide apart
        .to(leftPanelRef.current, { xPercent: -100, ease: 'power2.inOut' }, 0.2)
        .to(rightPanelRef.current, { xPercent: 100, ease: 'power2.inOut' }, 0.2)
        .to(laserLineRef.current, { opacity: 0 }, 0.3)
        // 3. Telemetry card zooms forward
        .fromTo(
          telemetryRef.current,
          { scale: 0.88, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.4
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Quant High-Frequency Telemetry Revealed */}
      <div
        ref={telemetryRef}
        className="relative z-10 w-full px-8 md:px-20 py-16 max-w-5xl mx-auto text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
          <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>LASER SPLIT CURTAIN REVEAL · HFT QUANT ENGINE</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Sub-Millisecond Quant Guild
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          High-frequency trading algorithmic talent calibrated on custom FPGA hardware, DPDK packet ingestion, and order-book arbitration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-mono">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="text-xs text-blue-600 font-bold mb-1">Tick-To-Trade Latency</div>
            <div className="text-2xl font-black text-slate-900">&lt; 840 Nanoseconds</div>
            <div className="text-xs text-slate-500 mt-2">Custom Solarflare OpenOnload Kernel</div>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="text-xs text-blue-600 font-bold mb-1">FPGA RTL Engineers</div>
            <div className="text-2xl font-black text-slate-900">46 Verified Leads</div>
            <div className="text-xs text-slate-500 mt-2">Xilinx UltraScale+ / Verilog Master</div>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="text-xs text-emerald-600 font-bold mb-1">GCC Cost Differential</div>
            <div className="text-2xl font-black text-emerald-600">-58% Net Spend</div>
            <div className="text-xs text-slate-500 mt-2">Delivered in 21 Days to Prod</div>
          </div>
        </div>
      </div>

      {/* Central Laser Incision Line */}
      <div
        ref={laserLineRef}
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-transparent via-blue-500 to-transparent z-30 shadow-[0_0_20px_#3b82f6]"
      />

      {/* Left Shutter Curtain */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-white border-r border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-xs font-mono text-blue-600 font-extrabold uppercase tracking-widest">
          QUANT VAULT FLANK 01
        </div>
        <div className="text-2xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
          <Cpu className="w-8 h-8 text-blue-600" />
          <span>FPGA & Low Latency</span>
        </div>
        <div className="text-xs font-mono text-slate-400">LASER SPLIT INITIATED</div>
      </div>

      {/* Right Shutter Curtain */}
      <div
        ref={rightPanelRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-white border-l border-slate-300 p-12 lg:p-16 flex flex-col justify-between z-20 shadow-2xl backdrop-blur-xl text-right"
      >
        <div className="text-xs font-mono text-blue-600 font-extrabold uppercase tracking-widest">
          QUANT VAULT FLANK 02
        </div>
        <div className="text-2xl md:text-4xl font-black text-slate-900">
          <span>Algorithmic Execution</span>
        </div>
        <div className="text-xs font-mono text-slate-400">DIVIDING HORIZONTALLY</div>
      </div>
    </section>
  );
};
