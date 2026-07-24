import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommitteeMemberForm from '@/components/admin/CommitteeMemberForm';
import { getAdminCommitteeMember } from '@/lib/admin/committees';

export const metadata: Metadata = {
  title: 'Edit committee member',
};

const MESSAGES: Record<string, string> = {
  '1': 'Member saved.',
};

const ERRORS: Record<string, string> = {
  save: 'Could not save the member. Try again.',
  delete: 'Could not delete the member.',
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function EditCommitteeMemberPage({
  params,
  searchParams,
}: PageProps) {
  const { id: idRaw } = await params;
  const { saved, error } = await searchParams;
  const id = Number(idRaw);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const member = await getAdminCommitteeMember(id);
  if (!member) {
    notFound();
  }

  const success = saved ? MESSAGES[saved] ?? 'Saved.' : null;
  const failure = error ? ERRORS[error] ?? 'Something went wrong.' : null;

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
        Edit member
      </h1>
      <p className="mt-1 text-sm text-stone-600">{member.name}</p>

      {success ? (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {success}
        </p>
      ) : null}
      {failure ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {failure}
        </p>
      ) : null}

      <div className="mt-8 rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <CommitteeMemberForm member={member} />
      </div>
    </div>
  );
}
