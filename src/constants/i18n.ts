export const locales = ['en', 'zh-Hant', 'zh-Hans'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  'zh-Hant': '繁',
  'zh-Hans': '简',
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
