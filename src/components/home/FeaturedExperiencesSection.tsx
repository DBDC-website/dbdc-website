'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/motion/ScrollReveal';
import AnimatedSection from '@/components/ui/AnimatedSection';
import HeadingGlow from '@/components/ui/HeadingGlow';
import { featuredExperiences } from '@/components/projects/ExperienceCards';
import type { Locale } from '@/constants/i18n';
import { homeImages } from '@/constants/homeImages';
import { t } from '@/lib/i18n';
import { cinematicEase, easeOut } from '@/lib/motion';
import { cn } from '@/lib/cn';

type FeaturedExperiencesSectionProps = {
  locale: Locale;
};

const experiencesBackdrop = homeImages.featuredExperiences;

const virtualTour = featuredExperiences[0];
const heritage = featuredExperiences[1];

function ExperiencesBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={experiencesBackdrop.src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: experiencesBackdrop.objectPosition }}
        priority={false}
      />
    </div>
  );
}

type StripProps = {
  locale: Locale;
  experience: (typeof featuredExperiences)[number];
  /** Image placement within the strip. */
  imageSide: 'left' | 'right';
  /** Direction the strip slides in from. */
  enterFrom: 'left' | 'right';
  /** Stagger delay before this strip starts (seconds). */
  startDelay?: number;
  /** Optional image crop framing (e.g. heritage carousel). */
  imageObjectPosition?: string;
};

function ExperienceStrip({
  locale,
  experience,
  imageSide,
  enterFrom,
  startDelay = 0,
  imageObjectPosition = 'center center',
}: StripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.28,
    margin: '0px 0px -10% 0px',
  });
  const reduceMotion = useReducedMotion();
  const Icon = experience.icon;
  const show = reduceMotion || inView;

  // Enter fully from off-screen, matching the Featured Projects side-entry feel.
  const offScreenX = enterFrom === 'left' ? '-108vw' : '108vw';
  const imageLeadX = enterFrom === 'left' ? '-18%' : '18%';
  const textTrailX = enterFrom === 'left' ? '-28%' : '28%';

  const stripTransition = {
    duration: reduceMotion ? 0 : 1.05,
    delay: reduceMotion ? 0 : startDelay,
    ease: cinematicEase,
  };
  const imageTransition = {
    duration: reduceMotion ? 0 : 0.95,
    delay: reduceMotion ? 0 : startDelay + 0.04,
    ease: cinematicEase,
  };
  const textTransition = {
    duration: reduceMotion ? 0 : 0.95,
    delay: reduceMotion ? 0 : startDelay + 0.28,
    ease: easeOut,
  };

  const textBlock = (
    <motion.div
      className="flex min-w-0 flex-1 flex-col justify-center px-5 py-4 sm:px-7 sm:py-5 lg:px-8"
      initial={reduceMotion ? false : { opacity: 0, x: textTrailX }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: textTrailX }}
      transition={textTransition}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1',
            experience.iconClassName,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug text-brand-900 sm:text-xl">
            {t(locale, experience.titleKey)}
          </h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-stone-600">
            {t(locale, experience.descriptionKey)}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0a6f96] transition-colors duration-300 group-hover:text-brand-900">
            <span className="border-b border-transparent pb-0.5 transition-[border-color] duration-300 group-hover:border-[#d2a73c]">
              {t(locale, experience.ctaKey)}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-[#0a6f96] transition-all duration-300 group-hover:bg-gold-100 group-hover:text-gold-700">
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );

  const imageBlock = (
    <motion.div
      className="relative h-36 w-full shrink-0 overflow-hidden sm:h-40 sm:w-[42%] lg:h-44 lg:w-[46%]"
      initial={reduceMotion ? false : { opacity: 0.35, x: imageLeadX }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0.35, x: imageLeadX }}
      transition={imageTransition}
    >
      <Image
        src={experience.imageSrc}
        alt={t(locale, experience.altKey)}
        width={experience.imageWidth}
        height={experience.imageHeight}
        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        style={{ objectPosition: imageObjectPosition }}
        sizes="(max-width: 640px) 100vw, 42vw"
      />
      <div
        className={cn(
          'absolute inset-0',
          imageSide === 'right'
            ? 'bg-gradient-to-l from-transparent via-transparent to-[#fffdf9]/35'
            : 'bg-gradient-to-r from-transparent via-transparent to-[#fffdf9]/35',
        )}
        aria-hidden="true"
      />
    </motion.div>
  );

  return (
    <div ref={ref} className="w-full max-w-5xl overflow-visible">
      <motion.a
        href={experience.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#d2a73c]/35 bg-[#fffdf9]/95 shadow-sm shadow-brand-900/[0.05] transition-[border-color,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a0dc] will-change-transform group-hover:border-[#00a0dc]/45 group-hover:shadow-lg group-hover:shadow-[#0a6f96]/10 sm:flex-row sm:items-stretch"
        initial={reduceMotion ? false : { x: offScreenX, opacity: 0 }}
        animate={show ? { x: 0, opacity: 1 } : { x: offScreenX, opacity: 0 }}
        transition={stripTransition}
        whileHover={reduceMotion ? undefined : { y: -3 }}
      >
        {imageSide === 'left' ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </motion.a>
    </div>
  );
}

export default function FeaturedExperiencesSection({
  locale,
}: FeaturedExperiencesSectionProps) {
  return (
    <AnimatedSection
      id="featured-experiences"
      tone="cream"
      spacing="default"
      aria-labelledby="featured-experiences-heading"
      withBackground={false}
      backdrop={<ExperiencesBackdrop />}
      overlayClassName="bg-gradient-to-b from-[#fff8eb]/28 via-[#f7f1e6]/18 to-[#eef4f8]/24"
      overflowVisible={false}
      className="!overflow-x-clip"
    >
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <HeadingGlow>
              <h2
                id="featured-experiences-heading"
                className="scroll-mt-28 text-4xl font-semibold leading-tight text-brand-950 [text-shadow:0_0_20px_rgba(255,255,255,1),0_0_42px_rgba(255,252,245,0.95),0_0_72px_rgba(255,248,235,0.85)] sm:scroll-mt-32 sm:text-5xl lg:scroll-mt-36"
              >
                {t(locale, 'projects.experiencesTitle')}
              </h2>
            </HeadingGlow>
            <p className="mt-4 text-base font-medium leading-relaxed text-brand-950 [text-shadow:0_0_10px_rgba(255,255,255,1),0_0_18px_rgba(255,255,255,1),0_0_32px_rgba(255,252,245,1),0_0_52px_rgba(255,248,235,0.95),0_1px_2px_rgba(255,255,255,1)] sm:text-lg">
              {t(locale, 'projects.experiencesDescription')}
            </p>
          </div>
          <Link
            href={`/${locale}/projects#experiences-heading`}
            className="relative hidden items-center gap-1.5 text-base font-semibold text-brand-800 transition-colors hover:text-brand-950 hover:underline sm:inline-flex sm:text-lg"
          >
            {t(locale, 'projects.viewOnProjects')}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="mt-10 flex flex-col items-center gap-6 sm:mt-12 sm:gap-7">
        <ExperienceStrip
          locale={locale}
          experience={virtualTour}
          imageSide="right"
          enterFrom="left"
          startDelay={0}
        />
        <ExperienceStrip
          locale={locale}
          experience={heritage}
          imageSide="left"
          enterFrom="right"
          startDelay={0.16}
          imageObjectPosition="center 85%"
        />
      </div>
    </AnimatedSection>
  );
}
