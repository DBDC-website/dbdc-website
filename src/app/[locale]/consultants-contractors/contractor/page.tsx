import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import ContractorForm from '@/components/registration/ContractorForm';
import { type Locale } from '@/constants/i18n';
import { withSupabaseImageTransform } from '@/lib/supabaseImage';

export const metadata: Metadata = {
  title: 'Contractor Registration',
  description:
    'Register your company with the Diocesan Building and Development Commission list of approved contractors.',
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContractorRegistrationPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Work With Us"
        title="Contractor Registration"
        description="Building and specialist contractors can apply to join the DBDC list of approved contractors."
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: withSupabaseImageTransform(
            'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/website-assets/outdoor-bridge.jpg',
            { width: 1200, quality: 80 },
          ),
          alt: 'White cross overlooking a coastal bridge',
          objectPosition: 'center 40%',
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
        <ContractorForm />
      </PageSection>
    </>
  );
}
