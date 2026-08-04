'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAdmin } from '@/app/admin/actions/auth';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type AdminNavProps = {
  email: string;
};

const NAV_LINKS = [
  { href: '/admin', label: 'Home', exact: true },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/committees', label: 'Committees' },
  { href: '/admin/past-work', label: 'Past Work' },
  { href: '/admin/articles', label: 'Articles' },
  { href: '/admin/registrations', label: 'Registrations' },
] as const;

export default function AdminNav({ email }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#e0bd60]/70 shadow-[0_4px_24px_rgba(27,39,64,0.08)]">
      <MosaicHueBackdrop />

      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <Link
            href="/admin"
            className="font-serif text-sm font-bold tracking-wide text-logo-grey"
          >
            DBDC Admin
          </Link>
          <p className="truncate text-xs text-stone-600/80">{email}</p>
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
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'text-brand-800 hover:bg-white/55',
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
