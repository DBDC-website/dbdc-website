'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import {
  heroEntranceContainerVariants,
  heroEntranceItemVariants,
} from '@/lib/motion';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';

type HeroContentProps = {
  locale: Locale;
};

export default function HeroContent({ locale }: HeroContentProps) {
  const reduceMotion = useReducedMotion();
  const welcome = t(locale, 'home.heroWelcome');
  const siteName = t(locale, 'site.name');
  const description = t(locale, 'site.description');
  const cta = t(locale, 'home.heroCta');

  const content = (
    <>
      <motion.h1
        variants={heroEntranceItemVariants}
        id="hero-heading"
        className="origin-left text-4xl font-semibold leading-[1.15] text-white [text-wrap:wrap] sm:text-5xl lg:text-6xl xl:text-7xl"
      >
        {welcome}
        <br />
        {siteName}
      </motion.h1>
      <motion.p
        variants={heroEntranceItemVariants}
        className="origin-left mt-8 max-w-2xl text-lg font-bold leading-relaxed text-cream-100 sm:text-xl"
      >
        {description}
      </motion.p>
      <motion.div variants={heroEntranceItemVariants} className="mt-12">
        <Button href={`/${locale}/projects`} variant="secondary" size="lg">
          {cta}
        </Button>
      </motion.div>
    </>
  );

  return (
    <Container size="wide">
      <div className="flex min-h-[78vh] max-w-4xl flex-col justify-center py-24 sm:py-28 lg:py-32">
        {reduceMotion ? (
          <div>
            <h1
              id="hero-heading"
              className="text-4xl font-semibold leading-[1.15] text-white [text-wrap:wrap] sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {welcome}
              <br />
              {siteName}
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-bold leading-relaxed text-cream-100 sm:text-xl">
              {description}
            </p>
            <div className="mt-12">
              <Button href={`/${locale}/projects`} variant="secondary" size="lg">
                {cta}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
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
