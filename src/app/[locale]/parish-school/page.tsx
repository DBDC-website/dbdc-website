import type { Metadata } from 'next';
import FaqAccordion from '@/components/parish-school/FaqAccordion';
import GovernmentLinksGrid from '@/components/parish-school/GovernmentLinksGrid';
import ParishSchoolContact from '@/components/parish-school/ParishSchoolContact';
import ParishSchoolPreamble from '@/components/parish-school/ParishSchoolPreamble';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import {
  faqItems,
  governmentLinks,
  parishSchoolContact,
  parishSchoolPreamble,
} from '@/constants/parishSchool';
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
    <>
      <PageHeader
        eyebrow="For Parishes & Schools"
        title="Parish & School Corner"
        description="Questions and answers to assist parishes in planning building maintenance, improvement, construction, or renovation works."
      />

      <PageSection
        aria-labelledby="preamble-heading"
        heading={{
          id: 'preamble-heading',
          eyebrow: 'Overview',
          title: 'Preamble',
        }}
      >
        <ParishSchoolPreamble preamble={parishSchoolPreamble} />
      </PageSection>

      <PageSection
        tone="cream"
        aria-labelledby="faq-heading"
        heading={{
          id: 'faq-heading',
          eyebrow: 'Guidance',
          title: 'Frequently Asked Questions',
          description: 'Click a question to expand the answer.',
        }}
      >
        <FaqAccordion items={faqItems} />
      </PageSection>

      <PageSection
        aria-labelledby="contact-heading"
        heading={{
          id: 'contact-heading',
          eyebrow: 'Contact',
          title: 'Need further assistance?',
        }}
      >
        <ParishSchoolContact contact={parishSchoolContact} locale={locale as Locale} />
      </PageSection>

      <PageSection
        tone="cream"
        aria-labelledby="gov-links-heading"
        heading={{
          id: 'gov-links-heading',
          eyebrow: 'References',
          title: 'Useful links',
          description:
            'Government departments and DBDC resources referenced in the guidance above.',
        }}
      >
        <GovernmentLinksGrid links={governmentLinks} locale={locale as Locale} />
      </PageSection>
    </>
  );
}
