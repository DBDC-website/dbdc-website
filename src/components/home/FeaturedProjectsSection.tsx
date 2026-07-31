'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import ScrollReveal from '@/components/motion/ScrollReveal';
import AnimatedSection from '@/components/ui/AnimatedSection';
import HeadingGlow from '@/components/ui/HeadingGlow';
import type { Locale } from '@/constants/i18n';
import { homeImages } from '@/constants/homeImages';
import { useTouchDevice } from '@/hooks/useTouchDevice';
import { t } from '@/lib/i18n';
import { cinematicEase } from '@/lib/motion';
import { withSupabaseImageTransform } from '@/lib/supabaseImage';
import { cn } from '@/lib/cn';
import type { Project } from '@/types/project';

type FeaturedProjectsSectionProps = {
  locale: Locale;
  projects: Project[];
};

const GAP = 28;
const AUTO_MS = 3200;
const AUTOPLAY_RESUME_MS = 5000;

const featuredDefaultBackdrop = homeImages.featuredProjects;

function getInitialIndex(projectCount: number) {
  return Math.max(0, Math.floor(projectCount / 2));
}

function FeaturedBackdrop({ project }: { project: Project | null }) {
  const hoverSrc = project?.imageUrl
    ? withSupabaseImageTransform(project.imageUrl, { width: 1200, quality: 75 })
    : null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={featuredDefaultBackdrop.src}
        alt=""
        fill
        sizes="100vw"
        unoptimized
        className="object-cover opacity-[0.92]"
        style={{ objectPosition: featuredDefaultBackdrop.objectPosition }}
        priority={false}
      />
      <AnimatePresence mode="sync">
        {hoverSrc ? (
          <motion.div
            key={project?.id ?? hoverSrc}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.94 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: cinematicEase }}
          >
            <Image
              src={hoverSrc}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
              priority={false}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CarouselProjectCard({
  project,
  isActive,
  isHovered,
  shouldLoadImage,
  isTouch,
  onHoverStart,
  onHoverEnd,
}: {
  project: Project;
  isActive: boolean;
  isHovered: boolean;
  shouldLoadImage: boolean;
  isTouch: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const hoverLift = isHovered && !reduceMotion && !isTouch;

  return (
    <motion.div
      onHoverStart={isTouch ? undefined : onHoverStart}
      onHoverEnd={isTouch ? undefined : onHoverEnd}
      style={
        isTouch
          ? undefined
          : { perspective: 1200, transformStyle: 'preserve-3d' }
      }
      className={cn(
        'flex h-full w-[min(92vw,32rem)] shrink-0 cursor-default flex-col sm:w-[34rem] lg:w-[38rem]',
        (isActive || isHovered) && 'relative',
      )}
    >
      <motion.div
        animate={
          reduceMotion || isTouch
            ? {
                scale: isActive ? 1 : 0.92,
                opacity: isActive ? 1 : 0.7,
                zIndex: isActive ? 10 : 1,
              }
            : hoverLift
              ? {
                  scale: 1.06,
                  y: -18,
                  rotateX: 2,
                  rotateY: 0,
                  z: 20,
                  opacity: 1,
                  zIndex: 30,
                }
              : {
                  scale: isActive ? 1 : 0.88,
                  y: isActive ? -6 : 0,
                  rotateX: 0,
                  rotateY: 0,
                  z: 0,
                  opacity: isActive ? 1 : 0.62,
                  zIndex: isActive ? 10 : 1,
                }
        }
        transition={{ duration: isTouch ? 0.35 : 0.65, ease: cinematicEase }}
        className={cn(
          'h-full origin-center overflow-hidden rounded-2xl',
          hoverLift
            ? 'shadow-2xl shadow-brand-900/25 ring-2 ring-gold-300/70'
            : isActive
              ? 'shadow-xl shadow-brand-900/12 ring-2 ring-gold-300/45'
              : 'shadow-md shadow-brand-900/5',
        )}
        style={isTouch ? undefined : { transformStyle: 'preserve-3d' }}
      >
        <ProjectCard
          project={project}
          thumbnailSrc={shouldLoadImage ? project.imageUrl : undefined}
          thumbnailLoading="lazy"
          thumbnailTransform={{ width: 600, quality: 75 }}
        />
      </motion.div>
    </motion.div>
  );
}

function FeaturedProjectsCarousel({
  locale,
  projects,
  onHoverProject,
}: {
  locale: Locale;
  projects: Project[];
  onHoverProject: (project: Project | null) => void;
}) {
  const projectCount = projects.length;
  const reduceMotion = useReducedMotion();
  const isTouch = useTouchDevice();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(containerRef, {
    once: false,
    amount: 0.05,
    margin: '0px 0px -12% 0px',
  });

  const [activeIndex, setActiveIndex] = useState(() =>
    getInitialIndex(projectCount),
  );
  const [cardWidth, setCardWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const x = useMotionValue(0);
  const resumeTimerRef = useRef<number | null>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  /** Pause autoplay; resume after 5s without arrow / control interaction. */
  const pauseAutoplayForResume = useCallback(() => {
    setAutoplay(false);
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      setAutoplay(true);
      resumeTimerRef.current = null;
    }, AUTOPLAY_RESUME_MS);
  }, [clearResumeTimer]);

  useEffect(() => {
    setActiveIndex(getInitialIndex(projects.length));
    setAutoplay(true);
    clearResumeTimer();
  }, [projects.length, clearResumeTimer]);

  useEffect(() => {
    if (sectionInView) {
      setAutoplay(true);
    } else {
      setAutoplay(false);
      clearResumeTimer();
    }
  }, [sectionInView, clearResumeTimer]);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const firstCard = container.querySelector<HTMLElement>('[data-carousel-card]');
    if (firstCard) setCardWidth(firstCard.offsetWidth);
  }, []);

  useEffect(() => {
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [measure, projects.length]);

  const step = cardWidth + GAP;
  const isAutoGliding =
    autoplay &&
    !reduceMotion &&
    sectionInView &&
    hoveredId == null &&
    !isDragging &&
    projectCount > 1;

  const getOffsetForIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return 0;
      return container.offsetWidth / 2 - cardWidth / 2 - index * step;
    },
    [cardWidth, step],
  );

  useLayoutEffect(() => {
    if (isDragging || isAutoGliding) return;
    x.set(getOffsetForIndex(activeIndex + projectCount));
  }, [
    activeIndex,
    cardWidth,
    getOffsetForIndex,
    isAutoGliding,
    isDragging,
    x,
    projectCount,
  ]);

  const goTo = useCallback(
    (index: number, { pauseAuto = false }: { pauseAuto?: boolean } = {}) => {
      if (projectCount === 0) return;
      if (pauseAuto) pauseAutoplayForResume();
      const normalized = ((index % projectCount) + projectCount) % projectCount;
      setActiveIndex(normalized);
    },
    [pauseAutoplayForResume, projectCount],
  );

  const goPrev = useCallback(
    () => goTo(activeIndex - 1, { pauseAuto: true }),
    [activeIndex, goTo],
  );
  const goNext = useCallback(
    () => goTo(activeIndex + 1, { pauseAuto: true }),
    [activeIndex, goTo],
  );

  // Snap / animate track when active index changes (manual nav / drag).
  useEffect(() => {
    if (isDragging || isAutoGliding) return;
    if (reduceMotion) {
      x.set(getOffsetForIndex(activeIndex + projectCount));
      return;
    }
    const controls = animate(x, getOffsetForIndex(activeIndex + projectCount), {
      duration: 0.75,
      ease: cinematicEase,
    });
    return () => controls.stop();
  }, [
    activeIndex,
    cardWidth,
    getOffsetForIndex,
    isAutoGliding,
    isDragging,
    projectCount,
    reduceMotion,
    x,
  ]);

  // Continuous infinite glide (right → left).
  useEffect(() => {
    if (!isAutoGliding) return;

    let raf = 0;
    let lastTs = 0;
    const pxPerSecond = step / (AUTO_MS / 1000);
    const loopSpan = step * projectCount;
    const loopResetX = getOffsetForIndex(projectCount * 2);

    const tick = (ts: number) => {
      if (!lastTs) {
        lastTs = ts;
      }
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const container = containerRef.current;
      if (!container) {
        raf = window.requestAnimationFrame(tick);
        return;
      }

      let nextX = x.get() - pxPerSecond * dt;
      const base = container.offsetWidth / 2 - cardWidth / 2;
      if (nextX <= loopResetX) {
        nextX += loopSpan;
      }

      x.set(nextX);
      const approxIndex = (base - nextX) / step;
      const wrappedIndex =
        ((Math.round(approxIndex) % projectCount) + projectCount) % projectCount;
      setActiveIndex((prev) => (prev === wrappedIndex ? prev : wrappedIndex));

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [
    cardWidth,
    getOffsetForIndex,
    isAutoGliding,
    projectCount,
    step,
    x,
  ]);

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
    pauseAutoplayForResume();

    const threshold = step * 0.18;
    const offset = info.offset.x + info.velocity.x * 0.12;

    if (offset > threshold) {
      goTo(activeIndex - 1, { pauseAuto: true });
      return;
    }
    if (offset < -threshold) {
      goTo(activeIndex + 1, { pauseAuto: true });
      return;
    }
    if (!reduceMotion) {
      animate(x, getOffsetForIndex(activeIndex + projectCount), {
        duration: 0.45,
        ease: cinematicEase,
      });
    }
  };

  const handleHoverStart = (project: Project, isActive: boolean) => {
    setHoveredId(project.id);
    if (isActive) {
      onHoverProject(project);
    }
  };

  const handleHoverEnd = () => {
    setHoveredId(null);
    onHoverProject(null);
  };

  return (
    <div className="relative mt-6 sm:mt-8">
      <div
        ref={containerRef}
        className="relative overflow-visible px-0 py-3 sm:py-4"
        role="region"
        aria-roledescription="carousel"
        aria-label={t(locale, 'home.featuredAria')}
      >
        <div
          className={cn(
            'relative overflow-visible',
            !isTouch && '[perspective:1400px]',
          )}
        >
          <motion.div
            className="flex cursor-grab touch-pan-y py-3 active:cursor-grabbing sm:py-4"
            style={{ x, gap: GAP }}
            drag={reduceMotion ? false : 'x'}
            dragElastic={0.14}
            onDragStart={() => {
              setIsDragging(true);
              pauseAutoplayForResume();
            }}
            onDragEnd={handleDragEnd}
          >
            {[...projects, ...projects, ...projects].map((project, index) => {
              const isActive = index % projectCount === activeIndex;
              const centeredIndex = activeIndex + projectCount;
              const shouldLoad = Math.abs(index - centeredIndex) <= 1;
              return (
                <div
                  key={`${project.id}-${index}`}
                  data-carousel-card
                  className="shrink-0"
                >
                  <CarouselProjectCard
                    project={project}
                    isActive={isActive}
                    isHovered={hoveredId === project.id && isActive}
                    shouldLoadImage={shouldLoad}
                    isTouch={isTouch}
                    onHoverStart={() => handleHoverStart(project, isActive)}
                    onHoverEnd={handleHoverEnd}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 sm:mt-3">
        <button
          type="button"
          onClick={goPrev}
          aria-label={t(locale, 'home.featuredPrev')}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/90 bg-white/90 text-brand-800 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2" aria-live="polite">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(index, { pauseAuto: true })}
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
          aria-label={t(locale, 'home.featuredNext')}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/90 bg-white/90 text-brand-800 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-1.5 text-base font-semibold text-brand-800"
        >
          {t(locale, 'home.featuredViewAll')}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedProjectsSection({
  locale,
  projects,
}: FeaturedProjectsSectionProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const hasHoverImage = Boolean(hoveredProject?.imageUrl);

  return (
    <AnimatedSection
      id="featured-projects"
      tone="cream"
      spacing="generous"
      aria-labelledby="featured-projects-heading"
      withBackground={false}
      backdrop={<FeaturedBackdrop project={hoveredProject} />}
      overlayClassName={
        hasHoverImage
          ? 'bg-gradient-to-b from-cream-100/28 via-cream-50/18 to-cream-100/30 transition-colors duration-700'
          : 'bg-gradient-to-b from-cream-100/32 via-cream-50/22 to-cream-100/34 transition-colors duration-700'
      }
    >
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <HeadingGlow>
              <h2
                id="featured-projects-heading"
                className="scroll-mt-28 text-4xl font-semibold leading-tight text-brand-950 [text-shadow:0_0_20px_rgba(255,255,255,1),0_0_42px_rgba(255,252,245,0.95),0_0_72px_rgba(255,248,235,0.85)] sm:scroll-mt-32 sm:text-5xl lg:scroll-mt-36"
              >
                {t(locale, 'home.featuredTitle')}
              </h2>
            </HeadingGlow>
            <p className="mt-4 text-base font-medium leading-relaxed text-brand-900 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_28px_rgba(255,252,245,0.75)] sm:text-lg">
              {t(locale, 'home.featuredSubtitle')}
            </p>
          </div>
          <Link
            href={`/${locale}/projects`}
            className="relative hidden items-center gap-1.5 text-base font-semibold text-brand-800 transition-colors hover:text-brand-950 hover:underline sm:inline-flex sm:text-lg"
          >
            {t(locale, 'home.featuredViewAll')}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </ScrollReveal>

      {projects.length > 0 ? (
        <ScrollReveal delay={0.1}>
          <div className="relative -mx-2 sm:-mx-4 lg:-mx-8">
            <FeaturedProjectsCarousel
              locale={locale}
              projects={projects}
              onHoverProject={setHoveredProject}
            />
          </div>
        </ScrollReveal>
      ) : (
        <p className="mt-10 text-sm text-stone-600">
          {t(locale, 'home.featuredEmpty')}
        </p>
      )}
    </AnimatedSection>
  );
}
