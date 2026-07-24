import type { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { listAdminProjects } from '@/lib/admin/projects';

export const metadata: Metadata = {
  title: 'Projects',
};

const FLASH: Record<string, string> = {
  deleted: 'Project deleted.',
  invalid: 'That project request was invalid.',
  missing: 'Project not found.',
};

type PageProps = {
  searchParams: Promise<{ deleted?: string; error?: string }>;
};

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const projects = await listAdminProjects();
  const flash =
    (params.deleted && FLASH.deleted) ||
    (params.error ? FLASH[params.error] ?? 'Something went wrong.' : null);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
            Projects
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Portfolio entries shown on the public projects page and homepage.
          </p>
        </div>
        <Button href="/admin/projects/new" size="sm">
          Add project
        </Button>
      </div>

      {flash ? (
        <p className="mt-4 rounded-md border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-brand-900">
          {flash}
        </p>
      ) : null}

      {projects.length === 0 ? (
        <p className="mt-10 rounded-lg border border-cream-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
          No projects yet.{' '}
          <Link href="/admin/projects/new" className="font-medium text-brand-800 hover:underline">
            Create the first one
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-cream-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Building</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-cream-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-brand-900">
                    {project.title}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {project.buildingName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {project.year ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        project.published
                          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800'
                          : 'rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600'
                      }
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="font-medium text-brand-800 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
