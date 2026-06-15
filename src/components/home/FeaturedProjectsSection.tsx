import Link from 'next/link';
import { featuredProjects } from '@/constants/projects';
import type { Locale } from '@/constants/i18n';

type FeaturedProjectsSectionProps = {
  locale: Locale;
};

export default function FeaturedProjectsSection({
  locale,
}: FeaturedProjectsSectionProps) {
  return (
    <section
      className="border-t border-gray-200 py-16"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="featured-projects-heading"
          className="text-2xl font-bold text-gray-900 md:text-3xl"
        >
          Featured Projects
        </h2>
        <Link
          href={`/${locale}/projects`}
          className="shrink-0 text-sm font-medium text-blue-700 hover:underline"
        >
          View all projects
        </Link>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <li
            key={project.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {project.status}
            </span>
            <h3 className="mt-3 font-semibold text-gray-900">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
