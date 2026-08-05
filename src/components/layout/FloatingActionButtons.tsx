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
        'pointer-events-none fixed bottom-5 right-5 z-30 transition-[opacity,transform] duration-300 sm:bottom-6 sm:right-6',
        chromeHidden
          ? 'translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100',
      )}
    >
      {/* Fixed circle-width column so the arrow stays centered under the donate mark */}
      <div className="relative flex w-[3.75rem] flex-col items-center gap-3 sm:w-16 sm:gap-3.5">
        <div className="relative flex w-full justify-end">
          <FloatingDonateButton locale={locale} nested />
        </div>
        <FloatingBackToTop locale={locale} />
      </div>
    </div>
  );
}
