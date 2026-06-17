'use client';

import { useMemo, useState } from 'react';
import { Search, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { Article } from '@/types/article';

type ArticleExplorerProps = {
  articles: Article[];
  categories: readonly string[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ArticleExplorer({
  articles,
  categories,
}: ArticleExplorerProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'All' || article.category === activeCategory;
      const matchesQuery =
        normalisedQuery === '' ||
        article.title.toLowerCase().includes(normalisedQuery) ||
        article.excerpt.toLowerCase().includes(normalisedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [articles, activeCategory, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <label htmlFor="article-search" className="sr-only">
            Search articles
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden="true"
          />
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-600"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-stone-500" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <Card as="li" key={article.slug} interactive className="flex flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge tone="brand">{article.category}</Badge>
                <time
                  dateTime={article.date}
                  className="text-xs text-stone-500"
                >
                  {formatDate(article.date)}
                </time>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-brand-900">
                {article.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                {article.excerpt}
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {article.readingTimeMinutes} min read
              </p>
            </Card>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-stone-500">
          No articles match your search.
        </p>
      )}
    </div>
  );
}
