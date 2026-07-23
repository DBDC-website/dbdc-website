import Link from 'next/link';
import { signOutAdmin } from '@/app/admin/actions/auth';
import Button from '@/components/ui/Button';

type AdminNavProps = {
  email: string;
};

export default function AdminNav({ email }: AdminNavProps) {
  return (
    <header className="border-b border-cream-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <Link
            href="/admin/registrations"
            className="text-sm font-semibold tracking-wide text-brand-900"
          >
            DBDC Admin
          </Link>
          <p className="truncate text-xs text-stone-500">{email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/registrations"
            className="text-sm font-medium text-brand-800 hover:underline"
          >
            Registrations
          </Link>
          <form action={signOutAdmin}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
