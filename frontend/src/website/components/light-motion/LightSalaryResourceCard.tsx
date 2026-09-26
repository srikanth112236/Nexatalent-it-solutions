import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, TrendingUp, BarChart3, FileSpreadsheet, Lock, Sparkles, Building2, ChevronRight } from 'lucide-react';

interface BenchmarkTier {
  role: string;
  p25: string;
  p50: string;
  p75: string;
  p90: string;
  yoyDelta: string;
}

const SAMPLE_BENCHMARKS: BenchmarkTier[] = [
  { role: 'Staff/Principal Backend (Go/Rust/Distributed)', p25: '₹48L', p50: '₹62L', p75: '₹78L', p90: '₹95L+', yoyDelta: '+18%' },
  { role: 'VP / Head of AI & Machine Learning', p25: '₹85L', p50: '₹1.15Cr', p75: '₹1.50Cr', p90: '₹1.85Cr+', yoyDelta: '+32%' },
  { role: 'Lead DevOps / Platform Architect (K8s/Terraform)', p25: '₹42L', p50: '₹56L', p75: '₹70L', p90: '₹85L+', yoyDelta: '+14%' },
  { role: 'Founding GCC Engineering Director', p25: '₹90L', p50: '₹1.25Cr', p75: '₹1.60Cr', p90: '₹2.10Cr+', yoyDelta: '+24%' }
];

export const LightSalaryResourceCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadCount, setDownloadCount] = useState(3842);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDownloadSuccess(true);
    setDownloadCount(prev => prev + 1);
  };

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2026 Tech & GCC Compensation Index</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Download the 2026 Tech Leadership & GCC Compensation Guide
          </h2>
          <p className="text-lg text-slate-600">
            Real market salary percentiles (P25 to P90), ESOP vesting benchmarks, and retention models across 14,000+ verified tech placements.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Preview Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Executive Compensation Matrix</h3>
                  <p className="text-xs text-slate-500">Live sample extracted from the 78-page report</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                Verified Q1 2026
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-4">Target Role</th>
                    <th className="pb-3 px-3">P25</th>
                    <th className="pb-3 px-3">P50 (Median)</th>
                    <th className="pb-3 px-3">P75</th>
                    <th className="pb-3 px-3">P90</th>
                    <th className="pb-3 pl-3 text-right">YoY Lift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SAMPLE_BENCHMARKS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-slate-800 text-xs md:text-sm">
                        {row.role}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-mono text-xs">{row.p25}</td>
                      <td className="py-3.5 px-3 font-bold text-blue-600 font-mono text-xs bg-blue-50/50 rounded">{row.p50}</td>
                      <td className="py-3.5 px-3 text-slate-600 font-mono text-xs">{row.p75}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 font-mono text-xs">{row.p90}</td>
                      <td className="py-3.5 pl-3 text-right font-bold text-emerald-600 text-xs">
                        {row.yoyDelta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Includes additional 65 roles across AI, FinTech, Cyber & DevOps in full PDF</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                78-Page Report <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Right Column: Download Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-2xl shadow-blue-500/10 relative">
            <div className="absolute -top-3.5 right-8 bg-blue-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
              Complimentary Enterprise Access
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Direct Guide Access</h3>
                <p className="text-xs text-slate-500">Instant PDF download + interactive Excel model</p>
              </div>
            </div>

            <ul className="space-y-3 mb-6 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>P25–P90 compensation bands for 65+ engineering specializations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bangalore vs London vs SF cost differential models for GCCs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Executive equity & LTIP vesting schedules in high-growth tech</span>
              </li>
            </ul>

            {downloadSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Your Report is Ready!</h4>
                <p className="text-xs text-emerald-700">
                  We have dispatched the 2026 Compensation Index PDF to <strong className="font-semibold">{email}</strong>. Check your inbox.
                </p>
                <button
                  onClick={() => setDownloadSuccess(false)}
                  className="mt-2 text-xs font-semibold text-emerald-800 underline"
                >
                  Download again or enter different email
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.connor@enterprise.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Goldman Sachs, Uber, Stripe"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Get Instant Guide Access</span>
                </button>
              </form>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>{downloadCount.toLocaleString()} HR & Engineering Leaders accessed</span>
              </span>
              <span>No spam guarantee</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
