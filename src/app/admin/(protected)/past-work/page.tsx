import type { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import {
  PAST_WORK_COMMITTEE_OPTIONS,
  isPastWorkAdminSlug,
} from '@/constants/admin';
import { listAdminPastWorkYears } from '@/lib/admin/pastWork';
import type { PastWorkAdminSlug } from '@/constants/admin';

export const metadata: Metadata = {
  title: 'Past Work',
};

const FLASH: Record<string, string> = {
  deleted: 'Year deleted.',
  invalid: 'That request was invalid.',
};

function labelFor(slug: string) {
  return (
    PAST_WORK_COMMITTEE_OPTIONS.find((option) => option.value === slug)
      ?.label ?? slug
  );
}

type PageProps = {
  searchParams: Promise<{
    deleted?: string;
    error?: string;
    committee?: string;
  }>;
};

export default async function AdminPastWorkPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter =
    params.committee && isPastWorkAdminSlug(params.committee)
      ? (params.committee as PastWorkAdminSlug)
      : undefined;

  const years = await listAdminPastWorkYears(filter);
  const flash =
    (params.deleted && FLASH.deleted) ||
    (params.error ? FLASH[params.error] ?? 'Something went wrong.' : null);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
            Past Work
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Yearly timelines shown under Members on each committee page.
          </p>
        </div>
        <Button href="/admin/past-work/new" size="sm">
          Add year
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/past-work"
          className={`rounded-md px-3 py-1.5 text-sm ${
            !filter
              ? 'bg-brand-800 text-white'
              : 'bg-cream-100 text-brand-800 hover:bg-cream-200'
          }`}
        >
          All
        </Link>
        {PAST_WORK_COMMITTEE_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={`/admin/past-work?committee=${option.value}`}
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

      {years.length === 0 ? (
        <p className="mt-10 rounded-lg border border-cream-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
          No years yet.{' '}
          <Link
            href="/admin/past-work/new"
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
                <th className="px-4 py-3 font-semibold">Committee</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Bullets</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {years.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-cream-100 last:border-0"
                >
                  <td className="px-4 py-3 text-stone-600">
                    {labelFor(row.committeeSlug)}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-900">
                    {row.year}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{row.itemCount}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/past-work/${row.id}`}
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
