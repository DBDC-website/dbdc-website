import type { Metadata } from 'next';
import Link from 'next/link';
import CommitteeMemberForm from '@/components/admin/CommitteeMemberForm';

export const metadata: Metadata = {
  title: 'New committee member',
};

const ERRORS: Record<string, string> = {
  invalid: 'English / romanised name is required.',
  save: 'Could not save the member. Try again.',
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewCommitteeMemberPage({
  searchParams,
}: PageProps) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? 'Something went wrong.' : null;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm">
        <Link
          href="/admin/committees"
          className="text-brand-800 hover:underline"
        >
          ← Committees
        </Link>
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-brand-900 sm:text-3xl">
        Add member
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        New entries appear on the public site when marked active.
      </p>

      {message ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {message}
        </p>
      ) : null}

      <div className="mt-8 rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <CommitteeMemberForm />
      </div>
    </div>
  );
}
