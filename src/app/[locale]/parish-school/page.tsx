import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import FaqAccordion from '@/components/parish-school/FaqAccordion';
import GovernmentLinksGrid from '@/components/parish-school/GovernmentLinksGrid';
import { faqItems, governmentLinks } from '@/constants/parishSchool';

export const metadata: Metadata = {
  title: 'Parish & School Corner',
  description:
    'Information for parishes and schools, including frequently asked questions and useful government department links.',
};

export default function ParishSchoolPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Parishes & Schools"
        title="Parish & School Corner"
        description="Guidance for parishes and schools, including frequently asked questions and useful external references."
      />

      <PageSection
        aria-labelledby="faq-heading"
        heading={{
          id: 'faq-heading',
          eyebrow: 'Help',
          title: 'Frequently asked questions',
        }}
      >
        <FaqAccordion items={faqItems} />
      </PageSection>

      <PageSection
        tone="cream"
        aria-labelledby="gov-links-heading"
        heading={{
          id: 'gov-links-heading',
          eyebrow: 'References',
          title: 'Useful government department links',
          description:
            'Placeholder links for now — final URLs will be provided by the DBDC Office.',
        }}
      >
        <GovernmentLinksGrid links={governmentLinks} />
      </PageSection>
    </>
  );
}
