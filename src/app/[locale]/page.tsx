import Link from 'next/link';
import { PICS_SHORT } from '@/constants/legal';
import { featuredProjects } from '@/constants/projects';
import { type Locale } from '@/constants/i18n';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-12 text-center">
        <div
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-600"
          aria-hidden="true"
        >
          DBDC
        </div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Welcome to the Diocesan Building and Development Commission
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          We support the Catholic Diocese of Hong Kong in planning, developing,
          and maintaining diocesan and parish properties.
        </p>
      </section>

      <section
        className="mb-12 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4"
        aria-labelledby="pics-heading"
      >
        <h2 id="pics-heading" className="text-sm font-semibold text-amber-900">
          Personal Information Collection Statement
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          {PICS_SHORT}
        </p>
      </section>

      <section aria-labelledby="featured-projects-heading">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2
            id="featured-projects-heading"
            className="text-xl font-bold text-gray-900"
          >
            Featured Projects
          </h2>
          <Link
            href={`/${locale as Locale}/projects`}
            className="text-sm font-medium text-blue-700 hover:underline"
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
    </div>
  );
}
