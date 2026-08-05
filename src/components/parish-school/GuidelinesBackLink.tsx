'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/constants/i18n';

const PENDING_SCROLL_ID_KEY = 'dbdc:pending-scroll-id';

type GuidelinesBackLinkProps = {
  locale: Locale;
  label: string;
};

/** Returns to Parish & School “Need further assistance?” section. */
export default function GuidelinesBackLink({
  locale,
  label,
}: GuidelinesBackLinkProps) {
  const router = useRouter();
  const href = `/${locale}/parish-school`;

  return (
    <Link
      href={`${href}#contact-heading`}
      scroll={false}
      onClick={(event) => {
        event.preventDefault();
        try {
          sessionStorage.setItem(PENDING_SCROLL_ID_KEY, 'contact-heading');
        } catch {
          // ignore
        }
        router.push(`${href}#contact-heading`);
      }}
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/75 px-3 py-1.5 text-sm font-medium text-brand-950 shadow-sm transition-colors hover:bg-white"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
