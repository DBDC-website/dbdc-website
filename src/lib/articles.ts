import { supabase } from '@/lib/supabaseClient';
import { normalizeStorageUrl } from '@/lib/projects';
import type { ArticlePdf, ArticleRow } from '@/types/article';

const ARTICLE_SELECT = 'id, label, title, author, date, pdf_url, sort_order';

export function mapArticleRow(row: ArticleRow): ArticlePdf {
  return {
    id: row.id,
    label: row.label,
    title: row.title,
    author: row.author?.trim() ? row.author.trim() : null,
    date: row.date,
    href: normalizeStorageUrl(row.pdf_url) ?? row.pdf_url,
    sortOrder: row.sort_order,
  };
}

export async function getArticles(): Promise<ArticlePdf[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }

  return (data as ArticleRow[] | null)?.map(mapArticleRow) ?? [];
}
