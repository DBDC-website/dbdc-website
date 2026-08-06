'use client';

import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import HeadingGlow from '@/components/ui/HeadingGlow';
import { committeeSectionAnchor } from '@/lib/committeeNav';
import { cn } from '@/lib/cn';
import type {
  CommitteeDetailSection,
  CommitteeFaqItem,
  CommitteeSectionContent,
} from '@/types/committee';
import type { CommitteeSlug } from '@/types/committee';

type CommitteeSectionAccordionProps = {
  sections: CommitteeDetailSection[];
  committeeSlug: CommitteeSlug;
};

function linkifyText(text: string) {
  const parts = text.split(/(cabpag@hkdbdc\.org\.hk)/g);
  return parts.map((part, index) =>
    part === 'cabpag@hkdbdc.org.hk' ? (
      <a
        key={`${part}-${index}`}
        href="mailto:cabpag@hkdbdc.org.hk"
        className="font-medium text-brand-800 hover:underline"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function FaqAnswer({ answer }: { answer: CommitteeFaqItem['answer'] }) {
  if (Array.isArray(answer)) {
    return (
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700 sm:text-base">
        {answer.map((item) => (
          <li key={item}>{linkifyText(item)}</li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-stone-700 sm:text-base">
      {linkifyText(answer)}
    </p>
  );
}

function FaqList({ items }: { items: CommitteeFaqItem[] }) {
  return (
    <dl className="mt-3 space-y-3">
      {items.map((item) => (
        <div key={item.question}>
          <dt className="font-medium text-brand-950">{item.question}</dt>
          <dd>
            <FaqAnswer answer={item.answer} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SectionBody({ content }: { content: CommitteeSectionContent }) {
  if (content.kind === 'list') {
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-brand-950 sm:text-base">
        {content.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (content.kind === 'faq') {
    return <FaqList items={content.items} />;
  }

  if (content.kind === 'faq-groups') {
    return (
      <div className="mt-3 space-y-2.5">
        {content.groups.map((group) => (
          <details
            key={group.title}
            className="group/faq rounded-xl border border-sky-200/60 bg-white/55"
          >
            <summary
              className={cn(
                'flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-sm font-semibold text-brand-950 sm:text-base',
                '[&::-webkit-details-marker]:hidden',
              )}
            >
              <span>{group.title}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-brand-800 transition-transform duration-200 group-open/faq:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="border-t border-sky-100/80 px-3.5 pb-3.5">
              <FaqList items={group.items} />
            </div>
          </details>
        ))}
      </div>
    );
  }

  return (
    <>
      {content.description ? (
        <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
          {content.description}
        </p>
      ) : null}

      {content.items.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
          {content.emptyMessage ?? 'Newsletters will appear here once published.'}
        </p>
      ) : (
        <ul
          className={cn(
            'divide-y divide-sky-100/90',
            content.description ? 'mt-4' : 'mt-3',
          )}
        >
          {content.items.map((item) => (
            <li key={`${item.name}-${item.dateLabel}-${item.href}`}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group/link flex items-center justify-between gap-3 py-3 text-brand-950 transition-colors hover:text-brand-800"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium sm:text-base">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-stone-500 sm:text-sm">
                    {item.dateLabel}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-brand-800 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span className="sr-only">Open newsletter</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <>
      <HeadingGlow fit="box">
        <h2 className="text-lg font-semibold text-brand-950 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_28px_rgba(255,252,245,0.8)] sm:text-xl">
          {title}
        </h2>
      </HeadingGlow>
      <div
        className="relative mt-5 h-px w-14 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
        aria-hidden="true"
      />
    </>
  );
}

/**
 * Committee detail sections. Collapsible sections (newsletter, Q&A) use
 * native details/summary; other sections stay open.
 */
export default function CommitteeSectionAccordion({
  sections,
  committeeSlug,
}: CommitteeSectionAccordionProps) {
  return (
    <StaggerChildren as="div" className="space-y-5 sm:space-y-6">
      {sections.map((section, index) => {
        const sectionId = committeeSectionAnchor(committeeSlug, index);

        return (
        <StaggerItem key={section.title}>
          {section.collapsible ? (
            <details
              id={sectionId}
              className="group scroll-mt-28 rounded-2xl border border-sky-200/55 bg-gradient-to-br from-[#e8f6fc]/88 via-[#fff8eb]/84 to-[#fde8d4]/88 px-4 py-4 shadow-sm shadow-brand-900/[0.06] sm:px-5 sm:py-5"
            >
              <summary
                className={cn(
                  'flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden',
                )}
              >
                <div className="min-w-0 flex-1">
                  <SectionHeading title={section.title} />
                </div>
                <ChevronDown
                  className="mt-1 h-5 w-5 shrink-0 text-brand-800 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <SectionBody content={section.content} />
            </details>
          ) : (
            <section
              id={sectionId}
              className="scroll-mt-28 rounded-2xl border border-sky-200/55 bg-gradient-to-br from-[#e8f6fc]/88 via-[#fff8eb]/84 to-[#fde8d4]/88 px-4 py-4 shadow-sm shadow-brand-900/[0.06] sm:px-5 sm:py-5"
            >
              <SectionHeading title={section.title} />
              <SectionBody content={section.content} />
            </section>
          )}
        </StaggerItem>
        );
      })}
    </StaggerChildren>
  );
}
