'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import type { Locale } from '@/constants/i18n';
import { useSiteChromeHidden } from '@/hooks/useSiteChromeHidden';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/cn';

const SHOW_AFTER_PX = 400;

type FloatingBackToTopProps = {
  locale: Locale;
};

export default function FloatingBackToTop({ locale }: FloatingBackToTopProps) {
  const reduceMotion = useReducedMotion();
  const chromeHidden = useSiteChromeHidden();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = visible && !chromeHidden;

  return (
    <motion.button
      type="button"
      aria-label={t(locale, 'chrome.backToTop')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'pointer-events-auto relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/80 shadow-md shadow-brand-900/15 ring-1 ring-white/70 transition-[box-shadow,opacity] duration-300 sm:h-10 sm:w-10',
        show
          ? 'opacity-100'
          : 'pointer-events-none opacity-0',
      )}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        y: show ? 0 : 8,
        scale: show ? 1 : 0.92,
      }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion || !show ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion || !show ? undefined : { scale: 0.96 }}
    >
      <MosaicHueBackdrop className="rounded-full" />
      <span className="absolute inset-0 rounded-full bg-white/25" aria-hidden="true" />
      <ArrowUp
        className="relative h-4 w-4 text-logo-grey"
        aria-hidden="true"
        strokeWidth={2.25}
      />
    </motion.button>
  );
}
