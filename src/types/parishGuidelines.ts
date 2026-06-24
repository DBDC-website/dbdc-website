export interface ParishGuidelineTip {
  text: string;
}

export interface ParishGuidelineFlowchart {
  title: string;
  titleZh?: string;
  /** Path under /public, e.g. "/documents/guidelines/flow-chart-maintenance-works.pdf" */
  href: string;
  description?: string;
}

export interface ParishGuidelinesContent {
  tipsTitle: string;
  tips: ParishGuidelineTip[];
  assistTitle: string;
  assistBody: string;
  signOff: string;
  flowchartsTitle: string;
  flowchartsDescription: string;
  flowcharts: ParishGuidelineFlowchart[];
}
