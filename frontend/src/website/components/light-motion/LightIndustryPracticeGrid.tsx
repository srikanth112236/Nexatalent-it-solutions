import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Database, Globe2, Shield, Zap, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const practices = [
  { id: 'fintech', title: 'FinTech & Quantitative Trading', desc: 'Ultra-low latency exchange gateways, FPGA acceleration, C++20, and algorithmic order routing.', roles: '48 Roles Active', icon: Zap, accent: '#2563eb' },
  { id: 'ai-ml', title: 'Generative AI & LLM Systems', desc: 'Distributed vLLM clusters, GPU memory kernels, RLHF alignment, and low-latency embeddings.', roles: '62 Roles Active', icon: Sparkles, accent: '#0891b2' },
  { id: 'cloud', title: 'Cloud-Native & Distributed Databases', desc: 'Raft consensus state machines, petabyte-scale messaging fabrics, and multi-region Kubernetes.', roles: '74 Roles Active', icon: Database, accent: '#7c3aed' },
  { id: 'gcc', title: 'Global Capability Center (GCC) Pods', desc: 'Turnkey site directors, staff architects, and full pods established in 75 days across Bangalore & Hyderabad.', roles: '85 Roles Active', icon: Globe2, accent: '#16a34a' },
  { id: 'security', title: 'Infrastructure Security & eBPF', desc: 'Kernel-bypass observability, zero-trust container security, cryptographic protocols, and SOC2.', roles: '36 Roles Active', icon: Shield, accent: '#ea580c' },
  { id: 'data', title: 'High-Throughput Data Engineering', desc: 'Real-time streaming pipelines, Apache Flink/Kafka at scale, and columnar analytical engines.', roles: '42 Roles Active', icon: Layers, accent: '#2563eb' },
];

export const LightIndustryPracticeGrid: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
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
          <span>25 / 40 · SECTOR PRACTICE MATRICES</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '0.75rem' }}>
          Deep Domain Expertise by Engineering Practice
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
          We organize our teams into specialized technical verticals led by former engineering practitioners.
        </p>

        {/* 6 Practices Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          {practices.map((p) => {
            const IconComp = p.icon;
            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)' }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #e2e8f0',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: `${p.accent}12`,
                        color: p.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={24} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.accent, backgroundColor: `${p.accent}10`, padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>
                      {p.roles}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                    {p.title}
                  </h3>

                  <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                  <Link
                    to={`/industries/${p.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: p.accent,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Practice Dossier</span>
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
