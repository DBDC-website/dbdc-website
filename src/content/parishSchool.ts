import type { Locale } from '@/constants/i18n';
import {
  faqItems,
  governmentLinks,
  parishSchoolContact,
  parishSchoolPreamble,
} from '@/constants/parishSchool';
import { pickContent } from '@/lib/i18n/pickLocalized';
import type {
  FaqItem,
  ParishSchoolContact,
  ParishSchoolPreamble,
  ResourceLink,
} from '@/types/parishSchool';

const parishSchoolPreambleZhHant: ParishSchoolPreamble = {
  intro:
    '以下一組問答旨在協助堂區規劃及進行各類樓宇維修、改善、建造或翻新工程，並適當參考相關程序及堂區常見問題。',
  leadIn: '一般而言，應首先考慮以下事項：',
  considerations: [
    {
      label: '工程類別',
      text: '',
      subItems: [
        '（1.1）日常維修（例如更換水龍頭或燈泡），或緊急維修（例如喉管堵塞或爆裂）——堂區可直接委任合資格工人或承建商進行工程。',
        '（1.2）其他主要聖堂樓宇維修、改善、建造或改建工程——請參閱以下常見問題的答案。',
      ],
    },
    {
      label: '主教批准',
      text: '除日常維修外，所有其他樓宇改善、改建或加建，以及建造工程，不論工程費用多少，均須先取得主教書面批准方可進行；並須遵從相關法例。',
    },
    {
      label: '保險',
      text: '進行工程的承建商必須按工程類別及規模購買有效保險，包括但不限於僱員及第三者保險，以保障教區及堂區的利益。',
    },
    {
      label: '法律合規',
      text: '進行各類維修、改善、改建或加建工程時，必須遵從香港現行法例及規例（例如有關小型工程、能源效益的法例，以及屋宇署與機電工程署的規例及指引）；並只應委任已向政府註冊的相關承建商進行工程。',
    },
  ],
};

const parishSchoolPreambleZhHans: ParishSchoolPreamble = {
  intro:
    '以下一组问答旨在协助堂区规划及进行各类楼宇维修、改善、建造或翻新工程，并适当参考相关程序及堂区常见问题。',
  leadIn: '一般而言，应首先考虑以下事项：',
  considerations: [
    {
      label: '工程类别',
      text: '',
      subItems: [
        '（1.1）日常维修（例如更换水龙头或灯泡），或紧急维修（例如喉管堵塞或爆裂）——堂区可直接委任合资格工人或承建商进行工程。',
        '（1.2）其他主要圣堂楼宇维修、改善、建造或改建工程——请参阅以下常见问题的答案。',
      ],
    },
    {
      label: '主教批准',
      text: '除日常维修外，所有其他楼宇改善、改建或加建，以及建造工程，不论工程费用多少，均须先取得主教书面批准方可进行；并须遵从相关法例。',
    },
    {
      label: '保险',
      text: '进行工程的承建商必须按工程类别及规模购买有效保险，包括但不限于雇员及第三者保险，以保障教区及堂区的利益。',
    },
    {
      label: '法律合规',
      text: '进行各类维修、改善、改建或加建工程时，必须遵从香港现行法例及规例（例如有关小型工程、能源效益的法例，以及屋宇署与机电工程署的规例及指引）；并只应委任已向政府注册的相关承建商进行工程。',
    },
  ],
};

const faqItemsZhHant: FaqItem[] = [
  {
    number: 1,
    question: '進行樓宇維修工程時應聘用哪類承建商？',
    answer: [
      {
        kind: 'paragraph',
        text: '這取決於工程類別及項目費用：',
      },
      {
        kind: 'list',
        style: 'unordered',
        items: [
          '（1.1）日常維修或緊急修理工程——堂區可聘用日常接觸或鄰近的合資格工程人員／公司。',
          '（1.2）涉及小型工程的項目——只應聘用合資格的小型工程承建商。',
          '（1.3）大型維修工程——必須只聘用政府註冊建築承建商。如有需要，可參閱本網站上經委員會審核及批准的政府註冊公司名單：',
        ],
      },
      {
        kind: 'link',
        href: 'https://dbdc.catholic.org.hk/Parish/contractors.html',
        label: '教區建築及發展委員會 — 政府註冊承建商',
      },
    ],
  },
  {
    number: 2,
    question: '屋宇署對進行樓宇維修工程的承建商有何現行要求？',
    answer: [
      {
        kind: 'paragraph',
        text: '基本上，業主必須聘用政府註冊的合資格及持牌人士及承建商，以申請及進行相關工程。如項目屬小型工程定義範圍，可由合資格及註冊的小型工程承建商進行，並由該承建商向屋宇署提交項目詳情及相關申請以供批准。有關小型樓宇工程的資料，請參閱以下屋宇署網頁連結：',
      },
      {
        kind: 'link',
        href: 'https://www.bd.gov.hk/english/services/index_mwcs.html',
        label: '屋宇署 — 小型工程監管制度',
      },
    ],
  },
  {
    number: 3,
    question:
      '規劃需要向屋宇署申請的聖堂樓宇維修、改善、加建或改建工程時，堂區是否需要通知教區？',
    answer: [
      {
        kind: 'paragraph',
        text: '由於主教是教區內所有天主教物業的註冊業主，堂區在進行任何需要向屋宇署提交申請的工程項目或大型樓宇維修前，必須先將建議（包括項目費用及預算）呈交主教批准。如項目涉及禮儀空間的改動，堂區必須先諮詢教區禮儀委員會。',
      },
      {
        kind: 'paragraph',
        text: '日常樓宇維修及緊急修理工程可由堂區自行處理。',
      },
    ],
  },
  {
    number: 4,
    question:
      '若堂區已籌得足夠資金，並擬自行承擔全部工程費用及相關顧問費，可否即時進行工程？',
    answer: [
      {
        kind: 'paragraph',
        text: '進行工程前，必須先向主教提交書面建議，並取得書面許可。',
      },
    ],
  },
  {
    number: 5,
    question:
      '堂區樓宇工程或大型維修項目是否必須由教區建築及發展委員會監督？',
    answer: [
      {
        kind: 'paragraph',
        text: '若堂區已取得主教書面批准，並有足夠專業及技術人員規劃及監督整個項目，堂區可自行處理工程。委員會不會派遣職員參與堂區的工程團隊或監督相關工程。若堂區認為需要委員會協助，可在向主教提交工程申請時提出要求。',
      },
    ],
  },
  {
    number: 6,
    question:
      '堂區是否需要就工程項目的技術協助向教區建築及發展委員會支付費用？',
    answer: [
      {
        kind: 'paragraph',
        text: '堂區無需就委員會的技術協助支付費用。惟超出委員會團隊範圍的專業服務，例如工料測量師服務、查冊費用及其他代堂區支付的實際開支，則會經教區總務處向堂區收取。教區建築及發展委員會由主教成立，其工作範圍之一是協助堂區處理土地及樓宇建造事宜。',
      },
    ],
  },
  {
    number: 7,
    question:
      '堂區收到政府（例如屋宇署、地政總署、消防處、機電工程署、土力工程處）有關其樓宇及斜坡的書面通知時應如何處理？',
    answer: [
      {
        kind: 'paragraph',
        text: '應盡快以電郵或傳真將通知書及相關來往函件送交教區總務處，以便統籌及處理。',
      },
      {
        kind: 'contacts',
        items: [
          {
            type: 'email',
            label: '電郵',
            value: 'procura@hkdioceseprocura.org.hk',
          },
          { type: 'fax', label: '傳真', value: '2868-4118' },
        ],
      },
    ],
  },
  {
    number: 8,
    question: '堂區是否需要透過書面報價或書面招標選取工程公司？',
    answer: [
      {
        kind: 'paragraph',
        text: '選取方法視乎項目複雜程度及預算費用而定。可參考教區採用的以下基本指引：',
      },
      {
        kind: 'table',
        headers: ['工程費用', '投標／報價數目'],
        rows: [
          ['少於 $50,000', '最少 1 份報價'],
          ['$50,000 至 $500,000', '最少 3 份報價'],
          ['$500,000 至 $100 萬', '最少 5 份報價'],
          ['$100 萬至 $300 萬', '選擇性招標，最少 5 家承建商'],
          ['超過 $300 萬', '公開招標，最少 5 家承建商'],
        ],
      },
      {
        kind: 'paragraph',
        text: '如需工料測量師協助評估報價或投標是否合理，可聯絡委員會以協助安排。惟堂區須自行支付工料測量師費用。如有任何疑問，請電郵至委員會：',
      },
      {
        kind: 'contacts',
        items: [
          {
            type: 'email',
            label: '電郵',
            value: 'office@hkdbdc.org.hk',
          },
        ],
      },
    ],
  },
  {
    number: 9,
    question: '升降機及自動梯安全使用有何現行法律要求？',
    answer: [
      {
        kind: 'paragraph',
        text: '堂區作為物業管理人，應聘用相關合資格承建商按法例進行定期保養，以確保升降機／自動梯安全。升降機／自動梯必須在適當位置張貼由政府發出的有效許可證（該許可證須每年由保養承建商向政府申請續期）。法例亦要求物業管理人委任負責人監督升降機／自動梯的安全。有關升降機／自動梯的法例及負責人的職責，可參閱以下網頁連結：',
      },
      {
        kind: 'link',
        href: 'https://www.emsd.gov.hk/en/lifts_and_escalators_safety/publications/guidance_notes_guidelines/index.html',
        label: '機電工程署 — 升降機及自動梯安全（指引）',
      },
    ],
  },
];

const faqItemsZhHans: FaqItem[] = [
  {
    number: 1,
    question: '进行楼宇维修工程时应聘用哪类承建商？',
    answer: [
      {
        kind: 'paragraph',
        text: '这取决于工程类别及项目费用：',
      },
      {
        kind: 'list',
        style: 'unordered',
        items: [
          '（1.1）日常维修或紧急修理工程——堂区可聘用日常接触或邻近的合资格工程人员／公司。',
          '（1.2）涉及小型工程的项目——只应聘用合资格的小型工程承建商。',
          '（1.3）大型维修工程——必须只聘用政府注册建筑承建商。如有需要，可参阅本网站上经委员会审核及批准的政府注册公司名单：',
        ],
      },
      {
        kind: 'link',
        href: 'https://dbdc.catholic.org.hk/Parish/contractors.html',
        label: '教区建筑及发展委员会 — 政府注册承建商',
      },
    ],
  },
  {
    number: 2,
    question: '屋宇署对进行楼宇维修工程的承建商有何现行要求？',
    answer: [
      {
        kind: 'paragraph',
        text: '基本上，业主必须聘用政府注册的合资格及持牌人士及承建商，以申请及进行相关工程。如项目属小型工程定义范围，可由合资格及注册的小型工程承建商进行，并由该承建商向屋宇署提交项目详情及相关申请以供批准。有关小型楼宇工程的资料，请参阅以下屋宇署网页链接：',
      },
      {
        kind: 'link',
        href: 'https://www.bd.gov.hk/english/services/index_mwcs.html',
        label: '屋宇署 — 小型工程监管制度',
      },
    ],
  },
  {
    number: 3,
    question:
      '规划需要向屋宇署申请的圣堂楼宇维修、改善、加建或改建工程时，堂区是否需要通知教区？',
    answer: [
      {
        kind: 'paragraph',
        text: '由于主教是教区内所有天主教物业的注册业主，堂区在进行任何需要向屋宇署提交申请的工程项目或大型楼宇维修前，必须先将建议（包括项目费用及预算）呈交主教批准。如项目涉及礼仪空间的改动，堂区必须先咨询教区礼仪委员会。',
      },
      {
        kind: 'paragraph',
        text: '日常楼宇维修及紧急修理工程可由堂区自行处理。',
      },
    ],
  },
  {
    number: 4,
    question:
      '若堂区已筹得足够资金，并拟自行承担全部工程费用及相关顾问费，可否即时进行工程？',
    answer: [
      {
        kind: 'paragraph',
        text: '进行工程前，必须先向主教提交书面建议，并取得书面许可。',
      },
    ],
  },
  {
    number: 5,
    question:
      '堂区楼宇工程或大型维修项目是否必须由教区建筑及发展委员会监督？',
    answer: [
      {
        kind: 'paragraph',
        text: '若堂区已取得主教书面批准，并有足够专业及技术人员规划及监督整个项目，堂区可自行处理工程。委员会不会派遣职员参与堂区的工程团队或监督相关工程。若堂区认为需要委员会协助，可在向主教提交工程申请时提出要求。',
      },
    ],
  },
  {
    number: 6,
    question:
      '堂区是否需要就工程项目的技术协助向教区建筑及发展委员会支付费用？',
    answer: [
      {
        kind: 'paragraph',
        text: '堂区无需就委员会的技术协助支付费用。惟超出委员会团队范围的专业服务，例如工料测量师服务、查册费用及其他代堂区支付的实际开支，则会经教区总务处向堂区收取。教区建筑及发展委员会由主教成立，其工作范围之一是协助堂区处理土地及楼宇建造事宜。',
      },
    ],
  },
  {
    number: 7,
    question:
      '堂区收到政府（例如屋宇署、地政总署、消防处、机电工程署、土力工程处）有关其楼宇及斜坡的书面通知时应如何处理？',
    answer: [
      {
        kind: 'paragraph',
        text: '应尽快以电邮或传真将通知书及相关来往函件送交教区总务处，以便统筹及处理。',
      },
      {
        kind: 'contacts',
        items: [
          {
            type: 'email',
            label: '电邮',
            value: 'procura@hkdioceseprocura.org.hk',
          },
          { type: 'fax', label: '传真', value: '2868-4118' },
        ],
      },
    ],
  },
  {
    number: 8,
    question: '堂区是否需要透过书面报价或书面招标选取工程公司？',
    answer: [
      {
        kind: 'paragraph',
        text: '选取方法视乎项目复杂程度及预算费用而定。可参考教区采用的以下基本指引：',
      },
      {
        kind: 'table',
        headers: ['工程费用', '投标／报价数目'],
        rows: [
          ['少于 $50,000', '最少 1 份报价'],
          ['$50,000 至 $500,000', '最少 3 份报价'],
          ['$500,000 至 $100 万', '最少 5 份报价'],
          ['$100 万至 $300 万', '选择性招标，最少 5 家承建商'],
          ['超过 $300 万', '公开招标，最少 5 家承建商'],
        ],
      },
      {
        kind: 'paragraph',
        text: '如需工料测量师协助评估报价或投标是否合理，可联络委员会以协助安排。惟堂区须自行支付工料测量师费用。如有任何疑问，请电邮至委员会：',
      },
      {
        kind: 'contacts',
        items: [
          {
            type: 'email',
            label: '电邮',
            value: 'office@hkdbdc.org.hk',
          },
        ],
      },
    ],
  },
  {
    number: 9,
    question: '升降机及自动梯安全使用有何现行法律要求？',
    answer: [
      {
        kind: 'paragraph',
        text: '堂区作为物业管理人，应聘用相关合资格承建商按法例进行定期保养，以确保升降机／自动梯安全。升降机／自动梯必须在适当位置张贴由政府发出的有效许可证（该许可证须每年由保养承建商向政府申请续期）。法例亦要求物业管理人委任负责人监督升降机／自动梯的安全。有关升降机／自动梯的法例及负责人的职责，可参阅以下网页链接：',
      },
      {
        kind: 'link',
        href: 'https://www.emsd.gov.hk/en/lifts_and_escalators_safety/publications/guidance_notes_guidelines/index.html',
        label: '机电工程署 — 升降机及自动梯安全（指引）',
      },
    ],
  },
];

const parishSchoolContactZhHant: ParishSchoolContact = {
  intro:
    '如對大型樓宇維修、保養、改善或其他發展工程有任何疑問，請參閱教區建築及發展委員會的工作指引，或以電話或電郵聯絡委員會。',
  guidelinesPath: parishSchoolContact.guidelinesPath,
  guidelinesLabel: '堂區工作指引',
  phone: parishSchoolContact.phone,
  email: parishSchoolContact.email,
};

const parishSchoolContactZhHans: ParishSchoolContact = {
  intro:
    '如对大型楼宇维修、保养、改善或其他发展工程有任何疑问，请参阅教区建筑及发展委员会的工作指引，或以电话或电邮联络委员会。',
  guidelinesPath: parishSchoolContact.guidelinesPath,
  guidelinesLabel: '堂区工作指引',
  phone: parishSchoolContact.phone,
  email: parishSchoolContact.email,
};

const governmentLinksZhHant: ResourceLink[] = [
  {
    name: '屋宇署 — 常見小型工程項目',
    href: 'https://www.bd.gov.hk/en/building-works/minor-works/minor-works-items/index.html',
  },
  {
    name: '屋宇署 — 主頁',
    href: 'https://www.bd.gov.hk/en/index.html',
  },
  {
    name: '土木工程拓展署 — 斜坡資訊系統',
    href: 'https://hkss.cedd.gov.hk/hkss/en/facts-and-figures/slope-information-system/sis/index.html',
  },
  {
    name: '機電工程署 — 升降機及自動梯安全',
    href: 'https://www.emsd.gov.hk/en/lifts_and_escalators_safety/index.html',
  },
  {
    name: '機電工程署 — 電力安全',
    href: 'https://www.emsd.gov.hk/en/electricity_safety/periodic_test_for_fixed_electrical_installations/index.html',
  },
  {
    name: '消防處 — 防火',
    href: 'https://www.hkfsd.gov.hk/eng/fire_protection/',
  },
  {
    name: '地政總署 — 斜坡維修責任系統',
    href: 'https://www2.slope.landsd.gov.hk/smris/',
  },
  {
    name: '城市規劃委員會 — 分區計劃大綱圖',
    href: 'https://www.ozp.tpb.gov.hk/',
  },
];

const governmentLinksZhHans: ResourceLink[] = [
  {
    name: '屋宇署 — 常见小型工程项目',
    href: 'https://www.bd.gov.hk/en/building-works/minor-works/minor-works-items/index.html',
  },
  {
    name: '屋宇署 — 主页',
    href: 'https://www.bd.gov.hk/en/index.html',
  },
  {
    name: '土木工程拓展署 — 斜坡信息系统',
    href: 'https://hkss.cedd.gov.hk/hkss/en/facts-and-figures/slope-information-system/sis/index.html',
  },
  {
    name: '机电工程署 — 升降机及自动梯安全',
    href: 'https://www.emsd.gov.hk/en/lifts_and_escalators_safety/index.html',
  },
  {
    name: '机电工程署 — 电力安全',
    href: 'https://www.emsd.gov.hk/en/electricity_safety/periodic_test_for_fixed_electrical_installations/index.html',
  },
  {
    name: '消防处 — 防火',
    href: 'https://www.hkfsd.gov.hk/eng/fire_protection/',
  },
  {
    name: '地政总署 — 斜坡维修责任系统',
    href: 'https://www2.slope.landsd.gov.hk/smris/',
  },
  {
    name: '城市规划委员会 — 分区计划大纲图',
    href: 'https://www.ozp.tpb.gov.hk/',
  },
];

export function getParishSchoolPreamble(locale: Locale): ParishSchoolPreamble {
  return pickContent(
    {
      en: parishSchoolPreamble,
      'zh-Hant': parishSchoolPreambleZhHant,
      'zh-Hans': parishSchoolPreambleZhHans,
    },
    locale,
  );
}

export function getFaqItems(locale: Locale): FaqItem[] {
  return pickContent(
    { en: faqItems, 'zh-Hant': faqItemsZhHant, 'zh-Hans': faqItemsZhHans },
    locale,
  );
}

export function getParishSchoolContact(locale: Locale): ParishSchoolContact {
  return pickContent(
    {
      en: parishSchoolContact,
      'zh-Hant': parishSchoolContactZhHant,
      'zh-Hans': parishSchoolContactZhHans,
    },
    locale,
  );
}

export function getGovernmentLinks(locale: Locale): ResourceLink[] {
  return pickContent(
    {
      en: governmentLinks,
      'zh-Hant': governmentLinksZhHant,
      'zh-Hans': governmentLinksZhHans,
    },
    locale,
  );
}
