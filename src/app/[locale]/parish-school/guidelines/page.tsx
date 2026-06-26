import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ParishFlowcharts from '@/components/parish-school/ParishFlowcharts';
import ParishGuidelinesTips from '@/components/parish-school/ParishGuidelinesTips';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { parishGuidelines } from '@/constants/parishGuidelines';
import { locales, type Locale } from '@/constants/i18n';

type GuidelinesPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Parish Working Guidelines',
  description:
    'Useful tips for selecting contractors for parish maintenance works, and reference flow charts for maintenance, emergency, and renovation projects.',
};

export default async function ParishGuidelinesPage({ params }: GuidelinesPageProps) {
  const { locale } = await params;

  return (
    <>
      <PageHeader
        eyebrow="For Parishes & Schools"
        title="Parish Working Guidelines"
        description="Practical guidance on contractor selection and project workflows for parish building works."
      />

      <PageSection contentClassName="max-w-5xl">
        <Link
          href={`/${locale as Locale}/parish-school`}
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-brand-800 transition-colors hover:text-brand-950"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Parish & School Corner
        </Link>

        <ParishGuidelinesTips content={parishGuidelines} />
      </PageSection>

      <PageSection
        tone="cream"
        aria-labelledby="flowcharts-heading"
        heading={{
          id: 'flowcharts-heading',
          eyebrow: 'Workflows',
          title: parishGuidelines.flowchartsTitle,
          description: parishGuidelines.flowchartsDescription,
        }}
      >
        <ParishFlowcharts flowcharts={parishGuidelines.flowcharts} />
      </PageSection>
    </>
  );
}
