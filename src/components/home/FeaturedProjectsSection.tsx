import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/projects/ProjectCard';
import { featuredProjects } from '@/constants/projects';
import type { Locale } from '@/constants/i18n';

type FeaturedProjectsSectionProps = {
  locale: Locale;
};

export default function FeaturedProjectsSection({
  locale,
}: FeaturedProjectsSectionProps) {
  return (
    <Section
      id="featured-projects"
      tone="default"
      aria-labelledby="featured-projects-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          id="featured-projects-heading"
          eyebrow="Our Work"
          title="Featured projects"
        />
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900 hover:underline"
        >
          View all projects
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </Section>
  );
}
