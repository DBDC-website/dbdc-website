import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleForm from '@/components/admin/ArticleForm';

export const metadata: Metadata = {
  title: 'New article',
};

const ERRORS: Record<string, string> = {
  required: 'English title is required.',
  upload:
    'PDF upload failed. Use a PDF under 25MB. If it keeps failing, ask a developer to check the articles-bucket storage policies.',
  save: 'Could not save the article. Try again.',
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewArticlePage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? 'Something went wrong.' : null;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm">
        <Link href="/admin/articles" className="text-brand-800 hover:underline">
          ← Articles
        </Link>
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-brand-900 sm:text-3xl">
        New article
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Add a research PDF to the public articles list.
      </p>

      {message ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {message}
        </p>
      ) : null}

      <div className="mt-8 rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <ArticleForm />
      </div>
    </div>
  );
}
