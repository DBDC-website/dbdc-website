'use client';

import { Lightbulb } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { ParishGuidelinesContent } from '@/types/parishGuidelines';

type ParishGuidelinesTipsProps = {
  content: Pick<
    ParishGuidelinesContent,
    'tipsTitle' | 'tips' | 'assistTitle' | 'assistBody' | 'signOff'
  >;
};

export default function ParishGuidelinesTips({ content }: ParishGuidelinesTipsProps) {
  const tips = content.tips.slice(0, 5);

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="relative w-full max-w-5xl py-2 sm:py-3">
        <div
          className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-full bg-[radial-gradient(ellipse_at_18%_45%,rgba(255,252,245,0.92)_0%,rgba(255,248,235,0.52)_40%,transparent_72%)] sm:-inset-x-4"
          aria-hidden="true"
        />
        <h2
          id="contractor-tips-heading"
          className="relative font-serif text-xl font-semibold leading-snug text-brand-950 [text-shadow:0_0_16px_rgba(255,255,255,0.95),0_0_32px_rgba(255,252,245,0.8)] sm:text-2xl lg:text-3xl"
        >
          {content.tipsTitle}
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <StaggerChildren as="ol" className="space-y-4">
          {tips.map((tip, index) => (
            <StaggerItem key={tip.text} as="li">
              <article className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/75 p-5 shadow-md shadow-brand-900/10 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-sky-200/90 hover:shadow-lg sm:p-6">
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#e8f6fc]/50 via-transparent to-[#fde8d4]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
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
                    <p className="text-sm leading-relaxed text-brand-950 sm:text-base">
                      {tip.text}
                    </p>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <section
          id="assist-heading"
          aria-labelledby="assist-heading-title"
          className="relative overflow-hidden rounded-[1.75rem] border border-sky-200/70 px-5 py-6 shadow-sm shadow-brand-900/10 sm:px-7 sm:py-8 lg:sticky lg:top-28"
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
    </div>
  );
}
