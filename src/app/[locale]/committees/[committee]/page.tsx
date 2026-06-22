import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommitteeSectionAccordion from '@/components/committees/CommitteeSectionAccordion';
import ScrollReveal from '@/components/motion/ScrollReveal';
import PageHeader from '@/components/ui/PageHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
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
      <AnimatedSection containerSize="narrow" spacing="generous">
        <ScrollReveal>
          <Link
            href={`/${locale as Locale}#committees`}
            className="inline-flex text-sm font-medium text-brand-800 transition-colors hover:text-brand-950 hover:underline decoration-gold-400/80"
          >
            ← Back to Committees
          </Link>
        </ScrollReveal>

        <div className="mt-8 lg:mt-10">
          <CommitteeSectionAccordion sections={found.sections} />
        </div>
      </AnimatedSection>
    </>
  );
}
