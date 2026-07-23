import type { Metadata } from 'next';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import { listRegistrations } from '@/lib/admin/registrations';

export const metadata: Metadata = {
  title: 'Registrations',
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-HK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default async function AdminRegistrationsPage() {
  const registrations = await listRegistrations();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
            Registrations
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Consultant and contractor submissions, newest first.
          </p>
        </div>
        <p className="text-sm text-stone-500">{registrations.length} total</p>
      </div>

      {registrations.length === 0 ? (
        <p className="mt-10 rounded-lg border border-cream-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
          No registrations yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-cream-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((item) => (
                <tr
                  key={`${item.type}-${item.id}`}
                  className="border-b border-cream-100 last:border-0"
                >
                  <td className="px-4 py-3 capitalize text-stone-700">
                    {item.type}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-900">
                    {item.companyName}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {item.email ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-stone-600">
                    {formatDate(item.submittedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/registrations/${item.type}/${item.id}`}
                      className="font-medium text-brand-800 hover:underline"
                    >
                      View
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
