import { createClient } from '@/lib/supabase/server';
import { normalizeStorageUrl } from '@/lib/projects';
import type { ArticleRow } from '@/types/article';

const ADMIN_ARTICLE_SELECT = `
  id,
  label,
  label_en,
  label_zh_hant,
  label_zh_hans,
  title,
  title_en,
  title_zh_hant,
  title_zh_hans,
  author,
  date,
  pdf_url,
  sort_order
`;

export type AdminArticle = {
  id: number;
  /** Display label: English column, else legacy label. */
  label: string;
  labelEn: string;
  labelZhHant: string | null;
  labelZhHans: string | null;
  title: string;
  titleEn: string;
  titleZhHant: string | null;
  titleZhHans: string | null;
  author: string | null;
  date: string;
  pdfUrl: string;
  sortOrder: number;
};

function mapRow(row: ArticleRow): AdminArticle {
  const labelEn = row.label_en?.trim() || row.label;
  const titleEn = row.title_en?.trim() || row.title;

  return {
    id: row.id,
    label: labelEn,
    labelEn,
    labelZhHant: row.label_zh_hant?.trim() || null,
    labelZhHans: row.label_zh_hans?.trim() || null,
    title: titleEn,
    titleEn,
    titleZhHant: row.title_zh_hant?.trim() || null,
    titleZhHans: row.title_zh_hans?.trim() || null,
    author: row.author?.trim() || null,
    date: row.date,
    pdfUrl: normalizeStorageUrl(row.pdf_url) ?? row.pdf_url,
    sortOrder: row.sort_order,
  };
}

export async function listAdminArticles(): Promise<AdminArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(ADMIN_ARTICLE_SELECT)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to list admin articles:', error);
    return [];
  }

  return (data as ArticleRow[] | null)?.map(mapRow) ?? [];
}

export async function getAdminArticle(
  id: number,
): Promise<AdminArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(ADMIN_ARTICLE_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load admin article:', error);
    return null;
  }

  return data ? mapRow(data as ArticleRow) : null;
}

/** Next free position, used when an editor leaves sort order blank. */
export async function nextArticleSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  const { data, error } = await supabase
    .from('articles')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 1;
  return (data.sort_order as number) + 1;
}
