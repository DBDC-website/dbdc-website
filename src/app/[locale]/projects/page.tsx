import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import ExperienceCards from '@/components/projects/ExperienceCards';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import { projects } from '@/constants/projects';

export const metadata: Metadata = {
  title: 'Selected Projects',
  description:
    'A showcase of diocesan building and development projects, including a 360° virtual tour and the Catholic Heritage website.',
};

export default function ProjectsPage() {
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
            'Placeholder projects for now — final imagery and details will be added in a later sprint.',
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
            'Step inside diocesan buildings virtually or explore the Catholic Heritage archive online.',
        }}
      >
        <ExperienceCards />
      </PageSection>
    </>
  );
}
