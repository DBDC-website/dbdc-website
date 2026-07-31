import type { Locale } from '@/constants/i18n';
import en from '@/messages/en.json';
import zhHans from '@/messages/zh-Hans.json';
import zhHant from '@/messages/zh-Hant.json';

export type Messages = typeof en;

const catalogs: Record<Locale, Messages> = {
  en,
  'zh-Hant': zhHant as Messages,
  'zh-Hans': zhHans as Messages,
};

type MessageParams = Record<string, string | number>;

/**
 * Locale resolution order for missing copy:
 * - zh-Hant → zh-Hans → en
 * - zh-Hans → zh-Hant → en
 * - en → (nothing else for messages)
 */
export function getFallbackChain(locale: Locale): Locale[] {
  switch (locale) {
    case 'zh-Hant':
      return ['zh-Hant', 'zh-Hans', 'en'];
    case 'zh-Hans':
      return ['zh-Hans', 'zh-Hant', 'en'];
    default:
      return ['en'];
  }
}

function getByPath(source: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = source;

  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function interpolate(template: string, params?: MessageParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key];
    return value == null ? match : String(value);
  });
}

/** Raw catalog for the requested locale (no merge). Prefer `t` / `tList` for reads. */
export function getMessages(locale: Locale): Messages {
  return catalogs[locale] ?? catalogs.en;
}

/** Resolve a string message with the Chinese↔Chinese→EN fallback chain. */
export function t(
  locale: Locale,
  key: string,
  params?: MessageParams,
): string {
  for (const candidate of getFallbackChain(locale)) {
    const value = getByPath(catalogs[candidate], key);
    if (typeof value === 'string') {
      return interpolate(value, params);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(`[i18n] Missing message: ${key}`);
  }

  return key;
}

/** Resolve a string-array message with the same fallback chain. */
export function tList(locale: Locale, key: string): string[] {
  for (const candidate of getFallbackChain(locale)) {
    const value = getByPath(catalogs[candidate], key);
    if (
      Array.isArray(value) &&
      value.every((item) => typeof item === 'string')
    ) {
      return value as string[];
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(`[i18n] Missing message list: ${key}`);
  }

  return [];
}

/** Map English membership role titles (from DB grouping) to localized labels. */
const ROLE_TITLE_KEYS: Record<string, string> = {
  'Ex-officio Members': 'home.roleExOfficio',
  Chairperson: 'home.roleChairperson',
  'Vice-Chairperson': 'home.roleViceChairperson',
  Members: 'home.roleMembers',
  Administrator: 'home.roleAdministrator',
};

export function localizeRoleTitle(locale: Locale, title: string): string {
  const key = ROLE_TITLE_KEYS[title];
  return key ? t(locale, key) : title;
}

/**
 * Member roles come from a fixed admin dropdown, so they are translated from
 * the English value rather than stored per locale. Legacy free-text variants
 * (Chairperson, Convenor, Deputy…) map onto the same keys.
 */
const MEMBER_ROLE_KEYS: Record<string, string> = {
  'ex-officio': 'roles.exOfficio',
  'ex officio': 'roles.exOfficio',
  'ex-officio member': 'roles.exOfficio',
  chairman: 'roles.chairman',
  chairperson: 'roles.chairman',
  convenor: 'roles.chairman',
  'vice-chairman': 'roles.viceChairman',
  'vice chairman': 'roles.viceChairman',
  'vice-chairperson': 'roles.viceChairman',
  member: 'roles.member',
  administrator: 'roles.administrator',
};

/** Returns null when the role is unrecognised so callers can show it as-is. */
export function localizeMemberRole(
  locale: Locale,
  role: string | null | undefined,
): string | null {
  if (!role) return null;
  const key = MEMBER_ROLE_KEYS[role.trim().toLowerCase()];
  return key ? t(locale, key) : null;
}
