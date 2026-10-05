import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, ShieldCheck, Database, Layers, BrainCircuit, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface ChapterPanel {
  id: string;
  tag: string;
  title: string;
  category: string;
  description: string;
  metric: string;
  metricLabel: string;
  badge: string;
  accent: string;
}

const chapters: ChapterPanel[] = [
  {
    id: 'h-01',
    tag: 'CHAPTER 01',
    category: 'High-Frequency FinTech & Crypto',
    title: 'Sub-Microsecond Trading Engines & Quantitative Architecture',
    description: 'Placing Staff and Principal Engineers specializing in kernel-bypass networking, FPGA acceleration, modern C++20, and ultra-low latency exchange gateways.',
    metric: 'Assessed',
    metricLabel: 'Low-Latency Systems Practice',
    badge: 'FinTech Vertical Practice',
    accent: '#2563eb',
  },
  {
    id: 'h-02',
    tag: 'CHAPTER 02',
    category: 'Foundation AI & LLM Systems',
    title: 'Distributed vLLM Clusters & GPU Inference Optimization',
    description: 'Specialists scaling Megatron-LM, TensorRT-LLM, model distillation, and low-latency embeddings inference for tier-1 generative AI enterprises.',
    metric: 'Scaled',
    metricLabel: 'AI Systems Delivery',
    badge: 'AI Systems Practice',
    accent: '#0891b2',
  },
  {
    id: 'h-03',
    tag: 'CHAPTER 03',
    category: 'Cloud-Native & Distributed Databases',
    title: 'Zero-Downtime Consensus & Global Mesh Networks',
    description: 'Architects orchestrating Raft/Paxos distributed state machines, multi-region Kubernetes clusters, and petabyte-scale event backbones.',
    metric: '99.999%',
    metricLabel: 'Service Availability Target',
    badge: 'Distributed DB Practice',
    accent: '#7c3aed',
  },
  {
    id: 'h-04',
    tag: 'CHAPTER 04',
    category: 'Global Engineering GCC Incubation',
    title: 'Turnkey Technology Hubs in Bangalore & Hyderabad',
    description: 'Assembling complete 50-person engineering centers with Managing Directors, Product Managers, and high-concurrency Staff Leads in under 75 days.',
    metric: '75 Days',
    metricLabel: 'Full Squad Incubation SLA',
    badge: 'GCC Scale Practice',
    accent: '#16a34a',
  },
];

export const LightHorizontalStory: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !triggerRef.current) return;

    const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel');

    const ctx = gsap.context(() => {
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${sectionRef.current ? sectionRef.current.offsetWidth : 3000}`,
        },
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="theme-light" style={{ overflow: 'hidden', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderBottom: '1px solid var(--nt-border, #e2e8f0)' }}>
      <section
        style={{
          padding: '4rem 2rem 2rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
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
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={14} />
          S02 & S03 Horizontal Full-Screen Panels with Parallax
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)' }}>
          Explore Key Architectural Practices
        </h2>
        <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1rem', marginTop: '0.5rem' }}>
          Scroll down vertically to journey horizontally through our core engineering specializations.
        </p>
      </section>

      {/* Horizontal Panels Wrapper */}
      <div
        ref={sectionRef}
        style={{
          display: 'flex',
          width: `${chapters.length * 100}vw`,
          height: '75vh',
          position: 'relative',
        }}
      >
        {chapters.map((chap, idx) => (
          <div
            key={chap.id}
            className="horizontal-panel"
            style={{
              width: '100vw',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 4rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '1000px',
                backgroundColor: 'var(--nt-surface, #ffffff)',
                borderRadius: '28px',
                border: '1px solid var(--nt-border, #e2e8f0)',
                padding: '3.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: chap.accent, letterSpacing: '0.05em' }}>
                    {chap.tag}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: `${chap.accent}12`,
                      color: chap.accent,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      border: `1px solid ${chap.accent}30`,
                    }}
                  >
                    {chap.badge}
                  </span>
                </div>

                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {chap.category}
                </div>

                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', lineHeight: 1.25, marginBottom: '1rem' }}>
                  {chap.title}
                </h3>

                <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {chap.description}
                </p>

                <Link
                  to="/employers"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: chap.accent,
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  }}
                >
                  <span>Request Domain Shortlist</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right Side Visual Block */}
              <div
                style={{
                  backgroundColor: 'var(--nt-surface-2, #f8fafc)',
                  borderRadius: '20px',
                  border: '1px solid var(--nt-border, #e2e8f0)',
                  padding: '2.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    backgroundColor: `${chap.accent}15`,
                    color: chap.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                  }}
                >
                  {idx === 0 && <Database size={30} />}
                  {idx === 1 && <BrainCircuit size={30} />}
                  {idx === 2 && <Layers size={30} />}
                  {idx === 3 && <Globe2 size={30} />}
                </div>

                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', lineHeight: 1 }}>
                  {chap.metric}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                  {chap.metricLabel}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <ShieldCheck size={16} />
                  <span>Backed by 90-Day Unconditional Warranty</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
