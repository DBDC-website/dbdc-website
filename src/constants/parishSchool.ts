import type { ExternalLink, FaqItem } from '@/types/faq';

export const faqItems: FaqItem[] = [
  {
    question: 'How can a parish start a building or renovation request?',
    answer:
      'Please contact the DBDC Office first for an initial consultation. The detailed workflow and submission requirements will be published here.',
  },
  {
    question: 'What documents are usually required for project review?',
    answer:
      'Typical items include the project background, preliminary scope, site information, and budget references. A complete checklist will be added later.',
  },
  {
    question: 'Can schools and parishes use the same submission process?',
    answer:
      'In general, yes. Specific requirements may vary by project type, and updated guidance will be provided on this page.',
  },
  {
    question: 'How long does a typical project review take?',
    answer:
      'Timelines depend on the scale and complexity of the project. Indicative timeframes will be published once finalised.',
  },
];

/** Placeholder links for now — final URLs to be provided by the DBDC Office. */
export const governmentLinks: ExternalLink[] = [
  { name: 'Buildings Department', href: '#' },
  { name: 'Lands Department', href: '#' },
  { name: 'Planning Department', href: '#' },
  { name: 'Fire Services Department', href: '#' },
  { name: 'Environmental Protection Department', href: '#' },
];
