import type { Locale } from '@/constants/i18n';
import { parishGuidelines } from '@/constants/parishGuidelines';
import { pickContent } from '@/lib/i18n/pickLocalized';
import type { ParishGuidelinesContent } from '@/types/parishGuidelines';

const parishGuidelinesZhHant: ParishGuidelinesContent = {
  tipsTitle: '堂區選取維修工程承建商的實用提示',
  tips: [
    {
      text: '委任承建商前，須清楚了解所需工程範圍。工程進行期間作出更改，會對費用及時間造成重大影響。',
    },
    {
      text: '按維修工程規模，選取適當規模的承建商公司。',
    },
    {
      text: '部分工程須由註冊人員進行以符合相關規例，例如電力重鋪線路。視乎工程規模，應邀請多於一份報價，以便比較可提供的服務。',
    },
    {
      text: '以同類項目互相比較，確保評估公平及平等。',
    },
    {
      text: '在付款條款中保留部分保證金，以確保承建商負責修補工程完成後的欠妥之處。',
    },
  ],
  assistTitle: '閣下可如何協助我們',
  assistBody:
    '若貴堂區曾與表現良好的承建商、禮儀藝術家或聖堂室內設計師合作，請向我們報告，以便更新名冊，讓其他堂區可為其工程尋找合適人員。',
  signOff: '教區建築及發展委員會',
  flowchartsTitle: '流程表',
  flowchartsDescription: '維修、緊急及翻新工程的參考流程表。',
  flowcharts: [
    {
      title: '維修工程流程表',
      href: '/documents/guidelines/flow-chart-maintenance-works.pdf',
      description: '規劃及進行維修工程的指引。',
    },
    {
      title: '緊急工程流程表',
      href: '/documents/guidelines/flow-chart-emergency-work.pdf',
      description: '需要緊急修理工程時應依循的步驟。',
    },
    {
      title: '大型翻新及維修工程的流程表',
      titleZh: '大型翻新及維修工程的流程表',
      href: '/documents/guidelines/flow-chart-renovation-works.pdf',
      description: '大型翻新及維修工程項目工作流程。',
    },
  ],
};

const parishGuidelinesZhHans: ParishGuidelinesContent = {
  tipsTitle: '堂区选取维修工程承建商的实用提示',
  tips: [
    {
      text: '委任承建商前，须清楚了解所需工程范围。工程进行期间作出更改，会对费用及时间造成重大影响。',
    },
    {
      text: '按维修工程规模，选取适当规模的承建商公司。',
    },
    {
      text: '部分工程须由注册人员进行以符合相关规例，例如电力重铺线路。视乎工程规模，应邀请多于一份报价，以便比较可提供的服务。',
    },
    {
      text: '以同类项目互相比较，确保评估公平及平等。',
    },
    {
      text: '在付款条款中保留部分保证金，以确保承建商负责修补工程完成后的欠妥之处。',
    },
  ],
  assistTitle: '阁下可如何协助我们',
  assistBody:
    '若贵堂区曾与表现良好的承建商、礼仪艺术家或圣堂室内设计师合作，请向我们报告，以便更新名册，让其他堂区可为其工程寻找合适人员。',
  signOff: '教区建筑及发展委员会',
  flowchartsTitle: '流程表',
  flowchartsDescription: '维修、紧急及翻新工程的参考流程表。',
  flowcharts: [
    {
      title: '维修工程流程表',
      href: '/documents/guidelines/flow-chart-maintenance-works.pdf',
      description: '规划及进行维修工程的指引。',
    },
    {
      title: '紧急工程流程表',
      href: '/documents/guidelines/flow-chart-emergency-work.pdf',
      description: '需要紧急修理工程时应依循的步骤。',
    },
    {
      title: '大型翻新及维修工程的流程表',
      titleZh: '大型翻新及维修工程的流程表',
      href: '/documents/guidelines/flow-chart-renovation-works.pdf',
      description: '大型翻新及维修工程项目工作流程。',
    },
  ],
};

export function getParishGuidelines(locale: Locale): ParishGuidelinesContent {
  return pickContent(
    {
      en: parishGuidelines,
      'zh-Hant': parishGuidelinesZhHant,
      'zh-Hans': parishGuidelinesZhHans,
    },
    locale,
  );
}

export function getParishGuidelinesTipsTitle(locale: Locale): string {
  return getParishGuidelines(locale).tipsTitle;
}

export function getParishGuidelinesTips(locale: Locale) {
  return getParishGuidelines(locale).tips;
}

export function getParishGuidelinesAssistTitle(locale: Locale): string {
  return getParishGuidelines(locale).assistTitle;
}

export function getParishGuidelinesAssistBody(locale: Locale): string {
  return getParishGuidelines(locale).assistBody;
}

export function getParishGuidelinesSignOff(locale: Locale): string {
  return getParishGuidelines(locale).signOff;
}

export function getParishGuidelinesFlowchartsTitle(locale: Locale): string {
  return getParishGuidelines(locale).flowchartsTitle;
}

export function getParishGuidelinesFlowchartsDescription(
  locale: Locale,
): string {
  return getParishGuidelines(locale).flowchartsDescription;
}

export function getParishGuidelinesFlowcharts(locale: Locale) {
  return getParishGuidelines(locale).flowcharts;
}
