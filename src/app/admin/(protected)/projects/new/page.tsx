import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectForm from '@/components/admin/ProjectForm';

export const metadata: Metadata = {
  title: 'New project',
};

const ERRORS: Record<string, string> = {
  title: 'Title is required.',
  slug: 'That slug is already in use. Choose another.',
  upload: 'Image upload failed. Check the file type and size.',
  save: 'Could not save the project. Try again.',
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewProjectPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? 'Something went wrong.' : null;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm">
        <Link href="/admin/projects" className="text-brand-800 hover:underline">
          ← Projects
        </Link>
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-brand-900 sm:text-3xl">
        New project
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Add a portfolio entry and optional primary image.
      </p>

      {message ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {message}
        </p>
      ) : null}

      <div className="mt-8 rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
