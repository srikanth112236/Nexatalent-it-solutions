import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface EditorialSlide {
  num: string;
  quote: string;
  author: string;
  org: string;
  stat: string;
}

const SLIDES: EditorialSlide[] = [
  { num: '01', quote: 'NexaTalent built our 80-person autonomous AI infrastructure center in Hyderabad in 70 days flat. Zero disruption to our San Francisco core sprints.', author: 'Marcus Vance', org: 'CTO, Global AI Infrastructure Unicorn', stat: '70-Day Delivery' },
  { num: '02', quote: 'The caliber of Principal Rust & C++ architects in their Bangalore pool exceeded our Wall Street expectations. Our execution latency dropped 38%.', author: 'Elena Rostova', org: 'Head of Quantitative Systems, High-Frequency Fund', stat: '-38% Latency' },
  { num: '03', quote: 'Their legal non-compete quarantine and hardware VDI enclaves made board-level SOC 2 compliance effortless across both our London and India hubs.', author: 'David Sterling', org: 'Chief Information Security Officer, Tier-1 FinTech', stat: '100% Board Pass' },
];

export const FullScreenHorizontalParallaxEditorialScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-white text-slate-900 overflow-hidden flex flex-col justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Header */}
      <div className="relative z-10 w-full px-8 md:px-16 pt-8 pb-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>EDITORIAL SPREAD · HORIZONTAL LATERAL SCRUB</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight">
            Executive Voices & <span className="text-blue-600">Enterprise Proof</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>LATERAL PANNING SHOWCASE</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Horizontal Editorial Track */}
      <div className="relative z-20 w-full overflow-visible py-12">
        <div ref={trackRef} className="flex gap-10 px-8 md:px-16 w-max">
          {SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[540px] p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-slate-300 font-mono">
                    {slide.num}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                    {slide.stat}
                  </span>
                </div>
                <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-70" />
                <p className="text-slate-800 text-base md:text-lg font-medium leading-relaxed mb-8">
                  "{slide.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <div className="font-black text-slate-900 text-sm">{slide.author}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{slide.org}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
