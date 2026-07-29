import type { Metadata } from 'next';
import FaqAccordion from '@/components/parish-school/FaqAccordion';
import GovernmentLinksGrid from '@/components/parish-school/GovernmentLinksGrid';
import ParishSchoolContact from '@/components/parish-school/ParishSchoolContact';
import ParishSchoolPreamble from '@/components/parish-school/ParishSchoolPreamble';
import SectionJumpButton from '@/components/parish-school/SectionJumpButton';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import {
  faqItems,
  governmentLinks,
  parishSchoolContact,
  parishSchoolPreamble,
} from '@/constants/parishSchool';
import { homeImages } from '@/constants/homeImages';
import { type Locale, isValidLocale } from '@/constants/i18n';
import { notFound } from 'next/navigation';

type ParishSchoolPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Parish & School Corner',
  description:
    'Guidance for parishes and schools on building maintenance, improvements, and renovation works in the Diocese of Hong Kong.',
};

export default async function ParishSchoolPage({ params }: ParishSchoolPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="relative bg-[#f5e2c8]">
      <PageHeader
        eyebrow="For Parishes & Schools"
        title="Parish & School Corner"
        description="Questions and answers to assist parishes in planning building maintenance, improvement, construction, or renovation works."
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
          title: 'Preamble',
        }}
      >
        <ParishSchoolPreamble preamble={parishSchoolPreamble} />
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
          title: 'Frequently Asked Questions',
          description: 'Click a question to expand the answer.',
        }}
      >
        <FaqAccordion items={faqItems} />
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
          title: 'Need further assistance?',
        }}
      >
        <ParishSchoolContact contact={parishSchoolContact} locale={locale as Locale} />
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
          title: 'Useful links',
        }}
      >
        <GovernmentLinksGrid links={governmentLinks} locale={locale as Locale} />
      </PageSection>
      </div>

      <SectionJumpButton
        targets={[
          { id: 'faq-heading', label: 'FAQs' },
          { id: 'contact-heading', label: 'Assistance & links' },
        ]}
      />
    </div>
  );
}
