import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RegistrationCards } from '@/components/consultants/ConsultantsPageContent';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { homeImages } from '@/constants/homeImages';
import { isValidLocale, type Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/i18n/metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  return buildPageMetadata({
    locale: localeParam,
    path: '/consultants-contractors',
    titleKey: 'consultants.metaTitle',
    descriptionKey: 'consultants.metaDescription',
  });
}

export default async function ConsultantsContractorsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;

  return (
    <div className="relative bg-[#e8f3ee]">
      <PageHeader
        eyebrow={t(locale, 'consultants.eyebrow')}
        title={t(locale, 'consultants.title')}
        description={t(locale, 'consultants.description')}
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: homeImages.consultantsHeader.src,
          alt: homeImages.consultantsHeader.alt,
          objectPosition: homeImages.consultantsHeader.objectPosition,
          scale: homeImages.consultantsHeader.scale,
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop className="opacity-68" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(143,179,154,0.28),transparent_52%),radial-gradient(ellipse_at_82%_78%,rgba(168,196,176,0.22),transparent_48%),linear-gradient(to_bottom,rgba(245,255,250,0.7),rgba(232,243,238,0.5),rgba(246,250,249,0.72))]"
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
            title: t(locale, 'consultants.registrationTitle'),
          }}
          headingClassName="[&_h2]:text-brand-950 [&_p]:text-stone-700"
        >
          <RegistrationCards locale={locale} />
        </PageSection>
      </div>
    </div>
  );
}
