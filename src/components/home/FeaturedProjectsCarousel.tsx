'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import { featuredProjects } from '@/constants/projects';
import type { Locale } from '@/constants/i18n';
import type { Project } from '@/types/project';
import { cn } from '@/lib/cn';

type FeaturedProjectsCarouselProps = {
  locale: Locale;
};

const GAP = 24;
const cinematicEase = [0.16, 1, 0.3, 1] as const;

function CarouselProjectCard({
  project,
  isActive,
  locale,
}: {
  project: Project;
  isActive: boolean;
  locale: Locale;
}) {
  return (
    <motion.div
      animate={{
        scale: isActive ? 1 : 0.9,
        opacity: isActive ? 1 : 0.72,
      }}
      transition={{ duration: 0.55, ease: cinematicEase }}
      className={cn(
        'flex h-full w-[min(85vw,20rem)] shrink-0 flex-col sm:w-[22rem] lg:w-[24rem]',
        isActive && 'relative z-10',
      )}
    >
      <div
        className={cn(
          'h-full rounded-2xl transition-[box-shadow,ring-color] duration-500',
          isActive
            ? 'shadow-xl shadow-brand-900/12 ring-2 ring-gold-300/50'
            : 'shadow-md shadow-brand-900/5',
        )}
      >
        <ProjectCard project={project} />
      </div>

      {isActive ? (
        <Link
          href={`/${locale}/projects`}
          className="mt-4 inline-flex items-center text-sm font-medium text-brand-800 transition-colors hover:text-brand-950"
        >
          View all projects
          <span aria-hidden="true" className="ml-1.5">
            →
          </span>
        </Link>
      ) : null}
    </motion.div>
  );
}

export default function FeaturedProjectsCarousel({
  locale,
}: FeaturedProjectsCarouselProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const maxIndex = featuredProjects.length - 1;

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>('[data-carousel-card]');
    if (firstCard) {
      setCardWidth(firstCard.offsetWidth);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const step = cardWidth + GAP;

  const getOffsetForIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return 0;
      const containerWidth = container.offsetWidth;
      return containerWidth / 2 - cardWidth / 2 - index * step;
    },
    [cardWidth, step],
  );

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [maxIndex],
  );

  useEffect(() => {
    x.set(getOffsetForIndex(activeIndex));
  }, [activeIndex, cardWidth, getOffsetForIndex, x]);

  useEffect(() => {
    if (isDragging || reduceMotion) return;

    const controls = animate(x, getOffsetForIndex(activeIndex), {
      duration: 0.65,
      ease: cinematicEase,
    });

    return () => controls.stop();
  }, [activeIndex, cardWidth, getOffsetForIndex, isDragging, reduceMotion, x]);

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);

    const threshold = step * 0.18;
    const velocityBoost = info.velocity.x * 0.12;
    const offset = info.offset.x + velocityBoost;

    if (offset > threshold) {
      goTo(activeIndex - 1);
      return;
    }

    if (offset < -threshold) {
      goTo(activeIndex + 1);
      return;
    }

    if (!reduceMotion) {
      animate(x, getOffsetForIndex(activeIndex), {
        duration: 0.45,
        ease: cinematicEase,
      });
    }
  };

  const trackX = reduceMotion ? getOffsetForIndex(activeIndex) : undefined;

  return (
    <div className="relative mt-14 lg:mt-16">
      <div
        ref={containerRef}
        className="relative overflow-hidden px-1 py-4 sm:py-6"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
      >
        <motion.div
          className="flex cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ x: reduceMotion ? trackX : x, gap: GAP }}
          drag={reduceMotion ? false : 'x'}
          dragElastic={0.14}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {featuredProjects.map((project, index) => (
            <div key={project.id} data-carousel-card className="shrink-0">
              <CarouselProjectCard
                project={project}
                isActive={index === activeIndex}
                locale={locale}
              />
            </div>
          ))}
        </motion.div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-cream-100 via-cream-100/80 to-transparent sm:w-16"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-cream-100 via-cream-100/80 to-transparent sm:w-16"
          aria-hidden="true"
        />
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 sm:mt-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="Show previous project"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/90 bg-white/90 text-brand-800 shadow-sm transition-[transform,box-shadow,border-color,opacity] duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" aria-live="polite">
          {featuredProjects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show ${project.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                index === activeIndex
                  ? 'w-8 bg-gold-600'
                  : 'w-2.5 bg-stone-300 hover:bg-stone-400',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === maxIndex}
          aria-label="Show next project"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/90 bg-white/90 text-brand-800 shadow-sm transition-[transform,box-shadow,border-color,opacity] duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
