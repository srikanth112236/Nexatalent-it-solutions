import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StoryChapter {
  id: string;
  tag: string;
  title: string;
  description: string;
  statValue: string;
  statLabel: string;
  visualHighlight: string;
}

export interface ScrollStorySectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  chapters?: StoryChapter[];
}

export const ScrollStorySection: React.FC<ScrollStorySectionProps> = ({
  badge = 'The Talent Journey',
  title = 'How We Built the Modern Tech Hiring Standard',
  subtitle = 'Follow the four pillars that differentiate precision tech hiring from commodity recruitment.',
  chapters = [
    {
      id: 'chapter-1',
      tag: '01 / Sourcing Calibration',
      title: 'Eliminating the 90% Keyword Noise',
      description: 'Commodity recruiters flood your inbox with resumes matching random buzzwords. We start by interviewing your Principal Engineers to write a deterministic calibration rubric that filters out 90% of superficial applicants.',
      statValue: '< 3.5%',
      statLabel: 'Candidate Acceptance Ratio',
      visualHighlight: 'Deterministic Engineering Rubric & Live Code Calibration',
    },
    {
      id: 'chapter-2',
      tag: '02 / Technical Calibration',
      title: 'Architect-to-Architect Screening',
      description: 'Before a profile reaches your screen, they are interviewed by former Staff and Principal Engineers who test distributed system limits, concurrency models, and code quality in real production context.',
      statValue: '100%',
      statLabel: 'Technically Pre-Vetted Contenders',
      visualHighlight: 'Rigorous Deep System Architecture & Concurrency Vetting',
    },
    {
      id: 'chapter-3',
      tag: '03 / Speed & SLA Precision',
      title: '48 to 72-Hour First Shortlist SLA',
      description: 'We run on strict contractually backed service level agreements. From initial kick-off call to calibrated candidate dossiers delivered directly into your unified portal in under 72 hours.',
      statValue: '48 Hours',
      statLabel: 'Guaranteed Shortlist SLA',
      visualHighlight: 'Real-Time Synchronous Portal & Accelerated Interviews',
    },
    {
      id: 'chapter-4',
      tag: '04 / Retention & Warranty',
      title: '90-Day Unconditional Insurance',
      description: 'Recruitment does not end on offer signature. We track notice periods, manage counter-offers, ensure day-1 joining, and back every hire with a 90-day replacement warranty.',
      statValue: '98.2%',
      statLabel: 'Joining Reliability Track Record',
      visualHighlight: 'Full 90-Day Replacement Guarantee & Candidate Onboarding Care',
    },
  ],
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 0 auto' }}>
            {subtitle}
          </p>
        </div>

        {/* Two-Column Story Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Chapter Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chapters.map((chapter, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <div
                  key={chapter.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: isActive ? 'var(--color-surface)' : 'rgba(15, 23, 42, 0.3)',
                    border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    padding: '1.5rem 1.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 10px 30px rgba(59, 130, 246, 0.15)' : 'none',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-primary-400)' : 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {chapter.tag}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      marginBottom: isActive ? '0.5rem' : 0,
                    }}
                  >
                    {chapter.title}
                  </h3>
                  {isActive && (
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                      {chapter.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Story Visual Display (Aceternity style neon highlight card) */}
          <div
            style={{
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '3rem 2.5rem',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(10, 15, 29, 0.95) 100%)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.15)',
            }}
          >
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-primary-400)',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              Verified Standard Output
            </div>

            <div
              style={{
                fontSize: '3.5rem',
                fontWeight: 900,
                color: 'var(--color-text)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}
            >
              {activeChapter.statValue}
            </div>

            <div
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                marginBottom: '2rem',
              }}
            >
              {activeChapter.statLabel}
            </div>

            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Operational Metric
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary-400)' }}>
                {activeChapter.visualHighlight}
              </div>
            </div>

            <Link
              to="/employers"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ffffff',
                backgroundColor: 'var(--color-primary)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              }}
            >
              <span>Explore Employer Guarantee</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
