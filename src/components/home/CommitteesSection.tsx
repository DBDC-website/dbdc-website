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
      <SectionHeading
        id="committees-heading"
        eyebrow="Governance"
        title="Committees"
        description="Committee information is part of the Home/About section. Select a committee below to open its detail page."
      />

      <ul className="mt-8 space-y-4">
        {committees.map((committee) => (
          <li key={committee.slug}>
            <Link
              href={`/${locale}/committees/${committee.slug}`}
              className="text-xl font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-900"
            >
              {committee.name}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
