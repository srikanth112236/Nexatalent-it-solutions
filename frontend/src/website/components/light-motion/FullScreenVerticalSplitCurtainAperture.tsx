import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Users, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenVerticalSplitCurtainAperture: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topSlatRef = useRef<HTMLDivElement>(null);
  const bottomSlatRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      tl.to(topSlatRef.current, { yPercent: -100, rotateX: 20, ease: 'power2.inOut' }, 0)
        .to(bottomSlatRef.current, { yPercent: 100, rotateX: -20, ease: 'power2.inOut' }, 0)
        .fromTo(
          contentRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.2
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-900 text-white overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Unveiled Leadership Directory */}
      <div
        ref={contentRef}
        className="relative z-10 w-full px-8 md:px-20 py-16 max-w-5xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 font-mono text-xs font-bold mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>APERTURE SHUTTER SPLIT · EXECUTIVE DIRECTORY</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          GCC Leadership Vanguard
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Pre-qualified Site Leaders and Engineering Vice Presidents who have navigated hyper-growth expansions from seed stage to public listing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase">Site Managing Director</span>
            <h4 className="text-xl font-bold text-white mt-1 mb-2">Ex-Microsoft GCC Head</h4>
            <p className="text-xs text-slate-400 mb-4">Scaled Bangalore R&D center from 50 to 1,800 engineers over 4 years.</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Available in 30 Days</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase">VP Platform Architecture</span>
            <h4 className="text-xl font-bold text-white mt-1 mb-2">Ex-Stripe Infrastructure</h4>
            <p className="text-xs text-slate-400 mb-4">Architected global multi-region payment routing handling $12B monthly volume.</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Vetted & Cleared</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase">Head of AI Research</span>
            <h4 className="text-xl font-bold text-white mt-1 mb-2">IIT Delhi PhD / Ex-DeepMind</h4>
            <p className="text-xs text-slate-400 mb-4">Published author with 18 papers on model compression and efficient inference.</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Confidential Dialogue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Aperture Slat (Slides Up) */}
      <div
        ref={topSlatRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-slate-950 border-b-2 border-blue-500/50 p-12 flex flex-col justify-between z-20 shadow-2xl"
      >
        <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">
          VERTICAL APERTURE BLIND 01
        </span>
        <div className="text-2xl md:text-4xl font-black text-white">
          Enterprise Leadership Index
        </div>
      </div>

      {/* Bottom Aperture Slat (Slides Down) */}
      <div
        ref={bottomSlatRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-950 border-t-2 border-blue-500/50 p-12 flex flex-col justify-between z-20 shadow-2xl"
      >
        <div className="text-2xl md:text-4xl font-black text-white">
          Sovereign Directory Partition
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>APERTURE SHUTTERS UNLOCKED</span>
          <ArrowUpRight className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </section>
  );
};
