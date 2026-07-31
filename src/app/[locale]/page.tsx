import AboutSection from '@/components/home/AboutSection';
import CommitteesSection from '@/components/home/CommitteesSection';
import FeaturedExperiencesSection from '@/components/home/FeaturedExperiencesSection';
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection';
import HeroSection from '@/components/home/HeroSection';
import MembershipSection from '@/components/home/MembershipSection';
import { isValidLocale, type Locale } from '@/constants/i18n';
import { buildPageMetadata } from '@/lib/i18n/metadata';
import { getFeaturedProjects } from '@/lib/projects';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  return buildPageMetadata({
    locale: localeParam,
    path: '',
    titleKey: 'site.name',
    descriptionKey: 'site.description',
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const featuredProjects = await getFeaturedProjects(locale);

  return (
    <>
      <HeroSection locale={locale} />
      <AboutSection locale={locale} />
      <FeaturedProjectsSection locale={locale} projects={featuredProjects} />
      <FeaturedExperiencesSection locale={locale} />
      <MembershipSection locale={locale} />
      <CommitteesSection locale={locale} />
    </>
  );
}
