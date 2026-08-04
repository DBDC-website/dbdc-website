'use client';

import { reorderProjects } from '@/app/admin/actions/projects';
import AdminSortableTable from '@/components/admin/AdminSortableTable';
import type { AdminProject } from '@/lib/admin/projects';

type ProjectsSortableTableProps = {
  projects: AdminProject[];
};

export default function ProjectsSortableTable({
  projects,
}: ProjectsSortableTableProps) {
  return (
    <AdminSortableTable
      items={projects}
      headers={['Title', 'Building', 'Year', 'Status', 'Order']}
      editHref={(project) => `/admin/projects/${project.id}`}
      onReorder={reorderProjects}
      renderCells={(project, index) => (
        <>
          <td className="px-4 py-3 font-medium text-brand-900">
            {project.title}
          </td>
          <td className="px-4 py-3 text-stone-600">
            {project.buildingName ?? '—'}
          </td>
          <td className="px-4 py-3 text-stone-600">{project.year ?? '—'}</td>
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
          <td className="px-4 py-3 text-stone-600">{index + 1}</td>
        </>
      )}
    />
  );
}
