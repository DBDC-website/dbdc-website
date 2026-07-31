'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Compass, Landmark } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { easeOut } from '@/lib/motion';
import { cn } from '@/lib/cn';

export const featuredExperiences = [
  {
    titleKey: 'projects.virtualTourTitle',
    descriptionKey: 'projects.virtualTourDescription',
    ctaKey: 'projects.virtualTourCta',
    altKey: 'projects.virtualTourAlt',
    href: 'https://dbdc.catholic.org.hk/RDC/home/index.html',
    imageSrc: '/images/virtual-tour.png',
    imageWidth: 1772,
    imageHeight: 1228,
    icon: Compass,
    iconClassName: 'bg-sky-100/95 text-[#0a6f96] ring-sky-200/70',
  },
  {
    titleKey: 'projects.heritageTitle',
    descriptionKey: 'projects.heritageDescription',
    ctaKey: 'projects.heritageCta',
    altKey: 'projects.heritageAlt',
    href: 'https://heritage.catholic.org.hk/en/home/index.html',
    imageSrc: '/images/heritage.png',
    imageWidth: 2284,
    imageHeight: 1414,
    icon: Landmark,
    iconClassName: 'bg-gold-100/95 text-gold-700 ring-gold-200/70',
  },
] as const;

function ExperienceCard({
  locale,
  titleKey,
  descriptionKey,
  ctaKey,
  altKey,
  href,
  imageSrc,
  imageWidth,
  imageHeight,
  icon: Icon,
  iconClassName,
}: (typeof featuredExperiences)[number] & { locale: Locale }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-auto block h-full w-full max-w-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a0dc] lg:max-w-lg"
      whileHover={reduceMotion ? undefined : { y: -6 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#d2a73c]/35 bg-[#fffdf9]/95 shadow-sm shadow-brand-900/[0.04] transition-[border-color,box-shadow] duration-500 group-hover:border-[#00a0dc]/45 group-hover:shadow-lg group-hover:shadow-[#0a6f96]/10">
        <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[3/2]">
          <Image
            src={imageSrc}
            alt={t(locale, altKey)}
            width={imageWidth}
            height={imageHeight}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            sizes="(max-width: 1024px) 100vw, 28rem"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-brand-950/8 to-transparent"
            aria-hidden="true"
          />

          <span
            className={cn(
              'absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110',
              iconClassName,
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-col px-4 py-3.5 sm:px-5 sm:py-4">
          <h3 className="text-lg font-semibold leading-snug text-brand-900 sm:text-xl">
            {t(locale, titleKey)}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
            {t(locale, descriptionKey)}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0a6f96] transition-colors duration-300 group-hover:text-brand-900">
            <span className="border-b border-transparent pb-0.5 transition-[border-color] duration-300 group-hover:border-[#d2a73c]">
              {t(locale, ctaKey)}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-[#0a6f96] transition-all duration-300 group-hover:bg-gold-100 group-hover:text-gold-700">
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </span>
        </div>
      </article>
    </motion.a>
  );
}

export default function ExperienceCards({ locale }: { locale: Locale }) {
  return (
    <StaggerChildren
      as="div"
      className="mx-auto grid max-w-4xl gap-6 sm:gap-7 lg:grid-cols-2 lg:gap-8"
    >
      {featuredExperiences.map((experience) => (
        <StaggerItem key={experience.href} className="h-full">
          <ExperienceCard locale={locale} {...experience} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
