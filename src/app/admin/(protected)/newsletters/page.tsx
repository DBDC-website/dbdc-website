import type { Metadata } from 'next';
import Link from 'next/link';
import NewslettersSortableTable from '@/components/admin/NewslettersSortableTable';
import Button from '@/components/ui/Button';
import { listAdminCabpagNewsletters } from '@/lib/admin/newsletters';

export const metadata: Metadata = {
  title: 'CaBPAG Newsletters',
};

const FLASH: Record<string, string> = {
  created: 'Newsletter added.',
  deleted: 'Newsletter deleted.',
  invalid: 'That newsletter request was invalid.',
};

type PageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function AdminNewslettersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const newsletters = await listAdminCabpagNewsletters();
  const flash =
    (params.created && FLASH.created) ||
    (params.deleted && FLASH.deleted) ||
    (params.error ? FLASH[params.error] ?? 'Something went wrong.' : null);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
            CaBPAG Newsletters
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Annual newsletters listed on the public CaBPAG committee page.
          </p>
        </div>
        <Button href="/admin/newsletters/new" size="sm">
          Add newsletter
        </Button>
      </div>

      {flash ? (
        <p className="mt-4 rounded-md border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-brand-900">
          {flash}
        </p>
      ) : null}

      {newsletters.length === 0 ? (
        <p className="mt-10 rounded-lg border border-cream-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
          No newsletters yet.{' '}
          <Link
            href="/admin/newsletters/new"
            className="font-medium text-brand-800 hover:underline"
          >
            Add the first one
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8">
          <NewslettersSortableTable newsletters={newsletters} />
        </div>
      )}
    </div>
  );
}
