'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, ChevronDown } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import HeadingGlow from '@/components/ui/HeadingGlow';
import { useSiteChromeHidden } from '@/hooks/useSiteChromeHidden';
import { cn } from '@/lib/cn';
import type { PastWorkYear } from '@/types/pastWork';
import { COMMITTEE_PAST_WORK_ANCHOR } from '@/lib/committeeNav';

type PastWorkSectionProps = {
  title: string;
  timelineLabel: string;
  linkLabel: string;
  backToTimelineLabel: string;
  years: PastWorkYear[];
};

export default function PastWorkSection({
  title,
  timelineLabel,
  linkLabel,
  backToTimelineLabel,
  years,
}: PastWorkSectionProps) {
  const [open, setOpen] = useState(false);
  const [activeYear, setActiveYear] = useState(years[0]?.year ?? null);
  const [showBackToTimeline, setShowBackToTimeline] = useState(false);
  const yearRefs = useRef<Map<string, HTMLElement>>(new Map());
  const timelineId = useId();
  const timelineRef = useRef<HTMLDivElement>(null);
  const yearsContainerRef = useRef<HTMLDivElement>(null);
  const chromeHidden = useSiteChromeHidden();

  useEffect(() => {
    if (!open || years.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );
        if (visible[0]) {
          const year = (visible[0].target as HTMLElement).dataset.year;
          if (year) setActiveYear(year);
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: 0.2 },
    );

    yearRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [open, years]);

  useEffect(() => {
    if (!open) {
      setShowBackToTimeline(false);
      return;
    }

    const update = () => {
      const timeline = timelineRef.current;
      const yearsEl = yearsContainerRef.current;
      if (!timeline || !yearsEl) {
        setShowBackToTimeline(false);
        return;
      }

      const timelineRect = timeline.getBoundingClientRect();
      const yearsRect = yearsEl.getBoundingClientRect();
      const timelineAbove = timelineRect.bottom < 96;
      const yearsInView =
        yearsRect.top < window.innerHeight * 0.92 &&
        yearsRect.bottom > window.innerHeight * 0.2;

      setShowBackToTimeline(timelineAbove && yearsInView);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [open, years]);

  const jumpToYear = (year: string) => {
    setActiveYear(year);
    const el = yearRefs.current.get(year);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jumpToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showFloating = showBackToTimeline && !chromeHidden;

  return (
    <section id={COMMITTEE_PAST_WORK_ANCHOR} className="mt-5 scroll-mt-28 sm:mt-6">
      <div className="overflow-hidden rounded-2xl border border-sky-200/55 bg-gradient-to-br from-[#e8f6fc]/88 via-[#fff8eb]/84 to-[#fde8d4]/88 shadow-sm shadow-brand-900/[0.06]">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
        >
          <HeadingGlow fit="box">
            <h2 className="text-lg font-semibold text-brand-950 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_28px_rgba(255,252,245,0.8)] sm:text-xl">
              {title}
            </h2>
          </HeadingGlow>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-brand-800 transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-sky-200/50 px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
              <div
                id={timelineId}
                ref={timelineRef}
                className="scroll-mt-28"
              >
                <div
                  className="overflow-x-auto px-1 pb-2"
                  role="tablist"
                  aria-label={timelineLabel}
                >
                  <div className="relative flex w-max min-w-full items-center gap-3 sm:gap-4">
                    <div
                      className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gold-300/80"
                      aria-hidden
                    />
                    {years.map((entry) => {
                      const isActive = activeYear === entry.year;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => jumpToYear(entry.year)}
                          className={`relative z-10 shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                            isActive
                              ? 'bg-brand-800 text-white shadow-sm'
                              : 'bg-white/80 text-brand-900 ring-1 ring-sky-200/70 hover:bg-cream-50'
                          }`}
                        >
                          {entry.year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div ref={yearsContainerRef} className="mt-6 space-y-5">
                {years.map((entry) => (
                  <article
                    key={entry.id}
                    id={`past-work-${entry.year}`}
                    data-year={entry.year}
                    ref={(node) => {
                      if (node) yearRefs.current.set(entry.year, node);
                      else yearRefs.current.delete(entry.year);
                    }}
                    className="scroll-mt-28 rounded-xl border border-cream-200/90 bg-white/75 p-4 sm:p-5"
                  >
                    <h3 className="text-base font-semibold text-brand-900 sm:text-lg">
                      {entry.year}
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {entry.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start gap-3 text-sm leading-relaxed text-brand-950 sm:text-base"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">{item.text}</span>
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-0.5 inline-flex shrink-0 rounded-md p-1 text-brand-800 transition-colors hover:bg-brand-50 hover:text-brand-950"
                              aria-label={linkLabel}
                            >
                              <ArrowUpRight className="h-4 w-4" aria-hidden />
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={jumpToTimeline}
        aria-label={backToTimelineLabel}
        className={cn(
          'fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 flex-col items-center gap-1 overflow-hidden rounded-full border border-white/75 px-4 py-3 text-logo-grey shadow-lg shadow-brand-900/10 transition-[opacity,transform] duration-300 hover:-translate-y-0.5 sm:bottom-7',
          showFloating
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <MosaicHueBackdrop />
        <span className="absolute inset-0 bg-white/30" aria-hidden="true" />
        <ArrowUp className="relative h-5 w-5" aria-hidden="true" />
        <span className="relative max-w-[7.5rem] text-center text-[10px] font-bold uppercase leading-tight tracking-[0.14em]">
          {backToTimelineLabel}
        </span>
      </button>
    </section>
  );
}
