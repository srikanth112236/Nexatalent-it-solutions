import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ShieldCheck, Zap, Award, Users, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FloatingMetric {
  value: string;
  label: string;
  sub: string;
  speed: number;
  rotate: number;
  accent: string;
  icon: React.ElementType;
}

const FLOATING_METRICS: FloatingMetric[] = [
  { value: '72 Hours', label: 'Shortlist Delivery SLA', sub: 'Contractually bound guarantee', speed: 1.2, rotate: -4, accent: '#2563eb', icon: Zap },
  { value: '94.8%', label: 'Offer Acceptance Rate', sub: 'Zero lost to counter-offers', speed: 0.6, rotate: 3, accent: '#10b981', icon: Award },
  { value: '180 Days', label: 'Unconditional Warranty', sub: 'Comprehensive replacement protection', speed: 1.5, rotate: -2, accent: '#7c3aed', icon: ShieldCheck },
  { value: '< 850ns', label: 'P99 Execution Threshold', sub: 'Quant & HFT verified benchmarks', speed: 0.8, rotate: 4, accent: '#0891b2', icon: Zap },
  { value: '75 Days', label: '120-Engineer GCC Launch', sub: 'Turnkey center operational', speed: 1.4, rotate: -3, accent: '#ea580c', icon: Users },
  { value: 'Top 0.5%', label: 'Candidate Acceptance', sub: 'Rigorous architectural evaluation', speed: 0.9, rotate: 2, accent: '#2563eb', icon: TrendingUp },
];

export const ParallaxDepthFloatMatrix: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.float-metric-card');

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const metric = FLOATING_METRICS[i];
        gsap.to(card, {
          y: -80 * metric.speed,
          rotation: metric.rotate * 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-28 bg-white border-b border-slate-200 relative overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Volumetric Parallax • Floating Metrics Constellation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Volumetric Metric Parallax Constellation
          </h2>
          <p className="text-lg text-slate-600">
            Every metric floats at an autonomous parallax velocity and rotational deflection as you scroll down the page.
          </p>
        </div>

        {/* Floating Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative py-6">
          {FLOATING_METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="float-metric-card rounded-3xl p-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-400 hover:shadow-2xl transition-all duration-300"
                style={{
                  transform: `rotate(${item.rotate}deg)`
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Icon className="w-6 h-6" style={{ color: item.accent }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    PARALLAX {item.speed}x
                  </span>
                </div>

                <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono tracking-tight mb-2">
                  {item.value}
                </div>

                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {item.label}
                </h3>

                <p className="text-xs text-slate-500">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
