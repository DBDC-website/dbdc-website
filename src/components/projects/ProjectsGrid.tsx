'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { getProjectPlaceholder } from '@/constants/projectPlaceholders';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import { cinematicEase } from '@/lib/motion';
import { withSupabaseImageTransform } from '@/lib/supabaseImage';
import { setSiteChromeHidden } from '@/lib/siteChrome';
import type { Project } from '@/types/project';

function galleryDedupeKey(src: string): string {
  try {
    const url = new URL(src);
    // Ignore transform query params so cover + gallery copies of the same file match.
    url.search = '';
    url.hash = '';
    return decodeURIComponent(url.pathname);
  } catch {
    return src.split('?')[0] ?? src;
  }
}

function projectGallery(project: Project): Array<{ src: string; alt: string; caption?: string | null }> {
  const items: Array<{ src: string; alt: string; caption?: string | null }> = [];
  const seen = new Set<string>();

  const push = (src: string | null | undefined, alt: string, caption?: string | null) => {
    if (!src) return;
    const key = galleryDedupeKey(src);
    if (seen.has(key)) return;
    seen.add(key);
    items.push({
      src: withSupabaseImageTransform(src, { width: 800, quality: 80 }),
      alt,
      caption,
    });
  };

  // Cover image first; skip when the same file already exists in project_images.
  push(project.imageUrl, project.imageAlt);
  for (const image of project.images ?? []) {
    push(image.imageUrl, image.caption || project.imageAlt, image.caption);
  }

  return items;
}

function ProjectTile({
  project,
  onOpen,
  isHovered,
  isDimmed,
  onHoverStart,
  onHoverEnd,
}: {
  project: Project;
  onOpen: () => void;
  isHovered: boolean;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const placeholder = getProjectPlaceholder(project);
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      aria-label={`View ${project.title}`}
      className="group relative block w-full origin-center overflow-hidden text-left shadow-md shadow-brand-900/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500"
      animate={
        reduceMotion
          ? undefined
          : isHovered
            ? {
                scale: 1.14,
                y: -10,
                zIndex: 30,
                boxShadow: '0 32px 56px -16px rgba(27, 39, 64, 0.45)',
              }
            : isDimmed
              ? {
                  scale: 0.92,
                  y: 8,
                  zIndex: 1,
                  opacity: 0.72,
                  boxShadow: '0 8px 18px -10px rgba(27, 39, 64, 0.2)',
                }
              : {
                  scale: 1,
                  y: 0,
                  zIndex: 2,
                  opacity: 1,
                  boxShadow: '0 10px 24px -12px rgba(27, 39, 64, 0.22)',
                }
      }
      whileTap={reduceMotion ? undefined : { scale: isHovered ? 1.1 : 0.98 }}
      transition={{ duration: 0.45, ease: cinematicEase }}
      style={{ transformOrigin: 'center center' }}
    >
      <PlaceholderImage
        alt={project.imageAlt}
        src={project.imageUrl ?? undefined}
        gradient={placeholder.gradient}
        label={project.imageUrl ? undefined : placeholder.label}
        sublabel={project.imageUrl ? undefined : placeholder.sublabel}
        style={placeholder.style}
        overlay={false}
        className="aspect-[4/3] w-full"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/15 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/0 transition-[box-shadow] duration-500 group-hover:ring-sage-300/70"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {project.buildingName ? (
          <p className="text-xs text-cream-100/90">{project.buildingName}</p>
        ) : null}
        <p
          className={
            project.buildingName
              ? 'mt-1 text-sm font-semibold text-white sm:text-base'
              : 'text-sm font-semibold text-white sm:text-base'
          }
        >
          {project.title}
        </p>
        {project.location || project.year ? (
          <p className="mt-1 text-xs text-cream-100/90">
            {[project.location, project.year].filter(Boolean).join(' · ')}
          </p>
        ) : null}
      </div>
    </motion.button>
  );
}

function ProjectLightbox({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const gallery = useMemo(() => projectGallery(project), [project]);
  const [imageIndex, setImageIndex] = useState(0);
  const hasMultiple = gallery.length > 1;
  const current = gallery[imageIndex];

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    setImageIndex((index) => (index - 1 + gallery.length) % gallery.length);
  }, [gallery.length, hasMultiple]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    setImageIndex((index) => (index + 1) % gallery.length);
  }, [gallery.length, hasMultiple]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSiteChromeHidden(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      setSiteChromeHidden(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  if (!mounted) return null;

  // Portal above page stacking contexts so section headings cannot paint over the dialog.
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-stretch justify-center p-0 sm:p-4 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#02080f]/88 backdrop-blur-[2px]"
        aria-label="Close project viewer"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 flex h-full w-full max-w-7xl flex-col overflow-hidden bg-[#07131c] shadow-2xl shadow-black/50 sm:h-[min(96vh,58rem)] sm:rounded-sm"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.45, ease: cinematicEase }}
      >
        <div className="relative flex items-start justify-between gap-4 overflow-hidden border-b border-cream-200/80 px-4 py-4 sm:px-6 sm:py-5">
          <MosaicHueBackdrop />
          <div className="absolute inset-0 bg-white/30" aria-hidden="true" />
          <div className="relative min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-logo-grey">
              {project.buildingName ?? 'Project'}
            </p>
            <h2
              id={titleId}
              className="mt-1 font-serif text-xl font-semibold text-brand-950 sm:text-2xl lg:text-3xl"
            >
              {project.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-700">
              {project.year ? <span>{project.year}</span> : null}
              {project.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {project.location}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-logo-grey/25 bg-white/70 text-logo-grey transition-colors hover:border-logo-grey/40 hover:bg-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#040b12]">
          {current ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.src}
                className="absolute inset-0"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Blurred fill matches the photo colour on letterboxed sides */}
                <Image
                  src={current.src}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="scale-110 object-cover opacity-80 blur-2xl"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-[#040b12]/25" aria-hidden="true" />
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-cream-100/80">
              No images available for this project yet.
            </div>
          )}

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#061018]/60 text-white backdrop-blur-sm transition hover:bg-[#061018]/85 sm:left-5"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#061018]/60 text-white backdrop-blur-sm transition hover:bg-[#061018]/85 sm:right-5"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#061018]/65 px-3 py-1 text-xs text-cream-100 backdrop-blur-sm">
                {imageIndex + 1} / {gallery.length}
              </p>
            </>
          ) : null}
        </div>

        {current?.caption ? (
          <p className="border-t border-cream-200 bg-cream-50 px-4 py-3 text-sm text-stone-700 sm:px-6">
            {current.caption}
          </p>
        ) : null}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/** Image-first showcase grid with full-page project lightbox. */
export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const activeProject = projects.find((project) => project.id === activeId) ?? null;

  // Clear hover while scrolling so scaled tiles cannot sit under the
  // fixed header and steal / misroute pointer interactions.
  useEffect(() => {
    const clearHover = () => setHoveredId(null);
    window.addEventListener('scroll', clearHover, { passive: true });
    return () => window.removeEventListener('scroll', clearHover);
  }, []);

  if (projects.length === 0) {
    return (
      <p className="text-sm text-stone-600">
        Projects will appear here once they are published.
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-5 overflow-visible py-4 sm:grid-cols-2 sm:gap-6 sm:py-6 lg:gap-8">
        {projects.map((project) => (
          <li key={project.id} className="relative z-0 overflow-visible">
            <ProjectTile
              project={project}
              onOpen={() => setActiveId(project.id)}
              isHovered={hoveredId === project.id}
              isDimmed={hoveredId != null && hoveredId !== project.id}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {activeProject ? (
          <ProjectLightbox
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveId(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
