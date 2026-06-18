import Link from 'next/link';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { committees } from '@/constants/committees';
import type { Locale } from '@/constants/i18n';

type CommitteesSectionProps = {
  locale: Locale;
};

export default function CommitteesSection({ locale }: CommitteesSectionProps) {
  return (
    <Section id="committees" tone="muted" aria-labelledby="committees-heading">
      <SectionHeading id="committees-heading" title="Committees" />

      <ul className="mt-8 space-y-3">
        {committees.map((committee) => (
          <li key={committee.slug}>
            <Link
              href={`/${locale}/committees/${committee.slug}`}
              className="text-lg font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-900"
            >
              {committee.name} ({committee.abbreviation})
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
