'use client';

import ProjectCard from '@/components/projects/ProjectCard';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { Project } from '@/types/project';

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <StaggerChildren
      as="ul"
      className="grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
    >
      {projects.map((project) => (
        <StaggerItem key={project.id} as="li" className="flex h-full min-h-0">
          <ProjectCard project={project} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
