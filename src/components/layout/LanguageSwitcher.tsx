'use client';

import { localeLabels, locales, type Locale } from '@/constants/i18n';
import { cn } from '@/lib/cn';

type LanguageSwitcherProps = {
  locale: Locale;
};

/**
 * Display-only language indicator for Sprint 1. Functional switching
 * (with real translations) is wired up in Sprint 2 alongside i18n content.
 */
export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  return (
    <div
      className="flex items-center gap-1.5 text-sm"
      aria-label="Language selection (coming soon)"
    >
      {locales.map((code, index) => (
        <span key={code} className="flex items-center gap-1.5">
          {index > 0 && (
            <span className="text-logo-grey/30" aria-hidden="true">
              |
            </span>
          )}
          <span
            className={cn(
              'font-bold',
              code === locale
                ? 'text-logo-grey'
                : 'text-logo-grey/50',
            )}
            aria-current={code === locale ? 'true' : undefined}
          >
            {localeLabels[code]}
          </span>
        </span>
      ))}
    </div>
  );
}
