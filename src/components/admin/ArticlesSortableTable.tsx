'use client';

import { reorderArticles } from '@/app/admin/actions/articles';
import AdminSortableTable from '@/components/admin/AdminSortableTable';
import type { AdminArticle } from '@/lib/admin/articles';
import { toRomanLabel } from '@/lib/admin/romanLabel';

const TONE_CLASS = {
  done: 'bg-emerald-50 text-emerald-800',
  partial: 'bg-amber-50 text-amber-800',
  none: 'bg-stone-100 text-stone-600',
} as const;

function translationBadge(hant: string | null, hans: string | null) {
  if (hant && hans) return { label: '繁 简', tone: 'done' as const };
  if (hant || hans) return { label: hant ? '繁' : '简', tone: 'partial' as const };
  return { label: 'EN only', tone: 'none' as const };
}

type ArticlesSortableTableProps = {
  articles: AdminArticle[];
};

export default function ArticlesSortableTable({
  articles,
}: ArticlesSortableTableProps) {
  return (
    <AdminSortableTable
      items={articles}
      headers={['Label', 'Title', 'Date', 'Translations', 'Order']}
      editHref={(article) => `/admin/articles/${article.id}`}
      onReorder={reorderArticles}
      renderCells={(article, index) => {
        const badge = translationBadge(
          article.titleZhHant,
          article.titleZhHans,
        );

        return (
          <>
            <td className="px-4 py-3 text-stone-600">
              {toRomanLabel(index + 1)}
            </td>
            <td className="max-w-md px-4 py-3 font-medium text-brand-900">
              {article.title}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-stone-600">
              {article.date}
            </td>
            <td className="px-4 py-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASS[badge.tone]}`}
              >
                {badge.label}
              </span>
            </td>
            <td className="px-4 py-3 text-stone-600">{index + 1}</td>
          </>
        );
      }}
    />
  );
}
