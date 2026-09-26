import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Magnet, ArrowUpRight } from 'lucide-react';

interface MagneticCardProps {
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  description: string;
}

const MagneticCard: React.FC<MagneticCardProps> = ({ title, category, metric, metricLabel, description }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between"
    >
      <div style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
            {category}
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">P99 CALIBRATED</span>
        </div>

        <div className="mb-4">
          <span className="text-3xl md:text-4xl font-black font-mono text-slate-900 block">
            {metric}
          </span>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mt-0.5">
            {metricLabel}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div style={{ transform: 'translateZ(20px)' }} className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
        <span className="text-xs font-bold text-slate-500">Verified Placement Pod</span>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export const SignatureMagneticCursorDeck: React.FC = () => {
  return (
    <section className="py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Magnet className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Reveal 01 • 3D Magnetic Cursor Tilt Deck</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            3D Magnetic Cursor Spring Deck
          </h2>
          <p className="text-lg text-slate-600">
            Hover over each card to experience magnetic spring deflection in 3D perspective space with active specular highlights.
          </p>
        </div>

        {/* 3 Magnetic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
          <MagneticCard
            category="Algorithmic Trading"
            metric="42 Days"
            metricLabel="SLA Inception to Full Pod"
            title="Wall Street HFT Trading Core"
            description="Assembled 35 FPGA and modern C++20 kernel-bypass engineers with sub-microsecond latency benchmarks in Bangalore."
          />
          <MagneticCard
            category="Autonomous AI"
            metric="98.5%"
            metricLabel="12-Month Staff Retention"
            title="Generative AI Cluster Architects"
            description="Placed VP of AI Infrastructure and 20 distributed vLLM engineers scaling multi-GPU tensor model parallelism."
          />
          <MagneticCard
            category="Turnkey GCC"
            metric="$9.4M"
            metricLabel="Net Annual Capital Arbitrage"
            title="Tier-1 SaaS Scale-Up Center"
            description="Established 120-engineer autonomous capability center with 100% intellectual property transfer on Day 75."
          />
        </div>

      </div>
    </section>
  );
};
