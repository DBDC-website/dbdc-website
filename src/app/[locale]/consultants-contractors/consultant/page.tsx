import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import ConsultantForm from '@/components/registration/ConsultantForm';
import { homeImages } from '@/constants/homeImages';
import { type Locale } from '@/constants/i18n';

export const metadata: Metadata = {
  title: 'Consultant Registration',
  description:
    'Register your consultancy with the Diocesan Building and Development Commission.',
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConsultantRegistrationPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Work With Us"
        title="Consultant Registration"
        description="Architects, engineers, surveyors, and other professionals can apply to join the DBDC list of registered consultants."
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: homeImages.consultantsHeader.src,
          alt: homeImages.consultantsHeader.alt,
          objectPosition: homeImages.consultantsHeader.objectPosition,
        }}
      />

      <PageSection containerSize="narrow" spacing="default">
        <Link
          href={`/${locale as Locale}/consultants-contractors`}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to registration
        </Link>
        <ConsultantForm />
      </PageSection>
    </>
  );
}
