import React, { useEffect, useRef, useState } from 'react';
import { Network, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface TalentNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  city: string;
  country: string;
  roles: number;
  specialty: string;
  color: string;
}

export const LightInteractiveNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<TalentNode | null>(null);

  const nodes: TalentNode[] = [
    { id: 'blr', x: 260, y: 180, radius: 24, city: 'Bangalore', country: 'India', roles: 142, specialty: 'Distributed Systems & Core DBs', color: '#2563eb' },
    { id: 'hyd', x: 380, y: 130, radius: 20, city: 'Hyderabad', country: 'India', roles: 98, specialty: 'Cloud Native & Hyperscalers', color: '#0891b2' },
    { id: 'pune', x: 210, y: 270, radius: 18, city: 'Pune', country: 'India', roles: 54, specialty: 'Automotive & Embedded Linux', color: '#7c3aed' },
    { id: 'lon', x: 550, y: 160, radius: 22, city: 'London', country: 'UK', roles: 48, specialty: 'HFT & Quantitative Finance', color: '#ea580c' },
    { id: 'sf', x: 740, y: 220, radius: 26, city: 'San Francisco', country: 'USA', roles: 86, specialty: 'Foundation AI & LLM Systems', color: '#16a34a' },
    { id: 'rem', x: 490, y: 290, radius: 20, city: 'Global Remote', country: 'Worldwide', roles: 64, specialty: 'Asynchronous Principal Engineers', color: '#2563eb' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Animated signal packet along the line
          const progress = (Math.sin(time + i + j) + 1) / 2;
          const packetX = n1.x + (n2.x - n1.x) * progress;
          const packetY = n1.y + (n2.y - n1.y) * progress;

          ctx.beginPath();
          ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
          ctx.fillStyle = n1.color;
          ctx.fill();
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const pulse = Math.sin(time * 2) * 3;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6 + (isHovered ? 6 : pulse), 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}15`;
        ctx.fill();

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isHovered ? 4 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? node.color : '#ffffff';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        // Node Label Text
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = isHovered ? '#ffffff' : '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.city.substring(0, 3).toUpperCase(), node.x, node.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const matched = nodes.find((node) => {
      const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
      return dist <= node.radius + 10;
    });

    setHoveredNode(matched || null);
  };

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
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
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <Network size={14} />
            S06 & E03 Interactive Talent Network Activation
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Live Cross-Border Engineering Network
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Hover over global talent hub nodes to inspect calibrated engineering clusters, live active mandates, and specialization rubrics.
          </p>
        </div>

        {/* Network Canvas & Details Overlay */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '2.5rem',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* Interactive Canvas */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <canvas
              ref={canvasRef}
              width={820}
              height={440}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredNode(null)}
              style={{
                width: '100%',
                maxWidth: '680px',
                height: 'auto',
                cursor: 'pointer',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            />
          </div>

          {/* Node Inspector Panel */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={16} color="#2563eb" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                Real-Time Node Telemetry
              </span>
            </div>

            {hoveredNode ? (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: `2px solid ${hoveredNode.color}`,
                  borderRadius: '20px',
                  padding: '2rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                      {hoveredNode.city}
                    </h3>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{hoveredNode.country}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      backgroundColor: `${hoveredNode.color}15`,
                      color: hoveredNode.color,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {hoveredNode.roles} Active Mandates
                  </span>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  <strong>Practice Domain:</strong> {hoveredNode.specialty}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span>Ex-FAANG / Tier-1 Principal Engineer Panel</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span>Guaranteed 48h Shortlist SLA Delivery</span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  textAlign: 'center',
                }}
              >
                <MapPin size={36} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Hover Any Node on Canvas
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                  Move your cursor over Bangalore, Hyderabad, London, or San Francisco to inspect live regional engineering pods.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
