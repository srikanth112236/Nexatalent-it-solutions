import React from 'react';
import { cn } from '../utils';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-sm)',
  className,
}) => {
  return (
    <div
      className={cn('skeleton-pulse', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        backgroundColor: 'var(--color-surface-raised)',
        opacity: 0.6,
      }}
    />
  );
};
