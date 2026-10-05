import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutDashboard, CheckCircle2, Clock, Users, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const LightDashboardAssembly: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !boardRef.current) return;

    const ctx = gsap.context(() => {
      // Pin and assemble dashboard pieces as user scrolls
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 20%',
          end: '+=1200',
          pin: true,
          scrub: 1,
        },
      });

      // Assemble pieces from various offsets into natural layout
      tl.from('.dash-piece-top', { y: -80, opacity: 0, scale: 0.95, duration: 1 }, 0)
        .from('.dash-piece-left', { x: -100, opacity: 0, duration: 1 }, 0.2)
        .from('.dash-piece-right', { x: 100, opacity: 0, duration: 1 }, 0.3)
        .from('.dash-piece-bottom', { y: 80, opacity: 0, duration: 1 }, 0.4);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        color: 'var(--nt-ink, #0f172a)',
        padding: '5rem 2rem',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              fontSize: '0.8125rem',
              fontWeight: 800,
              color: '#0265FF',
              marginBottom: '1rem',
            }}
          >
            <LayoutDashboard size={14} />
            <span>REAL-TIME HIRING TELEMETRY DASHBOARD</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F172A' }}>
            Real-Time Talent Operating Platform
          </h2>
          <p style={{ color: '#475569', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Our automated hiring engine streamlines candidate sourcing, technical vetting, and SLA tracking in real time.
          </p>
        </div>

        {/* Assembling Dashboard Container */}
        <div
          ref={boardRef}
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            borderRadius: '24px',
            backgroundColor: 'var(--nt-surface-2, #f8fafc)',
            border: '1px solid #cbd5e1',
            padding: '2.5rem',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Top Piece: SLA Status Bar */}
          <div
            className="dash-piece-top"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              borderRadius: '16px',
              padding: '1.25rem 1.75rem',
              border: '1px solid var(--nt-border, #e2e8f0)',
              boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16a34a', boxShadow: '0 0 8px #16a34a' }} />
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>Live Client SLA Engine</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--nt-muted, #64748b)', marginLeft: '0.5rem' }}>Active Mandates: 4</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontSize: '0.8125rem', fontWeight: 700 }}>
                <Clock size={15} />
                <span>Next Shortlist: 14h 22m remaining</span>
              </div>
              <Link
                to="/portals/employer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: '#2563eb',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                <span>Launch Portal</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Middle Row: Left & Right Split Pieces */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Left Piece: Active Candidate Pipeline */}
            <div
              className="dash-piece-left"
              style={{
                backgroundColor: 'var(--nt-surface, #ffffff)',
                borderRadius: '18px',
                border: '1px solid var(--nt-border, #e2e8f0)',
                padding: '1.75rem',
                boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>
                  Calibrated Candidate Bench
                </h4>
                <Users size={18} color="#2563eb" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Arjun M.', role: 'Staff SRE / eBPF', match: '98%', status: 'Technical Debrief Ready' },
                  { name: 'Sarah L.', role: 'Principal DB Architect', match: '96%', status: 'Interview Stage 2' },
                  { name: 'Karthik V.', role: 'Head of Infrastructure', match: '94%', status: 'Offer Lock Pending' },
                ].map((c, idx) => (
                  <div key={idx} style={{ padding: '0.85rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '12px', border: '1px solid var(--nt-border, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--nt-ink, #0f172a)' }}>{c.name} · {c.role}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--nt-muted, #64748b)', marginTop: '0.15rem' }}>{c.status}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                      {c.match} Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Piece: Performance Gauges */}
            <div
              className="dash-piece-right"
              style={{
                backgroundColor: 'var(--nt-surface, #ffffff)',
                borderRadius: '18px',
                border: '1px solid var(--nt-border, #e2e8f0)',
                padding: '1.75rem',
                boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>
                    SLA Velocity Metrics
                  </h4>
                  <Activity size={18} color="#16a34a" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '12px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--nt-muted, #64748b)', textTransform: 'uppercase', fontWeight: 700 }}>Avg First Shortlist</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginTop: '0.25rem' }}>36h</div>
                    <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>SLA Target: 48h</div>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '12px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--nt-muted, #64748b)', textTransform: 'uppercase', fontWeight: 700 }}>Pass Through Rate</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginTop: '0.25rem' }}>88%</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>3 of 4 Advance</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>Zero Candidate Leakage Defense Active</span>
              </div>
            </div>
          </div>

          {/* Bottom Piece: Verification Bar */}
          <div
            className="dash-piece-bottom"
            style={{
              backgroundColor: '#ecfdf5',
              borderRadius: '16px',
              padding: '1rem 1.5rem',
              border: '1px solid #a7f3d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.8125rem',
              color: '#065f46',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span><strong>SOC-2 Type II Certified:</strong> End-to-end encrypted candidate dossier sharing</span>
            </div>
            <span style={{ fontWeight: 700 }}>Synced 2 mins ago</span>
          </div>
        </div>
      </div>
    </section>
  );
};
