'use client';

import { ChevronDown } from 'lucide-react';
import HeadingGlow from '@/components/ui/HeadingGlow';
import { cn } from '@/lib/cn';

type CollapsibleMembershipSectionProps = {
  title: string;
  intro: string;
  expandLabel: string;
  children: React.ReactNode;
};

/**
 * On mobile/tablet (below `lg`), the full Members of the Commission block
 * collapses under the section title. Desktop keeps everything open.
 */
export default function CollapsibleMembershipSection({
  title,
  intro,
  expandLabel,
  children,
}: CollapsibleMembershipSectionProps) {
  return (
    <>
      <details className="group lg:hidden">
        <summary
          className={cn(
            'flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden',
          )}
        >
          <HeadingGlow className="min-w-0 flex-1" offset="none">
            <h3 className="text-2xl font-semibold text-brand-950 sm:text-3xl">
              {title}
            </h3>
          </HeadingGlow>
          <ChevronDown
            className="mt-1 h-5 w-5 shrink-0 text-brand-800 transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
          <span className="sr-only">{expandLabel}</span>
        </summary>

        <p className="mt-6 text-sm leading-relaxed text-stone-700 sm:mt-8 sm:text-base">
          {intro}
        </p>
        <div className="mt-5 space-y-5">{children}</div>
      </details>

      <div className="hidden lg:block">
        <HeadingGlow>
          <h3 className="text-2xl font-semibold text-brand-950 sm:text-3xl">
            {title}
          </h3>
        </HeadingGlow>
        <p className="mt-6 text-sm leading-relaxed text-stone-700 sm:mt-8 sm:text-base">
          {intro}
        </p>
        <div className="mt-5">{children}</div>
      </div>
    </>
  );
}
