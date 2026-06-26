import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FeaturedProjectsCarousel from '@/components/home/FeaturedProjectsCarousel';
import ScrollReveal from '@/components/motion/ScrollReveal';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Locale } from '@/constants/i18n';

type FeaturedProjectsSectionProps = {
  locale: Locale;
};

export default function FeaturedProjectsSection({
  locale,
}: FeaturedProjectsSectionProps) {
  return (
    <AnimatedSection
      id="featured-projects"
      tone="cream"
      spacing="generous"
      aria-labelledby="featured-projects-heading"
    >
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="featured-projects-heading"
            eyebrow="Our Work"
            title="Featured projects"
            description="A selection of diocesan building and development initiatives across Hong Kong."
            className="[&_h2]:text-4xl [&_h2]:sm:text-5xl"
          />
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900 hover:underline"
          >
            View all projects
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="relative -mx-2 sm:-mx-4 lg:-mx-8">
          <FeaturedProjectsCarousel locale={locale} />
        </div>
      </ScrollReveal>
    </AnimatedSection>
  );
}
