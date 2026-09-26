import React, { useState } from 'react';
import { cn } from '../utils';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const sizePixels: Record<AvatarSize, number> = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const px = sizePixels[size];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center select-none overflow-hidden', className)}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-primary)',
        fontWeight: 700,
        fontSize: `${px * 0.38}px`,
      }}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
