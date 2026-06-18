import { ChevronDown } from 'lucide-react';
import type { CommitteeDetailSection } from '@/types/committee';

type CommitteeSectionAccordionProps = {
  sections: CommitteeDetailSection[];
};

export default function CommitteeSectionAccordion({
  sections,
}: CommitteeSectionAccordionProps) {
  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <details
          key={section.title}
          className="group rounded-lg border border-stone-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-medium text-brand-900">
            {section.title}
            <ChevronDown
              className="h-5 w-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          {section.content.kind === 'list' ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
              {section.content.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <dl className="mt-4 space-y-4">
              {section.content.items.map((item) => (
                <div key={item.question}>
                  <dt className="font-medium text-brand-900">{item.question}</dt>
                  <dd className="mt-1 text-stone-700">{item.answer}</dd>
                </div>
              ))}
            </dl>
          )}
        </details>
      ))}
    </div>
  );
}
