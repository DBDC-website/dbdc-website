export type CommitteeSlug = 'rdc' | 'sc' | 'wc' | 'cabpag';

/** Slugs stored in `committee_members.committee_slug` (includes main commission). */
export type CommitteeMemberSlug = CommitteeSlug | 'dbdc';

export type CommitteeMember = {
  id: number;
  committeeSlug: CommitteeMemberSlug;
  /** Display name for the active locale (authored Chinese if present). */
  name: string;
  /** Authored Chinese names — never machine-translated. */
  nameZhHant?: string | null;
  nameZhHans?: string | null;
  /** Localized role for display. */
  role: string | null;
  /** English role for grouping / detection (`role_en` ?? legacy `role`). */
  roleEn: string | null;
  sortOrder: number;
  active: boolean;
};

export type CommitteeMemberRow = {
  id: number;
  committee_slug: CommitteeMemberSlug;
  name: string;
  name_zh_hant?: string | null;
  name_zh_hans?: string | null;
  role: string | null;
  role_en?: string | null;
  role_zh_hant?: string | null;
  role_zh_hans?: string | null;
  sort_order: number;
  active: boolean;
};

/** A single expandable subsection on a committee detail page. */
export type CommitteeSection = {
  title: string;
  /** Bullet list content for Sprint 1 placeholders. */
  items: string[];
};

/** Q&A pair used only in the CaBPAG section. */
export type CommitteeFaqItem = {
  question: string;
  /** Single paragraph, or bullet points when multiple strings. */
  answer: string | string[];
};

export type CommitteeFaqGroup = {
  title: string;
  items: CommitteeFaqItem[];
};

export type CommitteeLinkItem = {
  name: string;
  dateLabel: string;
  href: string;
};

export type CommitteeSectionContent =
  | { kind: 'list'; items: string[] }
  | { kind: 'faq'; items: CommitteeFaqItem[] }
  | { kind: 'faq-groups'; groups: CommitteeFaqGroup[] }
  | { kind: 'links'; items: CommitteeLinkItem[]; emptyMessage?: string; description?: string };

export type CommitteeDetailSection = {
  title: string;
  content: CommitteeSectionContent;
  /** When true, the section renders as a closed-by-default dropdown. */
  collapsible?: boolean;
};

export interface Committee {
  slug: CommitteeSlug;
  name: string;
  abbreviation: string;
  summary: string;
  /** Ordered subsections — each committee defines exactly what the requirements specify. */
  sections: CommitteeDetailSection[];
}
