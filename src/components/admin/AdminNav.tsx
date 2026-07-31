'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAdmin } from '@/app/admin/actions/auth';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type AdminNavProps = {
  email: string;
};

const NAV_LINKS = [
  { href: '/admin', label: 'Home', exact: true },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/committees', label: 'Committees' },
  { href: '/admin/articles', label: 'Articles' },
  { href: '/admin/registrations', label: 'Registrations' },
] as const;

export default function AdminNav({ email }: AdminNavProps) {
  const pathname = usePathname();

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
          {NAV_LINKS.map((link) => {
            const active =
              'exact' in link && link.exact
                ? pathname === link.href
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-900 text-white'
                    : 'text-brand-800 hover:bg-cream-100',
                )}
              >
                {link.label}
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
