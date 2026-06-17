import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import { committees, getCommittee } from '@/constants/committees';
import { locales, type Locale } from '@/constants/i18n';
import type { CommitteeSlug } from '@/types/committee';

type CommitteeDetailProps = {
  params: Promise<{ locale: string; committee: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    committees.map((committee) => ({ locale, committee: committee.slug })),
  );
}

export async function generateMetadata({
  params,
}: CommitteeDetailProps): Promise<Metadata> {
  const { committee } = await params;
  const found = getCommittee(committee as CommitteeSlug);
  if (!found) return { title: 'Committee not found' };
  return { title: found.name, description: found.summary };
}

export default async function CommitteeDetailPage({
  params,
}: CommitteeDetailProps) {
  const { locale, committee } = await params;
  const found = getCommittee(committee as CommitteeSlug);

  if (!found) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow={found.abbreviation}
        title={found.name}
        description={found.summary}
      />
      <Section containerSize="narrow">
        <Link
          href={`/${locale as Locale}/committees`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All committees
        </Link>

        <h2 className="mt-8 text-xl font-semibold text-brand-900">
          Responsibilities
        </h2>
        <ul className="mt-5 space-y-3">
          {found.responsibilities.map((item) => (
            <li key={item} className="flex gap-3">
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                aria-hidden="true"
              />
              <span className="leading-relaxed text-stone-700">{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-10 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-500">
          Detailed membership and meeting information for this committee will be
          published in a later sprint.
        </p>
      </Section>
    </>
  );
}
