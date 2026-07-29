'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import { donateConfig } from '@/constants/donate';
import { useSiteChromeHidden } from '@/hooks/useSiteChromeHidden';
import { cn } from '@/lib/cn';

export default function FloatingDonateButton() {
  const reduceMotion = useReducedMotion();
  const chromeHidden = useSiteChromeHidden();

  return (
    <div
      className={cn(
        'pointer-events-none fixed bottom-5 right-5 z-30 transition-[opacity,transform] duration-300 sm:bottom-6 sm:right-6',
        chromeHidden
          ? 'translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100',
      )}
    >
      <motion.a
        href={donateConfig.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={donateConfig.ariaLabel}
        className="pointer-events-auto group relative flex items-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: chromeHidden ? 0 : 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <span
          className={cn(
            'pointer-events-none absolute right-full mr-3 hidden rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-sm font-medium text-logo-grey shadow-lg shadow-brand-900/10 backdrop-blur-sm transition-[opacity,transform] duration-300 sm:block',
            'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
          )}
        >
          {donateConfig.tooltip}
        </span>

        <span className="relative flex h-[3.75rem] w-[3.75rem] items-center justify-center sm:h-16 sm:w-16">
          {!reduceMotion ? (
            <span
              className="absolute inset-0 rounded-full bg-[#00a0dc]/20 motion-safe:animate-ping"
              aria-hidden="true"
            />
          ) : null}

          <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/80 shadow-lg shadow-brand-900/15 ring-2 ring-white/70 transition-[box-shadow] duration-300 group-hover:shadow-xl">
            <MosaicHueBackdrop className="rounded-full" />
            <span className="absolute inset-0 rounded-full bg-white/25" aria-hidden="true" />
            {donateConfig.logoSrc ? (
              <Image
                src={donateConfig.logoSrc}
                alt=""
                width={64}
                height={64}
                className="relative h-full w-full object-cover"
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
    </div>
  );
}
