import type { Metadata } from 'next';
import { locales, type Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';

const SITE_URL = 'https://dbdc.catholic.org.hk';

/** Public paths without locale prefix (English slugs). */
export const PUBLIC_PATHS = [
  '',
  '/projects',
  '/parish-school',
  '/parish-school/guidelines',
  '/consultants-contractors',
  '/consultants-contractors/consultant',
  '/consultants-contractors/contractor',
  '/articles',
  '/search',
  '/committees/rdc',
  '/committees/sc',
  '/committees/wc',
  '/committees/cabpag',
  '/copyright-disclaimer',
  '/privacy-policy',
  '/pics',
] as const;

export function localePath(locale: Locale, path: string): string {
  const normalized = path === '/' ? '' : path;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/** Build hreflang alternates + canonical for a locale-relative path. */
export function buildAlternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {
    'x-default': absoluteUrl('en', path),
  };

  for (const loc of locales) {
    languages[loc] = absoluteUrl(loc, path);
  }

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}

type PageMetaInput = {
  locale: Locale;
  path: string;
  titleKey: string;
  descriptionKey: string;
  titleParams?: Record<string, string | number>;
};

/** Shared generateMetadata helper for public pages. */
export function buildPageMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
  titleParams,
}: PageMetaInput): Metadata {
  const title = t(locale, titleKey, titleParams);
  const description = t(locale, descriptionKey);

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      locale,
      url: absoluteUrl(locale, path),
      siteName: t(locale, 'site.shortName'),
    },
  };
}
