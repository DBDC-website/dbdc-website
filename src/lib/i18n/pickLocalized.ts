import type { Locale } from '@/constants/i18n';
import { getFallbackChain } from '@/lib/i18n';

/**
 * Column-per-locale picker for CMS rows.
 * Fallback: zh-Hant ↔ zh-Hans → en → legacy column.
 *
 * Example columns: title_en, title_zh_hant, title_zh_hans, title (legacy).
 */
export type LocalizedField =
  | 'title'
  | 'building_name'
  | 'image_alt'
  | 'caption'
  | 'label'
  | 'author'
  | 'name'
  | 'role';

const LOCALE_SUFFIX: Record<Locale, string> = {
  en: 'en',
  'zh-Hant': 'zh_hant',
  'zh-Hans': 'zh_hans',
};

function columnName(field: string, locale: Locale): string {
  return `${field}_${LOCALE_SUFFIX[locale]}`;
}

function readString(
  row: Record<string, unknown>,
  key: string,
): string | null {
  const value = row[key];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Pick a localized string from a DB row.
 * Tries locale-specific columns, then the other Chinese script, then EN, then legacy.
 */
export function pickLocalized(
  row: Record<string, unknown>,
  field: LocalizedField | string,
  locale: Locale,
  legacyField: string = field,
): string {
  for (const candidate of getFallbackChain(locale)) {
    const value = readString(row, columnName(field, candidate));
    if (value) return value;
  }

  return readString(row, legacyField) ?? '';
}

/** Same as pickLocalized but returns null when nothing is present. */
export function pickLocalizedOptional(
  row: Record<string, unknown>,
  field: LocalizedField | string,
  locale: Locale,
  legacyField: string = field,
): string | null {
  const value = pickLocalized(row, field, locale, legacyField);
  return value.length > 0 ? value : null;
}

/**
 * Resolve a Partial locale map with the same Chinese↔Chinese→EN chain.
 * Useful for static content modules (parish, legal, committees).
 */
export function pickContent<T>(
  map: Partial<Record<Locale, T>> & { en: T },
  locale: Locale,
): T {
  for (const candidate of getFallbackChain(locale)) {
    const value = map[candidate];
    if (value !== undefined) return value;
  }
  return map.en;
}
