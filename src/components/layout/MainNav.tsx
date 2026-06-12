import Link from 'next/link';
import type { Locale } from '@/constants/i18n';

const navItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/partners', label: 'Partners' },
  { href: '/consultants', label: 'Consultants & Contractors' },
  { href: '/committee', label: 'Committee' },
  { href: '/contact', label: 'Contact' },
] as const;

type MainNavProps = {
  locale: Locale;
};

export default function MainNav({ locale }: MainNavProps) {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={`/${locale}${item.href}`}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
