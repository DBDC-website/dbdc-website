import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import type { NavItem } from '@/types/navigation';

/** Localized primary navigation. Paths stay English; labels come from messages. */
export function getMainNav(locale: Locale): NavItem[] {
  return [
    {
      href: '/projects',
      label: t(locale, 'nav.projects'),
      children: [
        {
          href: '/projects#project-showcase-heading',
          label: t(locale, 'nav.projectsShowcase'),
        },
        {
          href: '/projects#experiences-heading',
          label: t(locale, 'nav.projectsExperiences'),
        },
      ],
    },
    {
      href: '/parish-school',
      label: t(locale, 'nav.parishSchool'),
      children: [
        {
          href: '/parish-school#preamble-heading',
          label: t(locale, 'nav.parishPreamble'),
        },
        {
          href: '/parish-school#faq-heading',
          label: t(locale, 'nav.parishFaq'),
        },
        {
          href: '/parish-school#contact-heading',
          label: t(locale, 'nav.parishContact'),
        },
        {
          href: '/parish-school#gov-links-heading',
          label: t(locale, 'nav.parishLinks'),
        },
      ],
    },
    {
      href: '/consultants-contractors',
      label: t(locale, 'nav.consultantsContractors'),
    },
    {
      href: '/articles',
      label: t(locale, 'nav.articles'),
    },
  ];
}

export function getLegalLinks(locale: Locale) {
  return [
    {
      href: '/copyright-disclaimer',
      label: t(locale, 'footer.legalCopyright'),
    },
    {
      href: '/privacy-policy',
      label: t(locale, 'footer.legalPrivacy'),
    },
    {
      href: '/pics',
      label: t(locale, 'footer.legalPics'),
    },
  ] as const;
}
