'use client';

import { ExternalLink, FileText } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { ParishGuidelineFlowchart } from '@/types/parishGuidelines';
import { cn } from '@/lib/cn';

type ParishFlowchartsProps = {
  flowcharts: ParishGuidelineFlowchart[];
};

export default function ParishFlowcharts({ flowcharts }: ParishFlowchartsProps) {
  return (
    <StaggerChildren as="div" className="grid gap-4 sm:gap-5 lg:grid-cols-3">
      {flowcharts.map((chart) => (
        <StaggerItem key={chart.href} className="h-full min-w-0">
          <article className="flex h-full flex-col rounded-2xl border border-cream-200/90 bg-white/90 px-4 py-5 shadow-sm shadow-brand-900/[0.04] sm:px-5 sm:py-6">
            {chart.titleZh ? (
              <p className="text-xs font-medium text-brand-800 sm:text-sm">
                {chart.titleZh}
              </p>
            ) : null}
            <h3
              className={cn(
                'font-serif text-lg font-semibold leading-snug text-brand-900 sm:text-xl',
                chart.titleZh && 'mt-1',
              )}
            >
              {chart.title}
            </h3>
            {chart.description ? (
              <p className="mt-2 text-xs text-stone-600 sm:text-sm">
                {chart.description}
              </p>
            ) : null}

            <a
              href={chart.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-brand-800 transition-colors hover:text-brand-950"
            >
              <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
              Open full chart
              <ExternalLink className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            </a>
          </article>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
