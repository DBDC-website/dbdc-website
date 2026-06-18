'use client';

import Link from 'next/link';
import type { Locale } from '@/constants/i18n';
import type { NavItem } from '@/types/navigation';
import LanguageSwitcher from './LanguageSwitcher';

type MobileMenuPanelProps = {
  locale: Locale;
  items: NavItem[];
  toggleId: string;
};

function closeMenu(toggleId: string) {
  const toggle = document.getElementById(toggleId) as HTMLInputElement | null;
  if (toggle) toggle.checked = false;
}

export default function MobileMenuPanel({
  locale,
  items,
  toggleId,
}: MobileMenuPanelProps) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
        <span className="font-serif text-lg font-semibold text-brand-900">Menu</span>
        <label
          htmlFor={toggleId}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-brand-800 hover:bg-brand-50"
          aria-label="Close menu"
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            &times;
          </span>
        </label>
      </div>

      <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={`/${locale}${item.href}`}
                onClick={() => closeMenu(toggleId)}
                className="block rounded-md px-5 py-3.5 text-lg font-medium text-stone-700 hover:bg-brand-50 hover:text-brand-800"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-stone-200 px-4 py-4">
        <LanguageSwitcher locale={locale} />
      </div>
    </div>
  );
}
