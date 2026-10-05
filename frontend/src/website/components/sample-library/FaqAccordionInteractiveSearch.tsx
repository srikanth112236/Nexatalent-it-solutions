import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

export const FaqAccordionInteractiveSearch: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const faqs = [
    {
      q: 'Who owns the intellectual property (IP) created by our GCC engineers?',
      a: '100% of all intellectual property, source code, neural network weights, patents, and software artifacts belong directly to your US or UK parent entity. NexaTalent IT Solutions executes comprehensive tri-party assignment deeds vetted by Cooley LLP and Trilegal.',
    },
    {
      q: 'Do we need to incorporate an Indian legal entity before hiring?',
      a: 'No. You can start immediately under NexaTalent IT Solutions’s Employer of Record (EOR) structure. Once your headcount reaches 30–50 engineers, our legal team assists you in establishing your wholly-owned private limited subsidiary and transfers all employees with zero friction.',
    },
    {
      q: 'What happens if a placed engineer leaves or fails performance standards?',
      a: 'Every retained search placement includes a 90-day free replacement guarantee. If a candidate departs or is terminated for performance within 90 days, we conduct a prioritized search to replace them at zero additional fee.',
    },
    {
      q: 'How does NexaTalent IT Solutions’s technical vetting compare to internal recruiters?',
      a: 'Traditional agencies screen resumes with keyword matching. NexaTalent IT Solutions conducts rigorous live coding sandboxes and architecture defenses led by former Google, Goldman Sachs, and Citadel engineering directors. Only the top 1.5% pass to client interviews.',
    },
  ];

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>Searchable Governance & Operational FAQ</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Client Knowledge Base</span>
      </div>

      <section className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Institutional Clarity on IP, Entity & SLAs
          </h2>
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions (e.g., IP ownership, entity setup, replacement)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed font-light border-t border-slate-200/60 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
