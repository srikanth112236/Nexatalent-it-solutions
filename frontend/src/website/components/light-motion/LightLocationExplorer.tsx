import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const hubs = [
  { city: 'Bangalore', country: 'India', comp: '₹65L - ₹95L', roles: '142 Active Roles', specialty: 'Core Distributed Systems & Tier-1 GCCs', accent: '#2563eb' },
  { city: 'Hyderabad', country: 'India', comp: '₹55L - ₹85L', roles: '98 Active Roles', specialty: 'Cloud Security, Data Platforms & AI Pods', accent: '#0891b2' },
  { city: 'London', country: 'United Kingdom', comp: '£140k - £220k', roles: '48 Active Roles', specialty: 'Quantitative Trading & FinTech Architecture', accent: '#7c3aed' },
  { city: 'San Francisco', country: 'United States', comp: '$240k - $360k', roles: '64 Active Roles', specialty: 'Foundational Generative AI & LLM Systems', accent: '#16a34a' },
];

export const LightLocationExplorer: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface-2, #f8fafc)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
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
          <span>NEXATALENT GLOBAL TALENT HUBS</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
          Cross-Border Engineering Hub Intelligence
        </h2>
        <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
          Calibrated compensation ranges and verified senior engineering talent density across top technology capitals.
        </p>

        {/* 4 Hubs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          {hubs.map((hub, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)' }}
              style={{
                backgroundColor: 'var(--nt-surface, #ffffff)',
                borderRadius: '24px',
                border: '1px solid var(--nt-border, #e2e8f0)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: hub.accent, fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1rem' }}>
                  <MapPin size={18} />
                  <span>{hub.country.toUpperCase()}</span>
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.5rem' }}>
                  {hub.city}
                </h3>

                <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                  {hub.specialty}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)' }}>
                    <Users size={15} color={hub.accent} />
                    <span>{hub.roles}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9375rem', color: '#059669', fontWeight: 800 }}>
                    <DollarSign size={16} color="#059669" />
                    <span>{hub.comp} Median</span>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--nt-border, #e2e8f0)' }}>
                <Link
                  to={`/jobs?location=${encodeURIComponent(hub.city)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: hub.accent,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                  }}
                >
                  <span>Explore {hub.city} Hub</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
