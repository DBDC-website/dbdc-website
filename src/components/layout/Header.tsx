import Link from 'next/link';
import Container from '@/components/ui/Container';
import type { Locale } from '@/constants/i18n';
import { mainNav, siteConfig } from '@/constants/site';
import LanguageSwitcher from './LanguageSwitcher';
import MainNav from './MainNav';
import MobileNav from './MobileNav';

type HeaderProps = {
  locale: Locale;
};

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3"
            aria-label={`${siteConfig.shortName} home`}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-800 text-sm font-bold tracking-wide text-white"
              aria-hidden="true"
            >
              DBDC
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-serif text-base font-semibold text-brand-900">
                {siteConfig.shortName}
              </span>
              <span className="text-xs text-stone-500">{siteConfig.tagline}</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <MainNav locale={locale} items={mainNav} className="hidden lg:block" />
            <div className="mx-2 hidden h-6 w-px bg-stone-200 lg:block" aria-hidden="true" />
            <div className="hidden lg:block">
              <LanguageSwitcher locale={locale} />
            </div>
            <MobileNav locale={locale} items={mainNav} />
          </div>
        </div>
      </Container>
    </header>
  );
}
