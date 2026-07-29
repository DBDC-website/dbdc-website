'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Container from '@/components/ui/Container';
import {
  pageHeaderContainerVariants,
  pageHeaderItemVariants,
  popInVariants,
} from '@/lib/motion';
import { cn } from '@/lib/cn';

type AnimatedPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional full-bleed background photo. */
  backgroundImage?: {
    src: string;
    alt?: string;
    objectPosition?: string;
  };
  /**
   * `sanctuary` — dark glass treatment.
   * `cathedral` — light wood / cream chapel treatment with mosaic blue–gold accents.
   * `default` — navy brand banner.
   */
  theme?: 'default' | 'sanctuary' | 'cathedral';
  /** Extra classes for the inner content container (padding, etc.). */
  contentClassName?: string;
  align?: 'left' | 'center';
};

export default function AnimatedPageHeader({
  eyebrow,
  title,
  description,
  backgroundImage,
  theme = 'default',
  contentClassName,
  align = 'left',
}: AnimatedPageHeaderProps) {
  const reduceMotion = useReducedMotion();
  const isSanctuary = theme === 'sanctuary';
  const isCathedral = theme === 'cathedral';
  const isCentered = align === 'center';

  const eyebrowClass = cn(
    isCathedral
      ? 'text-xs font-semibold uppercase tracking-[0.22em] text-brand-950 [text-shadow:0_0_18px_rgba(255,255,255,1),0_0_36px_rgba(255,252,245,0.95),0_1px_2px_rgba(255,255,255,0.9)]'
      : isSanctuary
        ? 'text-xs font-semibold uppercase tracking-[0.22em] text-gold-200'
        : 'text-xs font-semibold uppercase tracking-[0.2em] text-gold-300',
  );

  const titleClass = cn(
    isCathedral
      ? 'mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight text-brand-950 [text-shadow:0_0_20px_rgba(255,255,255,1),0_0_42px_rgba(255,252,245,0.95),0_0_72px_rgba(255,248,235,0.85),0_1px_3px_rgba(255,255,255,1)] sm:text-5xl lg:text-6xl'
      : isSanctuary
        ? 'mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl'
        : 'mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl',
    isCentered && 'mx-auto',
  );

  const descriptionClass = cn(
    isCathedral
      ? 'mt-5 max-w-2xl text-base font-bold leading-relaxed text-brand-900 [text-shadow:0_0_16px_rgba(255,255,255,1),0_0_36px_rgba(255,252,245,0.95),0_0_64px_rgba(255,248,235,0.8),0_1px_2px_rgba(255,255,255,1)] sm:text-lg lg:text-xl'
      : isSanctuary
        ? 'mt-5 max-w-2xl text-base font-bold leading-relaxed text-cream-50/95 sm:text-lg lg:text-xl'
        : 'mt-5 max-w-2xl text-lg font-bold leading-relaxed text-cream-100/90 sm:text-xl',
    isCentered && 'mx-auto',
  );

  const ruleClass = cn(
    isCathedral
      ? 'mt-8 h-px w-24 bg-gradient-to-r from-[#d2a73c] via-[#00a0dc] to-transparent'
      : isSanctuary
        ? 'mt-8 h-px w-24 bg-gradient-to-r from-gold-300 via-[#00a0dc]/70 to-transparent'
        : 'mt-8 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent',
    isCentered && 'mx-auto',
  );

  const descriptionVariants = {
    hidden: popInVariants.hidden,
    visible: {
      ...popInVariants.visible,
      transition: {
        ...popInVariants.visible.transition,
        delay: 0.18,
      },
    },
  };

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden',
        isCathedral
          ? 'bg-[#f3e4d0]'
          : isSanctuary
            ? 'bg-[#061018]'
            : 'bg-brand-900',
      )}
    >
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: backgroundImage.objectPosition ?? 'center center',
            }}
          />
          <div
            className={cn(
              'absolute inset-0',
              isCathedral
                ? 'bg-gradient-to-b from-transparent via-transparent to-[#f3e4d0]/35'
                : isSanctuary
                  ? 'bg-gradient-to-r from-[#02080f]/88 via-[#061018]/62 to-[#061018]/35'
                  : 'bg-brand-900/55',
            )}
            aria-hidden="true"
          />
          <div
            className={cn(
              'absolute inset-0',
              isCathedral
                ? 'bg-[radial-gradient(ellipse_at_50%_38%,rgba(255,252,245,0.72)_0%,rgba(255,248,235,0.45)_32%,transparent_58%)]'
                : isSanctuary
                  ? 'bg-gradient-to-t from-[#02080f]/90 via-transparent to-[#02080f]/45'
                  : 'bg-gradient-to-b from-brand-900/20 via-transparent to-brand-950/40',
            )}
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(224,189,96,0.18),transparent_50%),radial-gradient(circle_at_85%_80%,rgba(143,179,154,0.12),transparent_55%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-900/20 via-transparent to-brand-950/30"
            aria-hidden="true"
          />
        </>
      )}

      <Container
        size="wide"
        className={cn(
          'relative py-16 sm:py-20 lg:py-28',
          isCentered && 'text-center',
          contentClassName,
        )}
      >
        {reduceMotion ? (
          <>
            {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
            <h1 className={titleClass}>{title}</h1>
            {description ? <p className={descriptionClass}>{description}</p> : null}
            <div className={ruleClass} aria-hidden="true" />
          </>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={pageHeaderContainerVariants}
          >
            {eyebrow ? (
              <motion.p variants={pageHeaderItemVariants} className={eyebrowClass}>
                {eyebrow}
              </motion.p>
            ) : null}
            <motion.h1 variants={pageHeaderItemVariants} className={titleClass}>
              {title}
            </motion.h1>
            {description ? (
              <motion.p variants={descriptionVariants} className={descriptionClass}>
                {description}
              </motion.p>
            ) : null}
            <motion.div
              variants={pageHeaderItemVariants}
              className={ruleClass}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </Container>
    </div>
  );
}
