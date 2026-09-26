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
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.4
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Quant High-Frequency Telemetry Revealed */}
      <div
        ref={telemetryRef}
        className="relative z-10 w-full px-8 md:px-20 py-16 max-w-5xl mx-auto text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
          <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs font-bold mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>LASER SPLIT CURTAIN REVEAL · HFT QUANT ENGINE</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          Sub-Millisecond Quant Guild
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          High-frequency trading algorithmic talent calibrated on custom FPGA hardware, DPDK packet ingestion, and order-book arbitration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-mono">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-cyan-400 mb-1">Tick-To-Trade Latency</div>
            <div className="text-2xl font-black text-white">&lt; 840 Nanoseconds</div>
            <div className="text-xs text-slate-500 mt-2">Custom Solarflare OpenOnload Kernel</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-cyan-400 mb-1">FPGA RTL Engineers</div>
            <div className="text-2xl font-black text-white">46 Verified Leads</div>
            <div className="text-xs text-slate-500 mt-2">Xilinx UltraScale+ / Verilog Master</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-cyan-400 mb-1">GCC Cost Differential</div>
            <div className="text-2xl font-black text-emerald-400">-58% Net Spend</div>
            <div className="text-xs text-slate-500 mt-2">Delivered in 21 Days to Prod</div>
          </div>
        </div>
      </div>

      {/* Central Laser Incision Line */}
      <div
        ref={laserLineRef}
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent z-30 shadow-[0_0_20px_#22d3ee]"
      />

      {/* Left Shutter Curtain */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-slate-950 border-r border-cyan-500/30 p-12 flex flex-col justify-between z-20 shadow-2xl"
      >
        <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
          QUANT VAULT FLANK 01
        </div>
        <div className="text-2xl md:text-4xl font-black text-white flex items-center gap-3">
          <Cpu className="w-8 h-8 text-cyan-400" />
          <span>FPGA & Low Latency</span>
        </div>
        <div className="text-xs font-mono text-slate-500">LASER SPLIT INITIATED</div>
      </div>

      {/* Right Shutter Curtain */}
      <div
        ref={rightPanelRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-slate-950 border-l border-cyan-500/30 p-12 flex flex-col justify-between z-20 shadow-2xl text-right"
      >
        <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
          QUANT VAULT FLANK 02
        </div>
        <div className="text-2xl md:text-4xl font-black text-white">
          <span>Algorithmic Execution</span>
        </div>
        <div className="text-xs font-mono text-slate-500">DIVIDING HORIZONTALLY</div>
      </div>
    </section>
  );
};
