import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
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
        description="Three committees and an advisory group support the Commission, each with a distinct remit."
      />

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {committees.map((committee) => (
          <Card as="li" key={committee.slug} interactive className="p-6">
            <Link
              href={`/${locale}/committees/${committee.slug}`}
              className="group block focus:outline-none"
            >
              <Badge tone="gold">{committee.abbreviation}</Badge>
              <h3 className="mt-3 text-lg font-semibold text-brand-900 group-hover:text-brand-700">
                {committee.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {committee.summary}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                Learn more
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
