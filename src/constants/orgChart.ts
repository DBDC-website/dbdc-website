export type OrgNodeId =
  | 'bishop'
  | 'procuration'
  | 'dbdc'
  | 'rdc'
  | 'selection'
  | 'works'
  | 'cabpag'
  | 'office';

export type OrgNode = {
  id: OrgNodeId;
  en: string;
  zh: string;
  /** Center x in viewBox coords. */
  x: number;
  /** Center y in viewBox coords. */
  y: number;
  w: number;
  h: number;
  /** Double border like the source chart. */
  emphasized?: boolean;
};

export type OrgEdge = {
  id: string;
  from: OrgNodeId;
  to: OrgNodeId;
  /** SVG path `d` in viewBox coords. */
  d: string;
  dashed?: boolean;
};

/**
 * Taller layout for the right-column flowchart (wraps beside intro + objectives).
 * viewBox: 0 0 1120 640
 */
export const orgChartNodes: OrgNode[] = [
  {
    id: 'bishop',
    en: 'Bishop of Hong Kong',
    zh: '主教',
    x: 400,
    y: 58,
    w: 320,
    h: 92,
    emphasized: true,
  },
  {
    id: 'procuration',
    en: 'Procuration',
    zh: '總務處(財務)',
    x: 1020,
    y: 138,
    w: 190,
    h: 72,
  },
  {
    id: 'dbdc',
    en: 'Diocesan Building & Development Commission',
    zh: '教區建築及發展委員會',
    x: 400,
    y: 235,
    w: 420,
    h: 88,
  },
  {
    id: 'rdc',
    en: 'Research & Development Committee',
    zh: '研究及發展小組',
    x: 140,
    y: 400,
    w: 250,
    h: 88,
  },
  {
    id: 'selection',
    en: 'Selection Committee',
    zh: '遴選小組',
    x: 400,
    y: 400,
    w: 230,
    h: 88,
  },
  {
    id: 'works',
    en: 'Works Committee',
    zh: '工程專責小組',
    x: 640,
    y: 400,
    w: 230,
    h: 88,
  },
  {
    id: 'cabpag',
    en: 'Catholic Building Professional Advisory Group',
    zh: '天主教建築專業諮詢小組',
    x: 880,
    y: 400,
    w: 240,
    h: 92,
  },
  {
    id: 'office',
    en: 'Diocesan Building & Development Commission (Office)',
    zh: '教區建築及發展委員會(辦事處)',
    x: 440,
    y: 560,
    w: 500,
    h: 88,
  },
];

export const orgChartEdges: OrgEdge[] = [
  {
    id: 'bishop-dbdc',
    from: 'bishop',
    to: 'dbdc',
    d: 'M 400 104 V 191',
  },
  {
    id: 'spine-procuration',
    from: 'bishop',
    to: 'procuration',
    d: 'M 400 138 H 925',
  },
  {
    id: 'procuration-office',
    from: 'procuration',
    to: 'office',
    d: 'M 1020 174 V 560 H 690',
  },
  {
    id: 'dbdc-committees',
    from: 'dbdc',
    to: 'selection',
    d: 'M 400 279 V 330 H 140 H 640',
  },
  {
    id: 'rail-rdc',
    from: 'dbdc',
    to: 'rdc',
    d: 'M 140 330 V 356',
  },
  {
    id: 'rail-selection',
    from: 'dbdc',
    to: 'selection',
    d: 'M 400 330 V 356',
  },
  {
    id: 'rail-works',
    from: 'dbdc',
    to: 'works',
    d: 'M 640 330 V 356',
  },
  {
    id: 'committees-lower',
    from: 'rdc',
    to: 'office',
    d: 'M 140 444 V 490 H 640',
  },
  {
    id: 'lower-office',
    from: 'selection',
    to: 'office',
    d: 'M 400 444 V 516',
  },
  {
    id: 'works-lower',
    from: 'works',
    to: 'office',
    d: 'M 640 444 V 490',
  },
  {
    id: 'dbdc-cabpag',
    from: 'dbdc',
    to: 'cabpag',
    d: 'M 610 235 H 880 V 354',
    dashed: true,
  },
  {
    id: 'cabpag-rail',
    from: 'cabpag',
    to: 'works',
    d: 'M 880 446 V 490 H 640',
    dashed: true,
  },
];
