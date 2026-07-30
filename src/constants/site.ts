import type { NavItem } from '@/types/navigation';

export const siteConfig = {
  name: 'Diocesan Building and Development Commission',
  shortName: 'DBDC',
  tagline: 'Catholic Diocese of Hong Kong',
  description:
    'Supporting the planning, development, and maintenance of Diocesan properties across Hong Kong.',
};

/** Primary navigation. Paths are locale-relative; the locale prefix is added at render time. */
export const mainNav: NavItem[] = [
  {
    href: '/projects',
    label: 'Selected Projects',
    children: [
      {
        href: '/projects#project-showcase-heading',
        label: 'Project showcase',
      },
      {
        href: '/projects#experiences-heading',
        label: 'Featured experiences',
      },
    ],
  },
  {
    href: '/parish-school',
    label: 'Parish & School',
    children: [
      { href: '/parish-school#preamble-heading', label: 'Preamble' },
      {
        href: '/parish-school#faq-heading',
        label: 'Frequently Asked Questions',
      },
      {
        href: '/parish-school#contact-heading',
        label: 'Need further assistance?',
      },
      { href: '/parish-school#gov-links-heading', label: 'Useful links' },
    ],
  },
  {
    href: '/consultants-contractors',
    label: 'Consultants & Contractors',
  },
  {
    href: '/articles',
    label: 'Articles',
  },
];

/**
 * Contact details shown in the footer on every page.
 */
export const contactInfo = {
  organisation: 'DBDC OFFICE',
  address: ['9/F, Catholic Diocese Centre', '16 Caine Road, Hong Kong'],
  email: 'office@hkdbdc.org.hk',
  phone: '+852 2526 3200',
  fax: '+852 2526 1127',
  officeHours: ['Monday – Friday: 9:00-17:30', 'Saturday: 9:00-12:00'],
  isPlaceholder: false,
};
