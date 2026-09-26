import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, MapPin, Shield, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MandateItem {
  id: string;
  role: string;
  clientType: string;
  location: string;
  compensation: string;
  experience: string;
  urgency: string;
  skills: string[];
  confidential: boolean;
}

const MANDATES: MandateItem[] = [
  {
    id: 'm-01',
    role: 'VP & Head of AI Platform Infrastructure',
    clientType: 'Series D GenAI Research Lab ($12B Valuation)',
    location: 'Bangalore (Indiranagar)',
    compensation: '₹1.40 Cr – ₹1.90 Cr + Tier-1 Equity',
    experience: '14+ YOE',
    urgency: '72h SLA Shortlist',
    skills: ['vLLM', 'CUDA Kernels', 'Distributed PyTorch', 'GPU Topology'],
    confidential: true
  },
  {
    id: 'm-02',
    role: 'Principal Low-Latency C++ Trading Architect',
    clientType: 'Proprietary Quantitative Trading Desk',
    location: 'Bangalore / Hybrid London',
    compensation: '₹95L – ₹1.35 Cr Base + Performance Bonus',
    experience: '10+ YOE',
    urgency: 'Active Interviews',
    skills: ['Modern C++20', 'Kernel Bypass', 'FPGA Verilog', 'Order Matching'],
    confidential: true
  },
  {
    id: 'm-03',
    role: 'Staff Distributed Systems Storage Architect',
    clientType: 'Global Multi-Cloud Infrastructure Enterprise',
    location: 'Hyderabad (HITEC City)',
    compensation: '₹75L – ₹95L + Public RSUs',
    experience: '11+ YOE',
    urgency: 'Final Calibration',
    skills: ['Go / Rust', 'Raft Consensus', 'eBPF', 'Multi-Region K8s'],
    confidential: false
  },
  {
    id: 'm-04',
    role: 'Founding GCC Site Director / Managing Director',
    clientType: 'Fortune 100 Financial Services Giant',
    location: 'Bangalore Core Hub',
    compensation: '₹1.60 Cr – ₹2.20 Cr + Retention Escrow',
    experience: '18+ YOE',
    urgency: 'Immediate Executive Pod',
    skills: ['Turnkey GCC BOT', '100+ Org Leadership', 'SEZ Compliance'],
    confidential: true
  }
];

export const HorizontalMandateShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const scrollWidth = trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 2600;

      gsap.to(trackRef.current, {
        x: () => -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth + 600}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white border-b border-slate-200 overflow-hidden relative"
      style={{ height: '100vh' }}
    >
      <div className="pt-12 px-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned Horizontal Rail • Live Executive Mandates</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Live Verified Leadership Search Mandates
          </h2>
        </div>
        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span>Scroll down to browse mandates horizontally</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Horizontal Sliding Track */}
      <div
        ref={trackRef}
        className="flex items-center gap-8 px-12 h-[calc(100vh-140px)] w-max"
      >
        {MANDATES.map((m, idx) => (
          <div
            key={m.id}
            className="w-[420px] md:w-[480px] shrink-0 rounded-3xl p-8 bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-blue-500 transition-colors"
            style={{ height: '72%' }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                  MANDATE 0{idx + 1}
                </span>
                {m.confidential && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Shield className="w-3 h-3" />
                    <span>Confidential Search</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-2">
                {m.role}
              </h3>

              <p className="text-xs font-semibold text-slate-500 mb-4">
                {m.clientType}
              </p>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 mb-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">Compensation</span>
                  <span className="font-extrabold text-blue-600 font-mono">{m.compensation}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">Location</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {m.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {m.skills.map((sk, sIdx) => (
                  <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {m.urgency}
              </span>
              <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
                <span>View Full Mandate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
