import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface GlyphPortalHeroProps {
  /** The monumental letter visitors scroll through. */
  letter?: string;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/**
 * GlyphPortalHero — smooth pinned scrub portal, redesigned for readability.
 *
 * Same buttery feel as before (pinned + scrub + mouse parallax), but the
 * garble is fixed by *phasing*:
 *  Phase 0 (landing): glyph is faint (14% opacity) + text sits on a dark
 *   scrim, so the headline is 100% crisp in the screenshot view.
 *  Phase 1 (scroll 0→45%): headline lifts away and fades out FIRST.
 *  Phase 2 (scroll 20→100%): the glyph THEN grows 0.9→3.0x and blooms to
 *   full opacity, becoming the portal you fly through.
 * Text and full-strength glyph are never on screen together.
 */
export const GlyphPortalHero: React.FC<GlyphPortalHeroProps> = ({ letter = 'N' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Buttery lerped mouse parallax (separate props from the scroll tween).
    const gx = gsap.quickTo(glyphRef.current, 'x', { duration: 0.7, ease: 'power3' });
    const gy = gsap.quickTo(glyphRef.current, 'y', { duration: 0.7, ease: 'power3' });
    const mx = gsap.quickTo(mouseRef.current, 'x', { duration: 0.9, ease: 'power3' });
    const my = gsap.quickTo(mouseRef.current, 'y', { duration: 0.9, ease: 'power3' });
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      gx(nx * 42);
      gy(ny * 30);
      mx(nx * -22);
      my(ny * -16);
    };
    const el = containerRef.current;
    el.addEventListener('mousemove', onMove);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(Math.round(self.progress * 100)),
        },
      });

      // Phase 1 — story exits FIRST (fast, upward through the counterform).
      tl.fromTo(
        contentRef.current,
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
        { y: -130, opacity: 0, scale: 0.94, filter: 'blur(6px)', ease: 'power2.in', duration: 0.45 },
        0
      )
        // Ambient grid recedes.
        .fromTo(gridRef.current, { opacity: 0.14 }, { opacity: 0.02, ease: 'none', duration: 1 }, 0)
        // Phase 2 — portal travel: faint glyph blooms + grows past viewport.
        .fromTo(
          glyphRef.current,
          { scale: 0.9, opacity: 0.16 },
          { scale: 3.0, opacity: 1, ease: 'power1.inOut', duration: 1 },
          0.15
        )
        .fromTo(
          glowRef.current,
          { opacity: 0.45, scale: 0.9 },
          { opacity: 1, scale: 1.6, ease: 'none', duration: 1 },
          0.15
        )
        // Phase 3 — "entering" caption arrives only after headline is gone.
        .fromTo(
          enterRef.current,
          { y: 46, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.4 },
          0.58
        )
        .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0);
    }, containerRef);

    return () => {
      el.removeEventListener('mousemove', onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center m-0 p-0 text-white"
      style={{ width: '100vw', maxWidth: '100vw', backgroundColor: '#060F2B' }}
      aria-label="NexaTalent IT Solutions glyph portal"
    >
      {/* Faint engineering grid (fades as you dive in) — logo sky */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #3FA9FF 1px, transparent 0)',
          backgroundSize: '34px 34px',
          opacity: 0.14,
        }}
      />
      {/* Drifting ambient orbs — logo royal + sky */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full pointer-events-none animate-drift-slow"
        style={{ background: 'radial-gradient(circle, rgba(11,99,229,0.26) 0%, transparent 65%)', filter: 'blur(50px)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-24 w-[38rem] h-[38rem] rounded-full pointer-events-none animate-drift-slow"
        style={{ background: 'radial-gradient(circle, rgba(63,169,255,0.18) 0%, transparent 65%)', filter: 'blur(50px)', animationDelay: '-4s' }}
      />
      {/* Ambient gradient field — logo gradient */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(11,99,229,0.38) 0%, rgba(26,134,255,0.14) 45%, transparent 70%)', filter: 'blur(40px)', willChange: 'transform, opacity' }}
      />

      {/* The monumental glyph — logo N gradient, starts faint so headline stays crisp */}
      <div
        ref={glyphRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontSize: '72vmin',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          willChange: 'transform, opacity',
          opacity: 0.16,
          transform: 'scale(0.9)',
          filter: 'drop-shadow(0 0 90px rgba(26,134,255,0.40))',
        }}
      >
        <span
          className="animate-gradient-pan"
          style={{
            background: 'linear-gradient(120deg, #0A1E4E 0%, #0F42B0 28%, #0B63E5 48%, #1A86FF 68%, #3FA9FF 85%, #0B63E5 100%)',
            backgroundSize: '220% 220%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {letter}
        </span>
      </div>

      {/* Story — sits on its own dark scrim so it never mixes with the glyph */}
      <div ref={mouseRef} className="relative z-10 w-full" style={{ willChange: 'transform' }}>
        <div ref={contentRef} className="text-center px-6 max-w-3xl mx-auto" style={{ willChange: 'transform, opacity' }}>
          {/* Readability scrim */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(56rem,94vw)] h-[min(34rem,80vh)] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(2,6,23,0.82) 0%, rgba(2,6,23,0.55) 45%, transparent 72%)', filter: 'blur(8px)' }}
          />
          <div className="relative">
            <motion.div
              {...rise(0.05)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#060F2B]/60 border border-white/15 text-[#8ACBFF] text-xs font-mono font-bold mb-6 backdrop-blur-md"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>GLYPH PORTAL · SCROLL TO ENTER · {progress}%</span>
            </motion.div>
            <motion.h1
              {...rise(0.15)}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-4"
              style={{ textShadow: '0 2px 24px rgba(2,6,23,0.9), 0 0 2px rgba(2,6,23,0.9)' }}
            >
              Step Through the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3FA9FF] via-[#1A86FF] to-[#8ACBFF] animate-gradient-pan" style={{ backgroundSize: '220% 220%' }}>
                NexaTalent IT Solutions
              </span>{' '}
              Portal
            </motion.h1>
            <motion.p
              {...rise(0.28)}
              className="text-sm sm:text-base text-slate-200 font-light leading-relaxed mb-8"
              style={{ textShadow: '0 1px 16px rgba(2,6,23,0.9)' }}
            >
              One structured hiring workflow. Scroll through into assessed talent pipelines, role-calibrated shortlists and tracked interviews.
            </motion.p>
            <motion.div {...rise(0.4)} className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/employers"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0A1E4E] text-sm font-bold hover:bg-[#D8EBFF] hover:shadow-[0_0_36px_rgba(26,134,255,0.45)] transition-all"
              >
                <span>Hire Talent</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 bg-slate-950/50 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/10 hover:border-white/40 transition-all"
              >
                <span>Find Jobs</span>
              </Link>
            </motion.div>
            <motion.div
              {...rise(0.52)}
              className="flex items-center justify-center gap-6 mt-9 text-xs font-mono text-slate-300"
            >
            <span><strong className="text-white text-sm">Assessed</strong> Talent Pipelines</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span><strong className="text-white text-sm">Tracked</strong> Interviews</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span><strong className="text-white text-sm">Structured</strong> Shortlists</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Arrival caption — only appears deep in the scrub, after headline left */}
      <div ref={enterRef} className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ opacity: 0 }}>
        <p className="text-xs font-mono tracking-[0.3em] text-[#8ACBFF]/90 mb-3">YOU ARE INSIDE THE N</p>
        <p className="text-3xl sm:text-5xl font-black tracking-tight">
          42,800+ engineers <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3FA9FF] to-[#1A86FF]">ahead</span>
        </p>
        <p className="mt-3 text-sm text-slate-300">Keep scrolling — talent bench, pods & mandates ↓</p>
      </div>

      {/* Scrub progress — logo gradient */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-44 h-[3px] rounded-full bg-white/10 overflow-hidden">
        <div ref={barRef} className="h-full w-full origin-left bg-gradient-to-r from-[#0B63E5] via-[#1A86FF] to-[#3FA9FF]" style={{ transform: 'scaleX(0)' }} />
      </div>
    </section>
  );
};
