'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Container from '@/components/ui/Container';
import {
  pageHeaderContainerVariants,
  pageHeaderItemVariants,
} from '@/lib/motion';

type AnimatedPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function AnimatedPageHeader({
  eyebrow,
  title,
  description,
}: AnimatedPageHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate overflow-hidden bg-brand-900">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(224,189,96,0.18),transparent_50%),radial-gradient(circle_at_85%_80%,rgba(143,179,154,0.12),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-900/20 via-transparent to-brand-950/30"
        aria-hidden="true"
      />
      <Container size="wide" className="py-16 sm:py-20 lg:py-24">
        {reduceMotion ? (
          <>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream-100/90 sm:text-xl">
                {description}
              </p>
            ) : null}
            <div
              className="mt-8 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
              aria-hidden="true"
            />
          </>
        ) : (
          <motion.div
            initial="visible"
            animate="visible"
            variants={pageHeaderContainerVariants}
          >
            {eyebrow ? (
              <motion.p
                variants={pageHeaderItemVariants}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300"
              >
                {eyebrow}
              </motion.p>
            ) : null}
            <motion.h1
              variants={pageHeaderItemVariants}
              className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              {title}
            </motion.h1>
            {description ? (
              <motion.p
                variants={pageHeaderItemVariants}
                className="mt-5 max-w-2xl text-lg leading-relaxed text-cream-100/90 sm:text-xl"
              >
                {description}
              </motion.p>
            ) : null}
            <motion.div
              variants={pageHeaderItemVariants}
              className="mt-8 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </Container>
    </div>
  );
}
