import ProjectCard from '@/components/projects/ProjectCard';
import type { Project } from '@/types/project';

/** Server-rendered grid — avoids client motion HMR issues on this heavy page. */
export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-stone-600">
        Projects will appear here once they are published.
      </p>
    );
  }

  return (
    <ul className="grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {projects.map((project) => (
        <li key={project.id} className="flex h-full min-h-0">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
