import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PastWorkItemsEditor from '@/components/admin/PastWorkItemsEditor';
import PastWorkYearForm from '@/components/admin/PastWorkYearForm';
import { PAST_WORK_COMMITTEE_OPTIONS } from '@/constants/admin';
import { getAdminPastWorkYear } from '@/lib/admin/pastWork';

export const metadata: Metadata = {
  title: 'Edit Past Work year',
};

const MESSAGES: Record<string, string> = {
  '1': 'Year saved.',
  item: 'Bullet saved.',
  deleted_item: 'Bullet deleted.',
};

const ERRORS: Record<string, string> = {
  invalid: 'That request was invalid.',
  duplicate: 'That committee already has an entry for this year.',
  save: 'Could not save. Try again.',
  delete: 'Could not delete.',
  upload: 'File upload failed. Use a PDF or image under 25MB.',
  item_required: 'English bullet text is required.',
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function EditPastWorkYearPage({
  params,
  searchParams,
}: PageProps) {
  const { id: idRaw } = await params;
  const { saved, error } = await searchParams;
  const id = Number(idRaw);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const year = await getAdminPastWorkYear(id);
  if (!year) {
    notFound();
  }

  const committeeLabel =
    PAST_WORK_COMMITTEE_OPTIONS.find(
      (option) => option.value === year.committeeSlug,
    )?.label ?? year.committeeSlug;

  const success = saved ? MESSAGES[saved] ?? 'Saved.' : null;
  const failure = error ? ERRORS[error] ?? 'Something went wrong.' : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm">
          <Link
            href="/admin/past-work"
            className="text-brand-800 hover:underline"
          >
            ← Past Work
          </Link>
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-brand-900 sm:text-3xl">
          {committeeLabel} · {year.year}
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Edit the year, then manage bullet points below.
        </p>
      </div>

      {success ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {success}
        </p>
      ) : null}
      {failure ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {failure}
        </p>
      ) : null}

      <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <PastWorkYearForm year={year} />
      </div>

      <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <PastWorkItemsEditor yearId={year.id} items={year.items} />
      </div>
    </div>
  );
}
