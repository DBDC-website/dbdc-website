/** UI-facing article shape mapped from Supabase `articles`. */
export interface ArticlePdf {
  id: number;
  /** Roman numeral label, e.g. "I", "II". */
  label: string;
  title: string;
  author: string;
  /** Display date, e.g. "Sep 2011". */
  date: string;
  /** Public PDF URL (Supabase Storage or absolute path). */
  href: string;
  sortOrder: number;
}

export type ArticleRow = {
  id: number;
  label: string;
  title: string;
  author: string;
  date: string;
  pdf_url: string;
  sort_order: number;
  created_at?: string;
};
