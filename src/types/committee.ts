export type CommitteeSlug = 'rdc' | 'sc' | 'wc' | 'cabpag';

export interface Committee {
  slug: CommitteeSlug;
  name: string;
  abbreviation: string;
  summary: string;
  objectives: string[];
  currentChairmen: string[];
  pastChairmen: string[];
  pastWork: string[];
  currentWork?: string[];
  organization?: string[];
  members?: string[];
}
