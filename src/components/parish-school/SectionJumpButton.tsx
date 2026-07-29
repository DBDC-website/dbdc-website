'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import { useSiteChromeHidden } from '@/hooks/useSiteChromeHidden';
import { cn } from '@/lib/cn';

type JumpTarget = {
  id: string;
  label: string;
};

type SectionJumpButtonProps = {
  targets: JumpTarget[];
};

/**
 * Experiences-style floating control for Parish & School:
 * Preamble → FAQs → Assistance → Useful links.
 */
export default function SectionJumpButton({ targets }: SectionJumpButtonProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const chromeHidden = useSiteChromeHidden();

  useEffect(() => {
    const update = () => {
      const elements = targets
        .map((target) => ({
          ...target,
          element: document.getElementById(target.id),
        }))
        .filter((target): target is JumpTarget & { element: HTMLElement } =>
          Boolean(target.element),
        );

      if (elements.length === 0) {
        setVisible(false);
        return;
      }

      // First section whose top is still below the upper third of the viewport
      // is the next jump target.
      const marker = window.innerHeight * 0.32;
      const nextIndex = elements.findIndex(
        (target) => target.element.getBoundingClientRect().top > marker,
      );

      if (nextIndex === -1) {
        setVisible(false);
        setActiveIndex(elements.length - 1);
        return;
      }

      setActiveIndex(nextIndex);
      setVisible(true);
    };

    update();
    // Re-check after layout/images settle
    const raf = window.requestAnimationFrame(update);
    const timeout = window.setTimeout(update, 250);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [targets]);

  const current = targets[activeIndex] ?? targets[0];
  const show = Boolean(current) && visible && !chromeHidden;

  const jumpNext = () => {
    if (!current) return;
    document.getElementById(current.id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (!current) return null;

  return (
    <button
      type="button"
      onClick={jumpNext}
      aria-label={`Scroll to ${current.label}`}
      className={cn(
        'fixed bottom-5 left-1/2 z-50 inline-flex -translate-x-1/2 flex-col items-center gap-1 overflow-hidden rounded-full border border-white/75 px-4 py-3 text-logo-grey shadow-lg shadow-brand-900/15 transition-[opacity,transform] duration-300 hover:-translate-y-0.5 sm:bottom-7',
        show
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <MosaicHueBackdrop />
      <span className="absolute inset-0 bg-white/35" aria-hidden="true" />
      <span className="relative max-w-[7.5rem] text-center text-[10px] font-bold uppercase leading-tight tracking-[0.14em]">
        {current.label}
      </span>
      <ChevronDown
        className="relative h-5 w-5 animate-bounce"
        aria-hidden="true"
      />
    </button>
  );
}
