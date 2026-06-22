import { MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import { getProjectPlaceholder } from '@/constants/projectPlaceholders';
import type { Project, ProjectStatus } from '@/types/project';

const statusTone: Record<ProjectStatus, 'success' | 'brand' | 'gold' | 'info'> = {
  Completed: 'success',
  'In Progress': 'brand',
  Planning: 'gold',
  Upcoming: 'info',
};

export default function ProjectCard({ project }: { project: Project }) {
  const placeholder = getProjectPlaceholder(project);

  return (
    <Card
      className="group flex h-full flex-col overflow-hidden border-cream-200/90 bg-white shadow-sm shadow-brand-900/[0.04] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand-200/80 hover:shadow-lg hover:shadow-brand-900/10"
    >
      <div className="relative shrink-0 overflow-hidden">
        <PlaceholderImage
          alt={project.imageAlt}
          gradient={placeholder.gradient}
          label={placeholder.label}
          sublabel={placeholder.sublabel}
          style={placeholder.style}
          className="aspect-[16/10] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <Badge tone={statusTone[project.status]}>{project.status}</Badge>
          <span className="shrink-0 text-xs text-stone-500">{project.year}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-brand-900 sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600 sm:text-base">
          {project.description}
        </p>
        <p className="mt-5 flex shrink-0 items-center gap-1.5 text-xs text-stone-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {project.location}
        </p>
      </div>
    </Card>
  );
}
