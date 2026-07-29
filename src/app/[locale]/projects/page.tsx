import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import ExperienceCards from '@/components/projects/ExperienceCards';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import ScrollToExperiencesButton from '@/components/projects/ScrollToExperiencesButton';
import { homeImages } from '@/constants/homeImages';
import { getPublishedProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Selected Projects',
  description:
    'A showcase of Diocesan building and development projects across the Diocese, its parishes, schools and other properties.',
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="relative bg-[#f4e6d4]">
      <PageHeader
        eyebrow="Our Works"
        title="Selected Projects"
        description="A showcase of building, restoration, and development work carried out for the Diocese, its parishes, schools and other properties."
        theme="cathedral"
        align="center"
        contentClassName="min-h-[22rem] py-14 sm:min-h-[26rem] sm:py-16 lg:min-h-[30rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: homeImages.projectsHeader.src,
          alt: homeImages.projectsHeader.alt,
          objectPosition: homeImages.projectsHeader.objectPosition,
        }}
      />

      <div className="relative isolate">
        {/* Soft light-oak wash — matches chapel wood tones without going dark */}
        <div
          className="pointer-events-none absolute inset-0 bg-[#f4e6d4]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(210,167,60,0.12),transparent_50%),radial-gradient(ellipse_at_85%_30%,rgba(0,160,220,0.08),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(232,170,110,0.14),transparent_55%)]"
          aria-hidden="true"
        />

        <PageSection
          aria-labelledby="project-showcase-heading"
          withBackground={false}
          overlayClassName="bg-transparent"
          overflowVisible
          spacing="compact"
          className="relative z-10 !pt-6 !pb-6 sm:!pt-8 sm:!pb-8 lg:!pt-10 lg:!pb-8"
          heading={{
            id: 'project-showcase-heading',
            title: 'Project showcase',
            description:
              'Selected Diocesan building and development projects from the DBDC portfolio.',
          }}
          headingClassName="[&_h2]:text-brand-950 [&_p]:text-stone-700"
          ruleClassName="from-[#d2a73c] via-[#00a0dc] to-transparent"
          contentClassName="!mt-8 lg:!mt-10"
        >
          <ProjectsGrid projects={projects} />
        </PageSection>

        <div
          className="relative z-10 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-[#00a0dc]/45 to-transparent"
          aria-hidden="true"
        />

        <PageSection
          aria-labelledby="experiences-heading"
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          className="relative z-10 !pt-6 sm:!pt-8 lg:!pt-8"
          heading={{
            id: 'experiences-heading',
            title: 'Featured experiences',
            description:
              'Step inside Churches & Seminary virtually or explore the Catholic Heritage archive online.',
          }}
          headingClassName="[&_h2]:text-brand-950 [&_p]:text-base [&_p]:font-medium [&_p]:text-stone-700 sm:[&_p]:text-lg"
          ruleClassName="from-[#d2a73c] via-[#00a0dc] to-transparent"
        >
          <ExperienceCards />
        </PageSection>
      </div>

      <ScrollToExperiencesButton />
    </div>
  );
}
