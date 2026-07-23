'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import {
  heroEntranceContainerVariants,
  heroEntranceItemVariants,
} from '@/lib/motion';
import type { Locale } from '@/constants/i18n';
import { donateConfig } from '@/constants/donate';
import { siteConfig } from '@/constants/site';

type HeroContentProps = {
  locale: Locale;
};

export default function HeroContent({ locale }: HeroContentProps) {
  const reduceMotion = useReducedMotion();

  const content = (
    <>
      <motion.p
        variants={heroEntranceItemVariants}
        className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-200"
      >
        {siteConfig.tagline}
      </motion.p>
      <motion.h1
        variants={heroEntranceItemVariants}
        id="hero-heading"
        className="mt-6 text-4xl font-semibold leading-[1.15] text-white [text-wrap:wrap] sm:text-5xl lg:text-6xl xl:text-7xl"
      >
        Welcome to
        <br />
        {siteConfig.name}
      </motion.h1>
      <motion.p
        variants={heroEntranceItemVariants}
        className="mt-8 max-w-2xl text-lg leading-relaxed text-cream-100/90 sm:text-xl"
      >
        {siteConfig.description}
      </motion.p>
      <motion.div
        variants={heroEntranceItemVariants}
        className="mt-12 flex flex-wrap gap-4"
      >
        <Button href={`/${locale}/projects`} variant="secondary" size="lg">
          Explore our projects
        </Button>
        <Button
          href={donateConfig.url}
          external
          variant="outline"
          size="lg"
          className="border-white/50 text-white hover:border-gold-300 hover:bg-white/10"
        >
          {donateConfig.label}
        </Button>
      </motion.div>
    </>
  );

  return (
    <Container size="wide">
      <div className="flex min-h-[78vh] max-w-4xl flex-col justify-center py-24 sm:py-28 lg:py-32">
        {reduceMotion ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-200">
              {siteConfig.tagline}
            </p>
            <h1
              id="hero-heading"
              className="mt-6 text-4xl font-semibold leading-[1.15] text-white [text-wrap:wrap] sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Welcome to
              <br />
              {siteConfig.name}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-cream-100/90 sm:text-xl">
              {siteConfig.description}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Button href={`/${locale}/projects`} variant="secondary" size="lg">
                Explore our projects
              </Button>
              <Button
                href={donateConfig.url}
                external
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:border-gold-300 hover:bg-white/10"
              >
                {donateConfig.label}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial="visible"
            animate="visible"
            variants={heroEntranceContainerVariants}
          >
            {content}
          </motion.div>
        )}
      </div>
    </Container>
  );
}
