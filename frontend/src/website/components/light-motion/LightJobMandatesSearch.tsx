import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ['All Disciplines', 'Distributed Systems', 'Generative AI & ML', 'HFT FinTech', 'Cloud Native & SRE'];

export const LightJobMandatesSearch: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('All Disciplines');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
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
          <span>20 / 40 · VERIFIED MANDATE SEARCH</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '0.75rem' }}>
          Explore 310+ Active Tier-1 Mandates
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 3.5rem auto', lineHeight: 1.6 }}>
          100% verified compensation bands, explicit tech stacks, and direct CTO interview coordination.
        </p>

        {/* Search Bar Input Container */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '2px solid #2563eb',
            padding: '0.75rem 1rem',
            boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '820px',
            margin: '0 auto 2rem auto',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '220px' }}>
            <Search size={20} color="#2563eb" />
            <input
              type="text"
              placeholder="Search by role, stack (Rust, vLLM, eBPF), or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                color: '#0f172a',
                backgroundColor: 'transparent',
              }}
            />
          </div>

          <Link
            to={`/jobs?q=${encodeURIComponent(searchQuery)}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem 1.75rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            <span>Search Mandates</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filter Pills with layoutId Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  position: 'relative',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                  color: isSelected ? '#2563eb' : '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Quick Summary Strip */}
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: '#64748b', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={14} color="#2563eb" />
            <span>Average Senior Comp: ₹65L - ₹95L</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="#059669" />
            <span>Bangalore · Hyderabad · London · SF · Remote</span>
          </div>
        </div>
      </div>
    </section>
  );
};
