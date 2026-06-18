export type CommitteeSlug = 'rdc' | 'sc' | 'wc' | 'cabpag';

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
