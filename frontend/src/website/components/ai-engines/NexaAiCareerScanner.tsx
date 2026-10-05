import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Zap, Target } from 'lucide-react';

export function NexaAiCareerScanner() {
  const [isImproving, setIsImproving] = useState(false);
  const [improved, setImproved] = useState(false);
  const [currentScore, setCurrentScore] = useState(74);

  const handleImproveResume = () => {
    setIsImproving(true);
    setTimeout(() => {
      setIsImproving(false);
      setImproved(true);
      setCurrentScore(94);
    }, 1000);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>NEXA AI CAREER SCANNER & ATS BENCHMARK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              AI Resume Diagnostics & Optimization
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Nexa AI analyzes your resume against 5,000+ active enterprise JDs in Bangalore, Hyderabad, and Pune to uncover missing metrics, formatting bottlenecks, and keyword gaps.
            </p>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="button"
              onClick={handleImproveResume}
              disabled={isImproving || improved}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                improved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isImproving ? 'Generating Optimized Resume...' : improved ? '✨ Resume Optimized (94/100)' : '✨ Improve My Resume'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Score Gauge + 6 Diagnostic Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Score Card (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-lg shadow-slate-200/50"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-2">
                Overall Resume Score
              </span>
              <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={improved ? '#059669' : '#d97706'}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * currentScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    {currentScore}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/ 100</span>
                </div>
              </div>
            </div>

            <div className="w-full mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold">
                {improved ? (
                  <span className="text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Top 3% percentile in Bangalore Tech Hub
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Moderate ATS compatibility. 6 issues detected.
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Diagnostic Breakdown (8 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/50"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center justify-between">
              <span>Nexa AI Diagnostic Findings</span>
              <span className="text-xs text-emerald-700 font-mono font-bold">Real-time JD Matching</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* 1. Missing Keywords */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    1. Missing High-Frequency Keywords
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${improved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {improved ? 'Keywords Injected (+8 pts)' : '3 Keywords Omitted'}
                  </span>
                </div>
                <p className="text-slate-600 mb-2 leading-relaxed">
                  {improved
                    ? 'Injected high-demand terms: "Distributed Caching (Redis)", "Event-Driven Kafka Architecture", and "EKS Helm Deployment".'
                    : 'Target Senior Java roles demand explicit mentions of: "Distributed Caching (Redis)", "Event-Driven Kafka Architecture", and "Kubernetes Helm charts".'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`px-2.5 py-1 rounded font-medium ${improved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-200/80 text-slate-700'}`}>
                    Distributed Caching
                  </span>
                  <span className={`px-2.5 py-1 rounded font-medium ${improved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-200/80 text-slate-700'}`}>
                    Kafka Partitioning
                  </span>
                  <span className={`px-2.5 py-1 rounded font-medium ${improved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-200/80 text-slate-700'}`}>
                    EKS Orchestration
                  </span>
                </div>
              </div>

              {/* 2. Missing Measurable Achievements */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    2. Missing Measurable Achievements (Metrics & Impact)
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${improved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {improved ? 'Quantified Impact Added (+6 pts)' : 'Action Verbs Only'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {improved
                    ? 'Transformed bullets into STAR format: "Reduced API response latency by 42% (from 180ms to 95ms) and handled 14,000 peak TPS during flash sales."'
                    : 'Your project bullet points state "Built microservices" without stating latency improvements, query throughput, or cost reductions.'}
                </p>
              </div>

              {/* 3. Skills That Could Be Highlighted */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    3. High-Value Highlighted Skills
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                    High Demand in GCCs
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Promoted Java 17 record types, reactive Spring WebFlux, and zero-downtime Blue/Green deployment to top-line executive summary.
                </p>
              </div>

              {/* 4. Formatting & JD Compatibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">4. Formatting & ATS Parsing</span>
                  <span className="text-slate-600">
                    {improved ? 'Converted to single-column ATS clean layout.' : 'Multi-column tables can confuse legacy ATS parsers.'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">5. JD Compatibility Score</span>
                  <span className="text-slate-600">
                    {improved ? '96% match against top Bangalore Enterprise JDs.' : '74% match across Fortune 500 tech mandates.'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
