import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ParishFlowcharts from '@/components/parish-school/ParishFlowcharts';
import ParishGuidelinesTips from '@/components/parish-school/ParishGuidelinesTips';
import GuidelinesBackLink from '@/components/parish-school/GuidelinesBackLink';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import HeadingGlow from '@/components/ui/HeadingGlow';
import { getParishGuidelines } from '@/content/parishGuidelines';
import { homeImages } from '@/constants/homeImages';
import { isValidLocale, locales, type Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/i18n/metadata';

type GuidelinesPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: GuidelinesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  return buildPageMetadata({
    locale: localeParam,
    path: '/parish-school/guidelines',
    titleKey: 'parish.guidelines.metaTitle',
    descriptionKey: 'parish.guidelines.metaDescription',
  });
}

export default async function ParishGuidelinesPage({ params }: GuidelinesPageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const parishGuidelines = getParishGuidelines(locale);

  return (
    <div className="relative bg-[#eef6fb]">
      <PageHeader
        title={t(locale, 'parish.guidelines.title')}
        description={t(locale, 'parish.guidelines.description')}
        theme="sky"
        align="center"
        contentClassName="min-h-[18rem] py-14 sm:min-h-[22rem] sm:py-16 lg:min-h-[26rem] lg:pb-12 lg:pt-20"
        backgroundImage={{
          src: homeImages.committeeDetail.src,
          alt: homeImages.committeeDetail.alt,
          objectPosition: homeImages.committeeDetail.objectPosition,
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop variant="sky" />

        <PageSection
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          containerSize="wide"
          className="relative z-10 !py-7 sm:!py-9 lg:!py-10"
        >
          <GuidelinesBackLink
            locale={locale}
            label={t(locale, 'parish.guidelines.back')}
          />

          <ParishGuidelinesTips content={parishGuidelines} />
        </PageSection>

        <PageSection
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          containerSize="wide"
          className="relative z-10 !pb-12 !pt-4 sm:!pb-14 sm:!pt-6"
          aria-labelledby="flowcharts-heading"
        >
          <HeadingGlow className="mb-6 sm:mb-8">
            <h2
              id="flowcharts-heading"
              className="scroll-mt-28 font-serif text-3xl font-semibold text-brand-950 sm:scroll-mt-32 sm:text-4xl"
            >
              {parishGuidelines.flowchartsTitle}
            </h2>
          </HeadingGlow>

          <ParishFlowcharts flowcharts={parishGuidelines.flowcharts} />
        </PageSection>
      </div>
    </div>
  );
}
