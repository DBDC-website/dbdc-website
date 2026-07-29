'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';
import Container from './Container';
import SectionParallaxBackground from '@/components/motion/SectionParallaxBackground';

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'muted' | 'brand' | 'cream' | 'sage';
  spacing?: 'default' | 'compact' | 'generous';
  containerSize?: 'default' | 'narrow' | 'wide';
  bleed?: boolean;
  withBackground?: boolean;
  /** Replaces the default parallax photo when provided. */
  backdrop?: React.ReactNode;
  /** Overrides the tone wash over the backdrop. */
  overlayClassName?: string;
  /** Allow hover lifts / scaled children to paint outside the section. */
  overflowVisible?: boolean;
  'aria-labelledby'?: string;
  id?: string;
};

const toneOverlayMap: Record<NonNullable<AnimatedSectionProps['tone']>, string> = {
  default:
    'bg-gradient-to-b from-cream-50/94 via-cream-50/90 to-cream-50/94',
  cream:
    'bg-gradient-to-b from-cream-100/93 via-cream-100/88 to-cream-100/93',
  sage:
    'bg-gradient-to-b from-sage-50/92 via-sage-50/88 to-sage-50/92',
  muted:
    'bg-gradient-to-b from-cream-100/90 via-cream-100/86 to-cream-100/90',
  brand: 'bg-brand-900/95',
};

const textToneMap: Record<NonNullable<AnimatedSectionProps['tone']>, string> = {
  default: 'text-stone-800',
  cream: 'text-stone-800',
  sage: 'text-stone-800',
  muted: 'text-stone-800',
  brand: 'text-stone-100',
};

const spacingMap: Record<NonNullable<AnimatedSectionProps['spacing']>, string> = {
  default: 'py-16 sm:py-20 lg:py-24',
  compact: 'py-10 sm:py-12',
  generous: 'py-20 sm:py-28 lg:py-36',
};

export default function AnimatedSection({
  children,
  className,
  tone = 'default',
  spacing = 'default',
  containerSize = 'default',
  bleed = false,
  withBackground = true,
  backdrop,
  overlayClassName,
  overflowVisible = false,
  id,
  ...rest
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        'relative isolate',
        overflowVisible ? 'overflow-visible' : 'overflow-hidden',
        textToneMap[tone],
        spacingMap[spacing],
        className,
      )}
      {...rest}
    >
      {backdrop ? (
        <div className="absolute inset-0 z-0">{backdrop}</div>
      ) : withBackground && tone !== 'brand' ? (
        <SectionParallaxBackground sectionRef={sectionRef} />
      ) : null}

      <div
        className={cn(
          'absolute inset-0 z-0',
          overlayClassName ?? toneOverlayMap[tone],
        )}
        aria-hidden="true"
      />

      {bleed ? (
        <div className="relative z-10">{children}</div>
      ) : (
        <Container size={containerSize} className="relative z-10">
          {children}
        </Container>
      )}
    </section>
  );
}
