'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import type { Locale } from '@/constants/i18n';
import { useSiteChromeHidden } from '@/hooks/useSiteChromeHidden';
import { cn } from '@/lib/cn';
import { t } from '@/lib/i18n';

const TARGET_ID = 'experiences-heading';

/**
 * Persistent control that jumps from the project showcase to Featured experiences.
 */
export default function ScrollToExperiencesButton({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(true);
  const chromeHidden = useSiteChromeHidden();

  useEffect(() => {
    const target = document.getElementById(TARGET_ID);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollToExperiences = () => {
    document.getElementById(TARGET_ID)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const show = visible && !chromeHidden;

  return (
    <button
      type="button"
      onClick={scrollToExperiences}
      aria-label={t(locale, 'projects.scrollToExperiences')}
      className={cn(
        'fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 flex-col items-center gap-1 overflow-hidden rounded-full border border-white/75 px-4 py-3 text-logo-grey shadow-lg shadow-brand-900/10 transition-[opacity,transform] duration-300 hover:-translate-y-0.5 sm:bottom-7',
        show
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <MosaicHueBackdrop />
      <span className="absolute inset-0 bg-white/30" aria-hidden="true" />
      <span className="relative max-w-[6.5rem] text-center text-[10px] font-bold uppercase leading-tight tracking-[0.14em]">
        {t(locale, 'projects.experiencesLabel')}
      </span>
      <ChevronDown
        className="relative h-5 w-5 animate-bounce"
        aria-hidden="true"
      />
    </button>
  );
}
