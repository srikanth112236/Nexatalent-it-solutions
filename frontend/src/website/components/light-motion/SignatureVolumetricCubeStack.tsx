import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Box, Layers, Cpu, ShieldCheck, Zap, Server, ChevronRight, Activity } from 'lucide-react';

interface SquadCubeLayer {
  id: string;
  name: string;
  category: string;
  leadTime: string;
  throughput: string;
  accent: string;
  borderAccent: string;
  bgLight: string;
  description: string;
  metrics: { label: string; val: string }[];
}

const squadLayers: SquadCubeLayer[] = [
  {
    id: 'layer-4',
    name: 'Autonomous Agent Mesh',
    category: 'Layer 04 · Cognitive Tier',
    leadTime: '12ms Latency',
    throughput: '42,000 evt/s',
    accent: 'text-blue-600',
    borderAccent: 'border-blue-300',
    bgLight: 'bg-blue-50/70',
    description: 'Autonomous orchestration cluster executing multi-agent synthetic interview, coding evaluation, and behavioral clearance simultaneously.',
    metrics: [
      { label: 'Evaluation Parallelism', val: '64 Concurrent' },
      { label: 'Code Telemetry', val: 'AST & Bytecode' },
      { label: 'False Positive', val: '< 0.04%' },
    ],
  },
  {
    id: 'layer-3',
    name: 'Distributed Platform Core',
    category: 'Layer 03 · Execution Core',
    leadTime: '99.999% SLA',
    throughput: '3.2 GB/s',
    accent: 'text-indigo-600',
    borderAccent: 'border-indigo-300',
    bgLight: 'bg-indigo-50/70',
    description: 'Resilient event-sourced backplane linking GCC human capital pipelines directly into Fortune 500 corporate repositories.',
    metrics: [
      { label: 'Cross-Border Sync', val: 'Global VPC Peering' },
      { label: 'Candidate State Store', val: 'Immutable Ledger' },
      { label: 'Scale Factor', val: '10x Auto-Scale' },
    ],
  },
  {
    id: 'layer-2',
    name: 'High-Frequency Matching Engine',
    category: 'Layer 02 · Quantitative Engine',
    leadTime: '8.4ms Match',
    throughput: '18,500/min',
    accent: 'text-emerald-600',
    borderAccent: 'border-emerald-300',
    bgLight: 'bg-emerald-50/70',
    description: 'Vector embeddings calculating skill distance, timezone overlap, and salary arbitrage metrics across 400,000+ vetted engineers.',
    metrics: [
      { label: 'Vector Dimensions', val: '1,536 Dense' },
      { label: 'GCC Compensation Delta', val: '-62% vs US' },
      { label: 'Timezone Delta', val: '100% Core Match' },
    ],
  },
  {
    id: 'layer-1',
    name: 'Sovereign Enterprise Vault',
    category: 'Layer 01 · Trust & Compliance',
    leadTime: 'SOC2 Type II',
    throughput: 'Zero Trust',
    accent: 'text-amber-600',
    borderAccent: 'border-amber-300',
    bgLight: 'bg-amber-50/70',
    description: 'Granular IP protection, ironclad non-compete quarantine envelopes, and military-grade identity verification infrastructure.',
    metrics: [
      { label: 'Cryptographic Attestation', val: 'Hardware Enclave' },
      { label: 'Audit Trail', val: 'Full Immutable Logs' },
      { label: 'Compliance Level', val: 'ISO 27001 / GDPR' },
    ],
  },
];

export const SignatureVolumetricCubeStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-25, 0, 25]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 8, -5]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
    >
      {/* Background isometric grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(to right, #f1f5f9 1px, transparent 1px)',
          backgroundSize: '32px 32px, 64px 64px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3 border border-blue-200 shadow-sm">
              <Box className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Volumetric Voxel Architecture · 3D Modular Deconstruction</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Four-Tier Enterprise <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Talent Cube</span>
            </h2>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center gap-3">
            <button
              onClick={() => setIsExploded(!isExploded)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 shadow-sm flex items-center gap-2 ${
                isExploded
                  ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {isExploded ? 'Deconstruct: ACTIVE' : 'Explode 3D Layers'}
            </button>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Scroll-Coupled Pitch: ±25°</span>
            </div>
          </div>
        </div>

        {/* Interactive 3D Stack Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 3D Isometric View */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-white/80 rounded-2xl border border-slate-200 shadow-xl backdrop-blur-sm relative min-h-[500px]">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>ISOMETRIC 3D RENDER ENGINE</span>
            </div>

            <motion.div
              style={{
                rotateX,
                rotateY,
                perspective: 1200,
                transformStyle: 'preserve-3d',
              }}
              className="w-72 sm:w-88 flex flex-col items-center justify-center py-6 cursor-grab active:cursor-grabbing"
            >
              {squadLayers.map((layer, idx) => {
                const isSelected = activeLayer === idx;

                return (
                  <motion.div
                    key={layer.id}
                    onClick={() => setActiveLayer(idx)}
                    whileHover={{ scale: 1.05, translateZ: 30 }}
                    style={{
                      transformStyle: 'preserve-3d',
                      marginTop: idx === 0 ? 0 : isExploded ? '24px' : '-20px',
                    }}
                    animate={{
                      y: isExploded ? 0 : [0, -4, 0],
                      transition: { duration: 3, repeat: Infinity, delay: idx * 0.4 },
                    }}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md relative ${
                      isSelected
                        ? `bg-white border-2 ${layer.borderAccent} ring-4 ring-blue-100/80`
                        : `${layer.bgLight} border-slate-200 hover:border-slate-300 opacity-90 hover:opacity-100`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Cpu className="w-4 h-4 text-blue-600" />}
                        {idx === 1 && <Server className="w-4 h-4 text-indigo-600" />}
                        {idx === 2 && <Zap className="w-4 h-4 text-emerald-600" />}
                        {idx === 3 && <ShieldCheck className="w-4 h-4 text-amber-600" />}
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                          Tier 0{4 - idx}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-600">
                        {layer.leadTime}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm tracking-tight">{layer.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{layer.category}</div>

                    {/* Isometric Bottom Reflection Shadow */}
                    <div className="absolute inset-x-4 -bottom-2 h-2 bg-slate-900/5 rounded-full filter blur-xs -z-10" />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Dynamic Scroll Dial Indicator */}
            <div className="w-full mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-blue-600" />
                <span>Explosion Distance: {isExploded ? 'Expanded 180px' : 'Compact 48px'}</span>
              </span>
              <span>Perspective: 1200px</span>
            </div>
          </div>

          {/* Right Column: Active Layer Deep Dive Card */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Box className="w-48 h-48 text-slate-900" />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase text-blue-600 mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>{squadLayers[activeLayer].category}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                {squadLayers[activeLayer].name}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                {squadLayers[activeLayer].description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {squadLayers[activeLayer].metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:bg-white hover:border-slate-300 shadow-xs"
                  >
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                      {m.label}
                    </div>
                    <div className="text-base font-bold text-slate-900 font-mono">
                      {m.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Layer Selector Tabs */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                {squadLayers.map((layer, idx) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeLayer === idx
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>0{4 - idx}</span>
                    <span>{layer.name.split(' ')[0]}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
