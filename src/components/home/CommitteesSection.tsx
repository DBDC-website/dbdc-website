import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import { committees } from '@/constants/committees';
import type { Locale } from '@/constants/i18n';

type CommitteesSectionProps = {
  locale: Locale;
};

export default function CommitteesSection({ locale }: CommitteesSectionProps) {
  return (
    <AnimatedSection
      id="committees"
      tone="sage"
      spacing="generous"
      aria-labelledby="committees-heading"
    >
      <ScrollReveal>
        <SectionHeading
          id="committees-heading"
          title="Committees"
          className="[&_h2]:text-4xl [&_h2]:sm:text-5xl"
        />
        <div className="mt-4 h-px w-16 bg-gold-400" aria-hidden="true" />
      </ScrollReveal>

      <StaggerChildren as="ul" className="mt-10 space-y-4">
        {committees.map((committee) => (
          <StaggerItem key={committee.slug} as="li">
            <Link
              href={`/${locale}/committees/${committee.slug}`}
              className="group inline-flex text-lg font-medium text-brand-800 underline decoration-brand-300/60 underline-offset-[6px] transition-colors hover:text-brand-900 hover:decoration-gold-500 sm:text-xl"
            >
              {committee.name} ({committee.abbreviation})
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </AnimatedSection>
  );
}
