import type { ArticlePdf } from '@/types/article';

/**
 * Related Articles — PDF downloads for Sprint 1.
 *
 * HOW TO ADD YOUR PDFs:
 * 1. Place files in: public/documents/articles/
 * 2. Update each `href` below to match the filename, e.g.
 *    "/documents/articles/catholic-laity-involvement-sep-2011.pdf"
 *
 * Sprint 2: this array can be replaced by a Supabase query without
 * changing the page component — see ArticlePdfList.tsx.
 */
export const articlePdfs: ArticlePdf[] = [
  {
    label: 'I',
    title: 'Catholic Laity Involvement in Church Building Project',
    author: 'Ayako Fukushima',
    date: 'Sep 2011',
    href: '/documents/articles/catholic-laity-involvement-sep-2011.pdf',
  },
  {
    label: 'II',
    title:
      'The Building Process and the Laity Involvement of Our Lady of Mount Carmel Church in Wanchai, Hong Kong',
    author: 'Ayako Fukushima',
    date: 'June 2013',
    href: '/documents/articles/mount-carmel-laity-involvement-june-2013.pdf',
  },
  {
    label: 'III',
    title: 'Catholic Laity Involvement in Church Building Project',
    author: 'Ayako Fukushima',
    date: 'Sep 2011',
    href: '/documents/articles/catholic-laity-involvement-iii.pdf',
  },
  {
    label: 'IV',
    title: 'Catholic Laity Involvement in Church Building Project',
    author: 'Ayako Fukushima',
    date: 'Sep 2011',
    href: '/documents/articles/catholic-laity-involvement-iv.pdf',
  },
];
