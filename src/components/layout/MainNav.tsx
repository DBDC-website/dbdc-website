'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/constants/i18n';
import type { NavItem } from '@/types/navigation';
import { cn } from '@/lib/cn';

type MainNavProps = {
  locale: Locale;
  items: NavItem[];
  className?: string;
};

export default function MainNav({ locale, items, className }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className={className}>
      <ul className="flex items-center gap-0.5">
        {items.map((item) => {
          const href = `/${locale}${item.href}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={item.href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-800'
                    : 'text-stone-600 hover:bg-brand-50 hover:text-brand-800',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
