import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, DollarSign, Bookmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobMandate {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  sla: string;
  urgent?: boolean;
}

const jobs: JobMandate[] = [
  {
    id: 'j1',
    title: 'Principal Distributed Systems Architect',
    company: 'OmniCloud Global Labs',
    location: 'Bangalore · Hybrid',
    type: 'Full-Time',
    salary: '₹75L - ₹95L + Equity',
    tags: ['Rust', 'Distributed DB', 'Raft', 'eBPF'],
    sla: '48h Shortlist Active',
    urgent: true,
  },
  {
    id: 'j2',
    title: 'Staff Machine Learning Platform Lead',
    company: 'Foundry Neural AI',
    location: 'Hyderabad · Hybrid',
    type: 'Full-Time',
    salary: '₹68L - ₹88L + Equity',
    tags: ['vLLM', 'CUDA', 'Distributed PyTorch', 'K8s'],
    sla: 'Final Round Sprints',
    urgent: false,
  },
  {
    id: 'j3',
    title: 'Head of Core Low-Latency Infrastructure',
    company: 'AlphaFin Trading Group',
    location: 'London / Remote',
    type: 'Full-Time',
    salary: '£180k - £240k + Bonus',
    tags: ['C++20', 'Kernel Bypass', 'Solarflare', 'HFT'],
    sla: 'Exclusive Retained Search',
    urgent: true,
  },
];

export const LightJobCardShowcase: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface-2, #f8fafc)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
            <span>VERIFIED ACTIVE MANDATES</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
            Featured Engineering Opportunities
          </h2>
          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Every role is verified directly with engineering leadership, with transparent compensation and guaranteed interview cycles.
          </p>
        </div>

        {/* 3 Job Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {jobs.map((job) => {
            const isSaved = !!savedJobs[job.id];
            return (
              <motion.div
                key={job.id}
                whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)' }}
                style={{
                  backgroundColor: 'var(--nt-surface, #ffffff)',
                  borderRadius: '24px',
                  border: '1px solid var(--nt-border, #e2e8f0)',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        {job.sla}
                      </span>
                      {job.urgent && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                          Priority
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => toggleSave(job.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isSaved ? '#2563eb' : '#94a3b8',
                      }}
                    >
                      <Bookmark size={20} fill={isSaved ? '#2563eb' : 'none'} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                    {job.title}
                  </h3>

                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--nt-muted, #475569)', marginBottom: '1.25rem' }}>
                    {job.company}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--nt-muted, #64748b)' }}>
                      <MapPin size={15} color="#2563eb" />
                      <span>{job.location} · {job.type}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700 }}>
                      <DollarSign size={15} color="#059669" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {job.tags.map((tag, tIdx) => (
                      <span key={tIdx} style={{ backgroundColor: 'var(--nt-surface-3, #f1f5f9)', color: 'var(--nt-ink-2, #334155)', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--nt-border, #e2e8f0)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle2 size={14} />
                    <span>Verified Mandate</span>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Mandate & Apply</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
