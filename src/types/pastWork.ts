/** Past Work year / bullet types for committee detail pages + admin CMS. */

export type PastWorkCommitteeSlug = 'rdc' | 'sc' | 'wc' | 'cabpag';

export type PastWorkItem = {
  id: number;
  text: string;
  /** Resolved public href: uploaded file wins over external URL. */
  href: string | null;
};

export type PastWorkYear = {
  id: number;
  committeeSlug: PastWorkCommitteeSlug;
  /** Display label, e.g. "2010" or "2018-2021". */
  year: string;
  items: PastWorkItem[];
};

export type PastWorkYearRow = {
  id: number;
  committee_slug: PastWorkCommitteeSlug;
  year: string;
  sort_order: number;
  allows_links?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PastWorkItemRow = {
  id: number;
  year_id: number;
  text: string;
  text_en?: string | null;
  text_zh_hant?: string | null;
  text_zh_hans?: string | null;
  link_url: string | null;
  file_url: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};
