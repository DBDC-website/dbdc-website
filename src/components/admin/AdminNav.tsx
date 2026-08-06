'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { signOutAdmin } from '@/app/admin/actions/auth';
import Button from '@/components/ui/Button';
import {
  COMMITTEE_MEMBER_OPTIONS,
  PAST_WORK_COMMITTEE_OPTIONS,
} from '@/constants/admin';
import { cn } from '@/lib/cn';

type AdminNavProps = {
  email: string;
};

type NavLink = {
  type: 'link';
  href: string;
  label: string;
  exact?: boolean;
};

type NavDropdown = {
  type: 'dropdown';
  label: string;
  baseHref: string;
  items: { href: string; label: string }[];
};

const NAV_ITEMS: (NavLink | NavDropdown)[] = [
  { type: 'link', href: '/admin', label: 'Home', exact: true },
  { type: 'link', href: '/admin/projects', label: 'Projects' },
  {
    type: 'dropdown',
    label: 'Committees',
    baseHref: '/admin/committees',
    items: [
      { href: '/admin/committees', label: 'All committees' },
      ...COMMITTEE_MEMBER_OPTIONS.map((option) => ({
        href: `/admin/committees?committee=${option.value}`,
        label: option.label,
      })),
    ],
  },
  {
    type: 'dropdown',
    label: 'Past Work',
    baseHref: '/admin/past-work',
    items: [
      { href: '/admin/past-work', label: 'All committees' },
      ...PAST_WORK_COMMITTEE_OPTIONS.map((option) => ({
        href: `/admin/past-work?committee=${option.value}`,
        label: option.label,
      })),
    ],
  },
  { type: 'link', href: '/admin/newsletters', label: 'Newsletters' },
  { type: 'link', href: '/admin/articles', label: 'Articles' },
  { type: 'link', href: '/admin/registrations', label: 'Registrations' },
];

function isLinkActive(
  pathname: string,
  href: string,
  exact?: boolean,
): boolean {
  if (exact) return pathname === href;
  const base = href.split('?')[0];
  return pathname === base || pathname.startsWith(`${base}/`);
}

function isDropdownActive(pathname: string, baseHref: string): boolean {
  return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}

function AdminNavDropdown({
  item,
  pathname,
  committeeFilter,
}: {
  item: NavDropdown;
  pathname: string;
  committeeFilter: string | null;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = isDropdownActive(pathname, item.baseHref);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
          active
            ? 'bg-brand-900 text-white'
            : 'text-brand-800 hover:bg-cream-100',
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="menu"
          className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-cream-200 bg-white py-1 shadow-lg shadow-brand-900/10"
        >
          {item.items.map((entry) => {
            const entryPath = entry.href.split('?')[0];
            const entryQuery = entry.href.includes('?')
              ? new URLSearchParams(entry.href.split('?')[1]).get('committee')
              : null;
            const entryActive =
              pathname === entryPath &&
              (entryQuery
                ? committeeFilter === entryQuery
                : !committeeFilter && pathname.startsWith(item.baseHref));

            return (
              <li key={entry.href} role="none">
                <Link
                  href={entry.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-3 py-2 text-sm transition-colors',
                    entryActive
                      ? 'bg-brand-50 font-medium text-brand-900'
                      : 'text-brand-800 hover:bg-cream-50',
                  )}
                >
                  {entry.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export default function AdminNav({ email }: AdminNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const committeeFilter = searchParams.get('committee');

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/90 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <Link
            href="/admin"
            className="text-sm font-semibold tracking-wide text-brand-900"
          >
            DBDC Admin
          </Link>
          <p className="truncate text-xs text-stone-500">{email}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            if (item.type === 'dropdown') {
              return (
                <AdminNavDropdown
                  key={item.baseHref}
                  item={item}
                  pathname={pathname}
                  committeeFilter={committeeFilter}
                />
              );
            }

            const active = isLinkActive(pathname, item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-900 text-white'
                    : 'text-brand-800 hover:bg-cream-100',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <form action={signOutAdmin} className="ml-1">
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
