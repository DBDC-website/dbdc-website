export type FaqAnswerBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; style: 'ordered' | 'unordered'; items: string[] }
  | { kind: 'link'; href: string; label: string }
  | { kind: 'table'; headers: [string, string]; rows: [string, string][] }
  | {
      kind: 'contacts';
      items: { type: 'email' | 'fax' | 'phone'; label: string; value: string }[];
    };

export interface FaqItem {
  number: number;
  question: string;
  answer: FaqAnswerBlock[];
}

export interface PreambleConsideration {
  label: string;
  text: string;
  subItems?: string[];
}

export interface ParishSchoolPreamble {
  intro: string;
  leadIn: string;
  considerations: PreambleConsideration[];
}

export interface ExternalLink {
  name: string;
  href: string;
  description?: string;
}

export interface ParishSchoolContact {
  intro: string;
  /** App path without locale prefix, e.g. "/parish-school/guidelines". */
  guidelinesPath: string;
  guidelinesLabel: string;
  phone: string;
  email: string;
}

export interface ResourceLink extends ExternalLink {
  external?: boolean;
}
