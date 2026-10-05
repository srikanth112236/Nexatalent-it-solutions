import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

export const FooterArchitecturalDirectory: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  return (
    <div className={bare ? 'w-full' : 'w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200'}>
      {!bare && (
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>10 · Comprehensive Architectural Directory Footer</span>
        <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded text-[10px]">Deep Practice Taxonomy</span>
      </div>
      )}

      <footer className="max-w-7xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm text-slate-700">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Engineering Practice Directory</h3>
              <p className="text-xs text-slate-500">Structured taxonomy of verified technical talent pods & GCC domains.</p>
            </div>
          </div>
          <button 
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Download PDF Taxonomy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Directory Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 py-8 text-xs border-b border-slate-200">
          <div>
            <h5 className="font-bold text-slate-900 mb-3">AI & Pre-Training</h5>
            <ul className="space-y-2 text-slate-500 font-light">
              <li className="hover:text-blue-600 cursor-pointer">Megatron-LM</li>
              <li className="hover:text-blue-600 cursor-pointer">RLHF & Post-Training</li>
              <li className="hover:text-blue-600 cursor-pointer">Synthetic Data Gen</li>
              <li className="hover:text-blue-600 cursor-pointer">H100/B200 Clusters</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-3">Low-Latency & Quant</h5>
            <ul className="space-y-2 text-slate-500 font-light">
              <li className="hover:text-blue-600 cursor-pointer">C++23 Modern</li>
              <li className="hover:text-blue-600 cursor-pointer">Kernel Bypass (Solarflare)</li>
              <li className="hover:text-blue-600 cursor-pointer">FPGA Acceleration</li>
              <li className="hover:text-blue-600 cursor-pointer">FIX / ITCH Gateways</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-3">Distributed Cloud</h5>
            <ul className="space-y-2 text-slate-500 font-light">
              <li className="hover:text-blue-600 cursor-pointer">Kubernetes Operators</li>
              <li className="hover:text-blue-600 cursor-pointer">Kafka Event Sourcing</li>
              <li className="hover:text-blue-600 cursor-pointer">CockroachDB / Spanner</li>
              <li className="hover:text-blue-600 cursor-pointer">Multi-Region SRE</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-3">Security & Cyber</h5>
            <ul className="space-y-2 text-slate-500 font-light">
              <li className="hover:text-blue-600 cursor-pointer">Zero-Trust Identity</li>
              <li className="hover:text-blue-600 cursor-pointer">Cryptographic HSM</li>
              <li className="hover:text-blue-600 cursor-pointer">SOC-2 / FedRAMP</li>
              <li className="hover:text-blue-600 cursor-pointer">Red Team Adversarial</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-3">GCC Management</h5>
            <ul className="space-y-2 text-slate-500 font-light">
              <li className="hover:text-blue-600 cursor-pointer">Managing Directors</li>
              <li className="hover:text-blue-600 cursor-pointer">Head of People & HR</li>
              <li className="hover:text-blue-600 cursor-pointer">Finance & Transfer Price</li>
              <li className="hover:text-blue-600 cursor-pointer">Facility Operations</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-3">Executive Search</h5>
            <ul className="space-y-2 text-slate-500 font-light">
              <li className="hover:text-blue-600 cursor-pointer">Chief Technology Officer</li>
              <li className="hover:text-blue-600 cursor-pointer">Chief Product Officer</li>
              <li className="hover:text-blue-600 cursor-pointer">VP Infrastructure</li>
              <li className="hover:text-blue-600 cursor-pointer">Board Independent</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div>NexaTalent IT Solutions Directory Index • Version 2026.3 • Updated Weekly</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:text-slate-600 cursor-pointer">Tax Identification #29AABCV7291K</span>
            <span className="hover:text-slate-600 cursor-pointer">ISO 9001:2015</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
