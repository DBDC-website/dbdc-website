import type { Metadata } from 'next';
import Link from 'next/link';
import PastWorkYearForm from '@/components/admin/PastWorkYearForm';
import { isPastWorkAdminSlug } from '@/constants/admin';

export const metadata: Metadata = {
  title: 'New Past Work year',
};

const ERRORS: Record<string, string> = {
  invalid: 'Committee and year are required.',
  duplicate: 'That committee already has an entry for this year.',
  save: 'Could not save the year. Try again.',
};

type PageProps = {
  searchParams: Promise<{ error?: string; committee?: string }>;
};

export default async function NewPastWorkYearPage({ searchParams }: PageProps) {
  const { error, committee } = await searchParams;
  const message = error ? ERRORS[error] ?? 'Something went wrong.' : null;
  const defaultCommitteeSlug =
    committee && isPastWorkAdminSlug(committee) ? committee : undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm">
        <Link
          href="/admin/past-work"
          className="text-brand-800 hover:underline"
        >
          ← Past Work
        </Link>
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-brand-900 sm:text-3xl">
        New year
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Create a year for a committee, then add bullet points on the next
        screen.
      </p>

      {message ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {message}
        </p>
      ) : null}

      <div className="mt-8 rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <PastWorkYearForm defaultCommitteeSlug={defaultCommitteeSlug} />
      </div>
    </div>
  );
}
