'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { donateConfig } from '@/constants/donate';
import { cn } from '@/lib/cn';

export default function FloatingDonateButton() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-30 sm:bottom-6 sm:right-6">
      <motion.a
        href={donateConfig.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={donateConfig.ariaLabel}
        className="pointer-events-auto group relative flex items-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <span
          className={cn(
            'pointer-events-none absolute right-full mr-3 hidden rounded-full border border-gold-200/80 bg-white/95 px-3 py-1.5 text-sm font-medium text-brand-900 shadow-lg shadow-brand-900/10 backdrop-blur-sm transition-[opacity,transform] duration-300 sm:block',
            'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
          )}
        >
          {donateConfig.tooltip}
        </span>

        <span className="relative flex h-[3.75rem] w-[3.75rem] items-center justify-center sm:h-16 sm:w-16">
          {!reduceMotion ? (
            <span
              className="absolute inset-0 rounded-full bg-gold-400/25 motion-safe:animate-ping"
              aria-hidden="true"
            />
          ) : null}
          <span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-300/50 via-gold-500/35 to-brand-700/25 opacity-80 blur-md transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />

          <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-gold-300/90 bg-gradient-to-br from-gold-100 via-white to-gold-200 shadow-lg shadow-brand-900/15 ring-2 ring-white/80 transition-[border-color,box-shadow] duration-300 group-hover:border-gold-400 group-hover:shadow-xl group-hover:shadow-gold-500/25">
            {donateConfig.logoSrc ? (
              <Image
                src={donateConfig.logoSrc}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <Heart
                className="h-7 w-7 text-gold-700 transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8"
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
