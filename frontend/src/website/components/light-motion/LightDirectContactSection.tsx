import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const LightDirectContactSection: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            <span>30 / 40 · EXECUTIVE ADVISORY INTAKE</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '0.75rem' }}>
            Speak Directly with a Practice Lead
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Connect with a Senior Managing Partner who understands your technical architecture and compensation bands.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Details Panel */}
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>
              Direct Executive Access
            </h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Zero junior account coordinators. Every conversation is handled by former engineering leaders with deep networks across Bangalore, Hyderabad, London, and Silicon Valley.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Direct Partner Desk</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>partners@nexatalent.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Priority Hotline</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>+91 (80) 4122-8900</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>India Headquarters</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>Indiranagar, Bangalore · 560038</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <motion.div
            whileHover={{ y: -4 }}
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              padding: '3rem 2.5rem',
              boxShadow: '0 20px 45px -15px rgba(0,0,0,0.06)',
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Inquiry Dispatched
                </h4>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  A Practice Lead will contact your office within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Vikramaditya Sharma"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Corporate Work Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="v.sharma@enterprise.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Hiring Objective / Mandate Details:
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Outline your tech stack, hiring timeline, or GCC buildout goals..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.875rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    marginTop: '0.5rem',
                  }}
                >
                  <Send size={16} />
                  <span>Connect with Practice Lead</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
