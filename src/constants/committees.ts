import type { Committee, CommitteeSlug } from '@/types/committee';

/**
 * The three committees and the advisory group under the DBDC.
 * Placeholder details for Sprint 1 — to be refined with final content.
 */
export const committees: Committee[] = [
  {
    slug: 'rdc',
    abbreviation: 'R&DC',
    name: 'Research and Development Committee',
    summary:
      'Studies the pastoral and community-service needs of the Diocese and formulates building development plans to meet them.',
    objectives: [
      'Research diocesan pastoral and community-service needs.',
      'Formulate and prioritise building development proposals.',
      'Advise the Commission on long-term development strategy.',
    ],
    currentChairmen: ['Rev. Placeholder Name (Current Chairman)'],
    pastChairmen: [
      'Fr. Placeholder Name (2020–2022)',
      'Mr. Placeholder Name (2018–2020)',
    ],
    pastWork: [
      'Completed parish development needs assessment framework.',
      'Prepared recommendations for long-term diocesan facility planning.',
    ],
    currentWork: [
      'Reviewing priority proposals for parish and school facility upgrades.',
      'Updating planning criteria for future development submissions.',
    ],
    organization: [
      'The committee includes clergy and lay professionals with planning and development expertise.',
    ],
    members: ['Member list placeholder (to be provided by DBDC Office).'],
  },
  {
    slug: 'sc',
    abbreviation: 'SC',
    name: 'Selection Committee',
    summary:
      'Oversees the selection of consultants and contractors to ensure fair, transparent, and quality-driven procurement.',
    objectives: [
      'Review and shortlist consultants and contractors.',
      'Recommend appointments to the Commission.',
      'Uphold transparency and fairness in selection.',
    ],
    currentChairmen: ['Mr. Placeholder Name (Current Chairman)'],
    pastChairmen: ['Sr. Placeholder Name (2019–2021)'],
    pastWork: [
      'Reviewed consultant and contractor panel renewal exercises.',
      'Enhanced evaluation criteria for tender and selection review.',
    ],
  },
  {
    slug: 'wc',
    abbreviation: 'WC',
    name: 'Works Committee',
    summary:
      'Supervises the implementation of approved projects, monitoring quality, programme, and budget.',
    objectives: [
      'Monitor construction progress and quality.',
      'Review project budgets and variations.',
      'Assess the performance of appointed professionals.',
    ],
    currentChairmen: ['Mr. Placeholder Name (Current Chairman)'],
    pastChairmen: ['Mr. Placeholder Name (2017–2020)'],
    pastWork: [
      'Supervised major parish renovation works and post-completion review.',
      'Issued site supervision and reporting recommendations.',
    ],
  },
  {
    slug: 'cabpag',
    abbreviation: 'CaBPAG',
    name: 'Catholic Building Professional Advisory Group',
    summary:
      'A group of Catholic building professionals providing voluntary technical advice to the Commission.',
    objectives: [
      'Provide professional and technical guidance.',
      'Support parishes with specialist expertise.',
      'Advise on industry standards and best practice.',
    ],
    currentChairmen: ['Group Convener: Placeholder Name'],
    pastChairmen: ['Past Convener: Placeholder Name (2018–2021)'],
    pastWork: [
      'Provided advisory support on technical feasibility and maintenance strategy.',
      'Contributed professional input to heritage and conservation proposals.',
    ],
  },
];

export function getCommittee(slug: CommitteeSlug): Committee | undefined {
  return committees.find((committee) => committee.slug === slug);
}
