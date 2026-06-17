import type { Metadata } from 'next';
import { Compass, Landmark } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PlaceholderBox from '@/components/ui/PlaceholderBox';
import ProjectCard from '@/components/projects/ProjectCard';
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

      <Section aria-labelledby="project-showcase-heading">
        <SectionHeading
          id="project-showcase-heading"
          eyebrow="Showcase"
          title="Project showcase"
          description="Placeholder projects for now — final imagery and details will be added in a later sprint."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      </Section>

      <Section tone="muted" aria-labelledby="experiences-heading">
        <SectionHeading
          id="experiences-heading"
          eyebrow="Explore Further"
          title="Featured experiences"
          description="Immersive ways to explore diocesan heritage and architecture."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <Compass className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-brand-900">
                360° Virtual Tour
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Step inside selected churches and facilities through an interactive
              360° tour. The experience from the previous project will be
              integrated and modernised here.
            </p>
            <div className="mt-5">
              <PlaceholderBox
                label="360° Virtual Tour"
                description="Interactive panorama viewer to be embedded."
                aspect="aspect-video"
              />
            </div>
            <div className="mt-5">
              <Button variant="outline" size="sm" disabled>
                Launch tour (coming soon)
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                <Landmark className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-brand-900">
                Catholic Heritage Website
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Discover the history and heritage of Catholic buildings across the
              Diocese. This will link to the dedicated Catholic Heritage website.
            </p>
            <div className="mt-5">
              <PlaceholderBox
                label="Catholic Heritage Website"
                description="External link / embed to be added."
                aspect="aspect-video"
              />
            </div>
            <div className="mt-5">
              <Button variant="outline" size="sm" disabled>
                Visit heritage site (coming soon)
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
