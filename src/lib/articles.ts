import type { Locale } from '@/constants/i18n';
import { defaultLocale } from '@/constants/i18n';
import { pickLocalized } from '@/lib/i18n/pickLocalized';
import { normalizeStorageUrl } from '@/lib/projects';
import { supabase } from '@/lib/supabaseClient';
import type { ArticlePdf, ArticleRow } from '@/types/article';

const ARTICLE_SELECT_LEGACY =
  'id, label, title, author, date, pdf_url, sort_order';

const ARTICLE_SELECT = `
  ${ARTICLE_SELECT_LEGACY},
  label_en,
  label_zh_hant,
  label_zh_hans,
  title_en,
  title_zh_hant,
  title_zh_hans
`;

export function mapArticleRow(
  row: ArticleRow,
  locale: Locale = defaultLocale,
): ArticlePdf {
  const record = row as unknown as Record<string, unknown>;

  return {
    id: row.id,
    label: pickLocalized(record, 'label', locale),
    title: pickLocalized(record, 'title', locale),
    author: row.author?.trim() ? row.author.trim() : null,
    date: row.date,
    href: normalizeStorageUrl(row.pdf_url) ?? row.pdf_url ?? '',
    sortOrder: row.sort_order,
  };
}

export async function getArticles(
  locale: Locale = defaultLocale,
): Promise<ArticlePdf[]> {
  const primary = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  const result =
    primary.error != null
      ? await supabase
          .from('articles')
          .select(ARTICLE_SELECT_LEGACY)
          .order('sort_order', { ascending: true })
          .order('id', { ascending: true })
      : primary;

  if (result.error) {
    console.error('Failed to fetch articles:', result.error);
    return [];
  }

  return (
    (result.data as ArticleRow[] | null)?.map((row) =>
      mapArticleRow(row, locale),
    ) ?? []
  );
}
