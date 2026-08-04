import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlesSortableTable from '@/components/admin/ArticlesSortableTable';
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
        <div className="mt-8">
          <ArticlesSortableTable articles={articles} />
        </div>
      )}
    </div>
  );
}
