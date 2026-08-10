import type { ReactNode } from 'react';

/** Split text and wrap case-insensitive query matches for highlight rendering. */
export function highlightSearchMatches(
  text: string,
  query: string,
): ReactNode[] {
  const trimmed = query.trim();
  if (!trimmed || !text) return [text];

  const tokens = [
    ...new Set(
      trimmed
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length > 0),
    ),
  ].sort((a, b) => b.length - a.length);

  if (tokens.length === 0) return [text];

  const escaped = tokens.map((token) =>
    token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = tokens.some(
      (token) => part.toLowerCase() === token.toLowerCase(),
    );
    if (isMatch) {
      return (
        <mark
          key={`${part}-${index}`}
          className="rounded-sm bg-sky-100 px-0.5 font-semibold text-[#0a6f96]"
        >
          {part}
        </mark>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

/** Public path without locale, for display under result titles. */
export function displaySearchPath(href: string, locale: string): string {
  try {
    if (href.startsWith('http')) {
      const url = new URL(href);
      return `${url.pathname}${url.hash}`;
    }
  } catch {
    /* fall through */
  }
  const withoutLocale = href.replace(new RegExp(`^/${locale}`), '') || '/';
  return withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`;
}
