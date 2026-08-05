'use client';

import type { Locale } from '@/constants/i18n';
import { useSiteChromeHidden } from '@/hooks/useSiteChromeHidden';
import { cn } from '@/lib/cn';
import FloatingBackToTop from './FloatingBackToTop';
import FloatingDonateButton from './FloatingDonateButton';

type FloatingActionButtonsProps = {
  locale: Locale;
};

/** Donate + back-to-top stack, fixed bottom-right on public pages. */
export default function FloatingActionButtons({
  locale,
}: FloatingActionButtonsProps) {
  const chromeHidden = useSiteChromeHidden();

  return (
    <div
      className={cn(
        'pointer-events-none fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3 transition-[opacity,transform] duration-300 sm:bottom-6 sm:right-6 sm:gap-3.5',
        chromeHidden
          ? 'translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100',
      )}
    >
      <FloatingDonateButton locale={locale} nested />
      <FloatingBackToTop locale={locale} />
    </div>
  );
}
