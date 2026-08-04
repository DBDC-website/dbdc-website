'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';

const SCROLL_STORAGE_KEY = 'dbdc:scroll-by-path';

function readScrollMap(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, number>;
  } catch {
    return {};
  }
}

function writeScrollPosition(pathname: string, y: number) {
  try {
    const map = readScrollMap();
    map[pathname] = y;
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function readScrollPosition(pathname: string): number | null {
  const value = readScrollMap()[pathname];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function scrollToHash(lenis: ReturnType<typeof useLenis>, hash: string) {
  const id = decodeURIComponent(hash.slice(1));
  let attempts = 0;
  const tryScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 96;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      if (lenis) {
        lenis.scrollTo(top, { immediate: true });
      } else {
        window.scrollTo({ top, left: 0, behavior: 'auto' });
      }
      return;
    }

    attempts += 1;
    if (attempts < 30) {
      requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();
}

function scrollToY(lenis: ReturnType<typeof useLenis>, y: number) {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  }
}

function scrollToTop(lenis: ReturnType<typeof useLenis>) {
  scrollToY(lenis, 0);
}

/**
 * Forward navigation → top of page (or hash target).
 * Browser back/forward → restore saved scroll, or hash if present.
 * Full reload with hash → scroll to that section.
 */
export default function NavigationScrollManager() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isPopNavigation = useRef(false);
  const isInitialRender = useRef(true);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const onPopState = () => {
      isPopNavigation.current = true;
    };

    const onScroll = () => {
      writeScrollPosition(window.location.pathname, window.scrollY);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash;

      if (isInitialRender.current) {
        isInitialRender.current = false;
        previousPathname.current = pathname;
        if (hash.length > 1) {
          scrollToHash(lenis, hash);
        }
        return;
      }

      if (isPopNavigation.current) {
        isPopNavigation.current = false;
        previousPathname.current = pathname;

        if (hash.length > 1) {
          scrollToHash(lenis, hash);
          return;
        }

        const saved = readScrollPosition(pathname);
        if (saved != null) {
          scrollToY(lenis, saved);
        }
        return;
      }

      previousPathname.current = pathname;

      if (hash.length > 1) {
        scrollToHash(lenis, hash);
      } else {
        scrollToTop(lenis);
      }
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(apply);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  useEffect(() => {
    const onHashChange = () => {
      if (isPopNavigation.current) return;

      const hash = window.location.hash;
      requestAnimationFrame(() => {
        if (hash.length > 1) {
          scrollToHash(lenis, hash);
        } else {
          scrollToTop(lenis);
        }
      });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [lenis]);

  return null;
}
