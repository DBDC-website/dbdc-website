import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import ExperienceCards from '@/components/projects/ExperienceCards';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import { getPublishedProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Selected Projects',
  description:
    'A showcase of Diocesan building and development projects, including a 360° virtual tour and the Catholic Heritage website.',
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Selected Projects"
        description="A showcase of building, restoration, and development work carried out for the Diocese, its parishes, and schools."
      />

      <PageSection
        aria-labelledby="project-showcase-heading"
        heading={{
          id: 'project-showcase-heading',
          eyebrow: 'Showcase',
          title: 'Project showcase',
          description:
            'Selected Diocesan building and development projects from the DBDC portfolio.',
        }}
      >
        <ProjectsGrid projects={projects} />
      </PageSection>

      <PageSection
        tone="cream"
        aria-labelledby="experiences-heading"
        heading={{
          id: 'experiences-heading',
          eyebrow: 'Explore Further',
          title: 'Featured experiences',
          description:
            'Step inside Diocesan buildings virtually or explore the Catholic Heritage archive online.',
        }}
      >
        <ExperienceCards />
      </PageSection>
    </>
  );
}
