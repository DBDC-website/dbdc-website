'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';

function scrollToHash(lenis: ReturnType<typeof useLenis>, hash: string) {
  const id = decodeURIComponent(hash.slice(1));
  let attempts = 0;
  const tryScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 96;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      if (lenis) {
        lenis.scrollTo(top, { immediate: true });
      } else {
        window.scrollTo({ top, left: 0, behavior: 'auto' });
      }
      return;
    }

    attempts += 1;
    if (attempts < 20) {
      requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();
}

function scrollToTop(lenis: ReturnType<typeof useLenis>) {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
}

/**
 * Forward navigation → top of page (or hash target).
 * Browser back/forward → native scroll restoration (unchanged).
 * Full reload → browser default (unchanged).
 */
export default function NavigationScrollManager() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isPopNavigation = useRef(false);
  const isInitialRender = useRef(true);

  useEffect(() => {
    const onPopState = () => {
      isPopNavigation.current = true;
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (isPopNavigation.current) {
      isPopNavigation.current = false;
      return;
    }

    const hash = window.location.hash;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (hash.length > 1) {
          scrollToHash(lenis, hash);
        } else {
          scrollToTop(lenis);
        }
      });
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
