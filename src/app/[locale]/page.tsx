import AboutSection from '@/components/home/AboutSection';
import CommitteesSection from '@/components/home/CommitteesSection';
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection';
import HeroSection from '@/components/home/HeroSection';
import PicsSection from '@/components/home/PicsSection';
import { type Locale } from '@/constants/i18n';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale as Locale} />
      <AboutSection />
      <FeaturedProjectsSection locale={locale as Locale} />
      <CommitteesSection locale={locale as Locale} />
      <PicsSection />
    </>
  );
}
