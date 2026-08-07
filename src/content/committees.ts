import type { Locale } from '@/constants/i18n';
import { committees } from '@/constants/committees';
import {
  cabpagFaqGroupsZhHans,
  cabpagFaqGroupsZhHant,
} from '@/content/cabpagFaq';
import { pickContent } from '@/lib/i18n/pickLocalized';
import type { Committee, CommitteeSlug } from '@/types/committee';

const committeesZhHant: Committee[] = [
  {
    slug: 'rdc',
    abbreviation: 'R&DC',
    name: '研究及發展小組',
    summary:
      '研究教區牧民及社區服務需要，並制訂建築發展計劃以配合相關需要。',
    sections: [
      {
        title: '目標',
        content: {
          kind: 'list',
          items: [
            '研究及探討教區牧民及社區服務需要。',
            '制訂建築發展計劃以配合相關需要。',
            '向教區建築及發展委員會及主教提交建議。',
          ],
        },
      },
    ],
  },
  {
    slug: 'sc',
    abbreviation: 'SC',
    name: '遴選小組',
    summary:
      '維持教區建築及發展委員會認可顧問及承建商名單，並監督教區工程項目的公平、透明遴選。',
    sections: [
      {
        title: '目標',
        content: {
          kind: 'list',
          items: [
            '建立及維持教區建築及發展委員會（DBDC）工程項目的認可顧問及承建商名單。',
            '審核及評估申請，以納入教區建築及發展委員會認可顧問及承建商名單。',
            '審視及篩選教區工程項目的顧問及承建商。',
            '以公平及透明的方式向委員會推薦委任人選。',
          ],
        },
      },
    ],
  },
  {
    slug: 'wc',
    abbreviation: 'WC',
    name: '工程小組',
    summary:
      '監督已批核工程項目的推行，監察質素、進度及預算。',
    sections: [
      {
        title: '目標',
        content: {
          kind: 'list',
          items: [
            '監察已批核工程項目的施工進度及質素。',
            '審視工程預算、變更及進度里程碑。',
            '評估已委任顧問及承建商的表現。',
          ],
        },
      },
    ],
  },
  {
    slug: 'cabpag',
    abbreviation: 'CaBPAG',
    name: '天主教建築專業顧問小組',
    summary:
      '由天主教建築專業人士組成，義務向委員會提供技術意見。',
    sections: [
      {
        title: '歷史與背景',
        content: {
          kind: 'list',
          items: [
            '天主教建築專業顧問小組（CaBPAG）成立目的，是義務向教區建築及發展委員會提供專業意見。',
            '成員為天主教建築專業人士，貢獻專長以支援堂區及教區機構。',
          ],
        },
      },
      {
        title: '目標',
        content: {
          kind: 'list',
          items: [
            '向委員會提供專業及技術指導。',
            '以建築及發展方面的專門知識支援堂區。',
            '就業界標準及良好作業提出建議。',
          ],
        },
      },
      {
        title: '角色與職能',
        content: {
          kind: 'list',
          items: [
            '就技術可行性及設計事宜提供顧問意見。',
            '支援維修保養及保育建議的審視。',
            '協助堂區處理由教區建築及發展委員會轉介的專門技術問題。',
          ],
        },
      },
      {
        title: '組織',
        content: {
          kind: 'list',
          items: [
            '本小組在教區建築及發展委員會轄下運作，並由指定主席召集。',
            '成員來自相關建築及發展專業。',
          ],
        },
      },
      {
        title: '招募',
        content: {
          kind: 'list',
          items: [
            '新成員招募會因應專業需要定期進行。',
            '申請詳情及資格準則將在此公布。',
          ],
        },
      },
      {
        title: '常見問題',
        collapsible: true,
        content: {
          kind: 'faq-groups',
          groups: cabpagFaqGroupsZhHant,
        },
      },
    ],
  },
];

const committeesZhHans: Committee[] = [
  {
    slug: 'rdc',
    abbreviation: 'R&DC',
    name: '研究及发展小组',
    summary:
      '研究教区牧民及社区服务需要，并制订建筑发展计划以配合相关需要。',
    sections: [
      {
        title: '目标',
        content: {
          kind: 'list',
          items: [
            '研究及探讨教区牧民及社区服务需要。',
            '制订建筑发展计划以配合相关需要。',
            '向教区建筑及发展委员会及主教提交建议。',
          ],
        },
      },
    ],
  },
  {
    slug: 'sc',
    abbreviation: 'SC',
    name: '遴选小组',
    summary:
      '维持教区建筑及发展委员会认可顾问及承建商名单，并监督教区工程项目的公平、透明遴选。',
    sections: [
      {
        title: '目标',
        content: {
          kind: 'list',
          items: [
            '建立及维持教区建筑及发展委员会（DBDC）工程项目的认可顾问及承建商名单。',
            '审核及评估申请，以纳入教区建筑及发展委员会认可顾问及承建商名单。',
            '审视及筛选教区工程项目的顾问及承建商。',
            '以公平及透明的方式向委员会推荐委任人选。',
          ],
        },
      },
    ],
  },
  {
    slug: 'wc',
    abbreviation: 'WC',
    name: '工程小组',
    summary:
      '监督已批核工程项目的推行，监察质量、进度及预算。',
    sections: [
      {
        title: '目标',
        content: {
          kind: 'list',
          items: [
            '监察已批核工程项目的施工进度及质量。',
            '审视工程预算、变更及进度里程碑。',
            '评估已委任顾问及承建商的表现。',
          ],
        },
      },
    ],
  },
  {
    slug: 'cabpag',
    abbreviation: 'CaBPAG',
    name: '天主教建筑专业顾问小组',
    summary:
      '由天主教建筑专业人士组成，义务向委员会提供技术意见。',
    sections: [
      {
        title: '历史与背景',
        content: {
          kind: 'list',
          items: [
            '天主教建筑专业顾问小组（CaBPAG）成立目的，是义务向教区建筑及发展委员会提供专业意见。',
            '成员为天主教建筑专业人士，贡献专长以支援堂区及教区机构。',
          ],
        },
      },
      {
        title: '目标',
        content: {
          kind: 'list',
          items: [
            '向委员会提供专业及技术指导。',
            '以建筑及发展方面的专门知识支援堂区。',
            '就业界标准及良好作业提出建议。',
          ],
        },
      },
      {
        title: '角色与职能',
        content: {
          kind: 'list',
          items: [
            '就技术可行性及设计事宜提供顾问意见。',
            '支援维修保养及保育建议的审视。',
            '协助堂区处理由教区建筑及发展委员会转介的专门技术问题。',
          ],
        },
      },
      {
        title: '组织',
        content: {
          kind: 'list',
          items: [
            '本小组在教区建筑及发展委员会辖下运作，并由指定主席召集。',
            '成员来自相关建筑及发展专业。',
          ],
        },
      },
      {
        title: '招募',
        content: {
          kind: 'list',
          items: [
            '新成员招募会因应专业需要定期进行。',
            '申请详情及资格准则将在此公布。',
          ],
        },
      },
      {
        title: '常见问题',
        collapsible: true,
        content: {
          kind: 'faq-groups',
          groups: cabpagFaqGroupsZhHans,
        },
      },
    ],
  },
];

export function getCommittees(locale: Locale): Committee[] {
  return pickContent(
    { en: committees, 'zh-Hant': committeesZhHant, 'zh-Hans': committeesZhHans },
    locale,
  );
}

export function getCommittee(
  slug: CommitteeSlug,
  locale: Locale,
): Committee | undefined {
  return getCommittees(locale).find((committee) => committee.slug === slug);
}
