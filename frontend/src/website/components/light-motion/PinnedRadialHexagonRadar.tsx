import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Radar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HexVector {
  axis: string;
  name: string;
  score: number;
  benchmark: string;
}

const HEX_VECTORS: HexVector[] = [
  { axis: 'AXIS 01', name: 'Distributed Systems & Raft', score: 98, benchmark: 'Sub-ms Consensus' },
  { axis: 'AXIS 02', name: 'Ultra-Low Latency C++', score: 96, benchmark: '<850ns P99 Gateway' },
  { axis: 'AXIS 03', name: 'Generative AI & GPU Kernels', score: 94, benchmark: 'vLLM FlashAttention' },
  { axis: 'AXIS 04', name: 'Executive Team Governance', score: 95, benchmark: '50+ Org Scaling' },
  { axis: 'AXIS 05', name: 'Chaos Incident Recovery', score: 92, benchmark: 'Zero-Data-Loss SRE' },
  { axis: 'AXIS 06', name: 'SEZ & Regulatory Compliance', score: 99, benchmark: 'SOC2 & Day-1 IP' },
];

export const PinnedRadialHexagonRadar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          setScrollProgress(Math.max(0.15, self.progress));
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Compute 6 hexagon points around center (150, 150)
  const size = 300;
  const center = size / 2;
  const maxRadius = 115;

  const points = HEX_VECTORS.map((v, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const r = (v.score / 100) * maxRadius * scrollProgress;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      origX: center + maxRadius * Math.cos(angle),
      origY: center + maxRadius * Math.sin(angle),
    };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Radar className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned 6-Axis Hexagonal Caliper Radar</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            6-Axis Architectural Hexagon Caliper
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Scroll down to expand the geometric hexagon vertices from core to perimeter, evaluating candidate depth across six technical vectors.
          </p>
        </div>

        {/* 2-Column: Hexagon Radar & Metric Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hexagon Graphic */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center bg-white rounded-full p-4 border border-slate-200 shadow-xl">
              <svg width={size} height={size} className="overflow-visible">
                {/* Concentric Guide Hexagons */}
                {[0.33, 0.66, 1.0].map((scale, sIdx) => {
                  const ringPoints = [0, 1, 2, 3, 4, 5].map(i => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    return `${center + maxRadius * scale * Math.cos(angle)},${center + maxRadius * scale * Math.sin(angle)}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={sIdx}
                      points={ringPoints}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1.5"
                      strokeDasharray={sIdx < 2 ? '4 4' : 'none'}
                    />
                  );
                })}

                {/* Dynamic Polygon expanding on scroll */}
                <polygon
                  points={polygonPath}
                  fill="rgba(37, 99, 235, 0.2)"
                  stroke="#2563eb"
                  strokeWidth="3"
                />

                {/* Vertex Dots */}
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                ))}
              </svg>

              {/* Central Telemetry readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {Math.round(scrollProgress * 98)}%
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Top 0.5% Caliber
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Vector Breakdown Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HEX_VECTORS.map((v, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 block mb-0.5">
                    {v.axis}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                    {v.name}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-slate-500">{v.benchmark}</span>
                  <span className="font-mono font-black text-blue-600">{v.score}%</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
