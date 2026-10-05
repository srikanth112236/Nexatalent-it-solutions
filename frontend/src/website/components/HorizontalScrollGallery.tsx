import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  subtitle = 'Swipe through key architectural domains where NexaTalent IT Solutions consistently delivers market-beating talent outcomes.',
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>('.gallery-panel');
    
    // Create the horizontal scroll animation
    const tween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        end: () => `+=${containerRef.current?.offsetWidth || 0}`,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }
        }
      },
    });

    // Panel entrance animations (opacity/scale as they enter view)
    sections.forEach((panel) => {
      gsap.fromTo(
        panel,
        { opacity: 0.5, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: 'left center',
            end: 'right center',
            scrub: true,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (sectionRef.current) {
      // For GSAP horizontal scroll, clicking a button should ideally scroll the window vertically.
      // We estimate the amount to scroll vertically to correspond to one panel width horizontally.
      const panelWidth = window.innerWidth * 0.8; 
      const scrollAmount = direction === 'left' ? -panelWidth : panelWidth;
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} style={{ padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
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

          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll back"
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
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll forward"
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
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '2rem', borderRadius: '1px' }}>
          <div ref={progressRef} style={{ width: '0%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '1px' }} />
        </div>

        {/* Scrollable Container (GSAP handles transform) */}
        <div style={{ width: '100%', overflow: 'visible' }}>
          <div
            ref={containerRef}
            style={{
              display: 'flex',
              gap: '1.5rem',
              width: `${items.length * 100}%`,
              flexWrap: 'nowrap',
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="gallery-panel"
                style={{
                  width: '360px',
                  flexShrink: 0,
                  borderRadius: 'var(--radius-2xl)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: 'var(--shadow-md)',
                  transformOrigin: 'center center',
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
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-primary-400)'; }}
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
      </div>
    </section>
  );
};
