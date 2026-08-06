'use client';

import { reorderCabpagNewsletters } from '@/app/admin/actions/newsletters';
import AdminSortableTable from '@/components/admin/AdminSortableTable';
import type { AdminCabpagNewsletter } from '@/lib/admin/newsletters';

type NewslettersSortableTableProps = {
  newsletters: AdminCabpagNewsletter[];
};

export default function NewslettersSortableTable({
  newsletters,
}: NewslettersSortableTableProps) {
  return (
    <AdminSortableTable
      items={newsletters}
      headers={['Name', 'Date', 'Source', 'Status', 'Order']}
      editHref={(item) => `/admin/newsletters/${item.id}`}
      onReorder={reorderCabpagNewsletters}
      renderCells={(item, index) => (
        <>
          <td className="max-w-md px-4 py-3 font-medium text-brand-900">
            {item.titleEn}
          </td>
          <td className="whitespace-nowrap px-4 py-3 text-stone-600">
            {item.dateLabel}
          </td>
          <td className="px-4 py-3 text-stone-600">
            {item.pdfUrl ? 'PDF' : item.externalUrl ? 'Link' : '—'}
          </td>
          <td className="px-4 py-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                item.active
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {item.active ? 'Published' : 'Hidden'}
            </span>
          </td>
          <td className="px-4 py-3 text-stone-600">{index + 1}</td>
        </>
      )}
    />
  );
}
