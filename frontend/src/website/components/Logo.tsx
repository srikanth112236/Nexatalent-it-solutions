import React from 'react';

export interface LogoProps {
  /** Rendered height in px. Width scales automatically. */
  height?: number;
  /**
   * Set true when placed on a dark background.
   */
  onDark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Single source of truth for the NexaTalent IT Solutions brand mark.
 * Serves the tightly trimmed transparent PNG for maximum clarity and presence.
 */
export const Logo: React.FC<LogoProps> = ({ height = 48, onDark = false, className, style }) => {
  const img = (
    <img
      src="/logo-trimmed.png"
      alt="NexaTalent IT Solutions — Your Talent | Our Technology | A Better Tomorrow"
      height={height}
      style={{
        height,
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'block',
        imageRendering: 'auto',
        ...style,
      }}
      className={className}
    />
  );

  if (!onDark) return img;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: '6px 12px',
        lineHeight: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {img}
    </span>
  );
};
