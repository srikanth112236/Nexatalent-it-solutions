import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../../shared/primitives';

export const PortalPreview: React.FC = () => {
  const [activePortal, setActivePortal] = useState<'employer' | 'candidate' | 'recruiter'>('employer');

  const previews = {
    employer: {
      title: 'Employer Requisition Workspace',
      desc: 'Real-time candidate submissions, blind scorecards, and instant feedback loops.',
      route: '/employer',
      stats: '7 Active Roles • 22 Shortlisted Candidates',
    },
    candidate: {
      title: 'Candidate Career Hub',
      desc: 'Confidential application tracking, schedule panel interviews, and manage verified documents.',
      route: '/candidate',
      stats: '96% Profile Match • 2 Scheduled Rounds',
    },
    recruiter: {
      title: 'Recruiter Operations Cockpit',
      desc: 'ATS kanban pipelines, automated candidate reach-outs, and target attainment metrics.',
      route: '/recruiter',
      stats: '12 Managed Mandates • 64 Active Talent Pipeline',
    },
  };

  const curr = previews[activePortal];

  return (
    <section style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <Badge variant="primary" style={{ marginBottom: '1rem' }}>Platform Technology</Badge>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
          Purpose-Built Portals for Every Stakeholder
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {(['employer', 'candidate', 'recruiter'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActivePortal(p)}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              border: activePortal === p ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: activePortal === p ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activePortal === p ? '#ffffff' : 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {p} Portal Preview
          </button>
        ))}
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--color-border)',
          padding: '3rem',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <div style={{ maxWidth: '580px' }}>
          <Badge variant="accent" style={{ marginBottom: '1rem' }}>{curr.stats}</Badge>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>
            {curr.title}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {curr.desc}
          </p>
          <Link to={curr.route} style={{ textDecoration: 'none' }}>
            <Button variant="primary">Launch {activePortal} Portal &rarr;</Button>
          </Link>
        </div>

        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Live Portal Interface Mock
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ height: '40px', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }} />
            <div style={{ height: '40px', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }} />
            <div style={{ height: '40px', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }} />
          </div>
        </div>
      </div>
    </section>
  );
};
