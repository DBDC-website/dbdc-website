import type { Article } from '@/types/article';

/**
 * Placeholder articles for Sprint 1. The list page is built to be
 * search/filter-ready; categories below drive the (future) filter UI.
 */
export const articleCategories = [
  'All',
  'Projects',
  'Heritage',
  'Announcements',
  'Guidance',
] as const;

export const articles: Article[] = [
  {
    slug: 'preserving-heritage-churches',
    title: 'Preserving Heritage Churches in a Modern City',
    excerpt:
      'How careful conservation balances historic fabric with the needs of today’s parish communities.',
    category: 'Heritage',
    date: '2025-11-02',
    readingTimeMinutes: 5,
  },
  {
    slug: 'parish-centre-design-principles',
    title: 'Design Principles for New Parish Centres',
    excerpt:
      'Accessibility, flexibility, and stewardship: the values guiding new community facilities.',
    category: 'Projects',
    date: '2025-09-18',
    readingTimeMinutes: 4,
  },
  {
    slug: 'submitting-a-building-request',
    title: 'A Guide to Submitting a Building Request',
    excerpt:
      'A step-by-step overview to help parishes and schools prepare a complete submission.',
    category: 'Guidance',
    date: '2025-07-30',
    readingTimeMinutes: 6,
  },
  {
    slug: 'dbdc-annual-update',
    title: 'DBDC Annual Update',
    excerpt:
      'A summary of completed projects, works in progress, and priorities for the year ahead.',
    category: 'Announcements',
    date: '2025-06-12',
    readingTimeMinutes: 3,
  },
];
