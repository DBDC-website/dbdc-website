'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import { homeImages } from '@/constants/homeImages';
import { cinematicEase } from '@/lib/motion';

export default function HeroParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.1]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-sage-300/40" />

      {reduceMotion ? (
        <div className="absolute inset-0 scale-105">
          <PlaceholderImage
            src={homeImages.hero.src}
            alt={homeImages.hero.alt}
            className="h-full w-full"
            priority
          />
        </div>
      ) : (
        <motion.div
          className="absolute inset-0 origin-center"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: cinematicEase }}
        >
          <motion.div className="absolute inset-0 scale-110" style={{ y, opacity, scale: scrollScale }}>
            <PlaceholderImage
              src={homeImages.hero.src}
              alt={homeImages.hero.alt}
              className="h-full w-full"
              priority
            />
          </motion.div>
        </motion.div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/55 via-brand-900/45 to-cream-50/25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,167,60,0.22),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(143,179,154,0.18),transparent_55%)]" />
    </div>
  );
}
