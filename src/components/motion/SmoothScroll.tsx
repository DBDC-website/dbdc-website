'use client';

import { useReducedMotion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';

type SmoothScrollProps = {
  children: React.ReactNode;
};

/** Lenis smooth scroll site-wide; respects reduced-motion preferences. */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
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
