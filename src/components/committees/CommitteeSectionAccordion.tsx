'use client';

import { ChevronDown } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { CommitteeDetailSection } from '@/types/committee';

type CommitteeSectionAccordionProps = {
  sections: CommitteeDetailSection[];
};

export default function CommitteeSectionAccordion({
  sections,
}: CommitteeSectionAccordionProps) {
  return (
    <StaggerChildren as="div" className="space-y-3">
      {sections.map((section) => (
        <StaggerItem key={section.title}>
          <details className="group rounded-2xl border border-cream-200/90 bg-white/90 p-5 shadow-sm shadow-brand-900/[0.03] sm:p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-brand-900 sm:text-xl">
              {section.title}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-gold-600 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            {section.content.kind === 'list' ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-stone-700 sm:text-base">
                {section.content.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <dl className="mt-4 space-y-4">
                {section.content.items.map((item) => (
                  <div key={item.question}>
                    <dt className="font-medium text-brand-900">{item.question}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-stone-700 sm:text-base">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </details>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
