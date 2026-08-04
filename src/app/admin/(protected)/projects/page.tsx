import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectsSortableTable from '@/components/admin/ProjectsSortableTable';
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
          <Link
            href="/admin/projects/new"
            className="font-medium text-brand-800 hover:underline"
          >
            Create the first one
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8">
          <ProjectsSortableTable projects={projects} />
        </div>
      )}
    </div>
  );
}
