'use client';

import { ExternalLink, FileText } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { ParishGuidelineFlowchart } from '@/types/parishGuidelines';
import { cn } from '@/lib/cn';

type ParishFlowchartsProps = {
  flowcharts: ParishGuidelineFlowchart[];
};

function isPdf(href: string) {
  return href.toLowerCase().endsWith('.pdf');
}

function isImage(href: string) {
  return /\.(png|jpe?g|webp|gif)$/i.test(href);
}

export default function ParishFlowcharts({ flowcharts }: ParishFlowchartsProps) {
  return (
    <div className="max-w-5xl">
      <StaggerChildren as="div" className="space-y-10">
        {flowcharts.map((chart) => (
          <StaggerItem key={chart.href}>
            <article className="overflow-hidden rounded-2xl border border-cream-200/90 bg-white/90 shadow-sm shadow-brand-900/[0.04]">
              <div className="border-b border-cream-200/90 bg-gradient-to-r from-cream-50 via-white to-brand-50/30 px-5 py-5 sm:px-6 sm:py-6">
                {chart.titleZh ? (
                  <p className="text-sm font-medium text-brand-800">{chart.titleZh}</p>
                ) : null}
                <h3
                  className={cn(
                    'font-serif text-xl font-semibold text-brand-900 sm:text-2xl',
                    chart.titleZh && 'mt-1',
                  )}
                >
                  {chart.title}
                </h3>
                {chart.description ? (
                  <p className="mt-2 text-sm text-stone-600 sm:text-base">
                    {chart.description}
                  </p>
                ) : null}

                <a
                  href={chart.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-800 transition-colors hover:text-brand-950"
                >
                  <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
                  Open full chart
                  <ExternalLink className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
                </a>
              </div>

              <div className="bg-cream-50/50 p-4 sm:p-5">
                {isPdf(chart.href) ? (
                  <iframe
                    title={chart.title}
                    src={`${chart.href}#view=FitH`}
                    className="h-[min(70vh,42rem)] w-full rounded-xl border border-cream-200/90 bg-white"
                  />
                ) : isImage(chart.href) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={chart.href}
                    alt={chart.title}
                    className="mx-auto h-auto max-h-[42rem] w-full rounded-xl border border-cream-200/90 object-contain"
                  />
                ) : (
                  <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-cream-300 bg-white/80 px-6 py-10 text-center text-sm text-stone-500">
                    Add the flowchart file to{' '}
                    <code className="mx-1 rounded bg-cream-100 px-1.5 py-0.5 text-xs">
                      public{chart.href}
                    </code>
                  </div>
                )}
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
