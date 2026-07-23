export const aboutDbdc = {
  intro:
    'Established by the Bishop of Hong Kong, the Diocesan Building and Development Commission (DBDC) commenced office on 1 December 1995.',
  objectives: [
    "Research and study on the Diocese's pastoral and community service needs and formulation of building development plans to meet such needs.",
    'Execution of development plans approved by the Bishop.',
  ],
  scopeOfWork: [
    'Presenting a Report on building projects and a budget to the Bishop every two years.',
    'Providing assistance to the Diocese on lands matters.',
    'Setting up guidelines on building repair and maintenance.',
    'Liaising and coordinating with the Parish and other Diocesan organizations, as well as professional consultants, in the design and implementation of building projects.',
    'Supervising and assessing the performance of Contractors, Surveyors, Engineers and other Professionals working on the projects.',
  ],
  organization: [
    'Under the Commission, three Committees and a Building Professional Advisory Group (known as CaBPAG) have been established, each with specific work objectives which are separately described.',
    'To deal with individual parish projects, Project Task Forces comprising Parish Priests and representatives of Parish Council, Diocesan Liturgy Commission and DBDC are also formed when required. The daily operation of the Commission is managed by a DBDC Office headed by the Administrator with 6 full-time staff. The Office is tasked to implement the decisions of the Commission and provide professional and technical support in the development, maintenance and repair of buildings of the Diocese.',
  ],
  membersIntro:
    'Members of the Commission are appointed by the Bishop of Hong Kong for a term of two years, renewable on expiry.',
};

export type MemberGroup = {
  title: string;
  members: string[];
};

/**
 * Fallback membership used only if Supabase is unreachable.
 * Live data comes from `committee_members` where committee_slug = 'dbdc'.
 */
export const memberGroups: MemberGroup[] = [
  {
    title: 'Ex-officio Members',
    members: ['Bishop Joseph HA, OFM', 'Rev David CHAN', 'Rev Francis Xavier WONG'],
  },
  {
    title: 'Chairperson',
    members: ['Mr Philip KWOK'],
  },
  {
    title: 'Vice-Chairperson',
    members: ['Mr WONG Wai-kwong'],
  },
];

export const fallbackAppointedMembers: string[] = [
  'Rev Joseph LIU',
  'Rev Thomas LAW',
  'Mr Albert CHAN',
  'Ms Teresa CHU',
  'Mr Bosco FUNG',
  'Ms FUNG Yin-suen, Ada',
  'Mr HO Kin-wai, Stephen',
  'Mr HO Tat Hei, Michael',
  'Mr KWAN Wai-ming, Laurence',
  'Deacon LAM Sair-ling',
  'Prof LAU Kwok-yu',
  'Mr LAW Chi-wai, Alain',
  'Mr LEUNG Sai-ho, Edward',
  'Mr Simon LI',
  'Mrs MAK TANG Pik-yee, Agnes',
  'Mr WONG Po-lung, John',
  'Prof Anthony YEH',
];

export const administrator = 'Mr Patrick TAM';