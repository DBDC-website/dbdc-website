'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';

type SearchResultsFormProps = {
  locale: Locale;
  initialQuery: string;
};

export default function SearchResultsForm({
  locale,
  initialQuery,
}: SearchResultsFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const reset = () => {
    setQuery('');
    router.push(`/${locale}/search`);
  };

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
          router.push(`/${locale}/search`);
          return;
        }
        router.push(
          `/${locale}/search?q=${encodeURIComponent(trimmed)}`,
        );
      }}
    >
      <div className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-xl border border-cream-300/90 bg-white shadow-sm shadow-brand-900/[0.04]">
        <label htmlFor="search-results-input" className="sr-only">
          {t(locale, 'search.submit')}
        </label>
        <input
          id="search-results-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t(locale, 'search.placeholder')}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-brand-950 placeholder:text-stone-400 focus:outline-none sm:text-base"
          autoComplete="off"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center bg-logo-blue px-4 text-white transition-colors hover:bg-[#0090c8] sm:px-5"
          aria-label={t(locale, 'search.submit')}
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-1.5 self-end rounded-md px-2.5 py-2 text-sm font-medium text-brand-900/80 transition-colors hover:bg-white/70 hover:text-brand-950 sm:self-auto"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {t(locale, 'search.reset')}
      </button>
    </form>
  );
}
