'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Menu } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import type { Locale } from '@/constants/i18n';
import { useSiteChromeHidden } from '@/hooks/useSiteChromeHidden';
import type { NavItem } from '@/types/navigation';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import LanguageSwitcher from './LanguageSwitcher';
import MainNav from './MainNav';
import { MOBILE_MENU_TOGGLE_ID } from './MobileMenuOverlay';

type HeaderBarProps = {
  locale: Locale;
  items: NavItem[];
};

export default function HeaderBar({ locale, items }: HeaderBarProps) {
  const { scrollY } = useScroll();
  const chromeHidden = useSiteChromeHidden();
  const siteName = t(locale, 'site.name');

  const borderOpacity = useTransform(scrollY, [0, 72], [0.35, 0.88]);
  const shadowStrength = useTransform(scrollY, [0, 72], [0.04, 0.12]);

  const borderBottomColor = useMotionTemplate`rgba(224, 189, 96, ${borderOpacity})`;
  const boxShadow = useMotionTemplate`0 4px 24px rgba(27, 39, 64, ${shadowStrength})`;

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-[transform,opacity] duration-300',
        chromeHidden
          ? 'pointer-events-none -translate-y-full opacity-0'
          : 'translate-y-0 opacity-100',
      )}
      style={{
        borderBottomColor,
        boxShadow,
      }}
    >
      <MosaicHueBackdrop />

      <div className="relative mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <div className="flex h-[4.75rem] items-center justify-between gap-3 sm:h-[5.25rem] lg:h-[5.75rem]">
          <div className="inline-flex w-fit max-w-[min(100%,19rem)] shrink items-center gap-3 sm:max-w-[min(100%,24rem)] lg:max-w-[30rem] lg:gap-4">
            <a
              href="https://catholic.org.hk/en"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-sm bg-white p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={t(locale, 'chrome.dioceseLogoAria')}
            >
              <Image
                src="/logo.png"
                alt=""
                width={616}
                height={774}
                className="h-14 w-auto object-contain sm:h-16 lg:h-[4.5rem]"
                priority
              />
            </a>
            <Link
              href={`/${locale}`}
              className="min-w-0 rounded-md px-2.5 py-1.5 font-serif text-[0.8125rem] font-bold leading-snug tracking-wide text-logo-grey transition-[background-color,box-shadow,color] duration-300 hover:bg-white/75 hover:shadow-[0_0_0_1.5px_rgba(255,255,255,1),0_0_14px_rgba(255,252,245,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-3 sm:py-2 sm:text-sm lg:px-3.5 lg:py-2 lg:text-[1.05rem] lg:leading-tight"
              aria-label={t(locale, 'chrome.homeAria', { name: siteName })}
            >
              {locale === 'en' ? (
                <>
                  Diocesan Building and
                  <br />
                  Development Commission
                </>
              ) : (
                siteName
              )}
            </Link>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden lg:contents">
              <MainNav locale={locale} items={items} />
              <div className="mx-3 h-8 w-px bg-logo-grey/25" aria-hidden="true" />
              <LanguageSwitcher locale={locale} />
            </div>

            <label
              htmlFor={MOBILE_MENU_TOGGLE_ID}
              className="inline-flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md text-logo-grey hover:bg-white/55 active:bg-white/75 lg:hidden"
              aria-label={t(locale, 'nav.openMenu')}
              aria-controls="mobile-menu"
            >
              <Menu className="pointer-events-none h-7 w-7" aria-hidden="true" />
            </label>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
