'use client';

import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import HeadingGlow from '@/components/ui/HeadingGlow';
import type { CommitteeDetailSection } from '@/types/committee';

type CommitteeSectionAccordionProps = {
  sections: CommitteeDetailSection[];
};

/**
 * Open committee sections (no accordion). Headings use the homepage
 * soft cylinder glow treatment.
 */
export default function CommitteeSectionAccordion({
  sections,
}: CommitteeSectionAccordionProps) {
  return (
    <StaggerChildren as="div" className="space-y-5 sm:space-y-6">
      {sections.map((section) => (
        <StaggerItem key={section.title}>
          <section className="rounded-2xl border border-sky-200/55 bg-gradient-to-br from-[#e8f6fc]/88 via-[#fff8eb]/84 to-[#fde8d4]/88 px-4 py-4 shadow-sm shadow-brand-900/[0.06] sm:px-5 sm:py-5">
            <HeadingGlow fit="box">
              <h2 className="text-lg font-semibold text-brand-950 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_28px_rgba(255,252,245,0.8)] sm:text-xl">
                {section.title}
              </h2>
            </HeadingGlow>
            <div
              className="relative mt-5 h-px w-14 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
              aria-hidden="true"
            />

            {section.content.kind === 'list' ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-brand-950 sm:text-base">
                {section.content.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <dl className="mt-3 space-y-3">
                {section.content.items.map((item) => (
                  <div key={item.question}>
                    <dt className="font-medium text-brand-950">{item.question}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-stone-700 sm:text-base">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
