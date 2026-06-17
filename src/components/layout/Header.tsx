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
        <div className="flex h-20 items-center justify-between gap-6 lg:h-24">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-4"
            aria-label={`${siteConfig.name} home`}
          >
            <span
              className="font-serif text-xl font-semibold tracking-[0.18em] text-brand-900 sm:text-2xl"
            >
              DBDC
            </span>
          </Link>

          <div className="flex items-center gap-3 lg:gap-4">
            <MainNav locale={locale} items={mainNav} className="hidden lg:block" />
            <div className="mx-3 hidden h-8 w-px bg-stone-200 lg:block" aria-hidden="true" />
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
