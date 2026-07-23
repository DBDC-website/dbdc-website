export type CommitteeSlug = 'rdc' | 'sc' | 'wc' | 'cabpag';

/** Slugs stored in `committee_members.committee_slug` (includes main commission). */
export type CommitteeMemberSlug = CommitteeSlug | 'dbdc';

export type CommitteeMember = {
  id: number;
  committeeSlug: CommitteeMemberSlug;
  name: string;
  role: string | null;
  sortOrder: number;
  active: boolean;
};

export type CommitteeMemberRow = {
  id: number;
  committee_slug: CommitteeMemberSlug;
  name: string;
  role: string | null;
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
  answer: string;
};

export type CommitteeSectionContent =
  | { kind: 'list'; items: string[] }
  | { kind: 'faq'; items: CommitteeFaqItem[] };

export type CommitteeDetailSection = {
  title: string;
  content: CommitteeSectionContent;
};

export interface Committee {
  slug: CommitteeSlug;
  name: string;
  abbreviation: string;
  summary: string;
  /** Ordered subsections — each committee defines exactly what the requirements specify. */
  sections: CommitteeDetailSection[];
}
