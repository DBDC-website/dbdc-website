export type CommitteeSlug = 'rdc' | 'sc' | 'wc' | 'cabpag';

export interface Committee {
  slug: CommitteeSlug;
  name: string;
  abbreviation: string;
  summary: string;
  responsibilities: string[];
}
