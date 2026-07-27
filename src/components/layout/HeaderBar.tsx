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
import { siteConfig } from '@/constants/site';
import type { NavItem } from '@/types/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import MainNav from './MainNav';
import { MOBILE_MENU_TOGGLE_ID } from './MobileMenuOverlay';

type HeaderBarProps = {
  locale: Locale;
  items: NavItem[];
};

export default function HeaderBar({ locale, items }: HeaderBarProps) {
  const { scrollY } = useScroll();

  const borderOpacity = useTransform(scrollY, [0, 72], [0.35, 0.88]);
  const shadowStrength = useTransform(scrollY, [0, 72], [0.04, 0.12]);

  const borderBottomColor = useMotionTemplate`rgba(224, 189, 96, ${borderOpacity})`;
  const boxShadow = useMotionTemplate`0 4px 24px rgba(27, 39, 64, ${shadowStrength})`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 border-b"
      style={{
        borderBottomColor,
        boxShadow,
      }}
    >
      <MosaicHueBackdrop />

      <div className="relative mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <div className="flex h-[4.75rem] items-center justify-between gap-3 sm:h-[5.25rem] lg:h-[5.75rem]">
          <Link
            href={`/${locale}`}
            className="inline-flex min-w-0 max-w-[min(100%,26rem)] shrink items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 sm:max-w-[min(100%,34rem)] lg:max-w-[40rem] lg:gap-4"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="shrink-0 rounded-sm bg-white p-0.5">
              <Image
                src="/logo.png"
                alt=""
                width={616}
                height={774}
                className="h-14 w-auto object-contain sm:h-16 lg:h-[4.5rem]"
                priority
              />
            </span>
            <span className="min-w-0 font-serif text-[0.8125rem] font-bold leading-snug tracking-wide text-logo-grey sm:text-sm lg:text-[1.05rem] lg:leading-tight">
              {siteConfig.name}
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden lg:contents">
              <MainNav locale={locale} items={items} />
              <div className="mx-3 h-8 w-px bg-logo-grey/25" aria-hidden="true" />
              <LanguageSwitcher locale={locale} />
            </div>

            <label
              htmlFor={MOBILE_MENU_TOGGLE_ID}
              className="inline-flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md text-logo-grey hover:bg-white/55 active:bg-white/75 lg:hidden"
              aria-label="Open menu"
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
