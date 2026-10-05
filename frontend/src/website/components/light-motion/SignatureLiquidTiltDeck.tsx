import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Building2, Quote, Award } from 'lucide-react';

interface TiltStory {
  id: string;
  client: string;
  category: string;
  outcome: string;
  quote: string;
  speaker: string;
  role: string;
  metric: string;
  metricLabel: string;
  accent: string;
}

const STORIES: TiltStory[] = [
  {
    id: 'story-1',
    client: 'Tier-1 New York Investment Bank',
    category: 'Quantitative Systems',
    outcome: 'Built 35-engineer ultra-low latency FPGA & C++ trading pod in Bangalore within 45 calendar days.',
    quote: 'NexaTalent IT Solutions delivered candidates who were solving production cache misses on day one. Their technical vetting filters out 99% of resume noise.',
    speaker: 'Marcus Vance',
    role: 'Managing Director, Global Core Trading',
    metric: '45 Days',
    metricLabel: 'From Mandate to Go-Live',
    accent: '#2563eb'
  },
  {
    id: 'story-2',
    client: 'Global Cloud Enterprise ($40B Cap)',
    category: 'Autonomous AI Infrastructure',
    outcome: 'Hired VP of AI Platform and scaled 18 Staff Distributed Systems Architects across Bangalore & Hyderabad.',
    quote: 'We avoided a 6-month executive search vacuum. The caliber of founding engineering leaders introduced by NexaTalent IT Solutions was extraordinary.',
    speaker: 'Elena Rostova',
    role: 'Chief Technology Officer',
    metric: '98.5%',
    metricLabel: '12-Month Retention Rate',
    accent: '#7c3aed'
  },
  {
    id: 'story-3',
    client: 'Silicon Valley Autonomous Mobility Scale-up',
    category: 'Turnkey GCC Launch',
    outcome: 'Established full legal entity, leadership team, and 60 computer vision engineers in 75 days.',
    quote: 'Their Build-Operate-Transfer playbook gave us total IP protection and zero operational headaches from day one.',
    speaker: 'Devin Kulkarni',
    role: 'SVP of Engineering',
    metric: '$4.2M',
    metricLabel: 'Annual R&D Capital Arbitrage',
    accent: '#059669'
  }
];

const TiltCard: React.FC<{ story: TiltStory }> = ({ story }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

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
      className="relative rounded-3xl p-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
    >
      <div style={{ transform: 'translateZ(30px)' }}>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            {story.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{story.client}</span>
          </div>
        </div>

        {/* Big Outcome Metric */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <span className="text-3xl font-black text-slate-900 block font-mono">
            {story.metric}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
            {story.metricLabel}
          </span>
          <p className="text-sm text-slate-700 font-medium mt-3 leading-relaxed">
            {story.outcome}
          </p>
        </div>

        {/* Quote */}
        <div className="relative pl-6 mb-6">
          <Quote className="w-4 h-4 text-blue-400 absolute left-0 top-0.5" />
          <p className="text-xs text-slate-600 italic leading-relaxed">
            "{story.quote}"
          </p>
        </div>
      </div>

      {/* Speaker Footer */}
      <div style={{ transform: 'translateZ(20px)' }} className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900">{story.speaker}</h4>
          <p className="text-[11px] text-slate-500">{story.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export const SignatureLiquidTiltDeck: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 44 • 3D Fluid Tilt Deck & Client Proof</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Proven Executive & GCC Deployments
          </h2>
          <p className="text-lg text-slate-600">
            Interactive 3D dynamic tilt cards highlighting quantifiable results delivered for global financial institutions, SaaS scale-ups, and AI research labs.
          </p>
        </div>

        {/* 3D Tilt Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
          {STORIES.map((story) => (
            <TiltCard key={story.id} story={story} />
          ))}
        </div>

      </div>
    </section>
  );
};
