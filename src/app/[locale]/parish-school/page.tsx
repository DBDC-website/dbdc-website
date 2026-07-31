import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FaqAccordion from '@/components/parish-school/FaqAccordion';
import GovernmentLinksGrid from '@/components/parish-school/GovernmentLinksGrid';
import ParishSchoolContact from '@/components/parish-school/ParishSchoolContact';
import ParishSchoolPreamble from '@/components/parish-school/ParishSchoolPreamble';
import SectionJumpButton from '@/components/parish-school/SectionJumpButton';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import {
  getFaqItems,
  getGovernmentLinks,
  getParishSchoolContact,
  getParishSchoolPreamble,
} from '@/content/parishSchool';
import { homeImages } from '@/constants/homeImages';
import { type Locale, isValidLocale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/i18n/metadata';

type ParishSchoolPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ParishSchoolPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  return buildPageMetadata({
    locale: localeParam,
    path: '/parish-school',
    titleKey: 'parish.metaTitle',
    descriptionKey: 'parish.metaDescription',
  });
}

export default async function ParishSchoolPage({ params }: ParishSchoolPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;

  return (
    <div className="relative bg-[#f5e2c8]">
      <PageHeader
        eyebrow={t(locale, 'parish.eyebrow')}
        title={t(locale, 'parish.title')}
        description={t(locale, 'parish.description')}
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: homeImages.parishSchoolHeader.src,
          alt: homeImages.parishSchoolHeader.alt,
          objectPosition: homeImages.parishSchoolHeader.objectPosition,
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop className="opacity-75" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_8%,rgba(0,160,220,0.1),transparent_40%),radial-gradient(ellipse_at_80%_85%,rgba(245,163,78,0.18),transparent_45%),linear-gradient(to_bottom,rgba(255,244,228,0.7),rgba(245,226,200,0.45),rgba(255,248,236,0.7))]"
          aria-hidden="true"
        />

      <PageSection
        withBackground={false}
        overlayClassName="bg-transparent"
        spacing="compact"
        className="relative z-10 !pt-6 !pb-8 sm:!pt-8 sm:!pb-10"
        contentClassName="!mt-8 lg:!mt-10"
        aria-labelledby="preamble-heading"
        heading={{
          id: 'preamble-heading',
          title: t(locale, 'parish.preambleTitle'),
        }}
      >
        <ParishSchoolPreamble preamble={getParishSchoolPreamble(locale)} />
      </PageSection>

      <PageSection
        withBackground={false}
        overlayClassName="bg-transparent"
        spacing="compact"
        className="relative z-10 !pt-5 !pb-8 sm:!pt-6 sm:!pb-10"
        contentClassName="!mt-8 lg:!mt-10"
        aria-labelledby="faq-heading"
        heading={{
          id: 'faq-heading',
          title: t(locale, 'parish.faqTitle'),
          description: t(locale, 'parish.faqHint'),
        }}
      >
        <FaqAccordion items={getFaqItems(locale)} />
      </PageSection>

      <PageSection
        withBackground={false}
        overlayClassName="bg-transparent"
        spacing="compact"
        className="relative z-10 !pt-5 !pb-8 sm:!pt-6 sm:!pb-10"
        contentClassName="!mt-8 lg:!mt-10"
        aria-labelledby="contact-heading"
        heading={{
          id: 'contact-heading',
          title: t(locale, 'parish.contactTitle'),
        }}
      >
        <ParishSchoolContact contact={getParishSchoolContact(locale)} locale={locale} />
      </PageSection>

      <PageSection
        withBackground={false}
        overlayClassName="bg-transparent"
        spacing="compact"
        className="relative z-10 !pt-5 !pb-10 sm:!pt-6 sm:!pb-12"
        contentClassName="!mt-8 lg:!mt-10"
        aria-labelledby="gov-links-heading"
        heading={{
          id: 'gov-links-heading',
          title: t(locale, 'parish.linksTitle'),
        }}
      >
        <GovernmentLinksGrid links={getGovernmentLinks(locale)} locale={locale} />
      </PageSection>
      </div>

      <SectionJumpButton
        targets={[
          { id: 'faq-heading', label: t(locale, 'parish.jumpFaqs') },
          { id: 'contact-heading', label: t(locale, 'parish.jumpAssist') },
        ]}
      />
    </div>
  );
}
