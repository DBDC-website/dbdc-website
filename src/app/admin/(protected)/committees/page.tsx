import type { Metadata } from 'next';
import Link from 'next/link';
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

function labelFor(slug: string) {
  return (
    COMMITTEE_MEMBER_OPTIONS.find((option) => option.value === slug)?.label ??
    slug
  );
}

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
            People listed on the homepage and committee detail pages.
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
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-cream-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Committee</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-cream-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-brand-900">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {member.role ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {labelFor(member.committeeSlug)}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {member.sortOrder}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        member.active
                          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800'
                          : 'rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600'
                      }
                    >
                      {member.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/committees/${member.id}`}
                      className="font-medium text-brand-800 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
