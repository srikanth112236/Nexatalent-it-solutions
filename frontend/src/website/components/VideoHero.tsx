import React, { useState } from 'react';
import { Button, Badge, Modal } from '../../shared/primitives';

export interface VideoHeroProps {
  badge?: string;
  title?: string;
  description?: string;
  videoPreviewImage?: string;
  videoUrl?: string;
}

export const VideoHero: React.FC<VideoHeroProps> = ({
  badge = 'Architecture Walkthrough',
  title = 'See How Enterprise Teams Hire at Global Scale',
  description = 'A 3-minute technical tour of how NexaTalent qualifies mandates, benchmarks salaries, and submits interview-ready shortlists.',
  videoPreviewImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' }}>
      <Badge variant="primary" style={{ marginBottom: '1.25rem' }}>{badge}</Badge>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: '840px', margin: '0 auto 1.25rem auto' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
        {description}
      </p>

      {/* Video Container with Ambient Shadow */}
      <div
        style={{
          position: 'relative',
          maxWidth: '960px',
          margin: '0 auto',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
          cursor: 'pointer',
        }}
        onClick={() => setIsPlaying(true)}
      >
        <img
          src={videoPreviewImage}
          alt="Video Preview"
          style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
        />

        {/* Ambient Overlay & Play Trigger */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 22, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-primary)',
              transition: 'transform 0.2s',
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '1.5rem', marginLeft: '4px' }}>▶</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
        title="NexaTalent Platform Overview"
        maxWidth="800px"
      >
        <div style={{ aspectRatio: '16/9', backgroundColor: '#000000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#ffffff', fontSize: '0.95rem' }}>Interactive Demo Video Player</p>
        </div>
        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <Button variant="secondary" onClick={() => setIsPlaying(false)}>Close Player</Button>
        </div>
      </Modal>
    </section>
  );
};
