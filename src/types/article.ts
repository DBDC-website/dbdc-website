/** UI-facing article shape mapped from Supabase `articles`. */
export interface ArticlePdf {
  id: number;
  /** Roman numeral label, e.g. "I", "II". */
  label: string;
  title: string;
  author: string | null;
  /** Display date, e.g. "Sep 2011". */
  date: string;
  /** Public PDF URL (Supabase Storage or absolute path). */
  href: string;
  sortOrder: number;
}

export type ArticleRow = {
  id: number;
  label: string;
  label_en?: string | null;
  label_zh_hant?: string | null;
  label_zh_hans?: string | null;
  title: string;
  title_en?: string | null;
  title_zh_hant?: string | null;
  title_zh_hans?: string | null;
  author: string | null;
  date: string;
  pdf_url: string;
  sort_order: number;
  created_at?: string;
};
