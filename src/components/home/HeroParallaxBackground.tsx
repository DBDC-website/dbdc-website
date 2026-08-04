'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { heroSlides } from '@/constants/homeImages';
import { useTouchDevice } from '@/hooks/useTouchDevice';

/** Time until the first slide change after load. */
const FIRST_SLIDE_MS = 2800;
/** Time between subsequent slides. */
const SLIDE_MS = 9000;
/** Slow, steady cross-slide duration. */
const TRANSITION_S = 2.4;

/** Gentle constant-speed easing for a calm pan. */
const steadyEase = [0.4, 0, 0.2, 1] as const;

const slideVariants = {
  enter: {
    x: '100%',
  },
  center: {
    x: '0%',
  },
  exit: {
    x: '-100%',
  },
};

export default function HeroParallaxBackground() {
  const reduceMotion = useReducedMotion();
  const isTouch = useTouchDevice();
  const [index, setIndex] = useState(0);
  /** Still run the slideshow on phones; only skip scroll-linked parallax. */
  const enableSlideshow = !reduceMotion;
  const enableParallax = !reduceMotion && !isTouch;

  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.45]);

  useEffect(() => {
    if (!enableSlideshow) return;

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      setIndex(1 % heroSlides.length);
      intervalId = window.setInterval(() => {
        setIndex((current) => (current + 1) % heroSlides.length);
      }, SLIDE_MS);
    }, FIRST_SLIDE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [enableSlideshow]);

  useEffect(() => {
    if (!enableSlideshow) return;
    heroSlides.slice(1).forEach((slide) => {
      const img = new window.Image();
      img.src = slide.src;
    });
  }, [enableSlideshow]);

  const active = heroSlides[index] ?? heroSlides[0];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-sage-300/40" />

      {!enableSlideshow ? (
        <div className="absolute inset-0">
          <Image
            src={heroSlides[0].src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: heroSlides[0].objectPosition }}
            unoptimized
          />
        </div>
      ) : (
        <motion.div
          className="absolute inset-0"
          style={
            enableParallax
              ? { y: parallaxY, opacity: parallaxOpacity }
              : undefined
          }
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={active.src}
              className="absolute inset-0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: TRANSITION_S, ease: steadyEase }}
            >
              <div className="absolute inset-0 scale-[1.04]">
                <Image
                  src={active.src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: active.objectPosition }}
                  unoptimized
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950/55 via-brand-900/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-cream-50/20 to-cream-50/55 sm:h-40 lg:h-48" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,167,60,0.22),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(143,179,154,0.18),transparent_55%)]" />
    </div>
  );
}
