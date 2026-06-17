import type { NavItem } from '@/types/navigation';

export const siteConfig = {
  name: 'Diocesan Building and Development Commission',
  shortName: 'DBDC',
  tagline: 'Catholic Diocese of Hong Kong',
  description:
    'Supporting the planning, development, and maintenance of diocesan and parish properties across Hong Kong.',
};

/** Primary navigation. Paths are locale-relative; the locale prefix is added at render time. */
export const mainNav: NavItem[] = [
  { href: '/about', label: 'About Us' },
  { href: '/projects', label: 'Selected Projects' },
  { href: '/parish-school', label: 'Parish & School' },
  { href: '/consultants-contractors', label: 'Consultants & Contractors' },
  { href: '/articles', label: 'Articles' },
  { href: '/contact', label: 'Contact' },
];

/**
 * Contact details shown in the footer on every page.
 * Placeholder values for Sprint 1 — to be confirmed by the DBDC Office.
 */
export const contactInfo = {
  organisation: 'DBDC Office',
  address: ['Catholic Diocese Centre', '16 Caine Road', 'Central, Hong Kong'],
  email: 'dbdc@catholic.org.hk',
  phone: '+852 0000 0000',
  officeHours: 'Monday – Friday, 9:00 – 17:00',
  isPlaceholder: true,
};
