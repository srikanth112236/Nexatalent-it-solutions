import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, CheckCircle2, ArrowRight, Shield, Zap, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  metric: string;
  visualTitle: string;
  visualDesc: string;
}

const accordionItems: AccordionItem[] = [
  {
    id: 'acc-1',
    question: 'How does the 48-hour shortlist SLA operate contractually?',
    answer: 'From the minute we lock your technical rubric with your VP of Engineering, our specialized domain squad begins direct outreach to calibrated passive contenders. We guarantee 3 to 5 dossiers within 48 business hours or credit 25% of our fee.',
    metric: '48h SLA',
    visualTitle: 'Synchronous Intake to Calibration Sprint',
    visualDesc: 'Direct calendar integration, video interview recordings, and standardized consensus scoring rubrics.',
  },
  {
    id: 'acc-2',
    question: 'What is included in the 90-day unconditional replacement warranty?',
    answer: 'If any engineer placed by NexaTalent departs or fails to meet established milestones within their first 90 days, we immediately remount the search with our highest priority tier at zero additional expense.',
    metric: '90-Day Guarantee',
    visualTitle: 'Escrow-Backed Placement Insurance',
    visualDesc: 'Continuous post-onboarding pulse checks at 30, 60, and 90 days with hiring manager review.',
  },
  {
    id: 'acc-3',
    question: 'Who conducts the technical calibration screens before submission?',
    answer: 'All technical vetting is led by ex-Staff and Principal Engineers from Tier-1 product companies and hyperscalers. They test system boundaries, concurrency invariants, memory profiles, and architectural decisions.',
    metric: '100% Pre-Vetted',
    visualTitle: 'Architect-to-Architect Calibration Panel',
    visualDesc: 'Standardized rubrics eliminate 90% of superficial candidates before reaching your engineers.',
  },
];

export const LightMagneticCardAccordion: React.FC = () => {
  const [activeAcc, setActiveAcc] = useState('acc-1');

  const currentVisual = accordionItems.find((i) => i.id === activeAcc) || accordionItems[0];

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            Pattern 46, 47 & 48 · Magnetic Cards & Accordion Visual Transformation
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Reactive SLAs & Dynamic Visual Verification
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Click each accordion query to watch the corresponding architectural visual transform in real time.
          </p>
        </div>

        {/* 2-Column Accordion + Live Dynamic Visual */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Accordion Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {accordionItems.map((item) => {
              const isOpen = activeAcc === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveAcc(item.id)}
                  style={{
                    borderRadius: '20px',
                    backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                    border: isOpen ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    padding: '1.75rem',
                    cursor: 'pointer',
                    boxShadow: isOpen ? '0 10px 25px -5px rgba(37, 99, 235, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: isOpen ? '#2563eb' : '#0f172a', paddingRight: '1rem' }}>
                      {item.question}
                    </h4>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={20} color={isOpen ? '#2563eb' : '#94a3b8'} />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Visual Transformation (Pattern 48) */}
          <div
            style={{
              position: 'sticky',
              top: '120px',
              backgroundColor: '#f8fafc',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              padding: '3rem 2.5rem',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <Zap size={14} />
              {currentVisual.metric}
            </div>

            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)',
              }}
            >
              <Cpu size={32} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              {currentVisual.visualTitle}
            </h3>

            <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
              {currentVisual.visualDesc}
            </p>

            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.8125rem', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>Verified Service Level Standard Active</span>
            </div>
          </div>
        </div>

        {/* Pattern 46 & 47: Magnetic Hover Expand Grid */}
        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
              Pattern 46 & 47 · Magnetic Hover Expand Cards
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: '0.35rem' }}>
              Hover to Expand Practice Disciplines
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Core SRE & Cloud Native', roles: '114 Mandates', icon: Cpu, link: '/industries/cloud-native' },
              { title: 'HFT & Algorithmic Trading', roles: '68 Mandates', icon: Zap, link: '/industries/fintech' },
              { title: 'Generative AI & LLMOps', roles: '92 Mandates', icon: Sparkles, link: '/industries/ai-ml' },
              { title: 'Turnkey GCC Hub Scaling', roles: '140 Mandates', icon: Shield, link: '/industries/gcc' },
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '18px',
                    border: '1px solid #e2e8f0',
                    padding: '2rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <IconComp size={20} />
                  </div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {card.title}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600, marginBottom: '1.25rem' }}>
                    {card.roles}
                  </div>
                  <Link
                    to={card.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Inspect Mandates</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
