'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import type { Locale } from '@/constants/i18n';
import type { NavItem } from '@/types/navigation';
import { cn } from '@/lib/cn';
import LanguageSwitcher from './LanguageSwitcher';

type MobileNavProps = {
  locale: Locale;
  items: NavItem[];
};

export default function MobileNav({ locale, items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on Escape, lock body scroll, and move focus into the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center rounded-md p-2 text-brand-800 hover:bg-brand-50"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-brand-950/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
              <span className="font-serif text-lg font-semibold text-brand-900">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center rounded-md p-2 text-brand-800 hover:bg-brand-50"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-2 py-4">
              <ul className="flex flex-col gap-1">
                {items.map((item, index) => {
                  const href = `/${locale}${item.href}`;
                  const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);

                  return (
                    <li key={item.href}>
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'block rounded-md px-4 py-3 text-base font-medium',
                          isActive
                            ? 'bg-brand-50 text-brand-800'
                            : 'text-stone-700 hover:bg-brand-50 hover:text-brand-800',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-stone-200 px-4 py-4">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
