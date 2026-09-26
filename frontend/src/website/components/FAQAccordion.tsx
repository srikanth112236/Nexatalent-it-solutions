import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FAQAccordionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  showSearch?: boolean;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  badge = 'Common Questions',
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about our recruitment SLAs, fee structures, and technical vetting methodology.',
  showSearch = true,
  items = [
    {
      category: 'Enterprise',
      question: 'How quickly does NexaTalent present verified candidates for a senior role?',
      answer:
        'Our standard SLA is 48 to 72 hours for an initial calibration shortlist of 3 to 5 vetted senior engineers. For niche or executive searches, full pipeline delivery is completed within 7 business days.',
    },
    {
      category: 'Enterprise',
      question: 'What is your technical calibration and vetting process?',
      answer:
        'Every candidate undergoes a three-stage calibration: (1) System Architecture Assessment conducted by senior industry practitioners, (2) Deep codebase & concurrency evaluation, and (3) Behavioral alignment & notice period verification.',
    },
    {
      category: 'Enterprise',
      question: 'What happens if a candidate leaves within their probationary period?',
      answer:
        'We offer a comprehensive 90-day replacement guarantee. If a candidate departs or fails to meet performance milestones, we provide an immediate priority replacement at zero additional charge.',
    },
    {
      category: 'Candidates',
      question: 'Is there any fee or cost for candidates using NexaTalent?',
      answer:
        'No. NexaTalent is 100% free for candidates. We provide dedicated career representation, compensation benchmarking, interview prep, and offer negotiation advisory at no cost.',
    },
    {
      category: 'Enterprise',
      question: 'Do you assist with international talent relocation or Global Capability Center setup?',
      answer:
        'Yes. We have dedicated GCC Advisory squads in Bangalore, Hyderabad, and Pune specializing in legal entity formation, competitive compensation architecture, site leadership hiring, and turnkey office staffing.',
    },
  ],
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredItems = items.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-primary-400)',
              marginBottom: '0.75rem',
            }}
          >
            <HelpCircle size={15} />
            {badge}
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
            {subtitle}
          </p>

          {showSearch && (
            <div
              style={{
                position: 'relative',
                maxWidth: '480px',
                margin: '2rem auto 0 auto',
              }}
            >
              <Search
                size={18}
                color="var(--color-text-tertiary)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
            </div>
          )}
        </div>

        {/* Accordion Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-surface)',
                  border: isOpen ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--color-border)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  onClick={() => toggleItem(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                  }}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    size={20}
                    color="var(--color-text-secondary)"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      flexShrink: 0,
                      marginLeft: '1rem',
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.5rem 1.5rem',
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                      paddingTop: '1rem',
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
