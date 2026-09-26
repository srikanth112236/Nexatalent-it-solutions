import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowUpRight, Tag, Share2, Bookmark } from 'lucide-react';

interface ArticleItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readTime: string;
  date: string;
  featured?: boolean;
}

const ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    category: 'GCC Blueprint',
    title: 'The Modern Playbook for Setting Up a Tier-1 GCC in India: 2026 Edition',
    summary: 'How global Fortune 500 banks and high-growth SaaS scale-ups navigate talent density, compensation premiums, and entity structuring in Bangalore and Hyderabad.',
    author: {
      name: 'Vikram Malhotra',
      role: 'Managing Director, GCC Practice',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    readTime: '8 min read',
    date: 'March 2026',
    featured: true
  },
  {
    id: 'art-2',
    category: 'AI & Data Science',
    title: 'Evaluating LLM Architects vs Traditional ML Engineers: A Calibrated Guide',
    summary: 'Why classical algorithmic interviews fail to identify production-ready GenAI practitioners and how our 4-stage evaluation framework evaluates prompt engineering, RAG, and fine-tuning pipelines.',
    author: {
      name: 'Dr. Ananya Ray',
      role: 'Principal AI Evaluator',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
    },
    readTime: '6 min read',
    date: 'February 2026'
  },
  {
    id: 'art-3',
    category: 'FinTech Engineering',
    title: 'Hiring Ultra-Low Latency C++ Engineers in an AI-Disrupted Market',
    summary: 'Quant hedge funds and proprietary trading desks are fighting for the top 0.1% of systems programmers. Here is how leading HFT firms structure their retention incentives.',
    author: {
      name: 'Rohan Deshmukh',
      role: 'Partner, Quantitative Finance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    readTime: '5 min read',
    date: 'February 2026'
  }
];

export const LightEditorialInsightCard: React.FC = () => {
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>NexaTalent Research & Thought Leadership</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Executive Perspectives & Market Intelligence
            </h2>
            <p className="text-lg text-slate-600 mt-4">
              Deep-dive analytical research on tech executive hiring, GCC blueprint execution, and engineering talent compensation trends.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shrink-0">
            <span>Browse All 45+ Articles</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ARTICLES.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`rounded-3xl p-7 flex flex-col justify-between border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                article.featured
                  ? 'border-blue-300 bg-gradient-to-b from-blue-50/40 to-white shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    <Tag className="w-3 h-3 text-blue-600" />
                    <span>{article.category}</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      aria-label="Bookmark article"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked[article.id] ? 'fill-blue-600 text-blue-600' : ''}`} />
                    </button>
                    <button
                      aria-label="Share article"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {article.summary}
                </p>
              </div>

              {/* Author & Footer */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{article.author.name}</h4>
                    <p className="text-[11px] text-slate-500">{article.author.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{article.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
