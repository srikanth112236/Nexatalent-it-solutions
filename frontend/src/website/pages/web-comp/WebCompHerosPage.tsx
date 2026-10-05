import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';

import {
  Hero1AiPartner,
  Hero2MarketingCareers,
  Hero4WebDesigner,
  Hero5Creators,
  Hero6MarketingAgency,
  Hero7FuelingBrands
} from '../../components/web-comp/WcHeros';

import {
  H12Blob,
  H13Collage,
  H14GiantType,
  H15Browser,
  H16Badges
} from '../../components/web-comp/WcHeros2';

import {
  Hero30DarkNeonGrid,
  Hero31BentoArchitect,
  Hero32SalaryArbitrageHero,
  Hero33TerminalHero,
  Hero34ImmersiveVideoHero,
  Hero35SwissEditorial,
  Hero40GlassmorphismSpheres,
  Hero42ExecutivePledgeHero,
  Hero45BrutalistColorBlock
} from '../../components/web-comp/WcHeros3';

import {
  HeroLight1SpotlightBeam,
  HeroLight221stDevBento,
  HeroLight4LampLight,
  HeroLight6MagneticAvatarStack,
  HeroLight13SwissGrid,
  HeroLight14VideoPortal
} from '../../components/web-comp/WcLightHeros';

import {
  NewHero1,
  NewHero2,
  NewHero3,
  NewHero4,
  NewHero5,
  NewHero6,
  NewHero7,
  NewHero8,
  NewHero9,
  NewHero10,
  NewHero11,
  NewHero12,
  NewHero13,
  NewHero14,
  NewHero15,
  NewHero16,
  NewHero17,
  NewHero18,
  NewHero19,
  NewHero20,
  NewHero21,
  NewHero22,
  NewHero23,
  NewHero24,
  NewHero25,
} from '../../components/web-comp/WcNewHeros';

import { ScrollProgressBar } from '../../components/web-comp/WcSections';
import { Search, ArrowUp, Sparkles, Hash } from 'lucide-react';

interface HeroMeta {
  id: string;
  name: string;
  category: 'Complete Light Theme' | 'Full Screen' | 'Dark Tech & AI' | 'SaaS & Interactive' | 'Executive & Corporate' | 'New Fresh 2026 Heros';
  Component: React.ComponentType;
}

const HEROES: HeroMeta[] = [
  // 25 Brand-New Ultra-Modern Light Heros
  { id: 'new-hero-1', name: 'New Hero 01 — GCC Global Hub Interactive Map & Talent Radar', category: 'New Fresh 2026 Heros', Component: NewHero1 },
  { id: 'new-hero-2', name: 'New Hero 02 — 3D Stacked Candidate Dossier & Live Matcher', category: 'New Fresh 2026 Heros', Component: NewHero2 },
  { id: 'new-hero-3', name: 'New Hero 03 — Swiss Grid Modernist Tech Pod Builder', category: 'New Fresh 2026 Heros', Component: NewHero3 },
  { id: 'new-hero-4', name: 'New Hero 04 — Glassmorphism Dual-Tier Enterprise Hub', category: 'New Fresh 2026 Heros', Component: NewHero4 },
  { id: 'new-hero-5', name: 'New Hero 05 — Live Terminal & Automated AI Vetting Pipeline', category: 'New Fresh 2026 Heros', Component: NewHero5 },
  { id: 'new-hero-6', name: 'New Hero 06 — Asymmetric Editorial Showcase with Video Testimonial', category: 'New Fresh 2026 Heros', Component: NewHero6 },
  { id: 'new-hero-7', name: 'New Hero 07 — Aceternity Inspired Glowing Orbit & Skill Constellation', category: 'New Fresh 2026 Heros', Component: NewHero7 },
  { id: 'new-hero-8', name: 'New Hero 08 — High-Density Metric Dashboard & Instant Cost Calculator', category: 'New Fresh 2026 Heros', Component: NewHero8 },
  { id: 'new-hero-9', name: 'New Hero 09 — Floating Isometric Tech Pod Cards', category: 'New Fresh 2026 Heros', Component: NewHero9 },
  { id: 'new-hero-10', name: 'New Hero 10 — Minimalist Neo-Brutalist Light Command Center', category: 'New Fresh 2026 Heros', Component: NewHero10 },
  { id: 'new-hero-11', name: 'New Hero 11 — Interactive Talent Matrix & Live Search Bar', category: 'New Fresh 2026 Heros', Component: NewHero11 },
  { id: 'new-hero-12', name: 'New Hero 12 — Split Screen Diagonal Hero with Testimonials', category: 'New Fresh 2026 Heros', Component: NewHero12 },
  { id: 'new-hero-13', name: 'New Hero 13 — Modern SaaS Tabs & Live Candidate Reel', category: 'New Fresh 2026 Heros', Component: NewHero13 },
  { id: 'new-hero-14', name: 'New Hero 14 — Giant Typography with Inline Avatar Marquee', category: 'New Fresh 2026 Heros', Component: NewHero14 },
  { id: 'new-hero-15', name: 'New Hero 15 — Glass Floating Mobile App Mockup & Talent Push Alert', category: 'New Fresh 2026 Heros', Component: NewHero15 },
  { id: 'new-hero-16', name: 'New Hero 16 — B2B Enterprise Compliance & Security Shield', category: 'New Fresh 2026 Heros', Component: NewHero16 },
  { id: 'new-hero-17', name: 'New Hero 17 — Aceternity Glow Cards with Skill Assessment', category: 'New Fresh 2026 Heros', Component: NewHero17 },
  { id: 'new-hero-18', name: 'New Hero 18 — Circular Ripple Pulse Hero with Live Talent Stream', category: 'New Fresh 2026 Heros', Component: NewHero18 },
  { id: 'new-hero-19', name: 'New Hero 19 — Minimalist High-End Magazine Editorial Layout', category: 'New Fresh 2026 Heros', Component: NewHero19 },
  { id: 'new-hero-20', name: 'New Hero 20 — Interactive Pod Velocity & Sprint Forecast Calculator', category: 'New Fresh 2026 Heros', Component: NewHero20 },
  { id: 'new-hero-21', name: 'New Hero 21 — Floating Interactive Code Comparison Snippet', category: 'New Fresh 2026 Heros', Component: NewHero21 },
  { id: 'new-hero-22', name: 'New Hero 22 — Glass B2B Pricing & Subscription Tier Card', category: 'New Fresh 2026 Heros', Component: NewHero22 },
  { id: 'new-hero-23', name: 'New Hero 23 — 21st.dev Style Bento Grid with Timezone Overlap Matrix', category: 'New Fresh 2026 Heros', Component: NewHero23 },
  { id: 'new-hero-24', name: 'New Hero 24 — Floating Hexagon Talent Mesh & AI Chat Assistant', category: 'New Fresh 2026 Heros', Component: NewHero24 },
  { id: 'new-hero-25', name: 'New Hero 25 — Ultra Modern Futuristic Light Portal with Cursor Beam', category: 'New Fresh 2026 Heros', Component: NewHero25 },

  // Curated 26 Master Hero Components
  { id: 'light-hero-1', name: 'Hero L-01 — Aceternity Radial Beam & Spotlight (Light)', category: 'Complete Light Theme', Component: HeroLight1SpotlightBeam },
  { id: 'light-hero-2', name: 'Hero L-02 — 21st.dev Asymmetric Bento Grid (Light)', category: 'Complete Light Theme', Component: HeroLight221stDevBento },
  { id: 'light-hero-4', name: 'Hero L-04 — Aceternity Lamp Light Cone (Light)', category: 'Complete Light Theme', Component: HeroLight4LampLight },
  { id: 'light-hero-6', name: 'Hero L-06 — Magnetic Cursor & Live Avatar Stack', category: 'Complete Light Theme', Component: HeroLight6MagneticAvatarStack },
  { id: 'light-hero-13', name: 'Hero L-13 — Swiss Minimalist Architectural Grid', category: 'Complete Light Theme', Component: HeroLight13SwissGrid },
  { id: 'light-hero-14', name: 'Hero L-14 — Full-Width Glassmorphism Video Portal', category: 'Complete Light Theme', Component: HeroLight14VideoPortal },

  { id: 'hero-1', name: 'Hero 01 — AI Partner On-Demand Sourcing Agent', category: 'Dark Tech & AI', Component: Hero1AiPartner },
  { id: 'hero-2', name: 'Hero 02 — Executive Tech & GCC Hiring Squads', category: 'Executive & Corporate', Component: Hero2MarketingCareers },
  { id: 'hero-4', name: 'Hero 04 — Engineering Pod Configurator', category: 'Executive & Corporate', Component: Hero4WebDesigner },
  { id: 'hero-5', name: 'Hero 05 — Executive Consultation & Search', category: 'Executive & Corporate', Component: Hero5Creators },
  { id: 'hero-6', name: 'Hero 06 — Turnkey Recruitment Acceleration', category: 'Executive & Corporate', Component: Hero6MarketingAgency },
  { id: 'hero-7', name: 'Hero 07 — Global Recruitment Corridors', category: 'Executive & Corporate', Component: Hero7FuelingBrands },

  { id: 'hero-12', name: 'Hero 12 — Organic Soft Blob (Full Screen)', category: 'Full Screen', Component: H12Blob },
  { id: 'hero-13', name: 'Hero 13 — Image Collage Deck (Full Screen)', category: 'Full Screen', Component: H13Collage },
  { id: 'hero-14', name: 'Hero 14 — Giant Modernist Typography', category: 'Executive & Corporate', Component: H14GiantType },
  { id: 'hero-15', name: 'Hero 15 — Light SaaS Browser Pipeline Mock', category: 'SaaS & Interactive', Component: H15Browser },
  { id: 'hero-16', name: 'Hero 16 — Floating Badges & Avatars (Full Screen)', category: 'Full Screen', Component: H16Badges },

  { id: 'hero-30', name: 'Hero 30 — Cyber Radar (Light Edition)', category: 'Dark Tech & AI', Component: Hero30DarkNeonGrid },
  { id: 'hero-31', name: 'Hero 31 — Bento Architectural Editorial', category: 'Executive & Corporate', Component: Hero31BentoArchitect },
  { id: 'hero-32', name: 'Hero 32 — Interactive Salary Arbitrage Simulator (Light Mode)', category: 'SaaS & Interactive', Component: Hero32SalaryArbitrageHero },
  { id: 'hero-33', name: 'Hero 33 — Terminal Code Vetting & Command Line', category: 'Dark Tech & AI', Component: Hero33TerminalHero },
  { id: 'hero-34', name: 'Hero 34 — Full Screen Immersive Video Frame', category: 'Full Screen', Component: Hero34ImmersiveVideoHero },
  { id: 'hero-35', name: 'Hero 35 — Minimalist Swiss Editorial Modernist', category: 'Executive & Corporate', Component: Hero35SwissEditorial },
  { id: 'hero-40', name: 'Hero 40 — Glassmorphism Floating Gradient Spheres', category: 'Full Screen', Component: Hero40GlassmorphismSpheres },
  { id: 'hero-42', name: 'Hero 42 — Executive Guarantee Shield', category: 'Dark Tech & AI', Component: Hero42ExecutivePledgeHero },
  { id: 'hero-45', name: 'Hero 45 — Modern Brutalist Bold & Color Block', category: 'Executive & Corporate', Component: Hero45BrutalistColorBlock },
];

export function WebCompHerosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const filteredHeroes = HEROES.filter((h) => {
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.id.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-neutral-900 font-sans">
      <ScrollProgressBar />

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/95 text-white backdrop-blur border-b border-neutral-800 px-6 py-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-neutral-950 font-black text-sm shadow-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                NEXATALENT IT SOLUTIONS MASTER HEROES <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono">51 VARIANTS (25 NEW)</span>
              </h1>
              <p className="text-[11px] text-neutral-400">Ultra-compact, production-grade light-theme hero library with Lenis, GSAP &amp; Framer Motion</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search Hero..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Jump Jumper Select */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const target = document.getElementById(e.target.value);
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-lg bg-neutral-900 border border-neutral-800 py-1.5 px-3 text-xs text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value="">Jump to Hero Section...</option>
                {HEROES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mx-auto max-w-7xl pt-3 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['All', 'New Fresh 2026 Heros', 'Complete Light Theme', 'Full Screen', 'Dark Tech & AI', 'SaaS & Interactive', 'Executive & Corporate'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-neutral-950 shadow'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat} {cat === 'All' ? `(${HEROES.length})` : ''}
            </button>
          ))}
        </div>
      </header>

      {/* Main Hero Stream */}
      <main>
        {filteredHeroes.length === 0 ? (
          <div className="py-24 text-center text-neutral-500">
            <p className="text-lg font-semibold">No hero sections found matching "{searchQuery}"</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-3 text-xs font-bold text-indigo-600 underline">
              Reset Filters
            </button>
          </div>
        ) : (
          filteredHeroes.map(({ id, name, category, Component }) => (
            <div key={id} id={id} className="scroll-mt-24 border-t border-neutral-300">
              {/* Component Header Bar */}
              <div className="sticky top-[108px] z-40 bg-neutral-900 text-white px-6 py-2.5 text-xs font-mono flex items-center justify-between shadow-md border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 font-bold flex items-center gap-1">
                    <Hash size={12} /> {id.toUpperCase()}
                  </span>
                  <span className="font-semibold text-neutral-200">{name}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                  <span className="rounded bg-neutral-800 px-2.5 py-0.5 text-neutral-300">{category}</span>
                  <a href={`#${id}`} className="text-neutral-400 hover:text-emerald-400 transition-colors">Link &para;</a>
                </div>
              </div>

              {/* Hero Component */}
              <Component />
            </div>
          ))
        )}
      </main>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-neutral-900 text-white shadow-2xl flex items-center justify-center border border-neutral-700 hover:bg-indigo-600 transition-all"
        title="Scroll to Top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
