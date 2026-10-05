import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Users, Clock, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const VerticalParallaxCaseStudy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const cardOneRef = useRef<HTMLDivElement>(null);
  const cardTwoRef = useRef<HTMLDivElement>(null);
  const cardThreeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Big background typography parallax
      if (bgTextRef.current) {
        gsap.to(bgTextRef.current, {
          y: -140,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      // Card 1
      if (cardOneRef.current) {
        gsap.to(cardOneRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      // Card 2
      if (cardTwoRef.current) {
        gsap.to(cardTwoRef.current, {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      // Card 3
      if (cardThreeRef.current) {
        gsap.to(cardThreeRef.current, {
          y: -180,
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
      className="py-32 bg-slate-50 border-b border-slate-200 relative overflow-hidden"
    >
      {/* Huge Background Parallax Watermark */}
      <div
        ref={bgTextRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-slate-200/40 text-[12vw] tracking-tighter select-none pointer-events-none whitespace-nowrap z-0"
      >
        75-DAY SCALE STORY
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Vertical Parallax • Deep Optical Depth Masking</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Vertical Parallax: The GCC Scale Story
          </h2>
          <p className="text-lg text-slate-600">
            How distributed capability hiring moves from leadership anchors to operating squads.
          </p>
        </div>

        {/* 3 Differential Vertical Parallax Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Card 1: Shift -60px */}
          <div
            ref={cardOneRef}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>STAGE 01</span>
              <span className="text-blue-600 font-bold">Phase 01</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Founding Leadership Anchor
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hired the Site Managing Director and 4 Principal Architects to codify team topology, coding standards, and SEZ regulatory setup.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 text-xs font-bold text-slate-800">
              Output: Leadership Anchors Set
            </div>
          </div>

          {/* Card 2: Shift -120px */}
          <div
            ref={cardTwoRef}
            className="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/10 space-y-4 md:mt-8"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>STAGE 02</span>
              <span className="text-blue-600 font-bold">Phase 02</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Core Squad Ramp
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assessed senior individual contributors across backend, frontend and platform disciplines.
            </p>
            <div className="p-3 rounded-xl bg-blue-50 text-xs font-bold text-blue-800">
              Output: Coordinated Offer Closures
            </div>
          </div>

          {/* Card 3: Shift -180px */}
          <div
            ref={cardThreeRef}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4 md:mt-16"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>STAGE 03</span>
              <span className="text-emerald-600 font-bold">Phase 03</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Operating Center Handover
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operating squads with documented handover, legal clarity and knowledge transfer discipline.
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-800">
              Output: Documented Operating Model
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
