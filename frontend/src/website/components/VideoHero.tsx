import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Badge, Modal } from '../../shared/primitives';
import { motionTokens } from '../../shared/motion/motionTokens';

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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Badge variant="primary" style={{ marginBottom: '1.25rem' }}>{badge}</Badge>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: motionTokens.ease.standard }}
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: '840px', margin: '0 auto 1.25rem auto', color: '#ffffff' }}
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: motionTokens.ease.standard }}
        style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}
      >
        {description}
      </motion.p>

      {/* Video Container with Breathing Glowing Border and Animated Play Trigger */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3, ease: motionTokens.ease.emphasis }}
        whileHover={{ scale: 1.01 }}
        style={{
          position: 'relative',
          maxWidth: '960px',
          margin: '0 auto',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.2)',
          cursor: 'pointer',
        }}
        onClick={() => setIsPlaying(true)}
      >
        <img
          src={videoPreviewImage}
          alt="Video Preview"
          style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
        />

        {/* Ambient Dark Overlay & Pulsing Ripple Play Button */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 22, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Concentric Animated Pulse Ring */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                border: '2px solid rgba(59, 130, 246, 0.6)',
              }}
            />

            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.7)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <span style={{ color: '#ffffff', fontSize: '1.6rem', marginLeft: '5px' }}>▶</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
        title="NexaTalent Platform Overview & Workflow"
        maxWidth="840px"
      >
        <div style={{ aspectRatio: '16/9', backgroundColor: '#090d16', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Platform Video Tour Activated
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Demonstrating the real-time client pipeline, candidate verification checks, and SLA clock.
            </p>
          </div>
        </div>
        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <Button variant="secondary" onClick={() => setIsPlaying(false)}>Close Walkthrough</Button>
        </div>
      </Modal>
    </section>
  );
};
