'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Compass, Landmark } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import { easeOut } from '@/lib/motion';
import { cn } from '@/lib/cn';

const experiences = [
  {
    title: '360° Virtual Tour',
    description:
      'Explore selected churches and diocesan buildings through an interactive panoramic tour of DBDC research and development work.',
    href: 'https://dbdc.catholic.org.hk/RDC/home/index.html',
    imageSrc: '/images/virtual-tour.png',
    imageAlt: 'Preview of the DBDC 360° virtual tour',
    imageWidth: 1772,
    imageHeight: 1228,
    icon: Compass,
    iconClassName: 'bg-brand-100/95 text-brand-700 ring-brand-200/60',
    cta: 'Launch virtual tour',
  },
  {
    title: 'Catholic Heritage Website',
    description:
      'Discover the history, architecture, and conservation of Catholic buildings across the Diocese of Hong Kong.',
    href: 'https://heritage.catholic.org.hk/en/home/index.html',
    imageSrc: '/images/heritage.png',
    imageAlt: 'Preview of the Catholic Heritage website',
    imageWidth: 2284,
    imageHeight: 1414,
    icon: Landmark,
    iconClassName: 'bg-gold-100/95 text-gold-700 ring-gold-200/70',
    cta: 'Visit heritage site',
  },
] as const;

function ExperienceCard({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  icon: Icon,
  iconClassName,
  cta,
}: (typeof experiences)[number]) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      whileHover={reduceMotion ? undefined : { y: -8 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200/90 bg-white/90 shadow-sm shadow-brand-900/[0.04] transition-[border-color,box-shadow] duration-500 group-hover:border-gold-300/70 group-hover:shadow-lg group-hover:shadow-brand-900/10">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[5/3]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-brand-950/15 to-transparent transition-opacity duration-500 group-hover:from-brand-950/65"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gold-400/0 transition-colors duration-500 group-hover:bg-gold-400/10"
            aria-hidden="true"
          />

          <span
            className={cn(
              'absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110',
              iconClassName,
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 transition-colors duration-500 group-hover:bg-cream-50/60 sm:p-6 lg:p-7">
          <h3 className="text-xl font-semibold text-brand-900 transition-colors duration-300 group-hover:text-brand-950 sm:text-2xl">
            {title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600 transition-colors duration-300 group-hover:text-stone-700 sm:text-base">
            {description}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-800 transition-colors duration-300 group-hover:text-brand-950">
            <span className="border-b border-transparent pb-0.5 transition-[border-color] duration-300 group-hover:border-gold-400">
              {cta}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-800 transition-all duration-300 group-hover:bg-gold-100 group-hover:text-brand-950">
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </span>
        </div>
      </article>
    </motion.a>
  );
}

export default function ExperienceCards() {
  return (
    <StaggerChildren as="div" className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {experiences.map((experience) => (
        <StaggerItem key={experience.href} className="h-full">
          <ExperienceCard {...experience} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
