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
import Container from '@/components/ui/Container';
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

  const bgOpacity = useTransform(scrollY, [0, 72], [0.76, 0.97]);
  const borderOpacity = useTransform(scrollY, [0, 72], [0, 0.88]);
  const shadowStrength = useTransform(scrollY, [0, 72], [0, 0.1]);

  const backgroundColor = useMotionTemplate`rgba(250, 248, 244, ${bgOpacity})`;
  const borderBottomColor = useMotionTemplate`rgba(224, 189, 96, ${borderOpacity})`;
  const boxShadow = useMotionTemplate`0 4px 24px rgba(27, 39, 64, ${shadowStrength})`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 border-b backdrop-blur-lg backdrop-saturate-150"
      style={{
        backgroundColor,
        borderBottomColor,
        boxShadow,
      }}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.75rem]">
          <Link
            href={`/${locale}`}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={`${siteConfig.name} home`}
          >
            <Image
              src="/logo.png"
              alt=""
              width={616}
              height={774}
              className="h-9 w-auto object-contain lg:h-10"
              priority
            />
            <span className="font-serif text-xl font-semibold tracking-[0.14em] text-brand-950 lg:text-[1.35rem]">
              {siteConfig.shortName}
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden lg:contents">
              <MainNav locale={locale} items={items} />
              <div className="mx-3 h-8 w-px bg-gold-200/70" aria-hidden="true" />
              <LanguageSwitcher locale={locale} />
            </div>

            <label
              htmlFor={MOBILE_MENU_TOGGLE_ID}
              className="inline-flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md text-brand-950 hover:bg-gold-100/70 active:bg-gold-200/45 lg:hidden"
              aria-label="Open menu"
              aria-controls="mobile-menu"
            >
              <Menu className="pointer-events-none h-7 w-7" aria-hidden="true" />
            </label>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
