import { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
}

/**
 * Image that never shows a broken icon or a half-cropped face:
 * - fixed aspect container handled by caller (aspect-* + w-full)
 * - object-cover + object-top keeps faces/heads in frame (not center-cropped)
 * - on error swaps to a clean branded gradient placeholder
 */
export function SafeImage({ src, alt, fallbackLabel, className = '', ...rest }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 text-center ${className}`}
        style={{ aspectRatio: '16 / 10' }}
      >
        <div className="px-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">NexaTalent</p>
          <p className="mt-1 text-sm font-extrabold text-slate-700">{fallbackLabel || alt || 'NexaTalent delivery team'}</p>
        </div>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
