import type { Metadata } from 'next';
import Link from 'next/link';
import CommitteeMembersSortableTable from '@/components/admin/CommitteeMembersSortableTable';
import Button from '@/components/ui/Button';
import {
  COMMITTEE_MEMBER_OPTIONS,
  isAdminCommitteeSlug,
} from '@/constants/admin';
import { listAdminCommitteeMembers } from '@/lib/admin/committees';
import type { CommitteeMemberSlug } from '@/types/committee';

export const metadata: Metadata = {
  title: 'Committees',
};

const FLASH: Record<string, string> = {
  deleted: 'Member deleted.',
  invalid: 'That request was invalid.',
};

type PageProps = {
  searchParams: Promise<{
    deleted?: string;
    error?: string;
    committee?: string;
  }>;
};

export default async function AdminCommitteesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter =
    params.committee && isAdminCommitteeSlug(params.committee)
      ? (params.committee as CommitteeMemberSlug)
      : undefined;

  const members = await listAdminCommitteeMembers(filter);
  const flash =
    (params.deleted && FLASH.deleted) ||
    (params.error ? FLASH[params.error] ?? 'Something went wrong.' : null);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
            Committee members
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            People listed on the homepage and committee detail pages. Drag
            within a committee to change order.
          </p>
        </div>
        <Button href="/admin/committees/new" size="sm">
          Add member
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/committees"
          className={`rounded-md px-3 py-1.5 text-sm ${
            !filter
              ? 'bg-brand-800 text-white'
              : 'bg-cream-100 text-brand-800 hover:bg-cream-200'
          }`}
        >
          All
        </Link>
        {COMMITTEE_MEMBER_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={`/admin/committees?committee=${option.value}`}
            className={`rounded-md px-3 py-1.5 text-sm ${
              filter === option.value
                ? 'bg-brand-800 text-white'
                : 'bg-cream-100 text-brand-800 hover:bg-cream-200'
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      {flash ? (
        <p className="mt-4 rounded-md border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-brand-900">
          {flash}
        </p>
      ) : null}

      {members.length === 0 ? (
        <p className="mt-10 rounded-lg border border-cream-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
          No members in this view.{' '}
          <Link
            href="/admin/committees/new"
            className="font-medium text-brand-800 hover:underline"
          >
            Add one
          </Link>
          .
        </p>
      ) : filter ? (
        <div className="mt-8">
          <CommitteeMembersSortableTable
            members={members}
            committeeSlug={filter}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {COMMITTEE_MEMBER_OPTIONS.map((option) => {
            const group = members.filter(
              (member) => member.committeeSlug === option.value,
            );
            if (group.length === 0) return null;

            return (
              <section key={option.value}>
                <h2 className="mb-3 text-lg font-semibold text-brand-900">
                  {option.label}
                </h2>
                <CommitteeMembersSortableTable
                  members={group}
                  committeeSlug={option.value}
                />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
