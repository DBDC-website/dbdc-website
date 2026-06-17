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
    'Members of the Commission are appointed by the Bishop of Hong Kong for a term of two years, renewable on expiry. The current membership comprises:',
};

export type MemberGroup = {
  title: string;
  members: string[];
};

export const memberGroups: MemberGroup[] = [
  {
    title: 'Ex-officio Members',
    members: ['Most Rev. Joseph Ha, OFM', 'Rev. David Chan'],
  },
  {
    title: 'Chairperson',
    members: ['Mr. Philip Kwok'],
  },
  {
    title: 'Vice-Chairperson',
    members: ['Mr. Wong Wai-kwong'],
  },
  {
    title: 'Appointed Members',
    members: [
      'Rev. Thomas Law',
      'Deacon Ip Wai Wing, Julian',
      'Deacon Lam Sair-ling, Faustus',
      'Mr. Albert Chan',
      'Mr. Joseph Chan',
      'Ms. Teresa Chu',
      'Mr. Bosco Fung',
      'Ms. Fung Yin-suen, Ada',
      'Mr. Stephen Ho',
      'Mr. Ken Lam',
      'Dr. Lau Kwok-yu',
      'Mr. Leung King-wai',
      'Mr. Leung Sai-ho, Edward',
      'Mr. Simon Li',
      'Mrs. Mak Tang Pik-yee, Agnes',
      'Mr. Wong Po-lung, John',
      'Ms. Woo Shih-yung, Alice',
      'Prof. Yeh Gar-on, Anthony',
    ],
  },
];

export const administrator = 'Mr. Tam Sze-lam, Patrick';
