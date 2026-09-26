import React, { useState } from 'react';
import { Badge } from '../../shared/primitives';

const pipelineStages = [
  { stage: 'Sourced', count: '1,200 Candidates', desc: 'Raw talent pool algorithmically screened for core stack keywords.' },
  { stage: 'Vetted', count: '140 Candidates', desc: 'Senior engineer peer code evaluation & past production architecture check.' },
  { stage: 'Shortlisted', count: '28 Candidates', desc: 'Verified compensation expectations, notice period, and availability confirmed.' },
  { stage: 'Interviewing', count: '8 Candidates', desc: 'Client technical panels and executive leadership alignment rounds.' },
  { stage: 'Placed', count: '3 Hires', desc: 'Offer finalized, resignation assisted, and start date confirmed.' },
];

export const InteractiveTalentPipeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState(1);

  return (
    <section style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Badge variant="accent" style={{ marginBottom: '1rem' }}>Funnel Transparency</Badge>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
          Interactive Talent Qualification Pipeline
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
          Explore the quality filters applied before any engineer is presented to your hiring team.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
        {pipelineStages.map((p, idx) => {
          const isSelected = selectedStage === idx;
          return (
            <button
              key={p.stage}
              type="button"
              onClick={() => setSelectedStage(idx)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '1.25rem',
                backgroundColor: isSelected ? 'var(--color-surface-raised)' : 'var(--color-surface)',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                color: isSelected ? '#ffffff' : 'var(--color-text-muted)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-family-sans)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-subtle)' }}>
                Stage 0{idx + 1}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0' }}>{p.stage}</div>
              <div style={{ fontSize: '0.85rem', color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>{p.count}</div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '2.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {pipelineStages[selectedStage].stage} Gate Criteria
        </h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {pipelineStages[selectedStage].desc}
        </p>
      </div>
    </section>
  );
};
