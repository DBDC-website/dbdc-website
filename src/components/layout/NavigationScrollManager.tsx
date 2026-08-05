'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';

const SCROLL_STORAGE_KEY = 'dbdc:scroll-by-path';
const PENDING_SCROLL_ID_KEY = 'dbdc:pending-scroll-id';
/** Quick reload drop duration (seconds for Lenis / ms for window fallback). */
const RELOAD_SCROLL_DURATION_S = 1.35;
const RELOAD_SCROLL_DURATION_MS = 1350;

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

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
    map[normalizePath(pathname)] = y;
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function readScrollPosition(pathname: string): number | null {
  const map = readScrollMap();
  const key = normalizePath(pathname);
  const value = map[key] ?? map[pathname];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readPendingScrollId(): string | null {
  try {
    return sessionStorage.getItem(PENDING_SCROLL_ID_KEY);
  } catch {
    return null;
  }
}

function clearPendingScrollId() {
  try {
    sessionStorage.removeItem(PENDING_SCROLL_ID_KEY);
  } catch {
    // ignore
  }
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Short animated scroll used on reload so the move feels intentional, not glitchy. */
function scrollToYAnimated(
  lenis: ReturnType<typeof useLenis>,
  y: number,
) {
  if (lenis) {
    lenis.scrollTo(y, {
      immediate: false,
      duration: RELOAD_SCROLL_DURATION_S,
      easing: easeOutCubic,
      force: true,
    });
    return;
  }

  const start = window.scrollY;
  const delta = y - start;
  if (Math.abs(delta) < 2) return;
  const t0 = performance.now();

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / RELOAD_SCROLL_DURATION_MS);
    window.scrollTo(0, start + delta * easeOutCubic(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function scrollToId(
  lenis: ReturnType<typeof useLenis>,
  id: string,
  animated = false,
) {
  let attempts = 0;
  const tryScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 96;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      if (animated) {
        scrollToYAnimated(lenis, top);
      } else if (lenis) {
        lenis.scrollTo(top, { immediate: true, force: true });
      } else {
        window.scrollTo({ top, left: 0, behavior: 'auto' });
      }
      return true;
    }

    attempts += 1;
    if (attempts < 60) {
      requestAnimationFrame(tryScroll);
    }
    return false;
  };

  tryScroll();
  window.setTimeout(() => tryScroll(), 120);
  window.setTimeout(() => tryScroll(), 350);
}

function scrollToHash(
  lenis: ReturnType<typeof useLenis>,
  hash: string,
  animated = false,
) {
  scrollToId(lenis, decodeURIComponent(hash.slice(1)), animated);
}

function scrollToY(lenis: ReturnType<typeof useLenis>, y: number) {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  }
}

function scrollToTop(lenis: ReturnType<typeof useLenis>) {
  scrollToY(lenis, 0);
}

/**
 * Forward navigation → top (or hash / pending section).
 * Back/forward → restore saved scroll.
 * Full reload → short animated scroll to last section (home + interior).
 */
export default function NavigationScrollManager() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isPopNavigation = useRef(false);
  const isInitialRender = useRef(true);
  const previousPathname = useRef(pathname);
  const suppressScrollSave = useRef(false);
  /** Saved Y waiting for Lenis to become available after reload. */
  const pendingReloadY = useRef<number | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const onPopState = () => {
      isPopNavigation.current = true;
    };

    const persist = () => {
      if (suppressScrollSave.current) return;
      writeScrollPosition(window.location.pathname, window.scrollY);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('scroll', persist, { passive: true });
    // Ensure last position is stored before refresh/close (esp. home).
    window.addEventListener('pagehide', persist);
    window.addEventListener('beforeunload', persist);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('scroll', persist);
      window.removeEventListener('pagehide', persist);
      window.removeEventListener('beforeunload', persist);
    };
  }, []);

  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash;
      const pendingId = readPendingScrollId();
      const pathnameChanged = previousPathname.current !== pathname;

      if (isInitialRender.current) {
        isInitialRender.current = false;
        previousPathname.current = pathname;

        if (pendingId) {
          clearPendingScrollId();
          suppressScrollSave.current = true;
          scrollToId(lenis, pendingId, true);
          window.setTimeout(() => {
            suppressScrollSave.current = false;
          }, 800);
          return;
        }

        if (hash.length > 1) {
          suppressScrollSave.current = true;
          scrollToHash(lenis, hash, true);
          window.setTimeout(() => {
            suppressScrollSave.current = false;
          }, 800);
          return;
        }

        const saved = readScrollPosition(pathname);
        if (saved != null && saved > 40) {
          pendingReloadY.current = saved;
          suppressScrollSave.current = true;
          // Start from top, then drop quickly to the saved section.
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          scrollToYAnimated(lenis, saved);
          window.setTimeout(() => {
            suppressScrollSave.current = false;
            pendingReloadY.current = null;
          }, 1600);
        }
        return;
      }

      // Lenis mounted later on the same route — finish reload restore, never jump to top.
      if (!pathnameChanged && !isPopNavigation.current) {
        if (pendingReloadY.current != null && lenis) {
          const y = pendingReloadY.current;
          pendingReloadY.current = null;
          suppressScrollSave.current = true;
          scrollToYAnimated(lenis, y);
          window.setTimeout(() => {
            suppressScrollSave.current = false;
          }, 1600);
        }
        return;
      }

      if (isPopNavigation.current) {
        isPopNavigation.current = false;
        previousPathname.current = pathname;

        if (pendingId) {
          clearPendingScrollId();
          scrollToId(lenis, pendingId);
          return;
        }

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

      if (pendingId) {
        clearPendingScrollId();
        suppressScrollSave.current = true;
        scrollToId(lenis, pendingId, true);
        window.setTimeout(() => {
          suppressScrollSave.current = false;
        }, 800);
        return;
      }

      if (hash.length > 1) {
        suppressScrollSave.current = true;
        scrollToHash(lenis, hash, true);
        window.setTimeout(() => {
          suppressScrollSave.current = false;
        }, 800);
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

      const pendingId = readPendingScrollId();
      if (pendingId) {
        clearPendingScrollId();
        scrollToId(lenis, pendingId, true);
        return;
      }

      const hash = window.location.hash;
      requestAnimationFrame(() => {
        if (hash.length > 1) {
          scrollToHash(lenis, hash, true);
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
