import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Film } from 'lucide-react';

export const Hero07VerticalFilmstripParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const strip1Y = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const strip2Y = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[95vh] bg-white text-slate-900 overflow-hidden flex items-center justify-center border-y border-slate-200"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Headline & Manifesto */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
            <Film className="w-3.5 h-3.5 text-blue-600" />
            <span>FULL-SCREEN VERTICAL PARALLAX FILMSTRIP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Engineering Teams <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Captured in High Definition.
            </span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed font-light max-w-lg">
            Witness the physical and digital reality of modern GCCs. Seamless integration across Bangalore, London, and Silicon Valley with zero recruitment friction.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button 
              type="button"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule Campus Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-slate-500">
              Virtual 3D Tours Available
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <div className="text-xl font-black text-slate-900">4,200+</div>
              <div className="text-slate-500 text-[10px]">Engineers Placed</div>
            </div>
            <div>
              <div className="text-xl font-black text-blue-600">75 Days</div>
              <div className="text-slate-500 text-[10px]">Turnkey GCC Launch</div>
            </div>
            <div>
              <div className="text-xl font-black text-emerald-600">94.8%</div>
              <div className="text-slate-500 text-[10px]">Annual Retention</div>
            </div>
          </div>
        </div>

        {/* Right: Dual Vertical Filmstrip Ribbons moving in opposite directions */}
        <div className="lg:col-span-6 h-[480px] sm:h-[540px] grid grid-cols-2 gap-4 overflow-hidden rounded-3xl p-2 relative bg-slate-50 border border-slate-200 shadow-inner">
          
          {/* Filmstrip Column 1 (Scrolls Downward) */}
          <motion.div style={{ y: strip1Y }} className="space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-md h-52 bg-slate-200 relative group">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" 
                alt="Modern Tech Campus" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                BANGALORE TECH HUB
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-52 bg-slate-200 relative group">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                alt="Engineering Pod" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                SRE SQUAD 04
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-52 bg-slate-200 relative group">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" 
                alt="Corporate Architecture" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                HYDERABAD CYBERCITY
              </div>
            </div>
          </motion.div>

          {/* Filmstrip Column 2 (Scrolls Upward) */}
          <motion.div style={{ y: strip2Y }} className="space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-md h-52 bg-slate-200 relative group">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                alt="Principal Architect" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                PRINCIPAL FELLOW
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-52 bg-slate-200 relative group">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80" 
                alt="Hackathon Collaboration" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                QUANT HACKATHON
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-52 bg-slate-200 relative group">
              <img 
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" 
                alt="Command Center" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                AIR-GAPPED NOC
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
