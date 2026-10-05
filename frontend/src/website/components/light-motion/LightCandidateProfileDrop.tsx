import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, UploadCloud, CheckCircle2, ShieldCheck, FileText, Lock } from 'lucide-react';

export const LightCandidateProfileDrop: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileName(e.dataTransfer.files[0].name);
      setIsSuccess(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setIsSuccess(true);
    }
  };

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center' }}>
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
          <span>NEXATALENT CONFIDENTIAL TALENT INTAKE</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
          Confidential Career Representation
        </h2>
        <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 3.5rem auto', lineHeight: 1.6 }}>
          Submit your profile directly to our Senior Partners. Zero automated resume broadcasts, strict NDA enforcement, and uncompromised privacy.
        </p>

        {/* Dropzone Container */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? '#2563eb' : isSuccess ? '#16a34a' : '#cbd5e1',
            backgroundColor: isDragging ? '#eff6ff' : isSuccess ? '#f0fdf4' : '#f8fafc',
          }}
          style={{
            border: '2px dashed',
            borderRadius: '24px',
            padding: '4rem 2rem',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
            marginBottom: '2rem',
          }}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              zIndex: 2,
            }}
          />

          <div style={{ pointerEvents: 'none' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: isSuccess ? '#dcfce7' : '#eff6ff',
                color: isSuccess ? '#16a34a' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              {isSuccess ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
            </div>

            {isSuccess ? (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.35rem' }}>
                  Dossier Received: {fileName}
                </h3>
                <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '0.875rem' }}>
                  Senior Practice Lead assigned. Calibration review within 24 business hours.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.35rem' }}>
                  Drag & Drop Your Engineering CV or GitHub Dossier
                </h3>
                <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Supported formats: PDF, DOCX (Max 15MB)
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--nt-surface, #ffffff)', border: '1px solid #cbd5e1', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--nt-ink-2, #334155)' }}>
                  <FileText size={14} color="#2563eb" />
                  <span>Select Local File</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Ethical Charter Guarantees */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', color: 'var(--nt-muted, #475569)', fontSize: '0.875rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={16} color="#2563eb" />
            <span>Strict NDA Guarantee: Profile never shared without explicit consent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Zero Spam: Direct communication with Practice Lead</span>
          </div>
        </div>
      </div>
    </section>
  );
};
