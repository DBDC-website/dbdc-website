import type { Metadata } from 'next';
import { RegistrationCards } from '@/components/consultants/ConsultantsPageContent';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';

export const metadata: Metadata = {
  title: 'Consultants & Contractors',
  description:
    'Registration information and online applications for consultants and contractors working with the DBDC.',
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConsultantsContractorsPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <div className="relative bg-[#eef6f5]">
      <PageHeader
        eyebrow="Work With Us"
        title="Consultants & Contractors"
        description="Registration information and online applications for consultants and contractors."
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: 'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/website-assets/outdoor-bridge.jpg',
          alt: 'White cross overlooking a coastal bridge',
          objectPosition: 'center 40%',
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop className="opacity-68" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f5fffd]/72 via-[#eef6f5]/55 to-[#f6faf9]/72"
          aria-hidden="true"
        />

        <PageSection
          aria-labelledby="registration-heading"
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          className="relative z-10 !pt-8 !pb-12 sm:!pt-10 sm:!pb-14"
          heading={{
            id: 'registration-heading',
            title: 'Registration',
          }}
          headingClassName="[&_h2]:text-brand-950 [&_p]:text-stone-700"
        >
          <RegistrationCards locale={locale} />
        </PageSection>
      </div>
    </div>
  );
}
