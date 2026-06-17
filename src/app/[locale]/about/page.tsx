import type { Metadata } from 'next';
import AboutSection from '@/components/home/AboutSection';
import CommitteesSection from '@/components/home/CommitteesSection';
import MembersSection from '@/components/home/MembersSection';
import OrganizationSection from '@/components/home/OrganizationSection';
import PageHeader from '@/components/ui/PageHeader';
import { type Locale } from '@/constants/i18n';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'About the Diocesan Building and Development Commission: introduction, organization, membership, and committees.',
};

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="The Diocesan Building and Development Commission"
        description="Introduction, organization, membership, and the committees that support the Commission's work."
      />
      <AboutSection />
      <OrganizationSection />
      <MembersSection />
      <CommitteesSection locale={locale as Locale} />
    </>
  );
}
