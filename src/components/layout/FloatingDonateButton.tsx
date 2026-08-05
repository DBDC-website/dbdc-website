'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import type { Locale } from '@/constants/i18n';
import { donateConfig } from '@/constants/donate';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type FloatingDonateButtonProps = {
  locale: Locale;
  /** When true, skip fixed positioning (parent stack handles placement). */
  nested?: boolean;
};

export default function FloatingDonateButton({
  locale,
  nested = false,
}: FloatingDonateButtonProps) {
  const reduceMotion = useReducedMotion();
  const tooltip = t(locale, 'donate.tooltip');

  const link = (
    <motion.a
      href={donateConfig.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t(locale, 'donate.ariaLabel')}
      className="pointer-events-auto group relative inline-flex items-center"
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
    >
      {/* Soft blue hue emission — outside overflow clip so it can radiate */}
      {!reduceMotion ? (
        <span
          className="pointer-events-none absolute right-0 top-1/2 h-[3.75rem] w-[3.75rem] -translate-y-1/2 sm:h-16 sm:w-16"
          aria-hidden="true"
        >
          {/* Beat 1 — blue-led mosaic mix (sky + gold + warm) */}
          <span
            className="donate-hue-ping absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(0,190,250,0.99) 0%, rgba(40,170,230,0.7) 24%, rgba(230,175,45,0.55) 44%, rgba(240,130,70,0.35) 60%, transparent 74%)',
            }}
          />
          {/* Beat 2 — warm pink/orange-led mosaic mix (amber + rose + sky) */}
          <span
            className="donate-hue-ping donate-hue-ping-delay absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,145,75,0.95) 0%, rgba(245,110,105,0.72) 24%, rgba(230,175,45,0.55) 44%, rgba(0,175,235,0.35) 60%, transparent 74%)',
            }}
          />
        </span>
      ) : null}

      {/* Horizontal cylinder expands left from the round mark on hover */}
      <span
        className={cn(
          'relative flex items-center overflow-hidden rounded-full border border-white/80 bg-white/90 shadow-lg shadow-brand-900/15 ring-2 ring-white/70 backdrop-blur-sm',
          'transition-[box-shadow] duration-300 group-hover:shadow-xl',
        )}
      >
        <MosaicHueBackdrop className="rounded-full" />
        <span
          className="absolute inset-0 rounded-full bg-white/25"
          aria-hidden="true"
        />

        <span
          className={cn(
            'relative max-w-0 overflow-hidden whitespace-nowrap pl-0 text-sm font-semibold text-logo-grey opacity-0',
            'transition-[max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'group-hover:max-w-[14rem] group-hover:pl-4 group-hover:pr-1 group-hover:opacity-100',
            'group-focus-visible:max-w-[14rem] group-focus-visible:pl-4 group-focus-visible:pr-1 group-focus-visible:opacity-100',
          )}
        >
          {tooltip}
        </span>

        <span className="relative flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center sm:h-16 sm:w-16">
          {donateConfig.logoSrc ? (
            <Image
              src={donateConfig.logoSrc}
              alt=""
              width={64}
              height={64}
              className="relative h-full w-full rounded-full object-cover"
            />
          ) : (
            <Heart
              className="relative h-7 w-7 text-logo-grey transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8"
              aria-hidden="true"
              strokeWidth={1.75}
            />
          )}
        </span>
      </span>
    </motion.a>
  );

  if (nested) {
    return link;
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-30 sm:bottom-6 sm:right-6">
      {link}
    </div>
  );
}
