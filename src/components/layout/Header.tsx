import Link from 'next/link';
import { Menu } from 'lucide-react';
import Container from '@/components/ui/Container';
import type { Locale } from '@/constants/i18n';
import { mainNav, siteConfig } from '@/constants/site';
import LanguageSwitcher from './LanguageSwitcher';
import MainNav from './MainNav';
import { MOBILE_MENU_TOGGLE_ID } from './MobileMenuOverlay';

type HeaderProps = {
  locale: Locale;
};

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            href={`/${locale}`}
            className="inline-flex shrink-0 items-center"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="font-serif text-xl font-semibold tracking-[0.18em] text-brand-900">
              DBDC
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden lg:contents">
              <MainNav locale={locale} items={mainNav} />
              <div className="mx-3 h-8 w-px bg-stone-200" aria-hidden="true" />
              <LanguageSwitcher locale={locale} />
            </div>

            <label
              htmlFor={MOBILE_MENU_TOGGLE_ID}
              className="inline-flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md text-brand-800 hover:bg-brand-50 active:bg-brand-100 lg:hidden"
              aria-label="Open menu"
              aria-controls="mobile-menu"
            >
              <Menu className="pointer-events-none h-7 w-7" aria-hidden="true" />
            </label>
          </div>
        </div>
      </Container>
    </header>
  );
}
