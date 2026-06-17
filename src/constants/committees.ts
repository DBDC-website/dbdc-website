import type { Committee, CommitteeSlug } from '@/types/committee';

/**
 * The three committees and the advisory group under the DBDC.
 * Placeholder responsibilities for Sprint 1 — to be refined with final content.
 */
export const committees: Committee[] = [
  {
    slug: 'rdc',
    abbreviation: 'R&DC',
    name: 'Research and Development Committee',
    summary:
      'Studies the pastoral and community-service needs of the Diocese and formulates building development plans to meet them.',
    responsibilities: [
      'Research diocesan pastoral and community-service needs.',
      'Formulate and prioritise building development proposals.',
      'Advise the Commission on long-term development strategy.',
    ],
  },
  {
    slug: 'sc',
    abbreviation: 'SC',
    name: 'Selection Committee',
    summary:
      'Oversees the selection of consultants and contractors to ensure fair, transparent, and quality-driven procurement.',
    responsibilities: [
      'Review and shortlist consultants and contractors.',
      'Recommend appointments to the Commission.',
      'Uphold transparency and fairness in selection.',
    ],
  },
  {
    slug: 'wc',
    abbreviation: 'WC',
    name: 'Works Committee',
    summary:
      'Supervises the implementation of approved projects, monitoring quality, programme, and budget.',
    responsibilities: [
      'Monitor construction progress and quality.',
      'Review project budgets and variations.',
      'Assess the performance of appointed professionals.',
    ],
  },
  {
    slug: 'cabpag',
    abbreviation: 'CaBPAG',
    name: 'Catholic Building Professional Advisory Group',
    summary:
      'A group of Catholic building professionals providing voluntary technical advice to the Commission.',
    responsibilities: [
      'Provide professional and technical guidance.',
      'Support parishes with specialist expertise.',
      'Advise on industry standards and best practice.',
    ],
  },
];

export function getCommittee(slug: CommitteeSlug): Committee | undefined {
  return committees.find((committee) => committee.slug === slug);
}
