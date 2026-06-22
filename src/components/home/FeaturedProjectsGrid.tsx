'use client';

import ProjectCard from '@/components/projects/ProjectCard';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import { featuredProjects } from '@/constants/projects';

export default function FeaturedProjectsGrid() {
  return (
    <StaggerChildren
      as="ul"
      className="mt-14 grid auto-rows-fr gap-8 sm:grid-cols-2 sm:gap-9 lg:grid-cols-3 lg:gap-10"
    >
      {featuredProjects.map((project) => (
        <StaggerItem key={project.id} as="li" className="flex h-full min-h-0">
          <ProjectCard project={project} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
