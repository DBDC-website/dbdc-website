import PlaceholderImage from '@/components/ui/PlaceholderImage';
import { getProjectPlaceholder } from '@/constants/projectPlaceholders';
import type { Project } from '@/types/project';

export default function ProjectCard({ project }: { project: Project }) {
  const placeholder = getProjectPlaceholder(project);
  const label = project.buildingName ?? 'Project';

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/35 bg-brand-900/10 shadow-lg shadow-brand-900/20">
      <PlaceholderImage
        alt={project.imageAlt}
        src={project.imageUrl ?? undefined}
        gradient={placeholder.gradient}
        label={placeholder.label}
        sublabel={placeholder.sublabel}
        style={placeholder.style}
        className="aspect-[16/10] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/82 via-brand-950/15 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cream-100/90 sm:text-xs">
          {label}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-white sm:text-lg">
          {project.title}
        </h3>
        {project.location || project.year ? (
          <p className="mt-2 text-xs text-cream-100/90">
            {[project.location, project.year].filter(Boolean).join(' · ')}
          </p>
        ) : null}
      </div>
    </div>
  );
}
