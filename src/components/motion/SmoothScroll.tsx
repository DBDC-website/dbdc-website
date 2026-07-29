'use client';

import { useReducedMotion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { useTouchDevice } from '@/hooks/useTouchDevice';

type SmoothScrollProps = {
  children: React.ReactNode;
};

/**
 * Lenis smooth scroll for desktop pointer devices.
 * Disabled on touch/coarse-pointer viewports where it breaks native
 * scroll, IntersectionObserver, and Framer Motion scroll-linked effects.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const reduceMotion = useReducedMotion();
  const isTouch = useTouchDevice();

  if (reduceMotion || isTouch) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.35,
        smoothWheel: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
