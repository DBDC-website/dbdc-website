import type {
  FaqItem,
  ParishSchoolContact,
  ParishSchoolPreamble,
  ResourceLink,
} from '@/types/parishSchool';
import { parishGuidelinesPath } from '@/constants/parishGuidelines';

export const parishSchoolPreamble: ParishSchoolPreamble = {
  intro:
    'The following set of Questions and Answers has been prepared with the purpose of assisting Parishes in planning and undertaking various types of building maintenance, improvement, construction or renovation works, with due reference made to the relevant procedures and the problems commonly encountered by the Parishes.',
  leadIn: 'In general, the following are the first considerations:',
  considerations: [
    {
      label: 'Category of Works',
      text: '',
      subItems: [
        '(1.1) Daily maintenance such as replacement of water taps or light bulbs, or emergency maintenance such as blockage or bursting of pipes — Parishes can directly appoint qualified workers or contractors to carry out the works.',
        '(1.2) Other major church building maintenance, improvement, construction or alteration works — please refer to the answers to the Frequently Asked Questions below.',
      ],
    },
    {
      label: 'Bishop approval',
      text:
        'Apart from routine maintenance, all other building improvements, alterations or additions, and construction works, regardless of the project cost, must first have obtained approval in writing by the Bishop before execution; and be carried out in compliance with the relevant legislation.',
    },
    {
      label: 'Insurance',
      text:
        'Contractors carrying out the works must purchase valid insurance in accordance with the type and size of the project, including but not limiting to the insurance of their employees and third parties, to protect the interests of the Diocese and the Parish.',
    },
    {
      label: 'Legal compliance',
      text:
        'The carrying out of various maintenance, improvement, alteration or addition works must be in compliance with the existing laws and regulations in Hong Kong (such as legislation covering minor building works, energy efficiency, and regulations and guidelines of the Buildings Department and the Electrical and Mechanical Services Department); and only relevant contractors registered by the Government should be appointed to carry out the works.',
    },
  ],
};

export const faqItems: FaqItem[] = [
  {
    number: 1,
    question:
      'What kinds of contractors are to be employed to carry out the building maintenance works?',
    answer: [
      {
        kind: 'paragraph',
        text: 'This depends on the type of works and the cost of the project:',
      },
      {
        kind: 'list',
        style: 'unordered',
        items: [
          '(1.1) Routine maintenance or emergency repair works — the Parish can hire qualified engineering personnel / companies that they have regular contact with or are nearby.',
          '(1.2) Projects involving Minor Works — only qualified Minor Works contractors should be employed.',
          '(1.3) Major maintenance works — must hire only a Government-registered building contractor. Please refer if necessary to the list of Government-registered companies that have been reviewed and approved by the Commission on this website:',
        ],
      },
      {
        kind: 'link',
        href: 'https://dbdc.catholic.org.hk/Parish/contractors.html',
        label: 'DBDC — Government-registered contractors',
      },
    ],
  },
  {
    number: 2,
    question:
      'What are the existing requirements of the Buildings Department for contractors carrying out building maintenance works?',
    answer: [
      {
        kind: 'paragraph',
        text: 'Basically, the property owner must employ qualified and licensed persons and contractors registered by the Government in the application for and the carrying out of the relevant works. If the project is within the definition of Minor Works, it may be carried out by a qualified and registered Minor Works contractor who will submit the relevant application with details of the project to the Buildings Department for approval. For related information on minor building works, please refer to the website link of the Buildings Department below:',
      },
      {
        kind: 'link',
        href: 'https://www.bd.gov.hk/english/services/index_mwcs.html',
        label: 'Buildings Department — Minor Works Control System',
      },
    ],
  },
  {
    number: 3,
    question:
      'When planning church building repairs, improvements, addition or alteration works which require application to the Buildings Department, does the Parish need to notify the Diocese?',
    answer: [
      {
        kind: 'paragraph',
        text: 'As the Bishop is the registered owner of all Catholic properties in the Diocese, the Parish must submit their proposal to the Bishop for approval before undertaking any works project or major building maintenance which requires submission to the Buildings Department, including the cost and budget for the project. If the project involves changes to the liturgical space, the Parish must first consult the Diocesan Liturgy Commission.',
      },
      {
        kind: 'paragraph',
        text: 'Day-to-day building maintenance and emergency repair works can be handled by the Parish on their own.',
      },
    ],
  },
  {
    number: 4,
    question:
      'If the Parish has raised sufficient funds and intends to cover the entire cost of the project and related consultancy fees, can the works be carried out straight away?',
    answer: [
      {
        kind: 'paragraph',
        text: 'A written proposal must be submitted to the Bishop for a written permission before the project is carried out.',
      },
    ],
  },
  {
    number: 5,
    question:
      'Is it necessary for the Parish building works or large maintenance projects to be supervised by the Diocesan Building and Development Commission?',
    answer: [
      {
        kind: 'paragraph',
        text: "If the Parish has already received the Bishop's approval in writing and there are sufficient professional and technical staff to plan and supervise the whole project, the Parish can handle the work on their own. The Commission will not send staff to participate in the works team of the Parish or supervise the relevant works. If the Parish considers that there is a need for assistance from the Commission, a request may be made when submitting the project application to the Bishop.",
      },
    ],
  },
  {
    number: 6,
    question:
      'Does the Parish need to pay the Diocesan Building and Development Commission for technical assistance in the works project?',
    answer: [
      {
        kind: 'paragraph',
        text: "The Parish does not need to pay for the technical assistance of the Commission. Professional service provided beyond the Commission's team, such as that of the quantity surveyor, search fees and other actual expenses paid on behalf of the Parish, will however be charged to the Parish through the Diocesan Procuration Office. The Diocesan Building and Development Commission was established by the Bishop, and one of its work areas is to provide assistance to the Parishes in dealing with land and building construction matters.",
      },
    ],
  },
  {
    number: 7,
    question:
      'What should the Parish do on receipt of written notices relating to their buildings and slopes from the Government (such as Buildings Department, Lands Department, Fire Services Department, Electrical and Mechanical Services Department, Geotechnical Engineering Office)?',
    answer: [
      {
        kind: 'paragraph',
        text: 'As soon as possible, the notices and related correspondence should be sent to the Diocesan Procuration Office by e-mail or fax, for coordination and handling.',
      },
      {
        kind: 'contacts',
        items: [
          {
            type: 'email',
            label: 'Email',
            value: 'procura@hkdioceseprocura.org.hk',
          },
          { type: 'fax', label: 'Fax', value: '2868-4118' },
        ],
      },
    ],
  },
  {
    number: 8,
    question:
      'Does the Parish need to select a works company through the submission of quotations in writing or by written tender?',
    answer: [
      {
        kind: 'paragraph',
        text: 'The method of selection is determined by the complexity and the estimated cost of the project. Reference can be made to the following basic guidelines used by the Diocese:',
      },
      {
        kind: 'table',
        headers: ['Project cost', 'Number of tenders'],
        rows: [
          ['Below $50,000', 'Minimum of 1 quotation'],
          ['$50,000 to $500,000', 'At least 3 quotations'],
          ['$500,000 to $1 million', 'At least 5 quotations'],
          ['$1 million to $3 million', 'Selective tender, at least 5 contractors'],
          ['Above $3 million', 'Public tender, at least 5 contractors'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'If you need the assistance of a quantity surveyor to assess the reasonableness of the quotations or tenders, you may contact the Commission for assistance and arrangement. The Parish has however to pay for the cost of the quantity surveyor. If you have any questions, please email to the Commission at:',
      },
      {
        kind: 'contacts',
        items: [
          {
            type: 'email',
            label: 'Email',
            value: 'office@hkdbdc.org.hk',
          },
        ],
      },
    ],
  },
  {
    number: 9,
    question:
      'What are the existing legal requirements for the safe use of lifts and escalators?',
    answer: [
      {
        kind: 'paragraph',
        text: 'The Parish as the manager of the property should employ relevant qualified contractors to carry out regular maintenance required by law to ensure the safety of the lift / escalator. The lift / escalator must be affixed with a valid permit issued by the Government in the appropriate place (this permit must be renewed annually by the Government through an application by the maintenance contractor). The law also requires property managers to appoint a responsible person to oversee the safety of the lifts / escalators. The relevant legislation for lifts / escalators and the responsibilities of the responsible person can be found in the web link below:',
      },
      {
        kind: 'link',
        href: 'https://www.emsd.gov.hk/en/lifts_and_escalators_safety/publications/guidance_notes_guidelines/index.html',
        label: 'EMSD — Lifts and Escalators Safety (Guidance Notes)',
      },
    ],
  },
];

export const parishSchoolContact: ParishSchoolContact = {
  intro:
    'If you have any questions about major building repair, maintenance, improvement or other development works, please refer to the Diocesan Building and Development Commission\'s working guidelines below, or call or e-mail to the Commission.',
  guidelinesPath: parishGuidelinesPath,
  guidelinesLabel: 'Parish working guidelines',
  phone: '2526-3200',
  email: 'office@hkdbdc.org.hk',
};

export const governmentLinks: ResourceLink[] = [
  {
    name: 'Buildings Department - Common Minor Works Items',
    href: 'https://www.bd.gov.hk/en/building-works/minor-works/minor-works-items/index.html',
  },
  {
    name: 'Buildings Department - Home Page',
    href: 'https://www.bd.gov.hk/en/index.html',
  },
  {
    name: 'Civil Engineering and Development Department - Slope Information System',
    href: 'https://hkss.cedd.gov.hk/hkss/en/facts-and-figures/slope-information-system/sis/index.html',
  },
  {
    name: 'Electrical and Mechanical Services Department - Lifts and Escalator Safety',
    href: 'https://www.emsd.gov.hk/en/lifts_and_escalators_safety/index.html',
  },
  {
    name: 'Electrical and Mechanical Services Department - Electricity Safety',
    href: 'https://www.emsd.gov.hk/en/electricity_safety/periodic_test_for_fixed_electrical_installations/index.html',
  },
  {
    name: 'Fire Services Department - Fire Protection',
    href: 'https://www.hkfsd.gov.hk/eng/fire_protection/',
  },
  {
    name: 'Lands Department - Slope Maintenance Responsibility System',
    href: 'https://www2.slope.landsd.gov.hk/smris/',
  },
  {
    name: 'Town Planning Board - Outline Zoning Plan',
    href: 'https://www.ozp.tpb.gov.hk/',
  },
];
