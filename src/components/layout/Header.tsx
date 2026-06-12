import Link from 'next/link';
import type { Locale } from '@/constants/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import MainNav from './MainNav';

type HeaderProps = {
  locale: Locale;
};

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600"
              aria-hidden="true"
            >
              DBDC
            </div>
            <span className="text-sm font-semibold text-gray-900 md:text-base">
              Diocesan Building &amp; Development Commission
            </span>
          </Link>
          <div className="md:hidden">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <MainNav locale={locale} />
          <div className="hidden md:block">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
