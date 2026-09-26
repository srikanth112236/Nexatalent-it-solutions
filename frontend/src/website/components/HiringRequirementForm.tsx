import React, { useState } from 'react';
import { Sparkles, Zap, FileCheck } from 'lucide-react';

export interface HiringRequirementFormProps {
  title?: string;
  subtitle?: string;
  onSubmitMandate?: (mandate: any) => void;
}

export const HiringRequirementForm: React.FC<HiringRequirementFormProps> = ({
  title = 'Configure Your Technical Mandate',
  subtitle = 'Submit your hiring specifications to initiate our 48-hour calibration shortlist SLA.',
  onSubmitMandate,
}) => {
  const [roleTitle, setRoleTitle] = useState('');
  const [seniority, setSeniority] = useState('Staff Engineer');
  const [headcount, setHeadcount] = useState('1 - 2 Engineers');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [budget, setBudget] = useState('₹50L - ₹80L (or $120k - $160k)');
  const [urgency, setUrgency] = useState('Within 14 Days (Priority)');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Golang', 'Kubernetes']);
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableSkills = [
    'Golang',
    'Rust',
    'Kubernetes',
    'Distributed Systems',
    'Python / PyTorch',
    'TypeScript / React',
    'Kafka / Event-Driven',
    'AWS / Cloud Native',
    'C++ / High Frequency',
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmitMandate?.({
      roleTitle,
      seniority,
      headcount,
      location,
      budget,
      urgency,
      skills: selectedSkills,
      contactEmail,
    });
  };

  return (
    <div
      style={{
        borderRadius: 'var(--radius-2xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '3rem 2.5rem',
        maxWidth: '850px',
        margin: '0 auto',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(17, 23, 38, 0.9) 100%)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.875rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            fontSize: '0.8125rem',
            color: 'var(--color-primary-400)',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <Zap size={14} />
          Fast-Track Client Intake
        </div>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
          {subtitle}
        </p>
      </div>

      {isSubmitted ? (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(34, 197, 94, 0.08)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <FileCheck size={48} color="var(--color-success)" style={{ margin: '0 auto 1.25rem auto' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Mandate Intake Registered
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
            Your mandate for <strong style={{ color: 'var(--color-text)' }}>{roleTitle || 'Senior Technical Talent'}</strong> has been assigned to our Specialized Engineering Squad. We have sent the confirmation packet and SLA guarantee to <strong style={{ color: 'var(--color-text)' }}>{contactEmail}</strong>.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary-400)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} />
            Shortlist Delivery Target: Within 48 Hours
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Target Role & Seniority */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Target Role Title *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Lead SRE / Distributed DB Architect"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Seniority Level
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              >
                <option value="Senior Engineer (4-7 yrs)">Senior Engineer (4-7 yrs)</option>
                <option value="Staff Engineer (7-10 yrs)">Staff Engineer (7-10 yrs)</option>
                <option value="Principal Engineer (10-14 yrs)">Principal Engineer (10-14 yrs)</option>
                <option value="Engineering Manager / Director">Engineering Manager / Director</option>
                <option value="VP of Engineering / CTO">VP of Engineering / CTO</option>
              </select>
            </div>
          </div>

          {/* Key Technical Skills Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
              Required Core Technologies & Domains
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableSkills.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: '0.45rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      border: selected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: selected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: selected ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {selected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Budget */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Location / Hub
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              >
                <option value="Bangalore / Hybrid">Bangalore / Hybrid</option>
                <option value="Hyderabad / Hybrid">Hyderabad / Hybrid</option>
                <option value="Pune / Hybrid">Pune / Hybrid</option>
                <option value="Remote (India)">Remote (India)</option>
                <option value="Global Remote (Worldwide)">Global Remote (Worldwide)</option>
                <option value="London / Europe">London / Europe</option>
                <option value="US / Bay Area / NYC">US / Bay Area / NYC</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Target Budget / Band
              </label>
              <input
                type="text"
                placeholder="e.g. ₹50L - ₹80L"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Headcount Needed
              </label>
              <select
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              >
                <option value="1 Engineer">1 Engineer</option>
                <option value="2 - 5 Engineers">2 - 5 Engineers</option>
                <option value="5 - 15 Engineers">5 - 15 Engineers</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Hiring Velocity Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              >
                <option value="Immediate SLA (72-hour delivery)">Immediate SLA (72-hour delivery)</option>
                <option value="Within 14 Days (Priority)">Within 14 Days (Priority)</option>
                <option value="Standard 30 Days">Standard 30 Days</option>
                <option value="Confidential Executive Search">Confidential Executive Search</option>
              </select>
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
              Your Enterprise Email (For Shortlist Delivery) *
            </label>
            <input
              required
              type="email"
              placeholder="lead@company.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            style={{
              padding: '0.875rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Sparkles size={16} />
            <span>Launch Mandate with 48h Shortlist SLA</span>
          </button>
        </form>
      )}
    </div>
  );
};
