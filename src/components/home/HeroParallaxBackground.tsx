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
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.45]);

  useEffect(() => {
    if (reduceMotion) return;

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
  }, [reduceMotion]);

  useEffect(() => {
    heroSlides.slice(1).forEach((slide) => {
      const img = new window.Image();
      img.src = slide.src;
    });
  }, []);

  const active = heroSlides[index] ?? heroSlides[0];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-sage-300/40" />

      {reduceMotion ? (
        <div className="absolute inset-0">
          <Image
            src={heroSlides[0].src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: heroSlides[0].objectPosition }}
          />
        </div>
      ) : (
        <motion.div
          className="absolute inset-0"
          style={{ y: parallaxY, opacity: parallaxOpacity }}
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
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950/55 via-brand-900/45 to-cream-50/25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,167,60,0.22),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(143,179,154,0.18),transparent_55%)]" />
    </div>
  );
}
