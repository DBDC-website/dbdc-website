import type { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { listAdminArticles } from '@/lib/admin/articles';

export const metadata: Metadata = {
  title: 'Articles',
};

const FLASH: Record<string, string> = {
  deleted: 'Article deleted.',
  invalid: 'That article request was invalid.',
};

type PageProps = {
  searchParams: Promise<{ deleted?: string; error?: string }>;
};

function translationBadge(hant: string | null, hans: string | null) {
  if (hant && hans) return { label: '繁 简', tone: 'done' as const };
  if (hant || hans) return { label: hant ? '繁' : '简', tone: 'partial' as const };
  return { label: 'EN only', tone: 'none' as const };
}

const TONE_CLASS = {
  done: 'bg-emerald-50 text-emerald-800',
  partial: 'bg-amber-50 text-amber-800',
  none: 'bg-stone-100 text-stone-600',
};

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const articles = await listAdminArticles();
  const flash =
    (params.deleted && FLASH.deleted) ||
    (params.error ? FLASH[params.error] ?? 'Something went wrong.' : null);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
            Articles
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Research PDFs listed on the public articles page.
          </p>
        </div>
        <Button href="/admin/articles/new" size="sm">
          Add article
        </Button>
      </div>

      {flash ? (
        <p className="mt-4 rounded-md border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-brand-900">
          {flash}
        </p>
      ) : null}

      {articles.length === 0 ? (
        <p className="mt-10 rounded-lg border border-cream-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
          No articles yet.{' '}
          <Link
            href="/admin/articles/new"
            className="font-medium text-brand-800 hover:underline"
          >
            Add the first one
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-cream-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Label</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Translations</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                const badge = translationBadge(
                  article.titleZhHant,
                  article.titleZhHans,
                );

                return (
                  <tr
                    key={article.id}
                    className="border-b border-cream-100 last:border-0"
                  >
                    <td className="px-4 py-3 text-stone-600">
                      {article.label}
                    </td>
                    <td className="max-w-md px-4 py-3 font-medium text-brand-900">
                      {article.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                      {article.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASS[badge.tone]}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="font-medium text-brand-800 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
