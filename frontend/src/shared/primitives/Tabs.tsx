import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, onChange }) => {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || tabs[0]?.id || '');

  const handleSelect = (id: string) => {
    setActiveTabId(id);
    onChange?.(id);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div style={{ width: '100%' }}>
      {/* Tab List */}
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all 0.15s ease',
                fontFamily: 'var(--font-family-sans)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div role="tabpanel">
        {activeTab?.content}
      </div>
    </div>
  );
};
