import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';

export const FooterGlobalEnterpriseMega: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>06 · Global Enterprise Mega Footer</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Multi-Hub Worldwide Matrix</span>
      </div>

      <footer className="max-w-7xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Top Newsletter & Global Statement Tier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base">
                N
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">NexaTalent IT Solutions</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Institutional talent infrastructure, turnkey Global Capability Centers (GCCs), and retained executive search for Tier-1 technology companies.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                SOC-2 Type II Certified
              </span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>RBI Cross-Border Compliant</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-white mb-2">Subscribe to Institutional GCC Intelligence</h4>
            <p className="text-xs text-slate-400 mb-4">
              Bi-weekly confidential research reports on senior engineering compensation, retention benchmarks, and regulatory updates.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you. Your corporate briefing has been dispatched.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="corporate.email@enterprise.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Global Hubs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>Bangalore Headquarters</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Outer Ring Road & Indiranagar</p>
            <p className="text-xs text-slate-500 mt-1">Karnataka 560103, India</p>
            <p className="text-xs font-mono text-slate-400 mt-2">blr@nexatalent.internal</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>Hyderabad Hub</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">HITEC City Cyber Towers</p>
            <p className="text-xs text-slate-500 mt-1">Telangana 500081, India</p>
            <p className="text-xs font-mono text-slate-400 mt-2">hyd@nexatalent.internal</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>London Office</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">100 Bishopsgate, Bank</p>
            <p className="text-xs text-slate-500 mt-1">EC2N 4AG, London, UK</p>
            <p className="text-xs font-mono text-slate-400 mt-2">uk@nexatalent.internal</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>San Francisco Office</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">500 Howard St, SoMa</p>
            <p className="text-xs text-slate-500 mt-1">CA 94105, United States</p>
            <p className="text-xs font-mono text-slate-400 mt-2">sf@nexatalent.internal</p>
          </div>
        </div>

        {/* Links Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-800 text-xs">
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">GCC Architecture</h5>
            <ul className="space-y-2.5 text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Turnkey 75-Day Hub Launch</li>
              <li className="hover:text-white transition-colors cursor-pointer">Sovereign Pod Engineering</li>
              <li className="hover:text-white transition-colors cursor-pointer">Infrastructure & Leases</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cross-Border EOR & Tax</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Executive Search</h5>
            <ul className="space-y-2.5 text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Site Managing Directors</li>
              <li className="hover:text-white transition-colors cursor-pointer">Chief Technology Officers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Principal AI Researchers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Confidential Mandate Practice</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Engineering Guilds</h5>
            <ul className="space-y-2.5 text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Foundation Model Training</li>
              <li className="hover:text-white transition-colors cursor-pointer">Low-Latency C++ & Quant</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cloud Distributed Systems</li>
              <li className="hover:text-white transition-colors cursor-pointer">Zero-Trust Cyber Defense</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Governance & Audit</h5>
            <ul className="space-y-2.5 text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">SOC-2 Type II Report</li>
              <li className="hover:text-white transition-colors cursor-pointer">IP Assignment Deeds</li>
              <li className="hover:text-white transition-colors cursor-pointer">RBI FEMA Regulatory Notes</li>
              <li className="hover:text-white transition-colors cursor-pointer">Whistleblower Governance</li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Tier */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 NexaTalent IT Solutions Technologies Private Limited. All institutional rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Statement</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Retainer</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Center</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
