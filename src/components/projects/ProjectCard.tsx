import { MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Project, ProjectStatus } from '@/types/project';

const statusTone: Record<ProjectStatus, 'success' | 'brand' | 'gold' | 'info'> = {
  Completed: 'success',
  'In Progress': 'brand',
  Planning: 'gold',
  Upcoming: 'info',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card as="li" interactive className="flex flex-col overflow-hidden">
      {/* Image placeholder: a tinted band keyed to the project, replaced with a
          real photo in a later sprint. The category label doubles as alt intent. */}
      <div
        className="relative flex aspect-[16/10] items-end bg-gradient-to-br from-brand-700 to-brand-900 p-4"
        role="img"
        aria-label={project.imageAlt}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge tone={statusTone[project.status]}>{project.status}</Badge>
          <span className="text-xs text-stone-500">{project.year}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-brand-900">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
          {project.description}
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {project.location}
        </p>
      </div>
    </Card>
  );
}
