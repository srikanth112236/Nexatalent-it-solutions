import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface IndustryVertical {
  id: string;
  name: string;
  iconName: string;
  description: string;
  activeMandates: number;
  avgClosureDays: number;
  highlightRoles: string[];
}

export interface IndustryExplorerProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  industries?: IndustryVertical[];
}

export const IndustryExplorer: React.FC<IndustryExplorerProps> = ({
  badge = 'Domain Specialization Practices',
  title = 'Engineered for High-Complexity Verticals',
  subtitle = 'We do not run generalist recruiting. Each practice is headed by recruiters with technical roots in these domains.',
  industries = [
    {
      id: 'fintech-crypto',
      name: 'FinTech, HFT & Payments',
      iconName: 'Cpu',
      description: 'Ultra-low latency exchange gateways, core banking platforms, risk engines, and blockchain protocols.',
      activeMandates: 64,
      avgClosureDays: 19,
      highlightRoles: ['Low-Latency C++ Architect', 'Financial Quantitative Dev', 'Staff Core Banking Lead'],
    },
    {
      id: 'ai-machine-learning',
      name: 'AI, LLMs & Foundation Models',
      iconName: 'Cpu',
      description: 'Training infrastructure, inference optimization, vector DB engines, and enterprise generative AI solutions.',
      activeMandates: 82,
      avgClosureDays: 16,
      highlightRoles: ['LLMOps Platform Lead', 'CUDA Optimization Specialist', 'Founding ML Scientist'],
    },
    {
      id: 'cloud-infrastructure',
      name: 'Cloud Native & SRE Platforms',
      iconName: 'Cloud',
      description: 'Distributed Kubernetes systems, mesh networking, multi-cloud governance, and zero-downtime architectures.',
      activeMandates: 55,
      avgClosureDays: 22,
      highlightRoles: ['Staff Kubernetes Operator Dev', 'Principal Reliability Architect', 'Cloud Security Director'],
    },
    {
      id: 'gcc-india',
      name: 'Global Capability Centers (GCCs)',
      iconName: 'Building',
      description: 'Turnkey leadership hiring and rapid engineering squad incubation for US and European enterprise parents.',
      activeMandates: 91,
      avgClosureDays: 25,
      highlightRoles: ['GCC Site Managing Director', 'Head of India Engineering', 'Founding Staff Team Leads'],
    },
    {
      id: 'health-biotech',
      name: 'HealthTech & Bio-Informatics',
      iconName: 'HeartPulse',
      description: 'HIPAA-compliant distributed medical records, genomic data pipelines, and telemedicine infrastructure.',
      activeMandates: 38,
      avgClosureDays: 24,
      highlightRoles: ['Staff Health Data Architect', 'VP Healthcare Security', 'Lead Clinical Systems Eng'],
    },
    {
      id: 'mobility-automotive',
      name: 'Automotive & Autonomous Systems',
      iconName: 'Car',
      description: 'AUTOSAR, connected vehicle telemetry, edge inference, and electric powertrain embedded software.',
      activeMandates: 29,
      avgClosureDays: 28,
      highlightRoles: ['Lead AUTOSAR Developer', 'Embedded Linux Architect', 'Telematics Platform Engineer'],
    },
  ],
}) => {
  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 0 auto' }}>
            {subtitle}
          </p>
        </div>

        {/* Matrix Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {industries.map((ind) => (
            <div
              key={ind.id}
              style={{
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
                    {ind.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-primary-400)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {ind.activeMandates} Mandates
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {ind.description}
                </p>

                {/* Key Roles */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Frequent Placements
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {ind.highlightRoles.map((role, rIdx) => (
                      <div key={rIdx} style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
                        • {role}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
                  Avg {ind.avgClosureDays}-Day SLA
                </span>
                <Link
                  to={`/industries/${ind.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-primary-400)',
                    textDecoration: 'none',
                  }}
                >
                  <span>Practice Overview</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
