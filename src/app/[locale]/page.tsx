import AboutSection from '@/components/home/AboutSection';
import CommitteesSection from '@/components/home/CommitteesSection';
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection';
import HeroSection from '@/components/home/HeroSection';
import MembersSection from '@/components/home/MembersSection';
import OrganizationSection from '@/components/home/OrganizationSection';
import PicsSection from '@/components/home/PicsSection';
import { type Locale } from '@/constants/i18n';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection />

      <div className="mx-auto max-w-6xl px-4">
        <AboutSection />
        <OrganizationSection />
        <MembersSection />
        <CommitteesSection locale={locale as Locale} />
        <FeaturedProjectsSection locale={locale as Locale} />
        <PicsSection />
      </div>
    </>
  );
}
