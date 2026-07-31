import AboutSection from '@/components/home/AboutSection';
import CommitteesSection from '@/components/home/CommitteesSection';
import FeaturedExperiencesSection from '@/components/home/FeaturedExperiencesSection';
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection';
import HeroSection from '@/components/home/HeroSection';
import MembershipSection from '@/components/home/MembershipSection';
import { type Locale } from '@/constants/i18n';
import { getFeaturedProjects } from '@/lib/projects';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <HeroSection locale={locale as Locale} />
      <AboutSection />
      <FeaturedProjectsSection
        locale={locale as Locale}
        projects={featuredProjects}
      />
      <FeaturedExperiencesSection locale={locale as Locale} />
      <MembershipSection />
      <CommitteesSection locale={locale as Locale} />
    </>
  );
}
