import type { Committee, CommitteeSlug } from '@/types/committee';

/**
 * Static committee metadata and narrative sections.
 * Live member lists are loaded from Supabase `committee_members`.
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
        title: 'Past Work',
        content: {
          kind: 'list',
          items: [
            'Completed parish development needs assessment framework.',
            'Prepared recommendations for long-term Diocesan facility planning.',
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
            'Review and shortlist consultants and contractors for Diocesan projects.',
            'Recommend appointments to the Commission in a fair and transparent manner.',
            'Uphold quality and integrity in the selection process.',
          ],
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
    ],
  },
  {
    slug: 'cabpag',
    abbreviation: 'CaBPAG',
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
            'Members are Catholic building professionals who contribute their expertise to support parishes and Diocesan organisations.',
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
