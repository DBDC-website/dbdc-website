export const locales = ['en', 'zh-Hant', 'zh-Hans'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  'zh-Hant': '繁',
  'zh-Hans': '简',
};

/** Cookie used by proxy.ts for bare-path redirects. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/** BCP 47 values for `<html lang>`. */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  'zh-Hant': 'zh-Hant',
  'zh-Hans': 'zh-Hans',
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** Swap the locale segment of a pathname, preserving the rest of the path. */
export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && isValidLocale(segments[1])) {
    segments[1] = nextLocale;
    const next = segments.join('/');
    return next.length > 0 ? next : `/${nextLocale}`;
  }
  if (pathname === '/' || pathname === '') {
    return `/${nextLocale}`;
  }
  return `/${nextLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
