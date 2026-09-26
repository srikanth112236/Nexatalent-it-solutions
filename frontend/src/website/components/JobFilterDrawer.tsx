import React, { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

export interface JobFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: any) => void;
}

export const JobFilterDrawer: React.FC<JobFilterDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [selectedExperience, setSelectedExperience] = useState<string[]>(['5-8 Years']);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>(['Remote', 'Hybrid']);
  const [selectedCompBands, setSelectedCompBands] = useState<string[]>(['₹50L - ₹75L']);
  const [selectedStages, setSelectedStages] = useState<string[]>(['Global GCC / Enterprise']);

  if (!isOpen) return null;

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleReset = () => {
    setSelectedExperience([]);
    setSelectedWorkModes([]);
    setSelectedCompBands([]);
    setSelectedStages([]);
  };

  const handleApply = () => {
    onApplyFilters?.({
      experience: selectedExperience,
      workModes: selectedWorkModes,
      compBands: selectedCompBands,
      companyStages: selectedStages,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflowY: 'auto',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Filter Mandates
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Refine your exact career parameters
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Content Sections */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Work Mode */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
              Work Mode
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Remote (Global / India)', 'Hybrid (2-3 days office)', 'Onsite Prime Office'].map((mode) => (
                <label
                  key={mode}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedWorkModes.includes(mode)}
                    onChange={() => toggleItem(selectedWorkModes, setSelectedWorkModes, mode)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Range */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
              Experience Level
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['3-5 Years (Mid-Senior)', '5-8 Years (Senior)', '8-12 Years (Staff / Lead)', '12+ Years (Principal / Director)'].map((exp) => (
                <label
                  key={exp}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedExperience.includes(exp)}
                    onChange={() => toggleItem(selectedExperience, setSelectedExperience, exp)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{exp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Compensation Bands */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
              Compensation Band
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['₹30L - ₹50L ($60k - $90k)', '₹50L - ₹75L ($90k - $140k)', '₹75L - ₹1.2Cr ($140k - $200k)', '₹1.2Cr+ ($200k+ Executive)'].map((comp) => (
                <label
                  key={comp}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCompBands.includes(comp)}
                    onChange={() => toggleItem(selectedCompBands, setSelectedCompBands, comp)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{comp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Stage */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
              Company Scale
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Early Stage (Seed - Series A)', 'Growth Unicorn (Series B - E)', 'Global GCC / Enterprise', 'Public Tech Giant'].map((stage) => (
                <label
                  key={stage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedStages.includes(stage)}
                    onChange={() => toggleItem(selectedStages, setSelectedStages, stage)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{stage}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
          }}
        >
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleApply}
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <Check size={16} />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
