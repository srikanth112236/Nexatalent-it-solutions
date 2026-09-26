import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../shared/primitives';
import { motionTokens } from '../../shared/motion/motionTokens';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pipelineStages = [
  { stage: 'Sourced', count: '1,200 Candidates', desc: 'Raw talent pool algorithmically screened for core stack keywords.', value: 1200 },
  { stage: 'Vetted', count: '140 Candidates', desc: 'Senior engineer peer code evaluation & past production architecture check.', value: 140 },
  { stage: 'Shortlisted', count: '28 Candidates', desc: 'Verified compensation expectations, notice period, and availability confirmed.', value: 28 },
  { stage: 'Interviewing', count: '8 Candidates', desc: 'Client technical panels and executive leadership alignment rounds.', value: 8 },
  { stage: 'Placed', count: '3 Hires', desc: 'Offer finalized, resignation assisted, and start date confirmed.', value: 3 },
];

export const InteractiveTalentPipeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.pipeline-stage-btn', 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);
    
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.outQuart }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <Badge variant="accent" style={{ marginBottom: '1rem' }}>Funnel Transparency</Badge>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
          Interactive Talent Qualification Pipeline
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
          Explore the quality filters applied before any engineer is presented to your hiring team.
        </p>
      </motion.div>

      <div ref={timelineRef} style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', position: 'relative' }}>
        {pipelineStages.map((p, idx) => {
          const isSelected = selectedStage === idx;
          return (
            <motion.button
              key={p.stage}
              className="pipeline-stage-btn"
              type="button"
              onClick={() => setSelectedStage(idx)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '1.25rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-lg)',
                color: isSelected ? '#ffffff' : 'var(--color-text-muted)',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'var(--font-family-sans)',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
              }}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-stage-bg"
                  transition={motionTokens.spring.snappy}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'inherit',
                    zIndex: -1,
                  }}
                />
              )}
              {!isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: '1px solid var(--color-border)',
                    borderRadius: 'inherit',
                    zIndex: -1,
                  }}
                />
              )}
              
              <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-subtle)', transition: 'color 0.3s' }}>
                Stage 0{idx + 1}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0', color: isSelected ? '#ffffff' : 'inherit', transition: 'color 0.3s' }}>{p.stage}</div>
              <div style={{ fontSize: '0.85rem', color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)', transition: 'color 0.3s' }}>{p.count}</div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedStage}
          initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.outQuart }}
          style={{ padding: '2.5rem', backgroundColor: 'rgba(var(--color-surface-rgb), 0.8)', backdropFilter: 'blur(16px)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {pipelineStages[selectedStage].stage} Gate Criteria
          </h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {pipelineStages[selectedStage].desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
