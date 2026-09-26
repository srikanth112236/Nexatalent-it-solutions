import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Move } from 'lucide-react';

const WORDS = ['NEXATALENT', 'LEADERSHIP', 'DISTRIBUTED', 'GLOBAL GCC'];

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
}

export const SignatureParticleTextMorph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wordIdx, setWordIdx] = useState<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; radius: number }>({ x: -1000, y: -1000, radius: 80 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = 300);

    const initWord = (text: string) => {
      // Temporary canvas to sample text pixel positions
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      offCtx.fillStyle = '#000000';
      offCtx.font = `900 ${Math.min(width / 7.5, 72)}px system-ui, -apple-system, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, width / 2, height / 2);

      const imgData = offCtx.getImageData(0, 0, width, height).data;
      const newParticles: Particle[] = [];
      const step = 6; // sampling density

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          if (imgData[index + 3] > 128) {
            newParticles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              color: x > width / 2 ? '#2563eb' : '#4f46e5'
            });
          }
        }
      }

      particlesRef.current = newParticles;
    };

    initWord(WORDS[wordIdx]);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Spring force towards origin
        const dx = p.originX - p.x;
        const dy = p.originY - p.y;
        p.vx += dx * 0.05;
        p.vy += dy * 0.05;

        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(mdy, mdx);
          p.vx += Math.cos(angle) * force * 15;
          p.vy += Math.sin(angle) * force * 15;
        }

        // Friction damping
        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        // Render particle dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      initWord(WORDS[wordIdx]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [wordIdx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  const nextWord = () => {
    setWordIdx((prev) => (prev + 1) % WORDS.length);
  };

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Move className="w-3.5 h-3.5 text-blue-600" />
            <span>Signature Component 49 • Interactive Physics Particle Morph</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Interactive Physics Particle Typography
          </h2>
          <p className="text-lg text-slate-600">
            Hover your cursor to repel the physics particles. Click the morph button to cycle the headline across talent vectors.
          </p>
        </div>

        {/* Canvas Display Frame */}
        <div className="max-w-4xl mx-auto rounded-3xl p-6 md:p-8 bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Canvas 2D Particle Spring Physics Active</span>
            </div>
            <button
              onClick={nextWord}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Morph to Next Archetype</span>
            </button>
          </div>

          <div className="w-full h-[300px] flex items-center justify-center cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-slate-400">
            <span>Current Archetype:</span>
            <strong className="text-blue-600 font-mono text-sm">{WORDS[wordIdx]}</strong>
          </div>
        </div>

      </div>
    </section>
  );
};
