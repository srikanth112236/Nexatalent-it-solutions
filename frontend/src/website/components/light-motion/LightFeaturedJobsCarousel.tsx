import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const carouselRoles = [
  { id: 'c1', title: 'VP of Engineering', company: 'Global Neobank GCC', location: 'Bangalore · On-site', comp: '₹1.1Cr - ₹1.4Cr + Equity', stack: ['Leadership', 'Distributed Systems', 'Site Incubation'] },
  { id: 'c2', title: 'Principal eBPF Kernel Engineer', company: 'Cloud Security Hyperscaler', location: 'Hyderabad · Hybrid', comp: '₹80L - ₹1.05Cr', stack: ['C', 'Rust', 'Linux Kernel', 'Observability'] },
  { id: 'c3', title: 'Lead LLM Alignment Scientist', company: 'Generative AI Foundation', location: 'London / Remote', comp: '£160k - £220k', stack: ['RLHF', 'vLLM', 'Direct Preference Optimization'] },
  { id: 'c4', title: 'Staff Site Reliability Architect', company: 'Tier-1 High Frequency Trading', location: 'Singapore / Remote', comp: '$260k - $340k + Bonus', stack: ['Low Latency', 'Solarflare', 'Network Tuning'] },
];

export const LightFeaturedJobsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((p) => (p === 0 ? carouselRoles.length - 1 : p - 1));
  const next = () => setCurrentIndex((p) => (p === carouselRoles.length - 1 ? 0 : p + 1));

  const role = carouselRoles[currentIndex];

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
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
            fontWeight: 800,
            color: '#2563eb',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} />
          <span>LEADERSHIP SPOTLIGHT CAROUSEL</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
          Senior Executive & Staff Appointments
        </h2>
        <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 3.5rem auto', lineHeight: 1.6 }}>
          Exclusive confidential searches led directly by NexaTalent IT Solutions Managing Partners.
        </p>

        {/* Carousel Card Container */}
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: 'var(--nt-surface-2, #f8fafc)',
                borderRadius: '24px',
                border: '1px solid #cbd5e1',
                padding: '3rem 2.5rem',
                textAlign: 'left',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                  Exclusive Retained Search · Confidential
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)', fontWeight: 600 }}>
                  Role {currentIndex + 1} of {carouselRoles.length}
                </span>
              </div>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.5rem' }}>
                {role.title}
              </h3>
              <div style={{ fontSize: '1.0625rem', color: 'var(--nt-muted, #475569)', fontWeight: 600, marginBottom: '1.5rem' }}>
                {role.company}
              </div>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--nt-muted, #64748b)', fontSize: '0.9375rem' }}>
                  <MapPin size={16} color="#2563eb" />
                  <span>{role.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700, fontSize: '0.9375rem' }}>
                  <DollarSign size={16} color="#059669" />
                  <span>{role.comp}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                {role.stack.map((s, idx) => (
                  <span key={idx} style={{ backgroundColor: 'var(--nt-surface, #ffffff)', border: '1px solid var(--nt-border, #e2e8f0)', color: 'var(--nt-ink-2, #334155)', fontSize: '0.8125rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--nt-border, #e2e8f0)', paddingTop: '1.5rem' }}>
                <Link
                  to="/employers"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                  }}
                >
                  <span>Confidential Practice Inquiry</span>
                  <ArrowRight size={16} />
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={prev}
                    aria-label="Previous role"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--nt-surface, #ffffff)',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--nt-ink-2, #334155)',
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next role"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#ffffff',
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
