'use client';

import { useId, useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import { cn } from '@/lib/cn';
import HeadingGlow from '@/components/ui/HeadingGlow';
import type { ParishGuidelinesContent } from '@/types/parishGuidelines';

type ParishGuidelinesTipsProps = {
  content: Pick<
    ParishGuidelinesContent,
    'tipsTitle' | 'tips' | 'assistTitle' | 'assistBody' | 'signOff'
  >;
};

function TipCard({
  tip,
  index,
  expanded,
  onToggle,
}: {
  tip: { text: string };
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <StaggerItem as="li">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="group relative w-full overflow-hidden rounded-[1.75rem] border border-sky-200/70 px-5 py-5 text-left shadow-sm shadow-brand-900/10 transition-[border-color,box-shadow] duration-300 hover:border-sky-300/80 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-6 sm:py-6"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8f6fc]/90 via-[#fff8eb]/86 to-[#fde8d4]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(0,160,220,0.18),transparent_55%)]" />
        </div>
        <div className="relative flex gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-100 to-sky-100 text-sm font-bold text-brand-900 shadow-sm"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              Tip {index + 1}
            </p>
            <p
              id={panelId}
              className={cn(
                'text-sm leading-relaxed text-brand-950 sm:text-base',
                !expanded && 'line-clamp-2',
              )}
            >
              {tip.text}
            </p>
            {!expanded ? (
              <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-[#0a6f96]">
                …
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Read more
                </span>
              </span>
            ) : (
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                Show less
                <ChevronDown className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      </button>
    </StaggerItem>
  );
}

export default function ParishGuidelinesTips({ content }: ParishGuidelinesTipsProps) {
  const tips = content.tips.slice(0, 5);
  const columnOne = tips.slice(0, 3);
  const columnTwo = tips.slice(3, 5);
  const [expandedTips, setExpandedTips] = useState<Set<number>>(new Set());

  function toggleTip(index: number) {
    setExpandedTips((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <HeadingGlow className="mx-auto" offset="none">
        <h2
          id="contractor-tips-heading"
          className="text-center font-serif text-xl font-semibold leading-snug text-brand-950 [text-shadow:0_0_16px_rgba(255,255,255,0.95),0_0_32px_rgba(255,252,245,0.8)] sm:text-2xl lg:text-3xl"
        >
          {content.tipsTitle}
        </h2>
      </HeadingGlow>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-6">
        <StaggerChildren as="ol" className="space-y-4">
          {columnOne.map((tip, index) => (
            <TipCard
              key={tip.text}
              tip={tip}
              index={index}
              expanded={expandedTips.has(index)}
              onToggle={() => toggleTip(index)}
            />
          ))}
        </StaggerChildren>

        <StaggerChildren as="ol" className="space-y-4">
          {columnTwo.map((tip, index) => {
            const absoluteIndex = index + 3;
            return (
              <TipCard
                key={tip.text}
                tip={tip}
                index={absoluteIndex}
                expanded={expandedTips.has(absoluteIndex)}
                onToggle={() => toggleTip(absoluteIndex)}
              />
            );
          })}
        </StaggerChildren>
      </div>

      <section
        id="assist-heading"
        aria-labelledby="assist-heading-title"
        className="relative overflow-hidden rounded-[1.75rem] border border-sky-200/70 px-5 py-6 shadow-sm shadow-brand-900/10 sm:px-7 sm:py-8"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8f6fc]/90 via-[#fff8eb]/86 to-[#fde8d4]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(0,160,220,0.18),transparent_55%)]" />
        </div>
        <div className="relative">
          <h3
            id="assist-heading-title"
            className="font-serif text-xl font-semibold text-brand-950 sm:text-2xl"
          >
            {content.assistTitle}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-brand-900 sm:text-base">
            {content.assistBody}
          </p>
          <p className="mt-5 font-medium text-brand-950 sm:text-lg">
            {content.signOff}
          </p>
        </div>
      </section>
    </div>
  );
}
