'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { ProjectPlaceholderStyle } from '@/constants/projectPlaceholders';

type PlaceholderImageProps = {
  alt: string;
  src?: string;
  /** Tailwind gradient classes when no src is provided, e.g. "from-brand-200 to-sage-200". */
  gradient?: string;
  /** Visible placeholder label shown until final photography is provided. */
  label?: string;
  sublabel?: string;
  style?: ProjectPlaceholderStyle;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** How the image fills its container when `src` is set. */
  fit?: 'cover' | 'contain';
  /** Intrinsic dimensions for `fit="contain"` — preserves natural aspect ratio. */
  width?: number;
  height?: number;
  /** Optional gradient overlay on photographic images. */
  overlay?: boolean;
};

const styleOverlay: Record<ProjectPlaceholderStyle, string> = {
  heritage:
    'bg-[radial-gradient(circle_at_30%_20%,rgba(212,167,60,0.2),transparent_55%)]',
  construction:
    'bg-[repeating-linear-gradient(-45deg,transparent,transparent_12px,rgba(43,64,105,0.04)_12px,rgba(43,64,105,0.04)_24px)]',
  modern:
    'bg-[linear-gradient(135deg,transparent_60%,rgba(143,179,154,0.15)_100%)]',
};

const styleLabelTone: Record<ProjectPlaceholderStyle, string> = {
  heritage: 'text-gold-800',
  construction: 'text-brand-800',
  modern: 'text-brand-700',
};

function GradientFallback({
  alt,
  gradient,
  label,
  sublabel,
  style,
  className,
  showLabel,
}: {
  alt: string;
  gradient: string;
  label?: string;
  sublabel?: string;
  style: ProjectPlaceholderStyle;
  className?: string;
  showLabel: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'relative flex items-end overflow-hidden bg-gradient-to-br',
        gradient,
        className,
      )}
    >
      <div className={cn('absolute inset-0', styleOverlay[style])} aria-hidden="true" />

      {showLabel ? (
        <div className="relative w-full border-t border-white/40 bg-cream-50/75 px-4 py-3 backdrop-blur-[2px] sm:px-5 sm:py-4">
          <p
            className={cn(
              'text-[11px] font-semibold uppercase tracking-[0.2em]',
              styleLabelTone[style],
            )}
          >
            {label}
          </p>
          {sublabel ? (
            <p className="mt-1 text-xs text-stone-600 sm:text-sm">{sublabel}</p>
          ) : null}
          <p className="mt-2 text-[10px] uppercase tracking-wider text-stone-400">
            Placeholder image
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function PlaceholderImage({
  alt,
  src,
  gradient = 'from-brand-200 via-cream-100 to-sage-200',
  label,
  sublabel,
  style = 'modern',
  className,
  imageClassName,
  priority = false,
  fit = 'cover',
  width,
  height,
  overlay = true,
}: PlaceholderImageProps) {
  const [failed, setFailed] = useState(false);
  const showLabel = Boolean(label);

  if (!src || failed) {
    return (
      <GradientFallback
        alt={alt}
        gradient={gradient}
        label={label}
        sublabel={sublabel}
        style={style}
        className={className}
        showLabel={showLabel}
      />
    );
  }

  if (fit === 'contain') {
    return (
      <div className={cn('relative', className)}>
        <Image
          src={src}
          alt={alt}
          width={width ?? 1200}
          height={height ?? 800}
          className={cn('h-auto w-full object-contain', imageClassName)}
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority={priority}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', imageClassName)}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
        onError={() => setFailed(true)}
      />
      {overlay ? (
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-cream-50/10"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
