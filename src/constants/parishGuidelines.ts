import type { ParishGuidelinesContent } from '@/types/parishGuidelines';

/**
 * Parish working guidelines — contractor selection tips and flowcharts.
 *
 * FLOWCHART FILES: place PDFs (or images) in public/documents/guidelines/
 * and match the filenames in `flowcharts` below.
 */
export const parishGuidelines: ParishGuidelinesContent = {
  tipsTitle:
    'Some useful tips in selection of contractor for maintenance works in the Parish',
  tips: [
    {
      text: 'Have a clear idea of the works required before appointing a contractor. Changes during the course of the works would have serious cost and time implications.',
    },
    {
      text: 'Get contractor firm of the right size for the corresponding scale of maintenance works.',
    },
    {
      text: 'Some works require registered personnel to comply with relevant regulations, e.g. electrical rewiring. Depending on the size of the works, invite more than one quotation for comparison of the services that can be offered to us.',
    },
    {
      text: 'Compare like with the like to ensure an equal and fair assessment.',
    },
    {
      text: 'Hold up some retention money in the payment terms to ensure that the contractor be responsible for making good defects after execution of the works.',
    },
  ],
  assistTitle: 'What you can assist us',
  assistBody:
    'If your Parish has experience with some good contractors, artist for liturgical art and designer for church interiors, report to us for updating of our registers so that other Parishes can find appropriate personnel for their works.',
  signOff: 'Diocesan Building and Development Commission',
  flowchartsTitle: 'Flow charts',
  flowchartsDescription:
    'Reference flow charts for maintenance, emergency, and renovation works.',
  flowcharts: [
    {
      title: 'Flow Chart of Maintenance Works',
      href: '/documents/guidelines/flow-chart-maintenance-works.pdf',
      description: 'Guidance for planning and carrying out maintenance works.',
    },
    {
      title: 'Flow Chart on Emergency Work',
      href: '/documents/guidelines/flow-chart-emergency-work.pdf',
      description: 'Steps to follow when urgent repair work is required.',
    },
    {
      title: 'Flow Chart of Renovation Works',
      titleZh: '大型翻新及維修工程的流程表',
      href: '/documents/guidelines/flow-chart-renovation-works.pdf',
      description: 'Large-scale renovation and maintenance project workflow.',
    },
  ],
};

export const parishGuidelinesPath = '/parish-school/guidelines';
