import React from 'react';
import { Sparkles, Cpu, Network, ArrowRight } from 'lucide-react';

export const DetailCloudAndAiSpecialization: React.FC = () => {
  const stacks = [
    {
      title: 'Generative AI & LLM Systems',
      tools: ['PyTorch', 'vLLM & TensorRT', 'LangChain / LlamaIndex', 'Vector DBs'],
      desc: 'Specialized engineers trained in model fine-tuning, RAG architecture, and production AI deployment.',
      icon: Cpu,
    },
    {
      title: 'Cloud Infrastructure & DevOps',
      tools: ['Kubernetes & Helm', 'Terraform & IaC', 'AWS / Azure / GCP', 'CI/CD Pipelines'],
      desc: 'Cloud architects specializing in high-availability multi-region cluster management.',
      icon: Sparkles,
    },
    {
      title: 'Enterprise Agentic Workflows',
      tools: ['Multi-Agent Systems', 'API Integrations', 'Workflow Automation', 'State Machines'],
      desc: 'Building autonomous AI agents and enterprise system integrations with fail-safe reliability.',
      icon: Network,
    },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] py-8 px-4 sm:px-8 border-y border-slate-200/80">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider mb-3">
              <Cpu className="w-3.5 h-3.5 text-[#0265FF]" />
              <span>CLOUD & ARTIFICIAL INTELLIGENCE SPECIALIZATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pre-Vetted AI & Cloud Engineering Specialists
            </h2>
          </div>
          <button 
            type="button"
            className="px-6 py-3 rounded-full bg-[#0265FF] hover:bg-[#004FBF] text-white text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-md"
          >
            <span>Deploy AI & Cloud Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stacks.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0265FF] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">{s.desc}</p>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">Verified Skill Stack:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tools.map((tool, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
