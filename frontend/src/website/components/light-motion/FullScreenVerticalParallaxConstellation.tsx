import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network, Sparkles, Orbit, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface NodeData {
  id: string;
  name: string;
  role: string;
  speed: number;
  top: string;
  left: string;
  accent: string;
}

const NODES: NodeData[] = [
  { id: '1', name: 'Dr. Arjun Roy', role: 'Staff LLM Architect', speed: 1.8, top: '15%', left: '12%', accent: 'border-blue-500 bg-blue-50 text-blue-900' },
  { id: '2', name: 'Priya Iyer', role: 'Principal HFT Core', speed: 2.5, top: '25%', left: '72%', accent: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
  { id: '3', name: 'Rohan Deshmukh', role: 'VP Autonomous Infra', speed: 1.2, top: '55%', left: '20%', accent: 'border-indigo-500 bg-indigo-50 text-indigo-900' },
  { id: '4', name: 'Sneha Patel', role: 'Staff Cryptography', speed: 3.0, top: '65%', left: '65%', accent: 'border-amber-500 bg-amber-50 text-amber-900' },
];

export const FullScreenVerticalParallaxConstellation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      nodeRefs.current.forEach((el, idx) => {
        if (!el) return;
        const speedMultiplier = NODES[idx].speed;
        gsap.to(el, {
          y: -150 * speedMultiplier,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-[120vh] bg-slate-900 text-white overflow-hidden flex flex-col justify-center items-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Background Starfield / Constellation Canvas Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, #38bdf8 1px, transparent 1px), radial-gradient(circle, #818cf8 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px, 80px 80px',
        }}
      />

      {/* Orbit Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-blue-500/20 pointer-events-none animate-spin" style={{ animationDuration: '40s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-indigo-500/10 pointer-events-none animate-spin" style={{ animationDuration: '80s' }} />

      {/* Section Title */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 font-mono text-xs font-bold mb-4">
          <Orbit className="w-3.5 h-3.5 text-blue-400" />
          <span>VOLUMETRIC TALENT CONSTELLATION · 4D FIELD MATRIX</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          Gravitational Skill <span className="text-blue-400">Constellation</span>
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          Scroll-modulated vertical parallax floating candidate nodes at differing celestial velocities based on domain scarcity.
        </p>
      </div>

      {/* Floating Constellation Nodes */}
      {NODES.map((node, idx) => (
        <div
          key={node.id}
          ref={(el) => (nodeRefs.current[idx] = el)}
          style={{ top: node.top, left: node.left }}
          className={`absolute z-20 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${node.accent} max-w-xs`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">
              Velocity {node.speed}x
            </span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="font-extrabold text-base tracking-tight">{node.name}</div>
          <div className="text-xs font-semibold opacity-90">{node.role}</div>
        </div>
      ))}

      {/* Constellation Center Coordinates */}
      <div className="absolute bottom-8 left-8 flex items-center gap-3 text-xs font-mono text-slate-500">
        <Network className="w-4 h-4 text-blue-400" />
        <span>CONSTELLATION NODES: 42,000 ACTIVE</span>
        <Compass className="w-4 h-4 text-emerald-400 ml-4" />
        <span>POLAR PARALLAX SCRUB ACTIVE</span>
      </div>
    </section>
  );
};
