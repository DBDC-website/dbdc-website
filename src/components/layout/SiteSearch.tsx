'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { RotateCcw, Search, X } from 'lucide-react';
import type { Locale } from '@/constants/i18n';
import { t, tList } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type SiteSearchProps = {
  locale: Locale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SiteSearchToggle({
  open,
  onOpenChange,
  locale,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="site-search-panel"
      aria-label={open ? t(locale, 'search.close') : t(locale, 'search.open')}
      onClick={() => onOpenChange(!open)}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md text-logo-grey transition-colors hover:bg-white/55 hover:text-logo-grey',
        open && 'bg-white/70',
        className,
      )}
    >
      <Search className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
}

export default function SiteSearchPanel({
  locale,
  open,
  onOpenChange,
}: SiteSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const hotSearches = tList(locale, 'search.hot');

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  const reset = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const close = () => {
    onOpenChange(false);
    setQuery('');
  };

  const goToResults = (value = query) => {
    const trimmed = value.trim();
    close();
    if (!trimmed) {
      router.push(`/${locale}/search`);
      return;
    }
    router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
  };

  if (!open) return null;

  return (
    <div
      id="site-search-panel"
      className="relative z-10 border-t border-gold-300/50 bg-gradient-to-b from-cream-50 via-[#f7f1e6] to-cream-100 shadow-inner"
    >
      <div className="mx-auto w-full max-w-[100rem] px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            goToResults();
          }}
        >
          <div className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-xl border border-cream-300/90 bg-white shadow-sm shadow-brand-900/[0.04]">
            <label htmlFor={inputId} className="sr-only">
              {t(locale, 'search.submit')}
            </label>
            <input
              ref={inputRef}
              id={inputId}
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

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-brand-900/80 transition-colors hover:bg-white/70 hover:text-brand-950"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t(locale, 'search.reset')}
            </button>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-900 transition-colors hover:bg-white/70"
              aria-label={t(locale, 'search.close')}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-stone-600">
            {t(locale, 'search.hotSearches')}
          </span>
          {hotSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => goToResults(term)}
              className="rounded-full bg-logo-blue px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#0090c8] sm:text-sm"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
