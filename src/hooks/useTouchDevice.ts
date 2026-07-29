'use client';

import { useEffect, useState } from 'react';

/**
 * True on phones/tablets where native touch scrolling should be preferred
 * over Lenis smooth-scroll (which breaks in-view triggers on mobile).
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: none) and (pointer: coarse)');
    const update = () => setIsTouch(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isTouch;
}
