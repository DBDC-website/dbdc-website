'use client';

import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <StaggerChildren as="div" className="max-w-3xl space-y-3">
      {items.map((item) => (
        <StaggerItem key={item.question}>
          <details className="group rounded-2xl border border-cream-200/90 bg-white/90 p-5 shadow-sm shadow-brand-900/[0.03] sm:p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-brand-900 sm:text-lg">
              {item.question}
              <span
                className="text-gold-500 transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              {item.answer}
            </p>
          </details>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
