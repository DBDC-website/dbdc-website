'use client';

import Link from 'next/link';
import type { Locale } from '@/constants/i18n';
import type { NavItem } from '@/types/navigation';
import { t } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

type MobileMenuPanelProps = {
  locale: Locale;
  items: NavItem[];
  toggleId: string;
};

function closeMenu(toggleId: string) {
  const toggle = document.getElementById(toggleId) as HTMLInputElement | null;
  if (toggle) toggle.checked = false;
}

function resolveHref(locale: Locale, href: string) {
  if (href.startsWith('http') || href.startsWith('/documents/')) {
    return href;
  }
  if (href.includes('#')) {
    const [path, hash] = href.split('#');
    return `/${locale}${path}#${hash}`;
  }
  return `/${locale}${href}`;
}

function scrollToHashTarget(href: string) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return;
  const path = href.slice(0, hashIndex);
  const id = decodeURIComponent(href.slice(hashIndex + 1));
  if (window.location.pathname !== path) return;

  let attempts = 0;
  const tryScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 96;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, left: 0, behavior: 'smooth' });
      return;
    }
    attempts += 1;
    if (attempts < 20) requestAnimationFrame(tryScroll);
  };
  requestAnimationFrame(tryScroll);
}

export default function MobileMenuPanel({
  locale,
  items,
  toggleId,
}: MobileMenuPanelProps) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-gradient-to-b from-cream-50 via-cream-100 to-gold-50/50 shadow-xl">
      <div className="flex items-center justify-between border-b border-gold-200/60 px-4 py-4">
        <span className="font-serif text-lg font-semibold text-brand-950">
          {t(locale, 'nav.menuLabel')}
        </span>
        <label
          htmlFor={toggleId}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-brand-950 hover:bg-gold-100/70"
          aria-label={t(locale, 'nav.closeMenu')}
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            &times;
          </span>
        </label>
      </div>

      <nav
        aria-label={t(locale, 'nav.mobileAria')}
        className="flex-1 overflow-y-auto px-3 py-5"
      >
        <div className="mb-4 border-b border-gold-200/60 px-2 pb-4">
          <LanguageSwitcher locale={locale} />
        </div>

        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={resolveHref(locale, item.href)}
                scroll={false}
                onClick={() => closeMenu(toggleId)}
                className="block rounded-md px-5 py-3 text-lg font-bold text-brand-900 transition-colors hover:bg-gold-100/55 hover:text-brand-950"
              >
                {item.label}
              </Link>
              {item.children && item.children.length > 0 ? (
                <ul className="mb-2 ml-3 space-y-0.5 border-l border-gold-200/70 pl-3">
                  {item.children.map((child) => {
                    const href = resolveHref(locale, child.href);
                    return (
                    <li key={`${child.href}-${child.label}`}>
                      <Link
                        href={href}
                        scroll={false}
                        onClick={() => {
                          closeMenu(toggleId);
                          scrollToHashTarget(href);
                        }}
                        {...(child.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="block rounded-md px-3 py-2 text-sm font-bold text-brand-800/85 transition-colors hover:bg-gold-100/45 hover:text-brand-950"
                      >
                        {child.label}
                      </Link>
                    </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
