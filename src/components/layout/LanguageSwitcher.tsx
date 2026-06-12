'use client';

import { localeLabels, locales, type Locale } from '@/constants/i18n';

type LanguageSwitcherProps = {
  locale: Locale;
};

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  return (
    <div
      className="flex items-center gap-1 text-sm"
      aria-label="Language selection (coming soon)"
    >
      {locales.map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-gray-300" aria-hidden="true">
              |
            </span>
          )}
          <span
            className={
              code === locale
                ? 'font-semibold text-gray-900'
                : 'text-gray-400'
            }
            aria-current={code === locale ? 'true' : undefined}
          >
            {localeLabels[code]}
          </span>
        </span>
      ))}
    </div>
  );
}
