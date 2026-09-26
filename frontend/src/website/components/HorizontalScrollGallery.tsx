import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface GalleryItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  link?: string;
}

export interface HorizontalScrollGalleryProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  items?: GalleryItem[];
}

export const HorizontalScrollGallery: React.FC<HorizontalScrollGalleryProps> = ({
  badge = 'Impact Showcase',
  title = 'Engineered Across High-Performance Engineering Disciplines',
  subtitle = 'Swipe through key architectural domains where NexaTalent consistently delivers market-beating talent outcomes.',
  items = [
    {
      id: 'dist-sys',
      badge: 'Core Infrastructure',
      title: 'High-Throughput Distributed Engines',
      description: 'Placing Staff and Principal architects scaling consensus protocols (Raft, Paxos) and storage engines with zero downtime.',
      stat: '99.999%',
      statLabel: 'System Availability Target',
      link: '/industries/cloud-infrastructure',
    },
    {
      id: 'hft-quant',
      badge: 'Financial Systems',
      title: 'Sub-Microsecond Low Latency Trading',
      description: 'Kernel-bypass networking, FPGA acceleration, and modern C++20 specialists for Tier-1 proprietary trading firms.',
      stat: '< 850ns',
      statLabel: 'Execution Latency Threshold',
      link: '/industries/fintech-crypto',
    },
    {
      id: 'gen-ai',
      badge: 'AI Systems',
      title: 'LLM Fine-Tuning & Inference Clusters',
      description: 'Engineers orchestrating distributed vLLM clusters, Megatron-LM scaling, and GPU memory optimization.',
      stat: '10x',
      statLabel: 'Inference Throughput Boost',
      link: '/industries/ai-machine-learning',
    },
    {
      id: 'gcc-scale',
      badge: 'Global Scale',
      title: 'Turnkey India GCC Hub Incubation',
      description: 'Assembling 50-person engineering centers in Bangalore and Hyderabad with complete leadership and squad pods.',
      stat: '75 Days',
      statLabel: 'Full Team Deployment SLA',
      link: '/industries/gcc-india',
    },
  ],
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with Navigation Arrows */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-primary-400)',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={14} />
              {badge}
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)' }}>
              {title}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', maxWidth: '640px' }}>
              {subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '1.5rem',
            scrollbarWidth: 'none',
            scrollSnapType: 'x mandatory',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                flex: '0 0 360px',
                borderRadius: 'var(--radius-2xl)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                scrollSnapAlign: 'start',
                position: 'relative',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-primary-400)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    padding: '0.25rem 0.625rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                    marginBottom: '1rem',
                  }}
                >
                  {item.badge}
                </span>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    lineHeight: 1.35,
                    marginBottom: '0.75rem',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}
                >
                  {item.description}
                </p>
              </div>

              {/* Metric Box & Link */}
              <div>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
                    {item.stat}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                    {item.statLabel}
                  </div>
                </div>

                {item.link && (
                  <Link
                    to={item.link}
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
                    <span>Explore Practice</span>
                    <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
