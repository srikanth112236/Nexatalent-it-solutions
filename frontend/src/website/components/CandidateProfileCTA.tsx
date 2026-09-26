import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CandidateProfileCTAProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  perks?: string[];
  ctaLink?: string;
}

export const CandidateProfileCTA: React.FC<CandidateProfileCTAProps> = ({
  badge = 'For Elite Engineers & Tech Leaders',
  title = 'Confidential Career Representation with Zero Spam',
  subtitle = 'Get matched directly with VP/Director-level hiring decision-makers at tier-1 product organizations, hypergrowth scale-ups, and global GCCs.',
  perks = [
    '100% Confidential — your current employer will never see your profile',
    'Transparent salary benchmarks & verified equity upside',
    'Dedicated technical agent to prep, advocate, and negotiate on your behalf',
  ],
  ctaLink = '/register?type=candidate',
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          borderRadius: 'var(--radius-2xl)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: '3.5rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xl)',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
        }}
      >
        {/* Left Side: Copy and Perks */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.875rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-primary-400)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            {badge}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              lineHeight: 1.25,
              marginBottom: '1rem',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            {subtitle}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
            {perks.map((perk, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <CheckCircle2 size={16} color="var(--color-primary-400)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.9375rem', color: 'var(--color-text)' }}>{perk}</span>
              </div>
            ))}
          </div>

          <Link
            to={ctaLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '0.875rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
            }}
          >
            <span>Create Candidate Passport</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right Side: Interactive Resume Drop / Quick Profile */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            borderRadius: 'var(--radius-xl)',
            border: dragOver ? '2px dashed var(--color-primary)' : '2px dashed var(--color-border)',
            backgroundColor: dragOver ? 'rgba(59, 130, 246, 0.08)' : 'rgba(15, 23, 42, 0.5)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--color-primary-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <UploadCloud size={28} />
          </div>

          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            {uploadedFile ? 'Resume Attached' : 'Fast-Track Evaluation'}
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {uploadedFile ? (
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{uploadedFile}</span>
            ) : (
              'Drag & drop your CV / GitHub / LinkedIn profile for instant AI skill parsing and recruiter review.'
            )}
          </p>

          <label
            style={{
              display: 'inline-block',
              padding: '0.625rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            <span>Browse Document (PDF / DOCX)</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedFile(e.target.files[0].name);
                }
              }}
              style={{ display: 'none' }}
            />
          </label>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Lock size={12} color="var(--color-success)" />
            <span>Strict Privacy Guaranteed · Zero unsolicited contacts</span>
          </div>
        </div>
      </div>
    </section>
  );
};
