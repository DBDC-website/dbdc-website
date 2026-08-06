export type CabpagNewsletterRow = {
  id: number;
  title: string;
  title_zh_hant?: string | null;
  title_zh_hans?: string | null;
  published_month: number;
  published_year: number;
  pdf_url: string | null;
  external_url: string | null;
  sort_order: number;
  active: boolean;
};

export type CabpagNewsletter = {
  id: number;
  /** Localized display title. */
  title: string;
  titleEn: string;
  titleZhHant: string | null;
  titleZhHans: string | null;
  publishedMonth: number;
  publishedYear: number;
  /** Formatted month + year for the active locale. */
  dateLabel: string;
  /** Resolved href: PDF upload wins over external link. */
  href: string;
  pdfUrl: string | null;
  externalUrl: string | null;
  sortOrder: number;
  active: boolean;
};
