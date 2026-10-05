import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight, Sparkles, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'engagement' | 'gcc' | 'vetting' | 'pricing';
  question: string;
  answer: string;
  tag: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'engagement',
    question: 'How fast can NexaTalent IT Solutions deploy an enterprise search team or pod?',
    answer: 'Typical turnaround for shortlisting verified senior engineers and directors is 72 business hours. For end-to-end squad buildouts (5–12 engineers), initial deployment takes an average of 14–21 calendar days with calibrated salary banding and background verifications pre-cleared.',
    tag: 'SLA Speed'
  },
  {
    id: 'faq-2',
    category: 'gcc',
    question: 'What is included in the GCC Launch & Build-Operate-Transfer (BOT) service?',
    answer: 'Our GCC launch service handles the complete talent infrastructure lifecycle: legal employer-of-record advisory, real-estate & SEZ compliance, localized payroll benchmarking, full leadership hiring, and engineering squad scaling. You retain 100% intellectual property ownership from day one, with optional transfer of entity governance at the 12, 24, or 36-month mark.',
    tag: 'GCC Model'
  },
  {
    id: 'faq-3',
    category: 'vetting',
    question: 'How does your 4-stage engineering evaluation and vetting work?',
    answer: 'Every candidate undergoes: 1) System Architecture & Design assessment conducted by former Big Tech Staff/Principal engineers; 2) Live production debugging and algorithmic problem solving; 3) Leadership and organizational cultural compatibility; and 4) Multi-factor credential verification, compensation history check, and reference audits.',
    tag: 'Verification'
  },
  {
    id: 'faq-4',
    category: 'pricing',
    question: 'What commercial models do you support for enterprise clients?',
    answer: 'We provide three tailored engagement frameworks: Performance-based Contingency for ad-hoc specialist roles, Retained Executive Search with guaranteed SLA delivery for Director/VP/C-suite hires, and Dedicated Dedicated Squad/GCC Capacity retainers with transparent volume-discounted fee matrices.',
    tag: 'Commercials'
  },
  {
    id: 'faq-5',
    category: 'vetting',
    question: 'What guarantee or replacement policy do you offer on placements?',
    answer: 'All direct placements include an industry-leading 90-day replacement warranty. For retained executive mandates and GCC founding hires, we extend warranty coverage up to 180 days, backed by a dedicated talent continuity manager.',
    tag: 'Guarantee'
  },
  {
    id: 'faq-6',
    category: 'engagement',
    question: 'Can NexaTalent IT Solutions recruit cross-border or facilitate overseas relocations?',
    answer: 'Yes. We maintain active talent pipelines across India (Bangalore, Hyderabad, NCR, Pune), the United Kingdom (London), and North America (San Francisco, Austin, New York). Our global mobility partners handle Tier-2 / H1B / O-1 visa sponsorship paperwork and relocation logistics seamlessly.',
    tag: 'Global Mobility'
  }
];

export const LightFAQAccordion: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const matchesQuery = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-slate-200">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Clear, transparent answers about our enterprise talent partnerships, GCC setup timelines, candidate vetting rigor, and commercial arrangements.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Queries' },
              { id: 'engagement', label: 'Engagement & SLAs' },
              { id: 'gcc', label: 'GCC & BOT Setup' },
              { id: 'vetting', label: 'Technical Vetting' },
              { id: 'pricing', label: 'Commercial Models' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-blue-300 bg-blue-50/20 shadow-md shadow-blue-500/5'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  className="w-full text-left p-6 md:p-7 flex items-start justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider mb-1">
                      {faq.tag}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-7 md:px-7 md:pb-8 pt-0 border-t border-slate-100/80">
                        <p className="text-slate-600 text-base leading-relaxed mt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <p className="text-slate-500 font-medium">No questions matched your search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Help Banner */}
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/10">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Need customized answers for your hiring roadmap?</span>
            </div>
            <p className="text-slate-300 text-sm md:text-base">
              Speak directly with an enterprise talent partner specializing in your tech domain.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 shrink-0">
            <span>Schedule Partner Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
