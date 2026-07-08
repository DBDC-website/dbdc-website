import type { Metadata } from 'next';
import {
  FormsCards,
  RegistrationCards,
} from '@/components/consultants/ConsultantsPageContent';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';

export const metadata: Metadata = {
  title: 'Consultants & Contractors',
  description:
    'Registration information and forms for consultants and contractors working with the DBDC.',
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConsultantsContractorsPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Work With Us"
        title="Consultants & Contractors"
        description="Registration information, downloadable forms, and online applications for consultants and contractors."
      />

      <PageSection
        aria-labelledby="registration-heading"
        heading={{
          id: 'registration-heading',
          eyebrow: 'Get Registered',
          title: 'Registration',
        }}
      >
        <RegistrationCards locale={locale} />
      </PageSection>

      <PageSection
        tone="cream"
        aria-labelledby="forms-heading"
        heading={{
          id: 'forms-heading',
          eyebrow: 'Resources',
          title: 'Forms',
          description: 'Downloadable and online forms will be made available here.',
        }}
      >
        <FormsCards />
      </PageSection>
    </>
  );
}
