import type { Committee, CommitteeSlug } from '@/types/committee';

/**
 * Committee content for Sprint 1.
 * Each committee exposes only the subsections defined in the user requirements.
 */
export const committees: Committee[] = [
  {
    slug: 'rdc',
    abbreviation: 'R&DC',
    name: 'Research and Development Committee',
    summary:
      'Studies the pastoral and community-service needs of the Diocese and formulates building development plans to meet them.',
    sections: [
      {
        title: 'Objectives',
        content: {
          kind: 'list',
          items: [
            'Research and study on the Diocese’s pastoral and community service needs.',
            'Formulation of building development plans to meet such needs.',
            'Presentation of recommendations to the Commission and the Bishop.',
          ],
        },
      },
      {
        title: 'Current and Past Chairmen',
        content: {
          kind: 'list',
          items: [
            'Current Chairman: Placeholder Name (to be confirmed)',
            'Past Chairman: Placeholder Name (2018–2020)',
            'Past Chairman: Placeholder Name (2016–2018)',
          ],
        },
      },
      {
        title: 'Past Work',
        content: {
          kind: 'list',
          items: [
            'Completed parish development needs assessment framework.',
            'Prepared recommendations for long-term diocesan facility planning.',
            'Reviewed priority proposals for parish and school facility upgrades.',
          ],
        },
      },
    ],
  },
  {
    slug: 'sc',
    abbreviation: 'SC',
    name: 'Selection Committee',
    summary:
      'Oversees the selection of consultants and contractors to ensure fair, transparent, and quality-driven procurement.',
    sections: [
      {
        title: 'Objectives',
        content: {
          kind: 'list',
          items: [
            'Review and shortlist consultants and contractors for diocesan projects.',
            'Recommend appointments to the Commission in a fair and transparent manner.',
            'Uphold quality and integrity in the selection process.',
          ],
        },
      },
      {
        title: 'Current Chairman',
        content: {
          kind: 'list',
          items: ['Placeholder Name (to be confirmed)'],
        },
      },
    ],
  },
  {
    slug: 'wc',
    abbreviation: 'WC',
    name: 'Works Committee',
    summary:
      'Supervises the implementation of approved projects, monitoring quality, programme, and budget.',
    sections: [
      {
        title: 'Objectives',
        content: {
          kind: 'list',
          items: [
            'Monitor construction progress and quality on approved projects.',
            'Review project budgets, variations, and programme milestones.',
            'Assess the performance of appointed consultants and contractors.',
          ],
        },
      },
      {
        title: 'Current Chairman',
        content: {
          kind: 'list',
          items: ['Placeholder Name (to be confirmed)'],
        },
      },
    ],
  },
  {
    slug: 'cabpag',
    abbreviation: 'CABPAG',
    name: 'Catholic Building Professional Advisory Group',
    summary:
      'A group of Catholic building professionals providing voluntary technical advice to the Commission.',
    sections: [
      {
        title: 'History and Background',
        content: {
          kind: 'list',
          items: [
            'The Catholic Building Professional Advisory Group (CaBPAG) was established to provide voluntary professional advice to the DBDC.',
            'Members are Catholic building professionals who contribute their expertise to support parishes and diocesan organisations.',
          ],
        },
      },
      {
        title: 'Objectives',
        content: {
          kind: 'list',
          items: [
            'Provide professional and technical guidance to the Commission.',
            'Support parishes with specialist building and development expertise.',
            'Advise on industry standards and best practice.',
          ],
        },
      },
      {
        title: 'Roles and Function',
        content: {
          kind: 'list',
          items: [
            'Offer advisory input on technical feasibility and design matters.',
            'Support review of maintenance and conservation proposals.',
            'Assist parishes on specialist technical questions referred by the DBDC.',
          ],
        },
      },
      {
        title: 'Organization',
        content: {
          kind: 'list',
          items: [
            'The group operates under the DBDC and is convened by a designated chairperson.',
            'Members are drawn from relevant building and development professions.',
          ],
        },
      },
      {
        title: 'Membership',
        content: {
          kind: 'list',
          items: [
            'Membership comprises Catholic professionals in architecture, engineering, surveying, and related fields.',
            'Full member list to be published when confirmed by the DBDC Office.',
          ],
        },
      },
      {
        title: 'Recruitment',
        content: {
          kind: 'list',
          items: [
            'Recruitment of new members is conducted periodically based on professional needs.',
            'Application details and eligibility criteria will be published here.',
          ],
        },
      },
      {
        title: 'Q & A',
        content: {
          kind: 'faq',
          items: [
            {
              question: 'Who can join CaBPAG?',
              answer:
                'Catholic building professionals with relevant qualifications and experience may apply when recruitment is open.',
            },
            {
              question: 'Is membership paid?',
              answer:
                'Membership is voluntary. Members contribute their professional expertise on an advisory basis.',
            },
            {
              question: 'How are enquiries handled?',
              answer:
                'Parishes and schools should contact the DBDC Office first. Technical matters may be referred to CaBPAG as appropriate.',
            },
          ],
        },
      },
    ],
  },
];

export function getCommittee(slug: CommitteeSlug): Committee | undefined {
  return committees.find((committee) => committee.slug === slug);
}
