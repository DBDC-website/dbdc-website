import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { committees } from '@/constants/committees';
import { type Locale } from '@/constants/i18n';

export const metadata: Metadata = {
  title: 'Committees',
  description:
    'The three committees and advisory group that support the Diocesan Building and Development Commission.',
};

type CommitteesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CommitteesPage({ params }: CommitteesPageProps) {
  const { locale } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Committees"
        description="Three committees and an advisory group support the Commission, each with a distinct remit."
      />
      <Section>
        <ul className="grid gap-6 sm:grid-cols-2">
          {committees.map((committee) => (
            <Card as="li" key={committee.slug} interactive className="p-6">
              <Link
                href={`/${locale as Locale}/committees/${committee.slug}`}
                className="group block focus:outline-none"
              >
                <Badge tone="gold">{committee.abbreviation}</Badge>
                <h2 className="mt-3 text-lg font-semibold text-brand-900 group-hover:text-brand-700">
                  {committee.name}
                </h2>
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
    </>
  );
}
