'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LOCALE_COOKIE,
  localeLabels,
  locales,
  swapLocaleInPath,
  type Locale,
} from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type LanguageSwitcherProps = {
  locale: Locale;
};

function persistLocalePreference(nextLocale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(nextLocale)}; path=/; max-age=31536000; samesite=lax`;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <div
      className="flex items-center gap-1.5 text-sm"
      role="navigation"
      aria-label={t(locale, 'chrome.languageSelection')}
    >
      {locales.map((code, index) => {
        const href = swapLocaleInPath(pathname, code);
        const isActive = code === locale;

        return (
          <span key={code} className="flex items-center gap-1.5">
            {index > 0 && (
              <span className="text-logo-grey/30" aria-hidden="true">
                |
              </span>
            )}
            {isActive ? (
              <span
                className="font-bold text-logo-grey"
                aria-current="page"
              >
                {localeLabels[code]}
              </span>
            ) : (
              <Link
                href={href}
                className={cn(
                  'font-bold text-logo-grey/50 transition-colors hover:text-logo-grey',
                )}
                hrefLang={code}
                onClick={() => persistLocalePreference(code)}
                prefetch={false}
              >
                {localeLabels[code]}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
