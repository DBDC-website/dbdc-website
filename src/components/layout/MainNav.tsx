'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import type { Locale } from '@/constants/i18n';
import type { NavChild, NavItem } from '@/types/navigation';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type MainNavProps = {
  locale: Locale;
  items: NavItem[];
  className?: string;
};

function resolveHref(locale: Locale, href: string) {
  if (href.startsWith('http') || href.startsWith('/documents/')) {
    return href;
  }
  if (href.includes('#')) {
    const [path, hash] = href.split('#');
    return `/${locale}${path}#${hash}`;
  }
  return `/${locale}${href}`;
}

function NavDropdown({
  locale,
  item,
  isActive,
}: {
  locale: Locale;
  item: NavItem;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const children = item.children ?? [];

  // Close after navigation / soft focus restores to the trigger link.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close while the page scrolls so a lingering open menu cannot
  // intercept clicks meant for the content underneath.
  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Link
        href={resolveHref(locale, item.href)}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className={cn(
          'rounded-md px-4 py-2.5 text-base font-bold transition-colors',
          isActive || open
            ? 'text-logo-grey'
            : 'text-logo-grey/80 hover:bg-white/60 hover:text-logo-grey',
        )}
        onFocus={(event) => {
          // Only open for keyboard focus — mouse/programmatic focus was
          // randomly reopening the menu after route changes.
          if (event.currentTarget.matches(':focus-visible')) {
            setOpen(true);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false);
            event.currentTarget.blur();
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {item.label}
      </Link>

      <div
        id={menuId}
        role="menu"
        hidden={!open}
        className={cn(
          'absolute left-0 top-full z-50 min-w-[14rem] pt-2',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'origin-top rounded-xl border border-cream-200/90 bg-white/95 p-2 shadow-lg shadow-brand-900/10 ring-1 ring-gold-200/40 backdrop-blur-md transition duration-200',
            open
              ? 'translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-1 scale-95 opacity-0',
          )}
        >
          {children.map((child: NavChild) => {
            const href = resolveHref(locale, child.href);
            return (
              <Link
                key={`${child.href}-${child.label}`}
                href={href}
                role="menuitem"
                {...(child.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="block rounded-lg px-3.5 py-2.5 text-sm font-bold text-logo-grey/85 transition-colors hover:bg-cream-50 hover:text-logo-grey"
                onClick={() => setOpen(false)}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </li>
  );
}

export default function MainNav({ locale, items, className }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={t(locale, 'nav.mainAria')} className={className}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const href = resolveHref(locale, item.href);
          const pathOnly = href.split('#')[0];
          const isActive =
            pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);

          if (item.children && item.children.length > 0) {
            return (
              <NavDropdown
                key={item.href}
                locale={locale}
                item={item}
                isActive={isActive}
              />
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-md px-4 py-2.5 text-base font-bold transition-colors',
                  isActive
                    ? 'text-logo-grey'
                    : 'text-logo-grey/80 hover:bg-white/60 hover:text-logo-grey',
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
